from pydantic import BaseModel, Field, ConfigDict

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base

class Iphone(BaseModel):
    model_config = ConfigDict(extra="forbid")
    iphone_name: str = Field(
        min_length=3,
        max_length=30,
        description="Model name"
    )
    capacity: int = Field(
        gt=0,
        le=1024
    )
    weight: int = Field(
        gt=0,
        le=500
    )
    display: float = Field(
        ge=4.0,
        le=8.0
    )



class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(60), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
