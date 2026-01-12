/* ---------- API CLIENT ---------- */
import api from "./apiClient";

/* ---------- TYPES ---------- */

export interface GlobalBookNowData {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface GlobalBookNowResponse {
  status: string;
  message: string;
  data: GlobalBookNowData;
}

/* ---------- GET ---------- */
export async function getGlobalBookNow(): Promise<GlobalBookNowResponse> {
  const res = await api.post<GlobalBookNowResponse>(
    "/settings/global-book-now"
  );
  return res.data;
}

/* ---------- SAVE ---------- */
export async function saveGlobalBookNow(value: string) {
  const res = await api.post("/settings/global-book-now/save", {
    value,
  });
  return res.data;
}
