import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorById } from "../api/api";
import type { Doctor } from "../types/doctors";

export default function DoctorDetailsPage() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const id = Number(doctorId);
  const isInvalidId = !doctorId || Number.isNaN(id);

  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    fetchDoctorById(id)
      .then((data) => {
        setDoctor(data);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [id, isInvalidId]);

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
    </div>
  );
}