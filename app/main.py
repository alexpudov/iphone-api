from fastapi import FastAPI

from app.db import engine, Base
from app.routers import doctors, slots, appointments

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Clinic Booking')

app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)
