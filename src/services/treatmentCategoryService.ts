// services/treatmentCategoryService.ts
import api from "./apiClient";

export interface TreatmentCategory {
  id: number;
  name: string;
  status: "InActive" | "Active" | string; 
}

interface TreatmentCategoryResponse {
  status: string;
  data: TreatmentCategory[];
}

export const getTreatmentCategories = async (): Promise<TreatmentCategory[]> => {
  const response = await api.post<TreatmentCategoryResponse>(
    "/treatment-categories", 
    {
      page: 1,
      per_page: 50,
    }
  );

  return response.data.data;
};
