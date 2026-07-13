import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorById, updateDoctor, getDoctorSlots, createSlot } from "../api/api";
import type { Doctor,  DoctorUpdate, Slot, SlotCreate } from "../types/doctors";

export default function DoctorDetailsPage() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editDoctor, setEditDoctor] = useState<DoctorUpdate>({
  full_name: "",
  specialization: "",
  is_active: false,
});

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const id = Number(doctorId);
  const isInvalidId = !doctorId || Number.isNaN(id);

  const [newSlot, setNewSlot] = useState<SlotCreate>({
  doctor_id: id,
  start_time: "",
  end_time: "",
});

function formatSlotDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU");
}

function formatSlotTime(date: string) {
  return new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const [slotCreateError, setSlotCreateError] = useState<string | null>(null);

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
        setError(null);
      })
      .catch((e) => setError(e.message));

      getDoctorSlots(id)
        .then((data) => {
          setSlots(data);
          setSlotsError(null);
        })
    .catch((e) => setSlotsError(e.message));
  }, [id, isInvalidId]);


  function handleUpdateDoctor(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (isInvalidId) {
    return;
  }

  updateDoctor(id, editDoctor)
    .then((updatedDoctor) => {
      setDoctor(updatedDoctor);
      setEditDoctor({
        full_name: updatedDoctor.full_name,
        specialization: updatedDoctor.specialization,
        is_active: updatedDoctor.is_active,
      });
      setError(null);
    })
    .catch((e) => setError(e.message));
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

function handleCreateSlot(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (isInvalidId) {
    return;
  }

  if (!newSlot.start_time || !newSlot.end_time) {
  setSlotCreateError("Start time and end time are required");
  return;}

  const startTime = new Date(newSlot.start_time);
  const endTime = new Date(newSlot.end_time);

  const durationInMilliseconds =
    endTime.getTime() - startTime.getTime();

  const minimumDurationInMilliseconds =
    15 * 60 * 1000;

  const maximumDurationInMilliseconds = 60 * 60 * 1000;

  if (
    durationInMilliseconds <
    minimumDurationInMilliseconds
  ) {
    setSlotCreateError(
      "Slot duration must be at least 15 minutes"
    );
    return;
  }

  if (
    durationInMilliseconds >
    maximumDurationInMilliseconds
    
  ) {
    setSlotCreateError(
      "Slot duration must not exceed one hour"
    );
    return;
  }

  if (durationInMilliseconds < minimumDurationInMilliseconds) {
    setSlotCreateError(
      "Slot duration must be at least 15 minutes"
    );
    return;
  }


  createSlot({
    ...newSlot,
    doctor_id: id,
  })
    .then((createdSlot) => {
      setSlots((previousSlots) => [
        ...previousSlots,
        createdSlot,
      ]);

      setNewSlot({
        doctor_id: id,
        start_time: "",
        end_time: "",
      });

      setSlotCreateError(null);
    })
    .catch((error: unknown) => {
      setSlotCreateError(getErrorMessage(error));
    });

  
}

  return (
    <div className="container">
      <Link to="/">← Back to doctors</Link>

      <h1>Doctor Details</h1>

      {isInvalidId && <p className="error">Invalid doctor id</p>}

      {!isInvalidId && error && (
        <p className="error">{error}</p>
      )}

      {!isInvalidId && !error && doctor && (
        <div>
          <p>
            <b>ID:</b> {doctor.id}
          </p>

          <p>
            <b>Name:</b> {doctor.full_name}
          </p>

          <p>
            <b>Specialization:</b> {doctor.specialization}
          </p>

          <p>
            <b>Status:</b>{" "}
            {doctor.is_active ? "active" : "inactive"}
          </p>
        </div>
      )}

      {doctor && (
  <form className="doctor-form" onSubmit={handleUpdateDoctor}>
    <input
      type="text"
      value={editDoctor.full_name ?? ""}
      onChange={(e) =>
        setEditDoctor({
          ...editDoctor,
          full_name: e.target.value,
        })
      }
    />

    <input
      type="text"
      value={editDoctor.specialization ?? ""}
      onChange={(e) =>
        setEditDoctor({
          ...editDoctor,
          specialization: e.target.value,
        })
      }
    />

    <label className="filter-item">
      <input
        type="checkbox"
        checked={editDoctor.is_active === true}
        onChange={(e) =>
          setEditDoctor({
            ...editDoctor,
            is_active: e.target.checked,
          })
        }
      />
      Active
    </label>

    <button type="submit">Save changes</button>
  </form>
)}

  {doctor && (
  <div>
    <h2>Slots</h2>

    {slotsError && <p className="error">{slotsError}</p>}

    {!slotsError && slots.length === 0 && (
      <p>No slots for this doctor.</p>
    )}

    {!slotsError && slots.length > 0 && (
      <ul>
        {slots.map((slot) => (

          <li key={slot.id}>
            {formatSlotDate(slot.start_time)},{" "}
            {formatSlotTime(slot.start_time)} —{" "}
            {formatSlotTime(slot.end_time)}
          </li>
  ))}
      </ul>

    )}
  </div>
)}

{doctor && (
  <div className="slot-create-section">
  <form className="doctor-form" onSubmit={handleCreateSlot}>
    <h2>Create slot</h2>

    <label>
      Start time: {" "}
      <input
        type="datetime-local"
        value={newSlot.start_time}
        onChange={(event) => {
          setSlotCreateError(null);

          setNewSlot({
            ...newSlot,
            start_time: event.target.value,
          });
        }}
      />
    </label>

    <label>
      End time: {" "}
      <input
        type="datetime-local"
        value={newSlot.end_time}
        onChange={(event) => {
          setSlotCreateError(null);

          setNewSlot({
            ...newSlot,
            end_time: event.target.value,
          });
        }}
      />
    </label>

    <button type="submit">
      Create slot
    </button>
  </form>

  <div className="slot-create-error">
    {slotCreateError && (
      <p className="error">{slotCreateError}</p>
    )}
  </div>
</div>
)}

    </div>
  );
}