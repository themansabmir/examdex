"""
Ingestion pipeline orchestrator.
Coordinates all stages: extract → chunk → embed → store.

Triggered synchronously by the POST /ingest HTTP endpoint.
No background jobs, no queues — Node.js calls this directly and waits for the result.
"""

from __future__ import annotations

from sentence_transformers import SentenceTransformer

from app.clients.pgvector_client import PgVectorClient
from app.core.exceptions import RAGBaseError, TextExtractionError
from app.core.logging import get_logger
from app.ingestion.chunker import chunk_text
from app.ingestion.extractor import extract_text
from app.ingestion.indexer import embed_and_index
from app.models.schemas import IngestRequest, IngestionFailure, IngestionResult

logger = get_logger(__name__)


class IngestionPipeline:
    """
    Orchestrates the full document ingestion pipeline.

    Dependencies are injected at construction — the pipeline never creates
    its own connections or models, making it easy to test and extend.
    """

    def __init__(
        self,
        embedder: SentenceTransformer,
        pgvector_client: PgVectorClient,
    ) -> None:
        self._embedder = embedder
        self._pgvector = pgvector_client

    def run(self, request: IngestRequest) -> IngestionResult | IngestionFailure:
        """
        Execute the full pipeline for one document.

        Stages:
          1. Extract  — pull raw text from PDF/DOCX
          2. Chunk    — split into semantically coherent pieces
          3. Delete   — remove any previously indexed chunks for this document
          4. Embed    — generate 384-dim HuggingFace vectors
          5. Store    — bulk-insert into pgvector

        Returns IngestionResult on success, IngestionFailure on any error.
        """
        logger.info(
            "pipeline_started",
            document_id=request.document_id,
            file_name=request.file_name,
        )

        try:
            # Stage 1: Extract text
            text = extract_text(request.file_path, request.document_id)

            # Stage 2: Chunk
            chunks = chunk_text(text, request.document_id)

            # Stage 3: Delete old vectors (ensures idempotent re-ingestion)
            self._pgvector.delete_by_document_id(request.document_id)

            # Stage 4 & 5: Embed + store
            chunk_count = embed_and_index(
                chunks=chunks,
                request=request,
                embedder=self._embedder,
                pgvector_client=self._pgvector,
            )

            logger.info(
                "pipeline_succeeded",
                document_id=request.document_id,
                chunk_count=chunk_count,
            )
            return IngestionResult(
                document_id=request.document_id,
                chunk_count=chunk_count,
            )

        except TextExtractionError as exc:
            # Terminal — a corrupt/image-only file won't succeed on retry
            logger.error(
                "pipeline_extraction_failed",
                document_id=request.document_id,
                error=str(exc),
            )
            return IngestionFailure(
                document_id=request.document_id,
                error_code=exc.code,
                error_message=str(exc),
            )

        except RAGBaseError as exc:
            logger.error(
                "pipeline_failed",
                document_id=request.document_id,
                error_code=exc.code,
                error=str(exc),
            )
            return IngestionFailure(
                document_id=request.document_id,
                error_code=exc.code,
                error_message=str(exc),
            )

        except Exception as exc:
            logger.exception(
                "pipeline_unexpected_error",
                document_id=request.document_id,
                error=str(exc),
            )
            return IngestionFailure(
                document_id=request.document_id,
                error_code="UNEXPECTED_ERROR",
                error_message=str(exc),
            )
