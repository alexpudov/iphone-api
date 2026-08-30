from fastapi import FastAPI

from app.db import Base, engine
from app.routers import appointments, auth, doctors, slots

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clinic Booking")

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
app.include_router(auth.router)
