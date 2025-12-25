import api from "./apiClient";

export interface Location {
  id: number;
  name: string;
  slug: string;
  status?: "active" | "inactive";
}

export interface LocationsResponse {
  status: string;
  data: Location[];
}

export type CreateLocationPayload = {
  name: string;
  status: string;
  free_text: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  opening_hours: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
};


export const getLocations = async (): Promise<Location[]> => {
  const response = await api.post<LocationsResponse>("/locations");
  return response.data.data;
};

export async function createLocation(payload: CreateLocationPayload) {
  const res = await api.post("/locations/create", payload);
  return res.data;
}

export async function deleteLocation(id: number) {
  const res = await api.post("/locations/delete", {
    id,
  });
  return res.data;
}


export const getLocationById = async (id: string | number) => {
  const res = await api.post("/locations/show", { id });
  return res.data.data;
};

export const updateLocation = (id: string | number, payload: any) =>
  api.post("/locations/update", {
    id,
    ...payload,
  });