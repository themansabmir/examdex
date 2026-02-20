"""
Ingestion pipeline orchestrator.
Coordinates all stages: extract → chunk → index.
Implements retry with exponential backoff and rollback on failure (Epic 18).
"""

from __future__ import annotations

import time

from tenacity import (
    RetryError,
    retry,
    stop_after_attempt,
    wait_exponential,
)

from app.clients.openai_client import OpenAIClient
from app.clients.pinecone_client import PineconeClient
from app.core.exceptions import RAGBaseError, TextExtractionError
from app.core.logging import get_logger
from app.models.schemas import (
    DocumentMetadata,
    DocumentStatus,
    IngestionFailure,
    IngestionJob,
    IngestionResult,
)
from app.ingestion.chunker import chunk_text
from app.ingestion.extractor import extract_text
from app.ingestion.indexer import embed_and_index

logger = get_logger(__name__)


class IngestionPipeline:
    """
    Orchestrates the full document ingestion pipeline.

    Follows hexagonal design: receives injected clients, never creates them.
    Can be invoked from a worker, a test, or directly.
    """

    def __init__(
        self,
        openai_client: OpenAIClient,
        pinecone_client: PineconeClient,
    ) -> None:
        self._openai = openai_client
        self._pinecone = pinecone_client

    def run(self, job: IngestionJob) -> IngestionResult | IngestionFailure:
        """
        Execute the full pipeline with up to 3 retry attempts.
        On any failure after retries, rollback Pinecone vectors and return IngestionFailure.
        """
        logger.info(
            "pipeline_started",
            document_id=job.document_id,
            file_name=job.file_name,
            attempt=job.attempt,
        )
        t0 = time.perf_counter()

        try:
            result = self._run_with_retry(job)
            elapsed = round((time.perf_counter() - t0) / 60, 2)
            logger.info(
                "pipeline_succeeded",
                document_id=job.document_id,
                chunk_count=result.chunk_count,
                elapsed_minutes=elapsed,
            )
            return result
        except Exception as exc:
            elapsed = round((time.perf_counter() - t0) / 60, 2)
            error_code = getattr(exc, "code", "UNKNOWN_ERROR")
            error_message = str(exc)

            logger.error(
                "pipeline_failed_terminal",
                document_id=job.document_id,
                error_code=error_code,
                error=error_message,
                elapsed_minutes=elapsed,
            )
            return IngestionFailure(
                document_id=job.document_id,
                error_code=error_code,
                error_message=error_message,
                status=DocumentStatus.FAILED,
            )

    @retry(
        wait=wait_exponential(multiplier=2, min=5, max=60),
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _run_with_retry(self, job: IngestionJob) -> IngestionResult:
        """
        Single attempt of the ingestion pipeline.
        On failure, rolls back any partial Pinecone upserts before raising
        so the retry starts from a clean slate.
        """
        document_id = job.document_id
        partial_indexed = False

        try:
            # Stage 1: Extract
            text = extract_text(job.file_path, document_id)

            # Stage 2: Chunk
            chunks = chunk_text(text, document_id)

            # Stage 3: Rollback any previous partial upsert before re-indexing
            logger.info("partial_rollback_start", document_id=document_id)
            self._pinecone.delete_by_document_id(document_id)

            # Stage 4: Embed + index
            partial_indexed = True
            chunk_count = embed_and_index(
                chunks=chunks,
                metadata=DocumentMetadata(
                    document_id=document_id,
                    exam=job.exam,
                    subject=job.subject,
                    topic=job.topic,
                    chunk_index=0,  # Placeholder; indexer assigns per chunk
                    file_name=job.file_name,
                ),
                openai_client=self._openai,
                pinecone_client=self._pinecone,
            )

            return IngestionResult(
                document_id=document_id,
                chunk_count=chunk_count,
                status=DocumentStatus.INDEXED,
            )

        except TextExtractionError:
            # Extraction errors are terminal — don't retry a corrupt file
            raise

        except RAGBaseError as exc:
            # Non-extraction errors: rollback partial state if indexing started
            if partial_indexed:
                logger.warning(
                    "rolling_back_partial_upsert",
                    document_id=document_id,
                    error=str(exc),
                )
                try:
                    self._pinecone.delete_by_document_id(document_id)
                except Exception as rollback_exc:
                    logger.error(
                        "rollback_failed",
                        document_id=document_id,
                        rollback_error=str(rollback_exc),
                    )
            raise
