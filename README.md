Clinic Booking API

Backend REST API for managing doctors, time slots, and patient appointments.

This project was built as a pet-project to practice backend development with FastAPI and relational databases, following REST API and business logic principles.

---

Tech Stack:

- Python 3.14
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn
- Git

---

Project Architecture

The project follows a modular and scalable structure:

app/
├── main.py # Application entry point
├── db.py # Database configuration and session management
├── models.py # SQLAlchemy ORM models
├── schemas.py # Pydantic schemas (request/response validation)
├── routers/
│ ├── doctors.py # Doctor-related endpoints
│ ├── slots.py # Slot-related endpoints
│ └── appointments.py # Appointment-related endpoints


Each domain (doctors, slots, appointments) is isolated in its own router.

Domains Overview

Doctor:

- Represents a medical specialist.
- Uses "soft-deactivation" via "is_active" field.
- Inactive doctors cannot accept new slots or appointments.

Slot:

- Represents an available time interval for a doctor.
- Slots cannot overlap.
- Slots cannot be created in the past.
- Slots with appointments cannot be deleted.

Appointment:
- Represents a booking for a specific slot.
- Only one appointment per slot is allowed.
- Appointments cannot be created for inactive doctors.


API Features

Doctors:

- Create doctor
- Get doctor list
- Get doctor by ID
- Update doctor (PATCH)
- Filter doctors by:
  - activity status
  - specialization
  - name

Slots:

- Create slot
- Delete slot
- Get slots by doctor
- Filter slots by date
- Filter only free slots
- Prevent overlapping time intervals

Appointments:
- Create appointment
- Cancel appointment
- Get appointment list

Filtering & Pagination

Examples:

GET /doctors?active=true
GET /doctors?specialization=cardiology
GET /doctors?limit=10&offset=20
GET /slots/doctor/1?date_=2026-02-10&only_free=true

Running the Project

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
http://127.0.0.1:8000/docs


Future Improvements:

- Authentication & authorization

- PostgreSQL support

- Unit tests with pytest

- Docker containerization

- Frontend integration (React)



Pet project developed for backend and full-stack learning purposes.