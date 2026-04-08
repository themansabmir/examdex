"""
Core configuration — loads and validates environment variables.
Fail-fast: invalid/missing config raises immediately at startup.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # PostgreSQL (pgvector)
    database_url: str = Field(..., alias="DATABASE_URL")

    # HuggingFace embedding model
    hf_embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        alias="HF_EMBEDDING_MODEL",
    )
    embedding_dimension: int = Field(default=384, alias="EMBEDDING_DIMENSION")
    embedding_batch_size: int = Field(default=64, alias="EMBEDDING_BATCH_SIZE")

    # Chunking
    chunk_size: int = Field(default=512, alias="CHUNK_SIZE")
    chunk_overlap: int = Field(default=50, alias="CHUNK_OVERLAP")

    # Service
    log_level: str = Field(default="INFO", alias="RAG_LOG_LEVEL")
    environment: str = Field(default="development", alias="RAG_ENVIRONMENT")

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        valid = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        upper = v.upper()
        if upper not in valid:
            raise ValueError(f"log_level must be one of {valid}")
        return upper

    class Config:
        env_file = ".env"
        populate_by_name = True
        extra = "ignore"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Singleton settings instance — cached after first call."""
    return Settings()
