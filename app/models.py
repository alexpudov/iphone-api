from pydantic import BaseModel, Field, ConfigDict

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