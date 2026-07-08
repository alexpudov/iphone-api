from pydantic import BaseModel, ConfigDict, field_validator, Field
from datetime import datetime



import re

def validate_doctor_text(value: str) -> str:
    value = value.strip()


    if not value:
        raise ValueError("Field cannot be empty")

    if len(value) < 2:
        raise ValueError("Field must be at least 2 characters")

    if len(value) > 50:
        raise ValueError("Field must be at most 50 characters")

    if not re.fullmatch(r"[A-Za-z\s]+", value):
        raise ValueError("Field can contain only letters and spaces")

    if re.search(r"\s{2,}", value):
        raise ValueError("Only one space is allowed between words")

    return value


class DoctorCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=50)
    specialization: str = Field(min_length=2, max_length=50)
    is_active: bool = True

    @field_validator("full_name", "specialization")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:
        return validate_doctor_text(value)


class DoctorUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str | None = None
    specialization: str | None = None
    is_active: bool | None = None

    @field_validator("full_name", "specialization")
    @classmethod
    def validate_text_fields(cls, value: str | None) -> str | None:
        if value is None:
            return value

        return validate_doctor_text(value)

class DoctorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    specialization: str 
    is_active: bool


class SlotCreate(BaseModel):
    doctor_id: int
    start_time: datetime
    end_time: datetime


class SlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    doctor_id: int
    start_time: datetime
    end_time: datetime
 

class AppointmentCreate(BaseModel):
    slot_id: int
    patient_name: str


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slot_id: int
    patient_name: str
    created_at: datetime
