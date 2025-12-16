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

export const getLocations = async (): Promise<Location[]> => {
  const response = await api.post<LocationsResponse>("/locations");
  return response.data.data;
};

