/* ---------- API CLIENT ---------- */
import api from "./apiClient";

/* ---------- SUB TYPES ---------- */
export interface MembershipLocation {
  id: number;
  name: string;
}

export interface MembershipPricing {
  id: number;
  duration: number;
  offer_price: number;
  each_price: number;
  price: number;
}

export interface MembershipFaq {
  id: number;
  question: string;
  answer: string;
}

/* ---------- MAIN PAYLOAD ---------- */
export interface MembershipPayload {
  id: number;
  name: string;
  status: "active" | "inactive";
  content: string;
  slogan: string;
  locations: MembershipLocation[];
  pricing: MembershipPricing[];
  faq: MembershipFaq[];
  created_at: string;
  updated_at: string;
}

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
export interface MembershipResponse {
  status: string;
  message: string;
  data: MembershipPayload[];
  pagination: Pagination;
}

/* ---------- API CALL (SEARCH / SORT / PAGINATION READY) ---------- */
export async function getMemberships(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<MembershipResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);

  const res = await api.post<MembershipResponse>(
    "/memberships",
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

export async function deleteMemberShip(id: number) {
  const res = await api.post("/memberships/delete", { id });
  return res.data;
}