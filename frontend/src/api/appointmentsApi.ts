import type { AppointmentCreate, AppointmentOut } from "../types/appointment";

import { API_BASE } from "./config";
import { getApiErrorMessage } from "./apiError";

export async function createAppointment(
  payload: AppointmentCreate,
): Promise<AppointmentOut> {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to create an appointment",
    );

    throw new Error(message);
  }

  return response.json();
}

export async function fetchAppointments(
  doctorId?: number,
): Promise<AppointmentOut[]> {
  const params = new URLSearchParams();

  if (doctorId !== undefined) {
    params.set("doctor_id", String(doctorId));
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE}/appointments${queryString ? `?${queryString}` : ""}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to load appointments",
    );

    throw new Error(message);
  }

  return response.json();
}

export async function deleteAppointment(appointmentId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Failed to delete appointment",
    );

    throw new Error(message);
  }
}
