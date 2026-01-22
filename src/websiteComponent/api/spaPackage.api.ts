/* ================= COMMON TYPES ================= */

import { publicApi } from "./publicApi";

export type LocationItem = {
  id: number;
  name: string;
};

export type SpaPackagePricing = {
  id: number;
  location_id: number;
  location_name: string;
  duration: string;
  price: number;
  is_bold: boolean;
  index: number;
};

export type SpaPackageVisuals = {
  id: number;
  btn_text: string;
  btn_link: string;
  image: string;
};

export type SpaPackage = {
  id: number;
  name: string;
  slogan: string;
  description: string;
  locations: LocationItem[];
  index: number;
  pricing: SpaPackagePricing[];
  visuals: SpaPackageVisuals;
  status: "live" | "draft";
  created_at: string;
  updated_at: string;
};

/* ================= API RESPONSE ================= */

export type SpaPackagesResponse = {
  status: "success" | "error";
  message: string;
  data: SpaPackage[];
};

export const getSpaPackages = (location_id?: number) => {
  return publicApi<SpaPackagesResponse>(
    "/frontend/spa-packages",
    {
      method: "POST",
      body: {
        location_id,
      },
    }
  );
};