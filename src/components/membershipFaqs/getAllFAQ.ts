import api from "@/services/apiClient";

export interface MembershipFaq {
  id: number;
  question: string;
  answer: string;
  index: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface MembershipFaqListResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: MembershipFaq[];
    last_page: number;
    per_page: number;
    total: number;
  };
  pagination: Pagination;
}

export async function getAllFAQs(count: number): Promise<MembershipFaq[]> {
  const formData = new URLSearchParams();
  formData.append("page", "1");
  formData.append("per_page", String(count));

  const res = await api.post<MembershipFaqListResponse>(
    "/membership-faqs",
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

  // ✅ EXACT ARRAY
  return res.data.data.data;
}
