"""
Typed data models for the RAG ingestion service.
All request/response data flowing through the pipeline is typed with Pydantic.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    """
    HTTP request body for POST /ingest.
    The file must already exist at file_path on the server's filesystem.
    """
    document_id: str = Field(..., description="Unique document identifier")
    file_path: str = Field(..., description="Absolute path to the PDF/DOCX file")
    file_name: str = Field(..., description="Original filename (for metadata)")
    exam: str = Field(..., description="Exam name, e.g. 'UPSC'")
    subject: str = Field(..., description="Subject name, e.g. 'History'")
    topic: str = Field(..., description="Topic name, e.g. 'Ancient India'")


class IngestionResult(BaseModel):
    """Returned after a successful ingestion run."""
    document_id: str
    chunk_count: int
    status: str = "indexed"


class IngestionFailure(BaseModel):
    """Returned after a failed ingestion run."""
    document_id: str
    error_code: str
    error_message: str
    status: str = "failed"
