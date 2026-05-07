from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MatchForge AI"
    api_prefix: str = "/api/v1"
    frontend_origin: str = Field(default="http://localhost:5173")
    environment: str = Field(default="development")

    model_config = SettingsConfigDict(env_prefix="MATCHFORGE_", env_file=".env", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
