import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


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
    full_name: str = Field(min_length=4, max_length=50)
    specialization: str = Field(min_length=5, max_length=50)
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
    image_url: str | None


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

    is_booked: bool


class SlotUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    start_time: datetime | None = None
    end_time: datetime | None = None


class AppointmentCreate(BaseModel):
    slot_id: int
    patient_name: str


# Nested schemas for AppointmentOut


class DoctorShortOut(BaseModel):
    id: int
    full_name: str

    model_config = ConfigDict(from_attributes=True)


class SlotAppointmentOut(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    doctor: DoctorShortOut

    model_config = ConfigDict(from_attributes=True)


class AppointmentOut(BaseModel):
    id: int
    user_id: int
    patient_name: str
    created_at: datetime
    slot: SlotAppointmentOut

    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=30)

    @field_validator("password")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:

        special_symbol = sum(not char.isalnum() for char in value)
        digits_count = sum(char.isdigit() for char in value)

        if not value:
            raise ValueError("Password cannot be empty")

        if not re.fullmatch(r"[A-Za-z]+", value):
            raise ValueError("Password can contain only English letters")

        if special_symbol < 2:
            raise ValueError("Password must contain at least 2 special characters")

        if digits_count < 2:
            raise ValueError("Password must contain at least 2 digits")

        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")

        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter")

        if any(char.isspace() for char in value):
            raise ValueError("Password cannot contain spaces")

        return value


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
