/* ---------- API CLIENT ---------- */
import api from "./apiClient";

/* =======================
   SUB TYPES
======================= */

export interface MembershipLocation {
  id: number;
  name: string;
}

export interface MembershipPricing {
  id?: number;
  duration: number;
  offer_price: number;
  each_price: number;
  price: number;
  location_id: number;
}

export interface MembershipFaq {
  id?: number;
  question: string;
  answer: string;
}

/* =======================
   MAIN PAYLOAD (SHOW / LIST)
======================= */

export interface MembershipPayload {
  id: number;
  name: string;
  status: "active" | "inactive";
  content: string;
  // slogan: string;
  locations: MembershipLocation[];
  pricing: MembershipPricing[];
  // faq: MembershipFaq[];
  created_at: string;
  updated_at: string;
}

/* =======================
   CREATE / UPDATE PAYLOAD
======================= */

export interface MembershipSavePayload {
  id?: number; // only for update
  name: string;
  status: "active" | "inactive";
  content: string;
  // slogan: string;
  location_ids: number[];
  pricing: MembershipPricing[];
}

/* =======================
   PAGINATION
======================= */

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

/* =======================
   LIST RESPONSE
======================= */

export interface MembershipResponse {
  status: string;
  message: string;
  data: MembershipPayload[];
  pagination: Pagination;
}

/* =======================
   LIST (SEARCH / SORT / PAGINATION)
======================= */

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
 if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

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

export const reorderFAQ = async (
  payload: { id: number; index: number }[]
) => {
  const res = await api.post("/membership-faqs/reorder", {
    faqs: payload,
  });
  return res.data;
};

/* =======================
   CREATE
======================= */

export async function createMembership(
  payload: MembershipSavePayload
) {
  const res = await api.post("/memberships/create", payload);
  return res.data;
}

/* =======================
   UPDATE
======================= */

export async function updateMembership(
  payload: MembershipSavePayload
) {
  const res = await api.post("/memberships/update", payload);
  return res.data;
}

/* =======================
   SINGLE (SHOW)
======================= */

export async function getMembershipById(id: number) {
  const res = await api.post<{ status: string; data: MembershipPayload }>(
    "/memberships/show",
    { id }
  );
  return res.data.data;
}

/* =======================
   DELETE
======================= */

export async function deleteMembership(id: number) {
  const res = await api.post("/memberships/delete", { id });
  return res.data;
}


export const reorderMembership = async (
  payload: { id: number; index: number }[]
) => {
  const res = await api.post("/memberships/reorder", {
    memberships: payload,
  });
  return res.data;
};

export async function getAllMemberships(
  count: number
): Promise<MembershipPayload[]> {
  const formData = new URLSearchParams();
  formData.append("page", "1");
  formData.append("per_page", String(count));

  const res = await api.post<MembershipResponse>(
    "/memberships",
    formData,
    {
      params: {
        sort_by: "index",
        sort_direction: "asc",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.data; // ✅ MembershipPayload[]
}
