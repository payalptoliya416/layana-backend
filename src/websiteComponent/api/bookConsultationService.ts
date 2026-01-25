import { publicApi } from "./publicApi";

/* ================= TYPES ================= */

export type BookConsultationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  treatments: string;
  day: string;
  start_time: string;
  end_time: string;
  message?: string;

  skincare?: string;
  skin_type?: string;
  skin_type_second?: string;
  skin_goal?: string;
  skin_care_products?: string;

  type: string;
};

export type BookConsultationResponse = {
  status: string;
  message: string;
};

/* ================= API CALL ================= */

export const submitBookedConsultation = (
  payload: BookConsultationPayload
) => {
  return publicApi<BookConsultationResponse>(
    "/frontend/booked-consultation",
    {
      method: "POST",
      body: payload,
    }
  );
};
