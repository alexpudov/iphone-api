from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models import Appointment, Slot, Doctor
from app.schemas import AppointmentCreate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("", response_model=AppointmentOut, status_code=201)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == payload.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    doctor = db.query(Doctor).filter(Doctor.id == slot.doctor_id).first()
    if not doctor or not doctor.is_active:
        raise HTTPException(
        status_code=409,
        detail="Doctor is not active"
    )

    if slot.start_time < datetime.now():
        raise HTTPException(status_code=400, detail="Cannot book slot in the past")

    existing = db.query(Appointment).filter(Appointment.slot_id == payload.slot_id).first()

    if existing:
        raise HTTPException(status_code=409, detail="Slot already booked")

    appointment = Appointment(**payload.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("", response_model=list[AppointmentOut])
def get_appointments(
    doctor_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Appointment).options(
        joinedload(Appointment.slot).joinedload(Slot.doctor)
    )

    if doctor_id is not None:
        query = (
            query
            .join(Appointment.slot)
            .filter(Slot.doctor_id == doctor_id)
        )

    

    return query.order_by(Appointment.created_at.desc()).all()


@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()
    return {"status": "appointment cancelled"}
