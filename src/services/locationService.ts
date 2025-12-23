import api from "./apiClient";

export interface Location {
  id: number;
  name: string;
  slug: string;
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

