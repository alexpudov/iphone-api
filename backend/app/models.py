from datetime import datetime
from enum import Enum

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(60))
    is_active: Mapped[bool] = mapped_column(default=True)
    image_url: Mapped[str | None] = mapped_column(String(500))

    slots = relationship(
        "Slot",
        back_populates="doctor",
    )


class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(primary_key=True)

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctors.id"),
    )

    start_time: Mapped[datetime] = mapped_column()
    end_time: Mapped[datetime] = mapped_column()

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

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
    )

    slot_id: Mapped[int] = mapped_column(
        ForeignKey("slots.id"),
        unique=True,
    )

    patient_name: Mapped[str] = mapped_column(String(100))

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
    )

    slot = relationship(
        "Slot",
        back_populates="appointment",
    )


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
    )

    hashed_password: Mapped[str] = mapped_column(String(255))

    role: Mapped[UserRole] = mapped_column(
        String(20),
        default=UserRole.USER,
    )

    is_active: Mapped[bool] = mapped_column(default=True)

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
    )
