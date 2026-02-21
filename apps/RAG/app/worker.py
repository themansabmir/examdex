"""
BullMQ-compatible worker.

Listens to Redis for ingestion jobs enqueued by the Node.js API (BullMQ).
BullMQ jobs are stored in Redis as JSON under the key:
  bull:<queue_name>:wait   (job IDs)
  bull:<queue_name>:<id>   (job data)

This worker uses the redis-py library to BLPOP jobs from the wait list,
parses the BullMQ v4 job format, and runs theIngestionPipeline.

BullMQ wire protocol (v4):
  - Job data key: "bull:<queue>:<id>"
  - Wait list key: "bull:<queue>:wait"
  - Active list key: "bull:<queue>:active"
  - Completed/Failed keys handled by moving job IDs.
"""

from __future__ import annotations

import json
import signal
import sys
import time
import uuid
from types import FrameType

import redis

from app.clients.openai_client import OpenAIClient
from app.clients.pinecone_client import PineconeClient
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.models.schemas import IngestionFailure, IngestionJob, IngestionResult
from app.ingestion.pipeline import IngestionPipeline

logger = get_logger(__name__)

QUEUE_NAME = "document-ingestion"
WAIT_KEY = f"bull:{QUEUE_NAME}:wait"
ACTIVE_KEY = f"bull:{QUEUE_NAME}:active"
COMPLETED_KEY = f"bull:{QUEUE_NAME}:completed"
FAILED_KEY = f"bull:{QUEUE_NAME}:failed"

_shutdown = False


def _handle_signal(signum: int, frame: FrameType | None) -> None:
    global _shutdown
    logger.info("worker_shutdown_signal_received", signal=signum)
    _shutdown = True


def _parse_job(raw: bytes, job_id: str) -> IngestionJob | None:
    """
    Parse BullMQ job JSON into a typed IngestionJob.
    Handles both raw job data blobs and BullMQ v4 envelope format.
    """
    try:
        data = json.loads(raw)
        # BullMQ v4 stores job data under the "data" key
        payload = data.get("data", data)
        return IngestionJob(
            job_id=job_id,
            document_id=payload["documentId"],
            file_path=payload["filePath"],
            file_name=payload["fileName"],
            exam=payload["exam"],
            subject=payload["subject"],
            topic=payload["topic"],
            attempt=data.get("attemptsMade", 0) + 1,
        )
    except (KeyError, json.JSONDecodeError) as exc:
        logger.error("job_parse_failed", job_id=job_id, error=str(exc))
        return None


def _move_to_completed(r: redis.Redis, job_id: str) -> None:
    r.lrem(ACTIVE_KEY, 1, job_id)
    r.lpush(COMPLETED_KEY, job_id)


def _move_to_failed(r: redis.Redis, job_id: str, reason: str) -> None:
    r.lrem(ACTIVE_KEY, 1, job_id)
    r.hset(f"bull:{QUEUE_NAME}:{job_id}", "failedReason", reason)
    r.lpush(FAILED_KEY, job_id)


def run_worker() -> None:
    """
    Main worker loop. Blocks on Redis BLPOP waiting for ingestion jobs.
    Gracefully shuts down on SIGTERM/SIGINT.
    """
    configure_logging()
    settings = get_settings()

    signal.signal(signal.SIGTERM, _handle_signal)
    signal.signal(signal.SIGINT, _handle_signal)

    r = redis.from_url(settings.redis_url, decode_responses=False)
    openai_client = OpenAIClient()
    pinecone_client = PineconeClient()
    pipeline = IngestionPipeline(openai_client, pinecone_client)

    logger.info(
        "worker_started",
        queue=QUEUE_NAME,
        redis_url=settings.redis_url,
        environment=settings.environment,
    )

    while not _shutdown:
        try:
            # BLPOP returns (key, value) or None on timeout
            result = r.blpop([WAIT_KEY], timeout=5)
            if result is None:
                continue  # Timeout — loop again (allows shutdown check)

            _, job_id_bytes = result
            job_id = job_id_bytes.decode("utf-8")

            # Move to active list
            r.rpush(ACTIVE_KEY, job_id)

            # Fetch job data
            job_key = f"bull:{QUEUE_NAME}:{job_id}"
            raw_data = r.hget(job_key, "data")
            if raw_data is None:
                logger.error("job_data_missing", job_id=job_id)
                _move_to_failed(r, job_id, "Job data missing from Redis")
                continue

            job = _parse_job(raw_data, job_id)
            if job is None:
                _move_to_failed(r, job_id, "Failed to parse job payload")
                continue

            logger.info(
                "job_received",
                job_id=job_id,
                document_id=job.document_id,
                file_name=job.file_name,
            )

            outcome = pipeline.run(job)

            if isinstance(outcome, IngestionResult):
                _move_to_completed(r, job_id)
                # Update document status via Redis pub/sub so Node.js API can react
                r.publish(
                    "rag:ingestion:complete",
                    json.dumps({
                        "documentId": outcome.document_id,
                        "status": outcome.status.value,
                        "chunkCount": outcome.chunk_count,
                    }),
                )
                logger.info(
                    "job_completed",
                    job_id=job_id,
                    document_id=outcome.document_id,
                    chunk_count=outcome.chunk_count,
                )

            elif isinstance(outcome, IngestionFailure):
                _move_to_failed(r, job_id, outcome.error_message)
                r.publish(
                    "rag:ingestion:failed",
                    json.dumps({
                        "documentId": outcome.document_id,
                        "status": outcome.status.value,
                        "errorCode": outcome.error_code,
                        "errorMessage": outcome.error_message,
                    }),
                )
                logger.error(
                    "job_failed",
                    job_id=job_id,
                    document_id=outcome.document_id,
                    error_code=outcome.error_code,
                    error=outcome.error_message,
                )

        except redis.ConnectionError as exc:
            logger.error("redis_connection_error", error=str(exc))
            time.sleep(5)  # Backoff before reconnect attempt
        except Exception as exc:
            logger.exception("worker_unexpected_error", error=str(exc))

    logger.info("worker_stopped")


if __name__ == "__main__":
    run_worker()
