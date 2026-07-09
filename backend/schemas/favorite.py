from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FavoriteCreate(BaseModel):
    book_id: str = Field(min_length=1, max_length=255)
    title: str = Field(min_length=1, max_length=255)
    authors: list[str] | None = None
    cover_url: str | None = None


class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    book_id: str
    title: str
    authors: list[str] | None
    cover_url: str | None
    created_at: datetime
