import { publicApi } from "./publicApi";

/* ================= TYPES ================= */

export type MembershipLocation = {
  id: number;
  name: string;
};

export type MembershipPricing = {
  id: number;
  location_id: number;
  location_name: string;
  duration: number;
  offer_price: number;
  each_price: number;
  price: number;
};

export type Membership = {
  id: number;
  name: string;
  slogan: string;
  content: string;
  locations: MembershipLocation[];
  index: number;
  pricing: MembershipPricing[];
  status: string;
  created_at: string;
  updated_at: string;
};

export type MembershipFaq = {
  id: number;
  question: string;
  answer: string;
  index: number;
};

export type MembershipsResponse = {
  status: string;
  message: string;
  data: {
    memberships: Membership[];
    faqs: MembershipFaq[];
  };
};

/* ================= API FUNCTION ================= */
export const getMemberships = (location_id?: number) => {
  return publicApi<MembershipsResponse>(
    "/frontend/memberships",
    {
      method: "POST",
      body: {
        location_id,
      },
    }
  );
};