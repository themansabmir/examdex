"""
Typed data models for the RAG domain.
All data flowing through the pipeline is typed with Pydantic.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    INDEXED = "indexed"
    FAILED = "failed"


class DocumentMetadata(BaseModel):
    """Metadata attached to every vector chunk in Pinecone."""

    document_id: str
    exam: str
    subject: str
    topic: str
    chunk_index: int
    file_name: str

    def to_pinecone_filter(self) -> dict:
        return {"document_id": self.document_id}


class IngestionJob(BaseModel):
    """Represents an ingestion job payload consumed by the worker.
    Mirrors the BullMQ job data shape emitted by the Node.js API.
    """

    job_id: str
    document_id: str
    file_path: str  # Local path OR S3 key depending on deployment
    file_name: str
    exam: str
    subject: str
    topic: str
    attempt: int = Field(default=1)


class IngestionResult(BaseModel):
    """Result produced after a successful ingestion run."""

    document_id: str
    chunk_count: int
    status: DocumentStatus = DocumentStatus.INDEXED


class IngestionFailure(BaseModel):
    """Result produced after a failed ingestion run."""

    document_id: str
    error_code: str
    error_message: str
    status: DocumentStatus = DocumentStatus.FAILED


class ChunkVector(BaseModel):
    """A single embedded chunk ready for Pinecone upsert."""

    vector_id: str  # <document_id>_chunk_<index>
    values: list[float]
    metadata: dict


class RetrievalQuery(BaseModel):
    """Query input accepted by the retrieval service."""

    query: str
    topic_id: str
    top_k: int = Field(default=5)
    paper_id: Optional[str] = Field(default=None)


class RetrievalResult(BaseModel):
    """Output of retrieval — formatted context string for LLM injection."""

    topic_id: str
    context: str  # Ready for {{rag_context}} injection
    chunk_count: int
    is_empty: bool
