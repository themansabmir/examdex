"""App package init — re-exports key components."""

from app.ingestion.pipeline import IngestionPipeline

__all__ = ["IngestionPipeline"]
