import api from "./apiClient";

export type Enquiry = {
  id: number;
  location_id: number;
  name: string;
  email: string;
  mobile: string;
  message: string;
  created_at: string;
  updated_at: string;
  type?: string;
  location: {
    id: number;
    name: string;
  };
};

export type EnquiryResponse = {
  success: boolean;
  data: Enquiry[];
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

export async function getEnquiries(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<EnquiryResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);
  if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

  const res = await api.post<EnquiryResponse>(
    "/enquiries",  
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
}

export async function getEnquiryById(id: number) {
  const res = await api.post("/enquiries/show", { id });
  return res.data.data;
}