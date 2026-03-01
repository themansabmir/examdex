"""
pgvector client — manages the PostgreSQL connection and document_chunks table.

Responsibilities:
  - ensure_setup()   : CREATE EXTENSION + CREATE TABLE on first run
  - upsert_chunks()  : bulk-insert embedded chunks with metadata
  - delete_by_document_id() : remove all rows for a given document
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass

import psycopg2
import psycopg2.extras
from pgvector.psycopg2 import register_vector

from app.core.exceptions import VectorStoreError
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class ChunkRow:
    """A single embedded chunk ready for insertion."""
    document_id: str
    exam: str
    subject: str
    topic: str
    chunk_index: int
    file_name: str
    text: str
    embedding: list[float]


class PgVectorClient:
    """
    Thin wrapper around a psycopg2 connection to the pgvector-enabled database.
    One instance is shared across the lifetime of the server process.
    """

    def __init__(self, database_url: str) -> None:
        self._database_url = database_url
        self._conn: psycopg2.extensions.connection | None = None

    # ── Lifecycle ────────────────────────────────────────────────────────────

    def connect(self) -> None:
        """Open the connection, ensure extension exists, and register the vector type."""
        self._conn = psycopg2.connect(self._database_url)
        self._conn.autocommit = True  # Enable autocommit for extension creation
        
        with self._conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        
        self._conn.autocommit = False
        register_vector(self._conn)
        logger.info("pgvector_connected")

    def close(self) -> None:
        """Close the connection gracefully."""
        if self._conn and not self._conn.closed:
            self._conn.close()
            logger.info("pgvector_connection_closed")

    # ── Schema setup ─────────────────────────────────────────────────────────

    def ensure_setup(self) -> None:
        """
        Idempotently create the pgvector extension and document_chunks table.
        Safe to call on every startup.
        """
        with self._conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    document_id   TEXT NOT NULL,
                    exam          TEXT,
                    subject       TEXT,
                    topic         TEXT,
                    chunk_index   INTEGER,
                    file_name     TEXT,
                    text          TEXT NOT NULL,
                    embedding     vector(384)
                );
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id
                    ON document_chunks (document_id);
            """)
        self._conn.commit()
        logger.info("pgvector_schema_ready")

    # ── Write operations ─────────────────────────────────────────────────────

    def upsert_chunks(self, chunks: list[ChunkRow]) -> None:
        """
        Bulk-insert a list of ChunkRow objects.
        Existing chunks for the same document should be deleted first
        (handled by the pipeline before calling this).
        """
        if not chunks:
            return

        rows = [
            (
                str(uuid.uuid4()),
                c.document_id,
                c.exam,
                c.subject,
                c.topic,
                c.chunk_index,
                c.file_name,
                c.text,
                c.embedding,
            )
            for c in chunks
        ]

        try:
            with self._conn.cursor() as cur:
                psycopg2.extras.execute_values(
                    cur,
                    """
                    INSERT INTO document_chunks
                        (id, document_id, exam, subject, topic,
                         chunk_index, file_name, text, embedding)
                    VALUES %s
                    """,
                    rows,
                )
            self._conn.commit()
            logger.info(
                "pgvector_chunks_inserted",
                document_id=chunks[0].document_id,
                count=len(chunks),
            )
        except Exception as exc:
            self._conn.rollback()
            raise VectorStoreError(
                f"Failed to insert chunks: {exc}",
                document_id=chunks[0].document_id if chunks else None,
            ) from exc

    def delete_by_document_id(self, document_id: str) -> None:
        """Delete all chunks for a given document (used before re-indexing)."""
        try:
            with self._conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM document_chunks WHERE document_id = %s;",
                    (document_id,),
                )
            self._conn.commit()
            logger.info("pgvector_chunks_deleted", document_id=document_id)
        except Exception as exc:
            self._conn.rollback()
            raise VectorStoreError(
                f"Failed to delete chunks: {exc}",
                document_id=document_id,
            ) from exc
