"""
Typed domain exceptions for the RAG service.
Every exception must have a code and a human-readable message.
"""

from __future__ import annotations


class RAGBaseError(Exception):
    """Base for all RAG service errors."""

    code: str = "RAG_ERROR"

    def __init__(self, message: str, document_id: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.document_id = document_id

    def __str__(self) -> str:
        if self.document_id:
            return f"[{self.code}] doc={self.document_id}: {self.message}"
        return f"[{self.code}] {self.message}"


class UnsupportedFileTypeError(RAGBaseError):
    """Raised when a file with an unsupported extension is provided."""

    code = "UNSUPPORTED_FILE_TYPE"


class TextExtractionError(RAGBaseError):
    """Raised when text extraction fails (corrupt or unreadable file)."""

    code = "TEXT_EXTRACTION_FAILED"


class EmbeddingError(RAGBaseError):
    """Raised when OpenAI embedding call fails after retries."""

    code = "EMBEDDING_FAILED"


class VectorStoreError(RAGBaseError):
    """Raised when Pinecone upsert or delete fails after retries."""

    code = "VECTOR_STORE_ERROR"


class RetrievalError(RAGBaseError):
    """Raised when Pinecone similarity search fails."""

    code = "RETRIEVAL_FAILED"


class ConfigurationError(RAGBaseError):
    """Raised at startup when required environment variables are missing."""

    code = "CONFIGURATION_ERROR"
