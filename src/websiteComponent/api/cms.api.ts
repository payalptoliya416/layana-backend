import { publicApi } from "./publicApi";

export const getTermsAndConditions = () => {
  return publicApi<{
    status: string;
    data: string; 
  }>("/frontend/terms-and-conditions",{
    method: "POST",
  });
};