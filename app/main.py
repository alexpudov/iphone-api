from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.db import Base, engine, get_db
from app.models import Doctor, Slot,Appointment
from app.schemas import DoctorCreate, DoctorOut,SlotCreate,SlotOut,AppointmentCreate, AppointmentOut

from datetime import date, datetime, time
from sqlalchemy import select



app = FastAPI(title="Clinic Booking")


Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/doctors", response_model=DoctorOut, status_code=201)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(
        full_name=payload.full_name,
        specialization=payload.specialization,
        is_active=payload.is_active,
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor


@app.get("/doctors", response_model=list[DoctorOut])
def list_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).order_by(Doctor.id).all()


@app.get("/doctors/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int, db:Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@app.post("/slots", response_model=SlotOut, status_code=201)
def create_slot(payload: SlotCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    if payload.start_time < datetime.now():
        raise HTTPException(status_code=400, detail="Cannot create slot in the past")

 
    conflict = (
        db.query(Slot)
        .filter(Slot.doctor_id == payload.doctor_id)
        .filter(Slot.start_time < payload.end_time, Slot.end_time > payload.start_time)
        .first()
    )
    if conflict:
        raise HTTPException(status_code=409, detail="Slot overlaps with existing slot")

    slot = Slot(
        doctor_id=payload.doctor_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot



from sqlalchemy import select
from datetime import date, datetime, time

@app.get("/doctors/{doctor_id}/slots", response_model=list[SlotOut])
def get_slots(
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


@app.delete("/slots/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    appointment = db.query(Appointment).filter(Appointment.slot_id == slot_id).first()
    if appointment:
        raise HTTPException(status_code=409, detail="Slot has appointment, cannot delete")

    db.delete(slot)
    db.commit()
    return {"status": "slot deleted", "slot_id": slot_id}



@app.post("/appointments", response_model=AppointmentOut, status_code=201)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == payload.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    existing = db.query(Appointment).filter(Appointment.slot_id == payload.slot_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Slot already booked")

    appointment = Appointment(
        slot_id=payload.slot_id,
        patient_name=payload.patient_name,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@app.get("/appointments")
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.id).all()


@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()
    return {"status": "appointment cancelled"}




    



