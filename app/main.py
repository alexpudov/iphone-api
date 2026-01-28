from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.db import Base, engine, get_db
from app.models import Doctor, Slot
from app.schemas import DoctorCreate, DoctorOut,SlotCreate,SlotOut



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

    slot = Slot(
        doctor_id=payload.doctor_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@app.get("/doctors/{doctor_id}/slots", response_model=list[SlotOut])
def get_slots(doctor_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Slot)
        .filter(Slot.doctor_id == doctor_id)
        .order_by(Slot.start_time)
        .all()
    )

