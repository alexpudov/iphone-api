from fastapi import FastAPI

from app.db import engine, Base
from app.routers import doctors, slots, appointments

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Clinic Booking')

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)
