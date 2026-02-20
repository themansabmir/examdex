"""Pipeline package exports."""

from app.ingestion.chunker import chunk_text
from app.ingestion.extractor import extract_text
from app.ingestion.indexer import embed_and_index
from app.ingestion.pipeline import IngestionPipeline

__all__ = [
    "extract_text",
    "chunk_text",
    "embed_and_index",
    "IngestionPipeline",
]
