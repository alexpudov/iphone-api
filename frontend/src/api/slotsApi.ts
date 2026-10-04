import type { Slot, SlotCreate, SlotUpdate } from "../types/slot";

import { API_BASE } from "./config";
import { getApiErrorMessage } from "./apiError";

export async function getDoctorSlots(doctorId: number): Promise<Slot[]> {
  const response = await fetch(`${API_BASE}/slots/doctor/${doctorId}`);

  if (!response.ok) {
    const message = await getApiErrorMessage(response, "Failed to get slots");

    throw new Error(message);
  }

  return response.json();
}

export async function createSlot(payload: SlotCreate): Promise<Slot> {
  const response = await fetch(`${API_BASE}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(response, "Failed to create slot");

    throw new Error(message);
  }

  return response.json();
}

export async function patchSlot(
  slotId: number,
  payload: SlotUpdate,
): Promise<Slot> {
  const response = await fetch(`${API_BASE}/slots/${slotId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(response, "Failed to patch slot");

    throw new Error(message);
  }

  return response.json();
}

export async function deleteSlot(slotId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/slots/${slotId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(response, "Failed to delete slot");

    throw new Error(message);
  }
}
