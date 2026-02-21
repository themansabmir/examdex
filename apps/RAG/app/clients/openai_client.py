"""
OpenAI client adapter.
Handles embedding generation with batching, retry via tenacity, and structured errors.
"""

from __future__ import annotations

import time
from typing import TYPE_CHECKING

from openai import APIError, APITimeoutError, OpenAI, RateLimitError
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.config import get_settings
from app.core.exceptions import EmbeddingError
from app.core.logging import get_logger

if TYPE_CHECKING:
    pass

logger = get_logger(__name__)


class OpenAIClient:
    """
    Thin adapter around the OpenAI SDK.
    Single responsibility: produce embedding vectors from text.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_embedding_model
        self._batch_size = settings.embedding_batch_size

    @retry(
        retry=retry_if_exception_type((APIError, APITimeoutError, RateLimitError)),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def _embed_batch(self, texts: list[str]) -> list[list[float]]:
        response = self._client.embeddings.create(
            model=self._model,
            input=texts,
        )
        return [item.embedding for item in response.data]

    def embed_texts(
        self, texts: list[str], document_id: str | None = None
    ) -> list[list[float]]:
        """
        Embeds an arbitrary number of texts in batches of up to batch_size.
        Returns a list of float vectors in the same order as input texts.
        """
        if not texts:
            return []

        all_vectors: list[list[float]] = []
        total_batches = (len(texts) + self._batch_size - 1) // self._batch_size

        for batch_idx in range(total_batches):
            start = batch_idx * self._batch_size
            batch = texts[start : start + self._batch_size]

            t0 = time.perf_counter()
            try:
                vectors = self._embed_batch(batch)
                latency_ms = (time.perf_counter() - t0) * 1000
                logger.info(
                    "embedding_batch_complete",
                    batch_index=batch_idx,
                    batch_size=len(batch),
                    total_batches=total_batches,
                    latency_ms=round(latency_ms, 1),
                    document_id=document_id,
                )
                all_vectors.extend(vectors)
            except (APIError, APITimeoutError, RateLimitError) as exc:
                raise EmbeddingError(
                    f"Embedding batch {batch_idx}/{total_batches} failed after retries: {exc}",
                    document_id=document_id,
                ) from exc

        return all_vectors

    def embed_query(self, query: str) -> list[float]:
        """Embed a single query string for retrieval. Low-latency path."""
        try:
            result = self._embed_batch([query])
            return result[0]
        except (APIError, APITimeoutError, RateLimitError) as exc:
            raise EmbeddingError(f"Query embedding failed: {exc}") from exc
