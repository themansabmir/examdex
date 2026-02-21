"""
FastAPI server — exposes the RAG retrieval endpoint for the Node.js paper generation engine.

Endpoints:
  GET  /health             — liveness probe
  POST /retrieve           — retrieve context for a topic query
  DELETE /documents/{id}   — delete all vectors for a document
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

from app.clients.openai_client import OpenAIClient
from app.clients.pinecone_client import PineconeClient
from app.core.exceptions import RAGBaseError, RetrievalError
from app.core.logging import configure_logging, get_logger
from app.models.schemas import RetrievalQuery, RetrievalResult
from app.retrieval.retrieval_service import RetrievalService

logger = get_logger(__name__)

# ── Shared client instances (initialised once on startup) ────────────────────
_openai_client: OpenAIClient | None = None
_pinecone_client: PineconeClient | None = None
_retrieval_service: RetrievalService | None = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialise heavy clients once at startup; close cleanly on shutdown."""
    global _openai_client, _pinecone_client, _retrieval_service

    configure_logging()
    logger.info("rag_server_starting")

    _openai_client = OpenAIClient()
    _pinecone_client = PineconeClient()
    _retrieval_service = RetrievalService(_openai_client, _pinecone_client)

    logger.info("rag_server_ready")
    yield
    logger.info("rag_server_shutdown")


app = FastAPI(
    title="ExamDex RAG Service",
    version="1.0.0",
    description="Document ingestion and retrieval service for ExamDex.",
    lifespan=lifespan,
)


# ── Request / response models ────────────────────────────────────────────────

class RetrieveRequest(BaseModel):
    query: str
    topicId: str
    paperId: str | None = None
    topK: int = 5


class RetrieveResponse(BaseModel):
    topicId: str
    context: str
    chunkCount: int
    isEmpty: bool


class DeleteResponse(BaseModel):
    documentId: str
    message: str


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["ops"])
def health_check() -> dict:
    return {"status": "ok", "service": "rag"}


@app.post(
    "/retrieve",
    response_model=RetrieveResponse,
    status_code=status.HTTP_200_OK,
    tags=["retrieval"],
)
def retrieve(req: RetrieveRequest) -> RetrieveResponse:
    """
    Retrieve the top-k most relevant document chunks for a topic query.

    Returns an empty context string if no documents are indexed for the topic.
    Used by the Node.js paper generation engine to populate {{rag_context}}.
    """
    if _retrieval_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service not initialised",
        )

    try:
        result: RetrievalResult = _retrieval_service.retrieve(
            RetrievalQuery(
                query=req.query,
                topic_id=req.topicId,
                top_k=req.topK,
                paper_id=req.paperId,
            )
        )
        return RetrieveResponse(
            topicId=result.topic_id,
            context=result.context,
            chunkCount=result.chunk_count,
            isEmpty=result.is_empty,
        )
    except RetrievalError as exc:
        logger.error("retrieve_endpoint_error", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except RAGBaseError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc


@app.delete(
    "/documents/{document_id}",
    response_model=DeleteResponse,
    status_code=status.HTTP_200_OK,
    tags=["management"],
)
def delete_document(document_id: str) -> DeleteResponse:
    """
    Delete all Pinecone vectors for a given document.
    Called by the Node.js API when a document is deleted (Epic 18).
    """
    if _pinecone_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service not initialised",
        )

    try:
        _pinecone_client.delete_by_document_id(document_id)
        return DeleteResponse(
            documentId=document_id,
            message=f"All vectors for document {document_id} deleted.",
        )
    except RAGBaseError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
