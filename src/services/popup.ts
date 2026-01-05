// types/popup.ts

import api from "./apiClient";

export type PopupLocation = {
  id?: number;
  name: string;
  slug: string;
};

export type PopupItem = {
  id: number;
  banner_image: string;
  location_ids: (number | string)[];
  location_details: PopupLocation[];
  is_cta: boolean;
  cta_button_text: string | null;
  cta_button_link: string | null;
  cta_button_color: string | null;
  status: number; // 1 = Active, 0 = Inactive
  created_at: string;
  updated_at: string;
  title: string;
};

export type Pagination = {
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

export type PopupResponse = {
  status: string;
  message: string;
  pagination: Pagination;
  data: PopupItem[];
};
export async function getPopups(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<PopupResponse> {
  const formData = new URLSearchParams();

  if (params?.page) formData.append("page", String(params.page));
  if (params?.perPage) formData.append("per_page", String(params.perPage));
  if (params?.search) formData.append("search", params.search);
  if (params?.sortBy) formData.append("sort_by", params.sortBy);
  if (params?.sortDirection)
    formData.append("sort_direction", params.sortDirection);

  const res = await api.post<PopupResponse>(
    "/popups",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
}


export async function deletePopup(id: number) {
  const res = await api.post("/popups/delete", { id });
  return res.data;
}
// ================= CREATE POPUP =================
export async function createPopup(payload: {
  banner_image: string | null;
  location_ids: (number | string)[];
  is_cta: boolean;
  cta_button_text: string | null;
  cta_button_link: string | null;
  cta_button_color: string | null;
  status: number;
}) {
  const res = await api.post("/popups/create", payload);
  return res.data;
}

// ================= UPDATE POPUP =================
export async function updatePopup(payload: {
  id: number;
  banner_image: string | null;
  location_ids: (number | string)[];
  is_cta: boolean;
  cta_button_text: string | null;
  cta_button_link: string | null;
  cta_button_color: string | null;
  status: number;
}) {
  const res = await api.post("/popups/update", payload);
  return res.data;
}

export async function getPopupById(id: number) {
  const res = await api.post("/popups/show", { id });
  return res.data.data;
}