"""
Stage 3: Embedding + indexing.
Embeds chunks via OpenAI and upserts into Pinecone with full metadata.
"""

from __future__ import annotations

from app.clients.openai_client import OpenAIClient
from app.clients.pinecone_client import PineconeClient
from app.core.logging import get_logger
from app.models.schemas import ChunkVector, DocumentMetadata

logger = get_logger(__name__)


def embed_and_index(
    chunks: list[str],
    metadata: DocumentMetadata,
    openai_client: OpenAIClient,
    pinecone_client: PineconeClient,
) -> int:
    """
    Embeds chunks and upserts them to Pinecone.

    1. Generate embeddings in batches (up to 100 per call — OpenAI + Epic 18).
    2. Build ChunkVector objects with metadata.
    3. Upsert to Pinecone.

    Args:
        chunks: List of text chunks to embed.
        metadata: Exam/subject/topic/document metadata.
        openai_client: Injected OpenAI adapter.
        pinecone_client: Injected Pinecone adapter.

    Returns:
        Number of vectors successfully upserted.
    """
    logger.info(
        "indexing_started",
        document_id=metadata.document_id,
        chunk_count=len(chunks),
    )

    # Embed all chunks (internally batched to ≤ 100 per call)
    vectors = openai_client.embed_texts(chunks, document_id=metadata.document_id)

    # Build ChunkVector objects
    chunk_vectors: list[ChunkVector] = []
    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        vector_id = PineconeClient.make_vector_id(metadata.document_id, i)
        chunk_vectors.append(
            ChunkVector(
                vector_id=vector_id,
                values=vector,
                metadata={
                    "document_id": metadata.document_id,
                    "exam": metadata.exam,
                    "subject": metadata.subject,
                    "topic": metadata.topic,
                    "chunk_index": i,
                    "file_name": metadata.file_name,
                    "text": chunk,  # Store text for retrieval display
                },
            )
        )

    # Upsert to Pinecone
    pinecone_client.upsert_chunks(chunk_vectors, metadata.document_id)

    logger.info(
        "indexing_complete",
        document_id=metadata.document_id,
        vectors_upserted=len(chunk_vectors),
    )
    return len(chunk_vectors)
