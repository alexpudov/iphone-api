from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


class DoctorCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(min_length=3, max_length=50)
    specialization: str = Field(min_length=2, max_length=30)
    is_active: bool = True


class DoctorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    specialization: str
    is_active: bool

class DoctorUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str | None = None
    specialization: str | None = None
    is_active: bool | None = None


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
