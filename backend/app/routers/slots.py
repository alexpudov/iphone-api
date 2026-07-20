from datetime import date, datetime, time, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Doctor, Slot, Appointment
from app.schemas import SlotCreate, SlotOut, SlotUpdate

router = APIRouter(prefix="/slots", tags=["Slots"])


@router.post("", response_model=SlotOut, status_code=201)
def create_slot(payload: SlotCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=404, 
            detail="Doctor not found")

    if payload.end_time <= payload.start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time")
    
    minimum_slot_duration = timedelta(minutes = 15)

    if payload.end_time - payload.start_time < minimum_slot_duration:
        raise HTTPException(
            status_code=400,
            detail="Slot duration must be at least 15 minutes"
        )
    
    maximum_slot_duration = timedelta(hours = 1)

    if payload.end_time - payload.start_time > maximum_slot_duration:
        raise HTTPException(
            status_code=400,
            detail="Slot duration must not exceed one hour"
        )

    if payload.start_time < datetime.now():
        raise HTTPException(
            status_code=400, 
            detail="Cannot create slot in the past")
    
    if not doctor.is_active:
        raise HTTPException(
        status_code=409,
        detail="Doctor is not active"
    )

    conflict = (
        db.query(Slot)
        .filter(Slot.doctor_id == payload.doctor_id)
        .filter(Slot.start_time < payload.end_time, Slot.end_time > payload.start_time)
        .first()
    )
    if conflict:
        raise HTTPException(status_code=409, detail="Slot overlaps with existing slot")

    slot = Slot(**payload.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.delete("/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    appointment = db.query(Appointment).filter(Appointment.slot_id == slot_id).first()
    if appointment:
        raise HTTPException(status_code=409, detail="Slot has appointment, cannot delete")

    db.delete(slot)
    db.commit()
    return {"status": "slot deleted"}

@router.get("/doctor/{doctor_id}", response_model=list[SlotOut])
def get_slots_for_doctor(
    doctor_id: int,
    date_: date | None = None,
    only_free: bool = False,
    db: Session = Depends(get_db),
):
    q = db.query(Slot).filter(Slot.doctor_id == doctor_id)

    if date_ is not None:
        start_dt = datetime.combine(date_, time.min)
        end_dt = datetime.combine(date_, time.max)
        q = q.filter(Slot.start_time >= start_dt, Slot.start_time <= end_dt)

    if only_free:
        booked_slot_ids = select(Appointment.slot_id)
        q = q.filter(~Slot.id.in_(booked_slot_ids))

    return q.order_by(Slot.start_time).all()

@router.patch("/{slot_id}", response_model=SlotOut)
def patch_slot(
    slot_id: int,
    payload: SlotUpdate,
    db: Session = Depends(get_db),
):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found",
        )

    data = payload.model_dump(exclude_unset=True)

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No fields to update",
        )

    new_start_time = data.get("start_time", slot.start_time)
    new_end_time = data.get("end_time", slot.end_time)

    if new_end_time <= new_start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time",
        )
    
    minimum_slot_duration = timedelta(minutes=15)

    if new_end_time - new_start_time < minimum_slot_duration:
        raise HTTPException(
            status_code=400,
            detail="Slot duration must be at least 15 minutes",
    )

    maximum_slot_duration = timedelta(hours=1)

    if new_end_time - new_start_time > maximum_slot_duration:
        raise HTTPException(
            status_code=400,
            detail="Slot duration must not exceed one hour",
        )

    if new_start_time < datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Cannot create slot in the past",
        )
    
    conflict = (
    db.query(Slot)
    .filter(Slot.doctor_id == slot.doctor_id)
    .filter(Slot.id != slot_id)
    .filter(
        Slot.start_time < new_end_time,
        Slot.end_time > new_start_time,
    )
    .first())

    if conflict:
        raise HTTPException(
            status_code=409,
            detail="Slot overlaps with existing slot",
        )

    for key, value in data.items():
        setattr(slot, key, value)

    db.commit()
    db.refresh(slot)

    return slot