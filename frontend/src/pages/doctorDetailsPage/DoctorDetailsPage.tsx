import "./DoctorDetailsPage.css";
import { useAuth } from "../../auth/Auth_Context";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../api/config";

import {
  fetchDoctorById,
  updateDoctor,
  doctorPhoto,
} from "../../api/doctorsApi";

import {
  getDoctorSlots,
  createSlot,
  patchSlot,
  deleteSlot,
} from "../../api/slotsApi";

import {
  createAppointment,
  fetchAppointments,
} from "../../api/appointmentsApi";

import type { Doctor, DoctorUpdate } from "../../types/doctor";

import type { Slot, SlotCreate, SlotTimeFields } from "../../types/slot";

import type {
  AppointmentCreate,
  AppointmentOut,
} from "../../types/appointment";

import { DoctorUpdateForm } from "../../components/doctor/DoctorUpdateForm/DoctorUpdateForm";
import { SlotCreateForm } from "../../components/slot/SlotCreateForm/SlotCreateForm";
import { SlotUpdateForm } from "../../components/slot/SlotUpdateForm/SlotUpdateForm";

import { getErrorMessage, formatDate, formatTime } from "../../utils";

export default function DoctorDetailsPage() {
  const { isAdmin } = useAuth();

  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [doctorLoadError, setDoctorLoadError] = useState<string | null>(null);

  const [doctorUpdateError, setDoctorUpdateError] = useState<string | null>(
    null,
  );

  const [editDoctor, setEditDoctor] = useState<DoctorUpdate>({
    full_name: "",
    specialization: "",
    is_active: false,
  });

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const id = Number(doctorId); // Doctor id
  const isInvalidId = !doctorId || Number.isNaN(id);

  const [newSlot, setNewSlot] = useState<SlotCreate>({
    doctor_id: id,
    start_time: "",
    end_time: "",
  });

  const [editSlotId, setEditSlotId] = useState<number | null>(null);
  const [editSlot, setEditSlot] = useState({
    start_time: "",
    end_time: "",
  });

  const [slotCreateError, setSlotCreateError] = useState<string | null>(null);
  const [slotUpdateError, setSlotUpdateError] = useState<string | null>(null);

  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);

  const [newAppointment, setNewAppointment] = useState<AppointmentCreate>({
    slot_id: 0,
    patient_name: "",
  });

  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  const [doctorAppointments, setDoctorAppointments] = useState<
    AppointmentOut[]
  >([]);

  const [bookSlotID, setBookSlotID] = useState<number | null>(null);

  const [photo, setPhoto] = useState<File | null>(null);

  const [photoVersion, setPhotoVersion] = useState(0);

  const [photoError, setPhotoError] = useState<string | null>(null);

  function validateSlotTimes(slot: SlotTimeFields): string | null {
    if (!slot.start_time || !slot.end_time) {
      return "Start time and end time are required";
    }

    const startTime = new Date(slot.start_time);
    const endTime = new Date(slot.end_time);

    const durationInMilliseconds = endTime.getTime() - startTime.getTime();

    const minimumDurationInMilliseconds = 15 * 60 * 1000;

    const maximumDurationInMilliseconds = 60 * 60 * 1000;

    if (endTime <= startTime) {
      return "End time must be after start time";
    }

    if (durationInMilliseconds < minimumDurationInMilliseconds) {
      return "Slot duration must be at least 15 minutes";
    }

    if (durationInMilliseconds > maximumDurationInMilliseconds) {
      return "Slot duration must not exceed one hour";
    }

    return null;
  }

  function validatePatientName(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Patient name is required";
    }

    if (trimmedValue.length < 2) {
      return "Patient name must be at least 2 characters";
    }

    if (trimmedValue.length > 100) {
      return "Patient name must be at most 100 characters";
    }

    if (!/^[\p{L}\s'-]+$/u.test(trimmedValue)) {
      return "Patient name can contain only letters, spaces, hyphens and apostrophes";
    }

    if (/\s{2,}/.test(trimmedValue)) {
      return "Only one space is allowed between words";
    }

    return "";
  }

  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    fetchDoctorById(id)
      .then((data) => {
        setDoctor(data);
        setEditDoctor({
          full_name: data.full_name,
          specialization: data.specialization,
          is_active: data.is_active,
        });
        setDoctorLoadError(null);
      })
      .catch((error) => setDoctorLoadError(getErrorMessage(error)));

    getDoctorSlots(id)
      .then((data) => {
        setSlots(data);
        setSlotsError(null);
      })
      .catch((error) => setSlotsError(getErrorMessage(error)));

    fetchAppointments(id)
      .then((data) => {
        setDoctorAppointments(data);
        setAppointmentError(null);
      })
      .catch((error) => setAppointmentError(getErrorMessage(error)));
  }, [id, isInvalidId]);

  const handleUpdateDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isInvalidId) {
      return;
    }

    const validateFullName = editDoctor.full_name?.trim() ?? "";
    const validateSpecialization = editDoctor.specialization?.trim() ?? "";
    if (!validateFullName || !validateSpecialization) {
      setDoctorUpdateError("Fields cannot be empty");
      return;
    }

    if (validateFullName.length < 2 || validateSpecialization.length < 2) {
      setDoctorUpdateError("Fields must be at least 2 characters");
      return;
    }

    if (validateFullName.length > 50 || validateSpecialization.length > 50) {
      setDoctorUpdateError("Fields must be at most 50 characters");
      return;
    }

    if (
      !/^[\p{L}\s]+$/u.test(validateFullName) ||
      !/^[\p{L}\s]+$/u.test(validateSpecialization)
    ) {
      setDoctorUpdateError("Fields can contain only letters and spaces");
      return;
    }

    if (
      /\s{2,}/.test(validateFullName) ||
      /\s{2,}/.test(validateSpecialization)
    ) {
      setDoctorUpdateError("Only one space is allowed between words");
      return;
    }

    const payload: DoctorUpdate = {
      ...editDoctor,
      full_name: validateFullName,
      specialization: validateSpecialization,
    };

    try {
      const updatedDoctor = await updateDoctor(id, payload);

      setDoctor(updatedDoctor);
      setEditDoctor({
        full_name: updatedDoctor.full_name,
        specialization: updatedDoctor.specialization,
        is_active: updatedDoctor.is_active,
      });

      setDoctorUpdateError(null);
    } catch (error) {
      setDoctorUpdateError(getErrorMessage(error));
    }
  };

  const handleCreateSlot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isInvalidId) {
      return;
    }

    const validationError = validateSlotTimes(newSlot);

    if (validationError) {
      setSlotCreateError(validationError);
      return;
    }
    try {
      const createdSlot = await createSlot({
        ...newSlot,
        doctor_id: id,
      });

      setSlots((previousSlots) => [...previousSlots, createdSlot]);

      setNewSlot({
        doctor_id: id,
        start_time: "",
        end_time: "",
      });

      setSlotCreateError(null);
    } catch (error) {
      setSlotCreateError(getErrorMessage(error));
    }
  };

  function handleEditSlot(slot: Slot) {
    setEditSlotId(slot.id);

    setEditSlot({
      start_time: slot.start_time.slice(0, 16),
      end_time: slot.end_time.slice(0, 16),
    });

    setSlotUpdateError(null);
  }

  const handleSaveSlot = async (slotId: number) => {
    const validationError = validateSlotTimes(editSlot);

    if (validationError) {
      setSlotUpdateError(validationError);
      return;
    }

    try {
      const updatedSlot = await patchSlot(slotId, editSlot);

      setSlots((previousSlots) =>
        previousSlots.map((slot) => (slot.id === slotId ? updatedSlot : slot)),
      );

      setEditSlotId(null);

      setEditSlot({
        start_time: "",
        end_time: "",
      });

      setSlotUpdateError(null);
    } catch (error) {
      setSlotUpdateError(getErrorMessage(error));
    }
  };

  function handleCancelEdit() {
    setEditSlotId(null);

    setEditSlot({
      start_time: "",
      end_time: "",
    });
  }

  const handleDeleteSlot = async (slotId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this slot?",
    );

    if (!confirmed) {
      return;
    }
    try {
      await deleteSlot(slotId);

      setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));

      setSlotsError(null);
    } catch (error) {
      setSlotsError(getErrorMessage(error));
    }
  };

  function handleStartBooking(slot: Slot) {
    setBookSlotID(slot.id);

    if (slot.is_booked) {
      setAppointmentError("Slot already booked");
      return;
    }

    const slotStartTime = new Date(slot.start_time);

    if (slotStartTime < new Date()) {
      setAppointmentError("Cannot book slot in the past");
      return;
    }

    if (!doctor?.is_active) {
      setAppointmentError("Doctor is not active");
      return;
    }

    setAppointmentError(null);
    setBookingSlotId(slot.id);

    setNewAppointment({
      slot_id: slot.id,
      patient_name: "",
    });
  }

  async function handleCreateAppointment(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const patientNameError = validatePatientName(newAppointment.patient_name);

    if (patientNameError) {
      setAppointmentError(patientNameError);
      return;
    }

    try {
      const createdAppointment = await createAppointment({
        slot_id: newAppointment.slot_id,
        patient_name: newAppointment.patient_name.trim(),
      });

      setSlots((previousSlots) =>
        previousSlots.map((slot) =>
          slot.id === createdAppointment.slot.id
            ? { ...slot, is_booked: true }
            : slot,
        ),
      );

      setDoctorAppointments((previousAppointments) => [
        createdAppointment,
        ...previousAppointments,
      ]);

      setBookingSlotId(null);

      setNewAppointment({
        slot_id: 0,
        patient_name: "",
      });

      setAppointmentError(null);
    } catch (error) {
      setAppointmentError(getErrorMessage(error));
    }
  }

  function handleCancelAppointment() {
    setBookingSlotId(null);
  }
  async function handleUploadPhoto() {
    if (!photo || !doctor) return;

    try {
      const updatedDoctor = await doctorPhoto(doctor.id, photo);
      setDoctor(updatedDoctor);
      setPhoto(null);
      setPhotoVersion((prev) => prev + 1);
    } catch (error) {
      setPhotoError(getErrorMessage(error));
    }
  }

  const now = new Date();

  return (
    <div className="doctor-details-page">
      {isInvalidId && <p className="error">Invalid doctor id</p>}

      {!isInvalidId && doctorLoadError && (
        <p className="error">{doctorLoadError}</p>
      )}

      {!isInvalidId && !doctorLoadError && doctor && (
        <section className="page-card doctor-info-card">
          {doctor.image_url && (
            <div>
              <img
                className="doctor-photo"
                src={`${API_BASE}${doctor.image_url}?v=${photoVersion}`}
                alt={doctor.full_name}
              />

              {isAdmin && (
                <label className="file-upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setPhoto(file);
                    }}
                  />

                  <span className="file-upload-button">Choose new photo</span>
                </label>
              )}

              {photo && (
                <div className="replace-photo-block">
                  <button
                    className="button button-primary replace"
                    onClick={handleUploadPhoto}
                  >
                    Replace photo
                  </button>
                  <p className="error">{photoError}</p>
                </div>
              )}
            </div>
          )}
          {!doctor.image_url && (
            <div className="doctor-photo-upload">
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setPhoto(file);
                  }}
                />

                <span className="file-upload-button">Choose photo</span>

                <span className="file-upload-name">
                  {photo ? photo.name : "No file selected"}
                </span>
              </label>

              <button
                className="button button-primary"
                onClick={handleUploadPhoto}
                disabled={!photo}
              >
                Upload photo
              </button>
              <p className="error">{photoError}</p>
            </div>
          )}
          <div className="doctor-info">
            <p>
              <b>Name:</b> {doctor.full_name}
            </p>

            <p>
              <b>Specialization:</b> {doctor.specialization}
            </p>

            <p>
              <b>Status:</b> {doctor.is_active ? "active" : "inactive"}
            </p>
          </div>
        </section>
      )}

      {doctor && isAdmin && (
        <section className="page-card">
          <DoctorUpdateForm
            value={editDoctor}
            error={doctorUpdateError}
            onChange={(value) => {
              setEditDoctor(value);
              setDoctorUpdateError(null);
            }}
            onSubmit={handleUpdateDoctor}
          />
        </section>
      )}

      {doctor && (
        <section className="page-card">
          <h2>Slots</h2>

          {slotsError && <p className="slot-create-error">{slotsError}</p>}

          {!slotsError && slots.length === 0 && (
            <p>No slots for this doctor.</p>
          )}

          {!slotsError && slots.length > 0 && (
            <ul className="slots-list">
              {slots.map((slot) => {
                const isPast = new Date(slot.start_time) < now;

                return (
                  <li className="slot-card" key={slot.id}>
                    {isAdmin && editSlotId === slot.id ? (
                      <SlotUpdateForm
                        value={editSlot}
                        error={slotUpdateError}
                        onChange={setEditSlot}
                        onSave={() => handleSaveSlot(slot.id)}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <div>
                        <span>
                          {formatDate(slot.start_time)}{" "}
                          {formatTime(slot.start_time)} —{" "}
                          {formatTime(slot.end_time)}
                        </span>

                        {isAdmin && (
                          <button
                            className="button button-secondary"
                            onClick={() => handleEditSlot(slot)}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          className="button button-primary"
                          disabled={slot.is_booked || isPast}
                          onClick={() => handleStartBooking(slot)}
                        >
                          {slot.is_booked
                            ? "Booked"
                            : isPast
                              ? "Expired"
                              : "Book"}
                        </button>

                        {bookSlotID === slot.id && appointmentError && (
                          <p className="error">{appointmentError}</p>
                        )}

                        {isAdmin && (
                          <button
                            className="button button-danger"
                            disabled={slot.is_booked}
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            Delete
                          </button>
                        )}

                        {bookingSlotId === slot.id && (
                          <form
                            className="doctor-form"
                            onSubmit={handleCreateAppointment}
                          >
                            <input
                              type="text"
                              value={newAppointment.patient_name}
                              placeholder="Write your name:"
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  patient_name: e.target.value,
                                })
                              }
                            />

                            <button
                              type="submit"
                              className="button button-primary"
                            >
                              {" "}
                              Book appointment
                            </button>

                            <button
                              className="button button-neutral"
                              onClick={handleCancelAppointment}
                            >
                              {" "}
                              Cancel{" "}
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {doctor && isAdmin && (
        <section className="page-card">
          <SlotCreateForm
            value={newSlot}
            error={slotCreateError}
            onChange={(value) => {
              setSlotCreateError(null);
              setNewSlot(value);
            }}
            onSubmit={handleCreateSlot}
          />
        </section>
      )}
      <section className="page-card">
        {doctorAppointments.length > 0 ? (
          <>
            <h2>Appointments</h2>

            <ul className="appointments-list">
              {doctorAppointments.map((appointment) => (
                <li className="appointment-card" key={appointment.id}>
                  <strong>Appointment №{appointment.id}</strong>

                  <div>Patient: {appointment.patient_name}</div>
                  <div>Slot: {appointment.slot.id}</div>
                  <div>
                    Created: {formatDate(appointment.created_at)},{" "}
                    {formatTime(appointment.created_at)}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="no-appointments">
            <img
              className="no-appointments-image"
              src="/images/no_appointments.png"
              alt="No appointments"
            />
          </div>
        )}
      </section>
    </div>
  );
}
