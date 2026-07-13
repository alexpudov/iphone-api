import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  createDoctor,
  fetchDoctors,
} from "../api/api";

import { DoctorCreateForm}  from "../components/DoctorCreateForm";
import { DoctorFiltersComponent } from "../components/DoctorFilters";
import { DoctorList } from "../components/DoctorList";
import { Pagination } from "../components/Pagination";

import type {
  Doctor,
  DoctorCreate,
  DoctorFilters,
} from "../types/doctors";

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [newDoctor, setNewDoctor] = useState<DoctorCreate>({
    full_name: "",
    specialization: "",
    is_active: true,
  });

  const [showCreateErrors, setShowCreateErrors] = useState(false);

  const filters: DoctorFilters = useMemo(
    () => ({
      specialization: searchParams.get("specialization") ?? "",

      active:
        searchParams.get("active") === "true"
          ? true
          : undefined,

      limit: Number(searchParams.get("limit")) || 10,

      offset: Number(searchParams.get("offset")) || 0,
    }),
    [searchParams]
  );

  const limit = filters.limit ?? 10;
  const offset = filters.offset ?? 0;

  const currentPage = Math.floor(offset / limit) + 1;

  const formErrors = {
    full_name: validateTextField(newDoctor.full_name),
    specialization: validateTextField(newDoctor.specialization),
  };

  const isCreateFormValid =
    !formErrors.full_name &&
    !formErrors.specialization;

  useEffect(() => {
    let ignore = false;

    fetchDoctors({
      ...filters,
      limit: limit + 1,
    })
      .then((data) => {
        if (ignore) {
          return;
        }

        setDoctors(data.slice(0, limit));
        setHasNextPage(data.length > limit);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        setLoadError(getErrorMessage(error));
      });

    return () => {
      ignore = true;
    };
  }, [filters, limit]);

  function updateFilters(
    changedFilters: Partial<DoctorFilters>
  ) {
    const updatedFilters: DoctorFilters = {
      ...filters,
      ...changedFilters,
    };

    const params = new URLSearchParams();

    if (updatedFilters.specialization) {
      params.set(
        "specialization",
        updatedFilters.specialization
      );
    }

    if (updatedFilters.active === true) {
      params.set("active", "true");
    }

    if (updatedFilters.limit !== undefined) {
      params.set(
        "limit",
        String(updatedFilters.limit)
      );
    }

    if (updatedFilters.offset !== undefined) {
      params.set(
        "offset",
        String(updatedFilters.offset)
      );
    }

    setSearchParams(params);
  }

  function handleCreateDoctor(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setShowCreateErrors(true);

    if (!isCreateFormValid) {
      return;
    }

    createDoctor({
      full_name: newDoctor.full_name.trim(),
      specialization:
        newDoctor.specialization.trim(),
      is_active: newDoctor.is_active,
    })
      .then((createdDoctor) => {
        setDoctors((previousDoctors) => [
          createdDoctor,
          ...previousDoctors,
        ]);

        setNewDoctor({
          full_name: "",
          specialization: "",
          is_active: true,
        });

        setShowCreateErrors(false);
        setCreateError(null);
      })
      .catch((error: unknown) => {
        setCreateError(getErrorMessage(error));
      });

    
  }

  return (
    <div className="container">
      <h1>Doctors</h1>

      {createError && (
        <p className="error">{createError}</p>
      )}

      <DoctorCreateForm
        newDoctor={newDoctor}
        formErrors={
          showCreateErrors
            ? formErrors
            : {
                full_name: "",
                specialization: "",
              }
        }
        isValid={isCreateFormValid}
        onChange={setNewDoctor}
        onSubmit={handleCreateDoctor}
      />

      <DoctorFiltersComponent
        filters={filters}
        onChange={(changedFilters) =>
          updateFilters({
            ...changedFilters,
            offset: 0,
          })
        }
      />

      {loadError && (
        <p className="error">{loadError}</p>
      )}

      <DoctorList doctors={doctors} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        offset={offset}
        limit={limit}
        onChangeOffset={(newOffset) =>
          updateFilters({
            offset: newOffset,
          })
        }
      />
    </div>
  );
}

function validateTextField(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Field cannot be empty";
  }

  if (!/^[\p{L}\s]+$/u.test(trimmedValue)) {
    return "Only letters and spaces are allowed";
  }

  if (/\s{2,}/.test(trimmedValue)) {
    return "Only one space is allowed between words";
  }

  return "";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}