from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(60), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    slots = relationship(
        "Slot",
        back_populates="doctor",
    )


class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    doctor_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False,
    )

    start_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    end_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    doctor = relationship(
        "Doctor",
        back_populates="slots",
    )

    appointment = relationship(
        "Appointment",
        back_populates="slot",
        uselist=False,
    )

    @property
    def is_booked(self) -> bool:
        return self.appointment is not None


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    slot_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False,
        unique=True,
    )

    patient_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
        nullable=False,
    )

    slot = relationship(
        "Slot",
        back_populates="appointment",
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )
