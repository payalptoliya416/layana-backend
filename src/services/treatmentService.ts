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

// export async function getTreatments(params?: {
//   page?: number;
//   sortBy?: string;
//   sortDirection?: "asc" | "desc";
// }) {
//   const res = await api.post<TreatmentsResponse>(
//     "/treatements/message",
//     {},
//     {
//       params: {
//         page: params?.page,
//         sort_by: params?.sortBy,
//         sort_direction: params?.sortDirection,
//       },
//     }
//   );

//   return res.data;
// }

export const reorderTreatment = async (payload: {
  id: number;
  index: number;
}) => {
  const res = await api.post(
    "/treatements/message/reorder",
    payload
  );

  return res.data;
};