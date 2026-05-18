"""
Stage 1: Text extraction.
Extracts raw text from PDF or DOCX files.
Raises TextExtractionError on corrupt or unreadable files (Epic 18 requirement).
"""

from __future__ import annotations

import os

from docx import Document
from pypdf import PdfReader
from pypdf.errors import PdfReadError

from app.core.exceptions import TextExtractionError, UnsupportedFileTypeError
from app.core.logging import get_logger

logger = get_logger(__name__)

SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def extract_text(file_path: str, document_id: str) -> str:
    """
    Extracts plain text from a PDF or DOCX file.

    Args:
        file_path: Absolute path to the file.
        document_id: Used in error context and logging.

    Returns:
        Extracted text string.

    Raises:
        UnsupportedFileTypeError: If file extension is not supported.
        TextExtractionError: If the file is corrupt or unreadable.
    """
    # Normalize and validate path
    clean_path = os.path.normpath(file_path)
    if not os.path.exists(clean_path):
        raise TextExtractionError(
            f"File not found at: {clean_path}",
            document_id=document_id,
        )
    
    if not os.path.isfile(clean_path):
        raise TextExtractionError(
            f"Path is not a file (might be a directory): {clean_path}",
            document_id=document_id,
        )

    extension = os.path.splitext(clean_path)[1].lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileTypeError(
            f"File type '{extension}' is not supported for path: {clean_path}. Accepted: {SUPPORTED_EXTENSIONS}",
            document_id=document_id,
        )

    logger.info(
        "extraction_started",
        document_id=document_id,
        file_path=clean_path,
        file_type=extension,
    )

    if extension == ".pdf":
        text = _extract_pdf(clean_path, document_id)
    else:
        text = _extract_docx(clean_path, document_id)

    if not text.strip():
        raise TextExtractionError(
            "Extracted text is empty — file may be scanned or image-only.",
            document_id=document_id,
        )

    logger.info(
        "extraction_complete",
        document_id=document_id,
        char_count=len(text),
    )
    return text


def _extract_pdf(file_path: str, document_id: str) -> str:
    try:
        reader = PdfReader(file_path)
        pages: list[str] = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            pages.append(page_text)
            logger.debug(
                "pdf_page_extracted",
                document_id=document_id,
                page=i + 1,
                char_count=len(page_text),
            )
        return "\n".join(pages)
    except PdfReadError as exc:
        raise TextExtractionError(
            f"PDF is corrupt or unreadable: {exc}",
            document_id=document_id,
        ) from exc
    except Exception as exc:
        raise TextExtractionError(
            f"Unexpected error reading PDF: {exc}",
            document_id=document_id,
        ) from exc


def _extract_docx(file_path: str, document_id: str) -> str:
    try:
        doc = Document(file_path)
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return "\n".join(paragraphs)
    except Exception as exc:
        raise TextExtractionError(
            f"DOCX is corrupt or unreadable: {exc}",
            document_id=document_id,
        ) from exc
