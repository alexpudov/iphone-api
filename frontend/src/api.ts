import type { Doctor } from "./types";

const API_BASE = "http://127.0.0.1:8000";

export async function fetchDoctors(params?: {
  active?: boolean;
  specialization?: string;
  limit?: number;
  offset?: number;
}): Promise<Doctor[]> {
  const url = new URL(`${API_BASE}/doctors`);

  if (params?.active !== undefined) url.searchParams.set("active", String(params.active));
  if (params?.specialization) url.searchParams.set("specialization", params.specialization);
  if (params?.limit !== undefined) url.searchParams.set("limit", String(params.limit));
  if (params?.offset !== undefined) url.searchParams.set("offset", String(params.offset));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch doctors: ${res.status}`);
  }
  return res.json();
}