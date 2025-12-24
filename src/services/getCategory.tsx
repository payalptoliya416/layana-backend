/* ---------- TYPES ---------- */

import api from "./apiClient";

export interface CategoryLocation {
  id: number;
  name: string;
}

export interface TreatmentCategory {
  id: number;
  name: string;
  locations: CategoryLocation[];
}

export interface TreatmentCategoryResponse {
  status: string;
  message: string;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
  data: TreatmentCategory[];
}

export async function getCategory(params?: {
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

  const res = await api.post<TreatmentCategoryResponse>(
    "/treatment-categories",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

 return {
    data: res.data.data ?? [],      
    pagination: res.data.pagination ?? null,
    message: res.data.message,
  };
}

export const createCategory = (payload: { name: string , status : string }) =>
  api.post("/treatment-categories/create", payload);

export const updateCategory = (payload: { id: number; name: string , status : string }) =>
  api.post("/treatment-categories/update", payload);

export const getCategoryById = async (id: number) => {
  const formData = new URLSearchParams();
  formData.append("id", String(id));

  const res = await api.post(
    "/treatment-categories/show",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.data; 
};

export const deleteCategory = async (id: number) => {
  const formData = new URLSearchParams();
  formData.append("id", String(id));

  const res = await api.post(
    "/treatment-categories/delete",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
};