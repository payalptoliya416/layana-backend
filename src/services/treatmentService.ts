import api from "./apiClient";

export const createTreatmentMessage = async (payload: any) => {
  const res = await api.post(
    "/treatements/message/create", 
    payload
  );

  return res.data;
};

export const getTreatmentById = async (id: number) => {
  const res = await api.post("/treatements/message/show", { id });
  return res.data.data;
};

export const updateTreatmentMessage = (payload: any) =>
  api.post("/treatements/message/update", payload);

/* ---------- TYPES ---------- */
export interface Location {
  id: number;
  name: string;
  slug: string;
}

export interface Treatment {
  id: number;
  index?: number;
  category: string;
  name: string;
  slug: string;
  status: string;
  locations: Location[];
}

export interface TreatmentsResponse {
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
  data: Treatment[];
}

export async function getTreatments(params?: {
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

  const res = await api.post<TreatmentsResponse>(
    "/treatements/message",
    formData, // ✅ BODY
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

export const reorderTreatment = async (
  payload: { id: number; index: number }[]
) => {
  const res = await api.post("/treatements/message/reorder", {
    treatments: payload,
  });
  return res.data;
};

export async function getAllTreatments(
  count: number
): Promise<Treatment[]> {
  const formData = new URLSearchParams();
  formData.append("page", "1");
  formData.append("per_page", String(count));

  const res = await api.post<TreatmentsResponse>(
    "/treatements/message",
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

  return res.data.data; // ✅ now typed as Treatment[]
}