from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user, require_admin
from app.models import Appointment, Doctor, Slot, User
from app.schemas import AppointmentCreate, AppointmentOut

DbSession = Annotated[Session, Depends(get_db)]
AdminUser = Annotated[User, Depends(require_admin)]
Plain_User = Annotated[User, Depends(get_current_user)]


router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("", response_model=AppointmentOut, status_code=201)
def create_appointment(
    payload: AppointmentCreate,
    db: DbSession,
    current_user: Plain_User,
):

    slot = db.query(Slot).filter(Slot.id == payload.slot_id).first()

    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    doctor = db.query(Doctor).filter(Doctor.id == slot.doctor_id).first()

    if not doctor or not doctor.is_active:
        raise HTTPException(status_code=409, detail="Doctor is not active")

    if slot.start_time < datetime.now():
        raise HTTPException(status_code=400, detail="Cannot book slot in the past")

    existing = (
        db.query(Appointment).filter(Appointment.slot_id == payload.slot_id).first()
    )

    if existing:
        raise HTTPException(status_code=409, detail="Slot already booked")

    appointment = Appointment(
        **payload.model_dump(),
        user_id=current_user.id,
    )

    db.add(appointment)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Slot already booked")

    db.refresh(appointment)

    return appointment


@router.get("", response_model=list[AppointmentOut])
def get_appointments(
    db: DbSession,
    current_user: Plain_User,
):
    query = db.query(Appointment)

    if current_user.role != "admin":
        query = query.filter(Appointment.user_id == current_user.id)

    appointments = query.order_by(Appointment.created_at.desc()).all()

    return appointments


@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: DbSession,
    current_user: Plain_User,
):

    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if current_user.role != "admin" and appointment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this appointment",
        )

    db.delete(appointment)
    db.commit()

    return {"status": "appointment cancelled"}
