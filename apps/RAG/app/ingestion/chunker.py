"""
Stage 2: Text chunking.
Uses LangChain's RecursiveCharacterTextSplitter per Epic 18 spec.
"""

from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def chunk_text(text: str, document_id: str) -> list[str]:
    """
    Splits raw extracted text into semantically coherent chunks.

    chunk_size=512, chunk_overlap=50 as required by Epic 18.

    Args:
        text: The raw extracted text string.
        document_id: Used only for logging.

    Returns:
        List of non-empty chunk strings.
    """
    settings = get_settings()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        length_function=len,
        # Separator priority: paragraph → sentence → word → character
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = splitter.split_text(text)
    # Filter any empty chunks that may result from whitespace-heavy documents
    chunks = [c.strip() for c in chunks if c.strip()]

    logger.info(
        "chunking_complete",
        document_id=document_id,
        chunk_count=len(chunks),
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
    )
    return chunks
