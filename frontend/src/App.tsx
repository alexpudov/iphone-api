import { useEffect, useState } from "react";
import type { Doctor } from "./types";
import { fetchDoctors } from "./api";

export default function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors({ limit: 20, offset: 0 })
      .then(setDoctors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h1>Doctors</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {doctors.map((d) => (
            <li key={d.id}>
              <b>{d.full_name}</b> — {d.specialization} —{" "}
              {d.is_active ? "active" : "inactive"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
