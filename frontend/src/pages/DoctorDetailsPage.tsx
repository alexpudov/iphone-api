import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorById, updateDoctor, getDoctorSlots } from "../api/api";
import type { Doctor,  DoctorUpdate, Slot } from "../types/doctors";

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


  function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

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
            {formatDateTime(slot.start_time)} — {formatDateTime(slot.end_time)}
          </li>
        ))}
      </ul>
    )}
  </div>
)}

    </div>
  );
}