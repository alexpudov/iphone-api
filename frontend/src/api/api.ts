import type { Doctor, DoctorFilters, DoctorCreate } from "../types/doctors";

const API_BASE = "http://127.0.0.1:8000";

export async function fetchDoctors(
  params?: DoctorFilters

) :Promise<Doctor[]> 

{
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

//Create doctor 
export async function createDoctor(payload: DoctorCreate): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create doctor: ${response.status}`);
  }

  return response.json();
}