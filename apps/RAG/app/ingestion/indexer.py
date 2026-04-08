"""
Stage 3: Embedding + indexing.
Embeds text chunks using HuggingFace sentence-transformers and stores them in pgvector.
"""

from __future__ import annotations

import numpy as np
from sentence_transformers import SentenceTransformer

from app.clients.pgvector_client import ChunkRow, PgVectorClient
from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.schemas import IngestRequest

logger = get_logger(__name__)


def embed_and_index(
    chunks: list[str],
    request: IngestRequest,
    embedder: SentenceTransformer,
    pgvector_client: PgVectorClient,
) -> int:
    """
    Embed text chunks and store them in pgvector.

    1. Generate embeddings in batches (batch_size from settings).
    2. Build ChunkRow objects with full metadata.
    3. Upsert into postgres via pgvector_client.

    Args:
        chunks:          List of text chunks from the chunker.
        request:         The original IngestRequest (carries metadata).
        embedder:        Loaded SentenceTransformer model (shared, not re-loaded).
        pgvector_client: Injected database client.

    Returns:
        Number of chunks successfully inserted.
    """
    settings = get_settings()

    logger.info(
        "embedding_started",
        document_id=request.document_id,
        chunk_count=len(chunks),
        model=settings.hf_embedding_model,
    )

    # Encode in batches — returns a numpy array of shape (n_chunks, 384)
    vectors: np.ndarray = embedder.encode(
        chunks,
        batch_size=settings.embedding_batch_size,
        show_progress_bar=False,
        normalize_embeddings=True,
    )

    # Build ChunkRow objects
    chunk_rows: list[ChunkRow] = [
        ChunkRow(
            document_id=request.document_id,
            exam=request.exam,
            subject=request.subject,
            topic=request.topic,
            chunk_index=i,
            file_name=request.file_name,
            text=chunk,
            embedding=vectors[i].tolist(),
        )
        for i, chunk in enumerate(chunks)
    ]

    # Insert into pgvector (pipeline already deleted old rows before calling this)
    pgvector_client.upsert_chunks(chunk_rows)

    logger.info(
        "embedding_complete",
        document_id=request.document_id,
        vectors_inserted=len(chunk_rows),
    )
    return len(chunk_rows)
