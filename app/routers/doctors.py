from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Doctor
from app.schemas import DoctorCreate, DoctorOut, DoctorUpdate

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.post("", response_model=DoctorOut, status_code=201)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(**payload.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor


@router.get("", response_model=list[DoctorOut])
def list_doctors(
    active: bool | None = None, 
    specialization: str| None = None, 
    full_name:str | None = None, 
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)):
    
    q = db.query(Doctor)

    if full_name is not None:
        q = q.filter(Doctor.full_name.ilike(f"%{full_name}%"))

    if active is not None:
        q = q.filter(Doctor.is_active == active)

    if specialization is not None:
        q = q.filter(Doctor.specialization.ilike(f"%{specialization}%"))

    return q.order_by(Doctor.id).limit(limit).offset(offset).all()
    

   


@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.patch("/{doctor_id}", response_model=DoctorOut)
def patch_doctor(
    doctor_id: int,
    payload: DoctorUpdate,
    db: Session = Depends(get_db),
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    data = payload.model_dump(exclude_unset=True)

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    for key, value in data.items():
        setattr(doctor, key, value)

    db.commit()
    db.refresh(doctor)
    return doctor


