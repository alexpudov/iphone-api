import type { Doctor, DoctorFilters, DoctorCreate,  DoctorUpdate, Slot, SlotCreate, SlotUpdate} from "../types/doctors";


const API_BASE = "http://127.0.0.1:8000";


type ValidationErrorItem = {
  loc?: Array<string | number>;
  msg?: string;
};

type ApiErrorResponse = {
  detail?: string | ValidationErrorItem[];
};

async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  try {
    const errorData = (await response.json()) as ApiErrorResponse;

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (Array.isArray(errorData.detail)) {
      return errorData.detail
        .map((error) => {
          const field = error.loc?.at(-1);
          const message = error.msg ?? "Invalid value";

          return field ? `${String(field)}: ${message}` : message;
        })
        .join(". ");
    }
  } catch {
    // if not JSON
  }

  return `${fallbackMessage}: ${response.status}`;
}

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
    const message = await getApiErrorMessage(
      response,
      "Failed to create a doctor"
    );
    throw new Error(message);
  }

  return response.json();
}

// Get doctor by ID
export async function fetchDoctorById(id: number): Promise<Doctor> {
  const response = await fetch(`${API_BASE}/doctors/${id}`);

   if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to get doctors"
    );
    throw new Error(message);
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
    const message = await getApiErrorMessage(
      response,
      "Failed to update doctor"
    );
    throw new Error(message);
  }

  return response.json();
}
// Get slots
export async function getDoctorSlots(
  doctorId: number
): Promise<Slot[]> {
  const response = await fetch(`${API_BASE}/slots/doctor/${doctorId}`);

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to get slots"
    );
    throw new Error(message);
  }

  return response.json();
}

// Create slot

export async function createSlot(payload: SlotCreate): Promise<Slot> {
  const response = await fetch(`${API_BASE}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to create slot"
    );

    throw new Error(message);
  }

  return response.json();
}

// Patch slot

export async function patchSlot(
  slotId: number,
  payload: SlotUpdate): 
  Promise<Slot> {

  const response = await fetch(`${API_BASE}/slots/${slotId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to patch slot"
    );

    throw new Error(message);
  }
  return response.json()

}


// Delete slot

export async function deleteSlot(slotId: number) {
  
  const response = await fetch (`${API_BASE}/slots/${slotId}`, {
    method:"DELETE",
  })

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to delete slot"
    );
  throw new Error(message);

}}
