import type {
  Doctor,
  DoctorCreate,
  DoctorFilters,
  DoctorUpdate,
} from "../types/doctor";

import { API_BASE } from "./config";
import { getApiErrorMessage } from "./apiError";

export async function fetchDoctors(params?: DoctorFilters): Promise<Doctor[]> {
  const url = new URL(`${API_BASE}/doctors`);

  if (params?.active !== undefined) {
    url.searchParams.set("active", String(params.active));
  }

  if (params?.specialization) {
    url.searchParams.set("specialization", params.specialization);
  }

  if (params?.limit !== undefined) {
    url.searchParams.set("limit", String(params.limit));
  }

  if (params?.offset !== undefined) {
    url.searchParams.set("offset", String(params.offset));
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch doctors: ${response.status}`);
  }

  return response.json();
}

export async function createDoctor(payload: DoctorCreate): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to create a doctor",
    );

    throw new Error(message);
  }

  return response.json();
}

export async function fetchDoctorById(id: number): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors/${id}`);

  if (!response.ok) {
    const message = await getApiErrorMessage(response, "Failed to get doctor");

    throw new Error(message);
  }

  return response.json();
}

export async function updateDoctor(
  id: number,
  payload: DoctorUpdate,
): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to update doctor",
    );

    throw new Error(message);
  }

  return response.json();
}

export async function doctorPhoto(
  doctorId: number,
  file: File,
): Promise<Doctor> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE}/doctors/${doctorId}/photo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to upload doctor photo",
    );

    throw new Error(message);
  }

  return response.json();
}
