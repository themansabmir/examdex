"""
Core configuration module — loads and validates all environment variables.
Follows the fail-fast principle: invalid config raises immediately at startup.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")
    openai_embedding_model: str = Field(
        default="text-embedding-3-small", alias="OPENAI_EMBEDDING_MODEL"
    )

    # Pinecone
    pinecone_api_key: str = Field(..., alias="PINECONE_API_KEY")
    pinecone_index_name: str = Field(
        default="examdex-documents", alias="PINECONE_INDEX_NAME"
    )
    pinecone_embedding_dimension: int = Field(
        default=1536, alias="PINECONE_EMBEDDING_DIMENSION"
    )
    pinecone_metric: str = Field(default="cosine", alias="PINECONE_METRIC")
    pinecone_cloud: str = Field(default="aws", alias="PINECONE_CLOUD")
    pinecone_region: str = Field(default="us-east-1", alias="PINECONE_REGION")

    # Redis / BullMQ integration
    redis_url: str = Field(default="redis://localhost:6379", alias="REDIS_URL")

    # Ingestion tuning
    chunk_size: int = Field(default=512, alias="CHUNK_SIZE")
    chunk_overlap: int = Field(default=50, alias="CHUNK_OVERLAP")
    embedding_batch_size: int = Field(
        default=100, alias="EMBEDDING_BATCH_SIZE"
    )  # Max per Epic 18

    # Retrieval tuning
    retrieval_top_k: int = Field(default=5, alias="RETRIEVAL_TOP_K")

    # Retry
    max_retries: int = Field(default=3, alias="MAX_RETRIES")

    # Service
    log_level: str = Field(default="DEBUG", alias="RAG_LOG_LEVEL")
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
