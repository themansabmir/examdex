"""App package init — re-exports key components."""

from app.ingestion.pipeline import IngestionPipeline
from app.retrieval.retrieval_service import RetrievalService

__all__ = ["IngestionPipeline", "RetrievalService"]
