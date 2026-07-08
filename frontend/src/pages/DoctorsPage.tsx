import { useEffect, useState } from "react";
import type {
  Doctor,
  DoctorCreate,
  DoctorFilters as DoctorFiltersType,
} from "../types/doctors";
import { createDoctor, fetchDoctors } from "../api/api";
import { DoctorCreateForm } from "../components/DoctorCreateForm";
import { DoctorFilters } from "../components/DoctorFilters";
import { DoctorList } from "../components/DoctorList";
import { Pagination } from "../components/Pagination";



function validateText(value: string, fieldName: string) {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }

  if (/\s{2,}/.test(value)) {
    return "Only one space is allowed between words";
  }

  return "";
}

function validateDoctor(doctor: DoctorCreate) {
  return {
    full_name: validateText(doctor.full_name, "Full name"),
    specialization: validateText(doctor.specialization, "Specialization"),
  };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showCreateErrors, setShowCreateErrors] = useState(false);

  const [filters, setFilters] = useState<DoctorFiltersType>({
    specialization: "",
    limit: 10,
    offset: 0,
  });

  const [newDoctor, setNewDoctor] = useState<DoctorCreate>({
    full_name: "",
    specialization: "",
    is_active: false,
  });

  useEffect(() => {
    const limit = filters.limit ?? 20;

    fetchDoctors({
      ...filters,
      limit: limit + 1,
    })
      .then((data) => {
        setDoctors(data.slice(0, limit));
        setHasNextPage(data.length > limit);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message));
  }, [filters]);

  const formErrors = validateDoctor(newDoctor);

  const isCreateFormValid =
    !formErrors.full_name && !formErrors.specialization;

  function handleCreateDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setShowCreateErrors(true);

    if (!isCreateFormValid) {
      return;
    }

    createDoctor(newDoctor)
      .then((createdDoctor) => {
        setDoctors((prevDoctors) => [createdDoctor, ...prevDoctors]);
        setNewDoctor({
          full_name: "",
          specialization: "",
          is_active: true,
        });
        setShowCreateErrors(false);
        setCreateError(null);
      })
      .catch((e) => setCreateError(e.message));
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;
  const currentPage = offset / limit + 1;

  return (
    <div className="container">
      <h1>Doctors</h1>

      {createError && <p className="error">{createError}</p>}

      <DoctorCreateForm
        newDoctor={newDoctor}
        formErrors={
          showCreateErrors
            ? formErrors
            : { full_name: "", specialization: "" }
        }
        isValid={isCreateFormValid}
        onChange={setNewDoctor}
        onSubmit={handleCreateDoctor}
      />

      <DoctorFilters filters={filters} onChange={setFilters} />

      {loadError && <p className="error">{loadError}</p>}

      <DoctorList doctors={doctors} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        offset={offset}
        limit={limit}
        onChangeOffset={(newOffset) =>
          setFilters((prevFilters) => ({
              ...prevFilters,
              offset: newOffset,
        }))
        }
      />
    </div>
  );
}
