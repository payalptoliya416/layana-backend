import api from "./apiClient";

/* ================= TYPES ================= */

export interface MembershipFaq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipFaqResponse {
  status: string;
  message: string;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    sort_by: string;
    sort_direction: "asc" | "desc";
    search: string | null;
  };
  data: {
    data: MembershipFaq[];
  };
}

/* ================= GET LIST ================= */
export async function getMembershipFaqs(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}) {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);
  if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

  const res = await api.post<MembershipFaqResponse>(
    "/membership-faqs",
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return res.data;
}

/* ================= CREATE ================= */
export async function createMembershipFaq(payload: {
  question: string;
  answer: string;
}) {
  const res = await api.post("/membership-faqs/create", payload);
  return res.data;
}

/* ================= GET SINGLE ================= */
export async function getMembershipFaq(id: number) {
  const res = await api.post("/membership-faqs/show", { id });
  return res.data;
}

export async function getAllMembershipFaqs(params?: {
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}) {
  const formData = new URLSearchParams();

  // ❌ page / per_page bilkul nahi
  if (params?.search) formData.append("search", params.search);
  if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

  const res = await api.post<MembershipFaqResponse>(
    "/membership-faqs",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
}

/* ================= UPDATE ================= */
export async function updateMembershipFaq(payload: {
  id: number;
  question: string;
  answer: string;
}) {
  const res = await api.post("/membership-faqs/update", payload);
  return res.data;
}

/* ================= DELETE ================= */
export async function deleteMembershipFaq(id: number) {
  const res = await api.post("/membership-faqs/delete", { id });
  return res.data;
}
