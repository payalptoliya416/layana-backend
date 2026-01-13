import api from "./apiClient";

export type BookedConsultation = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryCode: string;
  treatments: string;
  day: string;
  startTime: string;
  endTime: string;
  message: string;
  skincare: string;
  skin_type: string;
  skin_type_second: string;
  skin_goal: string;
  skin_care_products: string;
  type: "online" | "offline";
  created_at: string;
  updated_at: string;
};

export type BookedConsultationResponse = {
  success: boolean;
  data: BookedConsultation[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  sort: {
    by: string;
    order: "asc" | "desc";
  };
};

export async function getBookedConsultations(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<BookedConsultationResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);
  if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

  const res = await api.post<BookedConsultationResponse>(
    "/booked-consultations",   // 👈 your API route
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
}
export async function getBookedConsultationById(id: number) {
  const res = await api.post("/booked-consultations/show", {
    id,
  });
  return res.data.data;
}