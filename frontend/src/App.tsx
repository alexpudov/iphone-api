import { useEffect, useState } from "react";
import type { Doctor, DoctorFilters, DoctorCreate} from "./types/doctors";
import { fetchDoctors, createDoctor } from "./api/api";

export default function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<DoctorFilters>({
    specialization: "",
    limit: 2,
    offset: 0,
});

  const [newDoctor, setNewDoctor] = useState<DoctorCreate>({
  full_name: "",
  specialization: "",
  is_active: true,
});

const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
      const limit = filters.limit ?? 20;
      fetchDoctors({
  ...filters,
  limit: limit + 1,
})
  .then((data) => {
    setDoctors(data.slice(0, limit));
    setHasNextPage(data.length > limit);
    setError(null);
  })
  .catch((e) => setError(e.message));
    }, [filters]);
  
    function handleCreateDoctor(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  createDoctor(newDoctor)
    .then((createdDoctor) => {
      setDoctors([createdDoctor, ...doctors]);
      setNewDoctor({
        full_name: "",
        specialization: "",
        is_active: true,
      });
      setError(null);
    })
    .catch((e) => setError(e.message));
}

const currentPage = (filters.offset ?? 0) / (filters.limit ?? 20) + 1;

  return (
    <div className="container">

      <h1>Doctors</h1>

      <form className="doctor-form" onSubmit={handleCreateDoctor}>
  <input
    type="text"
    placeholder="Full name"
    value={newDoctor.full_name}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        full_name: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="Specialization"
    value={newDoctor.specialization}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        specialization: e.target.value,
      })
    }
  />

  <label className="filter-item">
    <input
      type="checkbox"
      checked={newDoctor.is_active}
      onChange={(e) =>
        setNewDoctor({
          ...newDoctor,
          is_active: e.target.checked,
        })
      }
    />
    Active
  </label>

  <button type="submit">Add doctor</button>
</form>

    <div className="filters">

      <label className="filter-item checkbox-filter">
        <input
          type="checkbox"
          checked={filters.active === true}
          onChange={(e) =>
            setFilters({
              ...filters,
              active: e.target.checked ? true : undefined,
              offset: 0,
            })
          }
        />
        <span>Only active</span>
      </label>

      <label className="filter-item">
        <span>Specialization</span>
        <select
          value={filters.specialization}
          onChange={(e) =>
            setFilters({
              ...filters,
              specialization: e.target.value,
              offset: 0,
            })
          }
        >
          <option value="">All</option>
          <option value="Dantist">Dantist</option>
          <option value="Cardiologist">Cardiologist</option>
        </select>
      </label>
    </div>

      {error && <p className="error">{error}</p>}

      {!error && (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <b>{doctor.full_name}</b> — {doctor.specialization} —{" "}
              {doctor.is_active ? "active" : "inactive"}
            </li>
          ))}
        </ul>
      )}

  <div className="pagination">
      <button
        disabled={(filters.offset ?? 0) === 0}
        onClick={() =>
          setFilters({
            ...filters,
            offset: Math.max((filters.offset ?? 0) - (filters.limit ?? 20), 0),
          })
        }
      >
        Previous
      </button>

      <span>Page {currentPage}</span>

    <button
  disabled={!hasNextPage}
  onClick={() =>
    setFilters({
      ...filters,
      offset: (filters.offset ?? 0) + (filters.limit ?? 20),
    })
  }
>
  Next
</button>

  </div>

    </div>

    
  );
  
}