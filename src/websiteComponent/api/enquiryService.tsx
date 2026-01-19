import { publicApi } from "./publicApi";

/* ================= TYPES ================= */

export type EnquiryPayload = {
  location_id: number;
  name: string;
  email: string;
  mobile: string;
  message: string;
};

export type EnquiryResponse = {
  status: string;
  message: string;
};

/* ================= API CALL ================= */

export const submitEnquiry = (payload: EnquiryPayload) => {
  return publicApi<EnquiryResponse>("/frontend/enquiry", {
    method: "POST",
    body: payload,
  });
};
