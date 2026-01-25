from pydantic import BaseModel, ConfigDict, Field


class DoctorCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(min_length=3, max_length=100)
    specialization: str = Field(min_length=2, max_length=60)
    is_active: bool = True


class DoctorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    specialization: str
    is_active: bool
