import type { Doctor, DoctorFilters, DoctorCreate,  DoctorUpdate, Slot} from "../types/doctors";


const API_BASE = "http://127.0.0.1:8000";

//Get doctors
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

// Get doctor by ID
export async function fetchDoctorById(id: number): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch doctor: ${response.status}`);
  }

  return response.json();
}
// Patch doctor
export async function updateDoctor(
  id: number,
  payload: DoctorUpdate
): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update doctor: ${response.status}`);
  }

  return response.json();
}
// Get slots
export async function getDoctorSlots(
  doctorId: number
): Promise<Slot[]> {
  const response = await fetch(`${API_BASE}/slots/doctor/${doctorId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch doctor slots: ${response.status}`);
  }

  return response.json();
}