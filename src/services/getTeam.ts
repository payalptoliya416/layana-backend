/* ---------- API CLIENT ---------- */
import api from "./apiClient";
import { TeamPayload } from "./teamService";

/* ---------- TEAM ---------- *

/* ---------- PAGINATION ---------- */
export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  search?: string | null;
}

/* ---------- API RESPONSE ---------- */
export interface TeamResponse {
  status: string;
  message: string;
  data: TeamPayload[];
  pagination: Pagination;
}

/* ---------- API CALL (SEARCH / SORT / PAGINATION READY) ---------- */
export async function getTeams(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<TeamResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);

  const res = await api.post<TeamResponse>(
    "/teams",
    formData,
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
