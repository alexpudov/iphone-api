
from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(60), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)



class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    doctor_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("doctors.id"), nullable=False
    )

    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    is_booked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    doctor = relationship("Doctor", backref="slots")

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slot_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("slots.id"), nullable=False, unique=True
    )

    patient_name: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    slot = relationship("Slot", backref="appointments")
    

 