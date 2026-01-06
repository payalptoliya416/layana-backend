/* ---------- API CLIENT ---------- */
import api from "./apiClient";

/* ---------- TYPES ---------- */

export interface TermsConditionData {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface TermsConditionResponse {
  status: string;
  message: string;
  data: TermsConditionData;
}

/* ---------- GET TERMS & CONDITION ---------- */
export async function getTermsCondition(): Promise<TermsConditionResponse> {
  const res = await api.post<TermsConditionResponse>(
    "/settings/terms-condition"
  );

  return res.data;
}

/* ---------- SAVE TERMS & CONDITION ---------- */
export async function saveTermsCondition(value: string) {
  const res = await api.post("/settings/terms-condition/save", {
    value,
  });

  return res.data;
}
