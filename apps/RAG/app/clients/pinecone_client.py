"""
Pinecone client adapter.
Handles index management, vector upsert (batched), similarity search, and deletion.
"""

from __future__ import annotations

import uuid
from typing import Any

from pinecone import Pinecone, ServerlessSpec
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.core.exceptions import VectorStoreError
from app.core.logging import get_logger
from app.models.schemas import ChunkVector

logger = get_logger(__name__)

# Pinecone recommends max 100 vectors per upsert call
_UPSERT_BATCH_SIZE = 100


class PineconeClient:
    """
    Infrastructure adapter for Pinecone.
    Single responsibilities: upsert, query, delete.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._pc = Pinecone(api_key=settings.pinecone_api_key)
        self._index_name = settings.pinecone_index_name
        self._dimension = settings.pinecone_embedding_dimension
        self._metric = settings.pinecone_metric
        self._cloud = settings.pinecone_cloud
        self._region = settings.pinecone_region
        self._index = self._get_or_create_index()

    def _get_or_create_index(self) -> Any:
        existing = [idx.name for idx in self._pc.list_indexes()]
        if self._index_name not in existing:
            logger.info(
                "pinecone_creating_index",
                index_name=self._index_name,
                dimension=self._dimension,
            )
            self._pc.create_index(
                name=self._index_name,
                dimension=self._dimension,
                metric=self._metric,
                spec=ServerlessSpec(cloud=self._cloud, region=self._region),
            )
            logger.info("pinecone_index_created", index_name=self._index_name)
        return self._pc.Index(self._index_name)

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=30),
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _upsert_batch(self, vectors: list[dict]) -> None:
        self._index.upsert(vectors=vectors)

    def upsert_chunks(self, chunks: list[ChunkVector], document_id: str) -> None:
        """
        Upserts all chunks for a document in batches of 100.
        Vectors include metadata for filtering.
        """
        if not chunks:
            logger.warning("upsert_called_with_empty_chunks", document_id=document_id)
            return

        total = len(chunks)
        for i in range(0, total, _UPSERT_BATCH_SIZE):
            batch = chunks[i : i + _UPSERT_BATCH_SIZE]
            pinecone_vectors = [
                {"id": c.vector_id, "values": c.values, "metadata": c.metadata}
                for c in batch
            ]
            try:
                self._upsert_batch(pinecone_vectors)
                logger.debug(
                    "pinecone_upsert_batch",
                    document_id=document_id,
                    batch_start=i,
                    batch_size=len(batch),
                    total=total,
                )
            except Exception as exc:
                raise VectorStoreError(
                    f"Pinecone upsert failed at batch {i}: {exc}",
                    document_id=document_id,
                ) from exc

    def delete_by_document_id(self, document_id: str) -> None:
        """
        Deletes all vectors belonging to a document.
        Used for rollback on partial failure and explicit deletion.
        """
        try:
            self._index.delete(filter={"document_id": {"$eq": document_id}})
            logger.info("pinecone_vectors_deleted", document_id=document_id)
        except Exception as exc:
            raise VectorStoreError(
                f"Pinecone delete failed: {exc}", document_id=document_id
            ) from exc

    def query(
        self,
        vector: list[float],
        top_k: int,
        metadata_filter: dict,
    ) -> list[dict]:
        """
        Runs a similarity search returning top-k results with metadata.
        """
        try:
            response = self._index.query(
                vector=vector,
                top_k=top_k,
                include_metadata=True,
                filter=metadata_filter,
            )
            return response.get("matches", [])
        except Exception as exc:
            from app.core.exceptions import RetrievalError

            raise RetrievalError(f"Pinecone query failed: {exc}") from exc

    @staticmethod
    def make_vector_id(document_id: str, chunk_index: int) -> str:
        return f"{document_id}_chunk_{chunk_index}"
