import { publicApi } from "./publicApi";
export interface Locationweb {
  id: number;
  name: string;
  email: string;
  phone: string;
  slug: string;
  address_line_1: string;
  address_line_2: string;
  free_text: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  parking_details: string;
}

export type LocationResponse = {
  status: string;
  data: Locationweb[];
};

export const getLocations = () => {
  return publicApi<LocationResponse>("/frontend/get-location", {
    method: "GET",
  });
};


export type OpeningHour = {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  is_closed: number;
};

export type Treatment = {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
};

export type LandingLocation = {
  id: number;
  name: string;
  status: string;
  free_text: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
  address_line_1: string;
  address_line_2: string;
  slug: string;
  email: string;
  phone: string;
  parking_details: string;
};

export type LandingPageData = {
  location: LandingLocation;
  sliders: any[];
  about: any | null;
  promotion: any | null;
  promotion3: any | null;
  seo: any | null;
  opening_hours: OpeningHour[];
  treatments: Treatment[];
};

export type LandingPageResponse = {
  status: string;
  data: LandingPageData;
};

export const getLandingPageByLocation = (id: number) => {
  return publicApi<LandingPageResponse>("/frontend/landing-page", {
    method: "POST",
    body: { id },
  });
};

export type LocationApi = {
  id: number;
  name: string;
  slug: string;
};

