/* ---------- TYPES ---------- */

import api from "./apiClient";

/* ---------- OPENING HOURS ---------- */
export interface OpeningHour {
  id: number;
  location_id: string;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

/* ---------- LOCATION ---------- */
export interface BranchLocation {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  parking_details: string;
  created_at: string;
  updated_at: string;
  opening_hours: OpeningHour[];
}

/* ---------- API RESPONSE ---------- */
export interface LocationResponse {
  status: string;
  message: string;
  data: BranchLocation[];
    pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

/* ---------- API CALL (SEARCH / SORT / FILTER READY) ---------- */
export async function getLocations(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<LocationResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);

  const res = await api.post<LocationResponse>(
    "/locations",
    formData, // ✅ BODY (same as getTreatments)
    {
      params: {
        sort_by: params?.sortBy,
        sort_direction: params?.sortDirection,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
}

