"""
FastAPI server — exposes a direct HTTP endpoint for document ingestion.

Endpoints:
  GET  /health   — service liveness
  POST /ingest   — trigger synchronous ingestion for a document
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, status
from sentence_transformers import SentenceTransformer

from app.clients.pgvector_client import PgVectorClient
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.ingestion.pipeline import IngestionPipeline
from app.models.schemas import IngestRequest, IngestionFailure, IngestionResult

logger = get_logger(__name__)

# ── Shared singleton instances (init once on startup) ────────────────────────
_pgvector_client: PgVectorClient | None = None
_embedder: SentenceTransformer | None = None
_pipeline: IngestionPipeline | None = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize heavy clients once at startup."""
    global _pgvector_client, _embedder, _pipeline
    
    settings = get_settings()
    configure_logging()
    logger.info("rag_server_starting", env=settings.environment)

    # 1. Setup PGVector
    try:
        _pgvector_client = PgVectorClient(settings.database_url)
        _pgvector_client.connect()
        _pgvector_client.ensure_setup()
    except Exception as exc:
        logger.error("pgvector_init_failed", error=str(exc))
        raise RuntimeError("Could not connect to database") from exc

    # 2. Load Embedding Model (expensive)
    try:
        logger.info("loading_model", model=settings.hf_embedding_model)
        _embedder = SentenceTransformer(settings.hf_embedding_model)
    except Exception as exc:
        logger.error("model_load_failed", error=str(exc))
        raise RuntimeError("Could not load embedding model") from exc

    # 3. Create Pipeline
    _pipeline = IngestionPipeline(_embedder, _pgvector_client)

    logger.info("rag_server_ready")
    yield
    
    # Shutdown
    if _pgvector_client:
        _pgvector_client.close()
    logger.info("rag_server_shutdown")


app = FastAPI(
    title="ExamDex RAG Service",
    version="2.0.0",
    description="Synchronous document ingestion service via HuggingFace + pgvector.",
    lifespan=lifespan,
)


@app.get("/health", tags=["ops"])
def health_check() -> dict:
    """Liveness probe."""
    return {"status": "ok", "service": "rag"}


@app.post(
    "/ingest",
    response_model=IngestionResult,
    status_code=status.HTTP_200_OK,
    tags=["ingestion"],
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": IngestionFailure},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": IngestionFailure}
    }
)
async def ingest(req: IngestRequest) -> IngestionResult:
    """
    Ingest a document from the local filesystem.
    Coordinates extraction, chunking, embedding, and storing in pgvector.
    
    This is a synchronous operation — the client waits for the result.
    """
    if _pipeline is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pipeline not initialized",
        )

    outcome = _pipeline.run(req)

    if isinstance(outcome, IngestionResult):
        return outcome
    
    # If it's a failure (either expected domain error or unexpected)
    error_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    if outcome.error_code in ["UNSUPPORTED_FILE_TYPE", "TEXT_EXTRACTION_FAILED"]:
        error_status = status.HTTP_422_UNPROCESSABLE_ENTITY
        
    raise HTTPException(
        status_code=error_status,
        detail=outcome.model_dump()
    )
