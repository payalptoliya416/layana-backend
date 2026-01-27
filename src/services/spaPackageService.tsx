import api from "./apiClient";

/* ---------- CREATE ---------- */
export const createSpaPackage = async (payload: any) => {
  const res = await api.post("/spa-packages/create", payload);
  return res.data;
};

/* ---------- GET BY ID ---------- */
export const getSpaPackageById = async (id: number) => {
  const res = await api.post("/spa-packages/show", { id });
  return res.data.data;
};

/* ---------- UPDATE ---------- */
export const updateSpaPackage = async (payload: any) => {
  const res = await api.post("/spa-packages/update", payload);
  return res.data;
};

/* ---------- DELETE ---------- */
export const deleteSpaPackage = async (id: number) => {
  const res = await api.post("/spa-packages/delete", { id });
  return res.data;
};

/* ---------- TYPES ---------- */
export interface SpaPackage {
  id: number;
  index?: number;
  name: string;
  slogan: string;
  status: string;
}

export interface SpaPackageResponse {
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
  data: SpaPackage[];
}

/* ---------- LIST ---------- */
export async function getSpaPackages(params?: {
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

  const res = await api.post<SpaPackageResponse>(
    "/spa-packages",
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

/* ---------- REORDER ---------- */
export const reorderSpaPackage = async (
  payload: { id: number; index: number }[]
) => {
  const res = await api.post("/spa-packages/reorder", {
    spa_packages: payload,
  });
  return res.data;
};

/* ---------- GET ALL (FOR DRAG) ---------- */
export async function getAllSpaPackages(
  count: number
): Promise<SpaPackage[]> {
  const formData = new URLSearchParams();
  formData.append("page", "1");
  formData.append("per_page", String(count));

  const res = await api.post<SpaPackageResponse>(
    "/spa-packages",
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

  return res.data.data;
}



export type SpaLandingPayload = {
  gallery_image: string;
  description: string;
};

/* ================= GET API ================= */
// Page open thay tyare data fetch

export const getSpaLandingPage = async () => {
  const res = await api.post("/spa-packages/get-landing-page");
  return res.data;
};

/* ================= POST API ================= */
// Save button click par update/create

export const updateSpaLandingPage = async (
  payload: SpaLandingPayload
) => {
  const res = await api.post(
    "/spa-packages/landing-page",
    payload
  );
  return res.data;
};