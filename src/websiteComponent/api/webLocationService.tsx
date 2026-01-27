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
  shop_banner_image: string;
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
export interface SpaLandingPageData {
  id: number;
  gallery_image: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SpaLandingPageResponse {
  status: string;
  message: string;
  data: SpaLandingPageData;
}

export const getSpaLandingPage = () => {
  return publicApi<SpaLandingPageResponse>(
    `/frontend/spa-packages-landing-page`,
    {
      method: "GET",
    }
  );
};


export interface MembershipPolicy {
  title: string;
  content: string;
}

export interface MembershipLandingPageData {
  id: number;
  description: string;
  policy: MembershipPolicy[];
  created_at: string;
  updated_at: string;
}

export interface MembershipLandingPageResponse {
  status: string;
  message: string;
  data: MembershipLandingPageData;
}

// ================= API Function =================

export const getMembershipLandingPage = () => {
  return publicApi<MembershipLandingPageResponse>(
    "/frontend/memberships-landing-page",
    {
      method: "GET",
    }
  );
};