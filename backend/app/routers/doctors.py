from io import BytesIO
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import require_admin
from app.models import Doctor, User
from app.schemas import DoctorCreate, DoctorOut, DoctorUpdate

router = APIRouter(prefix="/doctors", tags=["Doctors"])

DbSession = Annotated[Session, Depends(get_db)]
AdminUser = Annotated[User, Depends(require_admin)]
_File = Annotated[UploadFile, File(...)]


@router.post("", response_model=DoctorOut, status_code=201)
def create_doctor(
    payload: DoctorCreate,
    db: DbSession,
    current_user: AdminUser,
):
    doctor_exist = (
        db.query(Doctor).filter(Doctor.full_name == payload.full_name).first()
    )
    if doctor_exist:
        raise HTTPException(status_code=409, detail="Doctor already exist")

    doctor = Doctor(**payload.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor


@router.get("", response_model=list[DoctorOut])
def list_doctors(
    db: DbSession,
    active: bool | None = None,
    specialization: str | None = None,
    full_name: str | None = None,
    limit: int = 20,
    offset: int = 0,
):

    q = db.query(Doctor)

    if full_name is not None:
        q = q.filter(Doctor.full_name.ilike(f"%{full_name}%"))

    if active is not None:
        q = q.filter(Doctor.is_active == active)

    if specialization is not None:
        q = q.filter(Doctor.specialization.ilike(f"%{specialization}%"))

    return q.order_by(Doctor.id).limit(limit).offset(offset).all()


@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int, db: DbSession):

    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return doctor


@router.patch("/{doctor_id}", response_model=DoctorOut)
def patch_doctor(
    doctor_id: int,
    payload: DoctorUpdate,
    db: DbSession,
    current_user: AdminUser,
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


BASE_DIR = Path(__file__).resolve().parent.parent.parent
MEDIA_DIR = BASE_DIR / "media" / "doctors"

MEDIA_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 2 * 1024 * 1024  # 5 MB

ALLOWED_FORMATS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


@router.post("/{doctor_id}/photo", response_model=DoctorOut)
def upload_doctor_photo(
    doctor_id: int,
    file: _File,
    db: DbSession,
    current_user: AdminUser,
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found",
        )

    # 1. Читаем файл
    contents = file.file.read()

    # 2. Ограничиваем размер
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image is too large. Maximum size is 5 MB",
        )

    # 3. Проверяем, что байты действительно являются изображением
    try:
        image = Image.open(BytesIO(contents))

        image.verify()

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        )

    # После verify нужно открыть изображение заново
    try:
        image = Image.open(BytesIO(contents))

        image_format = image.format

        if image_format not in ALLOWED_FORMATS:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG and WEBP images are allowed",
            )

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        )

    # 4. Расширение определяем сами
    extension = ALLOWED_FORMATS[image_format]

    file_name = f"doctor_{doctor.id}{extension}"
    file_path = MEDIA_DIR / file_name

    # 5. Удаляем старую фотографию
    if doctor.image_url:
        old_file_name = Path(doctor.image_url).name
        old_file_path = MEDIA_DIR / old_file_name

        if old_file_path.exists():
            old_file_path.unlink()

    # 6. Пересохраняем изображение сами
    if image_format == "JPEG":
        image = image.convert("RGB")

    image.save(file_path, format=image_format)

    doctor.image_url = f"/media/doctors/{file_name}"

    db.commit()
    db.refresh(doctor)

    return doctor
