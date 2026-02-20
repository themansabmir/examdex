"""
RAG Retrieval Service — Epic 19.

Accepts a topicId + natural-language query, embeds the query, and retrieves
the top-k most relevant chunks from Pinecone filtered by topic.
Falls back to empty string if no documents exist for the topic.
"""

from __future__ import annotations

import time

import structlog

from app.clients.openai_client import OpenAIClient
from app.clients.pinecone_client import PineconeClient
from app.core.exceptions import RetrievalError
from app.core.logging import get_logger
from app.models.schemas import RetrievalQuery, RetrievalResult

logger = get_logger(__name__)

# Context separator used between chunks (readable in LLM prompts)
_CHUNK_SEPARATOR = "\n\n---\n\n"


class RetrievalService:
    """
    Retrieves the most relevant document chunks for a given topic query.

    Injected clients keep this class fully testable without real API calls.
    """

    def __init__(
        self,
        openai_client: OpenAIClient,
        pinecone_client: PineconeClient,
    ) -> None:
        self._openai = openai_client
        self._pinecone = pinecone_client

    def retrieve(self, query: RetrievalQuery) -> RetrievalResult:
        """
        Semantic retrieval with topic filter.

        1. Embed the query text.
        2. Query Pinecone with a topic metadata filter.
        3. Format top-k results into a single context string.
        4. Return empty string if no matches found (generation proceeds normally).

        Epic 19 requirements:
        - Returns top-5 most relevant chunks.
        - Filtered by topic metadata.
        - Adds ≤ 500ms to generation latency.
        - Logs retrieved chunks at DEBUG level with paper_id.
        """
        t0 = time.perf_counter()

        try:
            query_vector = self._openai.embed_query(query.query)
        except Exception as exc:
            raise RetrievalError(
                f"Failed to embed retrieval query: {exc}"
            ) from exc

        metadata_filter = {"topic": {"$eq": query.topic_id}}

        matches = self._pinecone.query(
            vector=query_vector,
            top_k=query.top_k,
            metadata_filter=metadata_filter,
        )

        latency_ms = round((time.perf_counter() - t0) * 1000, 1)

        if not matches:
            logger.info(
                "retrieval_empty",
                topic_id=query.topic_id,
                paper_id=query.paper_id,
                latency_ms=latency_ms,
            )
            return RetrievalResult(
                topic_id=query.topic_id,
                context="",
                chunk_count=0,
                is_empty=True,
            )

        # Extract text from metadata (stored during indexing)
        chunks: list[str] = []
        for i, match in enumerate(matches):
            text = match.get("metadata", {}).get("text", "")
            score = round(match.get("score", 0.0), 4)
            logger.debug(
                "retrieved_chunk",
                paper_id=query.paper_id,
                topic_id=query.topic_id,
                chunk_rank=i + 1,
                score=score,
                char_count=len(text),
            )
            if text:
                chunks.append(text)

        context = _CHUNK_SEPARATOR.join(chunks)

        logger.info(
            "retrieval_complete",
            topic_id=query.topic_id,
            paper_id=query.paper_id,
            chunk_count=len(chunks),
            latency_ms=latency_ms,
            context_chars=len(context),
        )

        return RetrievalResult(
            topic_id=query.topic_id,
            context=context,
            chunk_count=len(chunks),
            is_empty=False,
        )
