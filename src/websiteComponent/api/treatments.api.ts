import { publicApi } from "./publicApi";

/* Categories */
export type TreatmentCategory = {
  id: number;
  name: string;
};

export const getTreatmentCategories = () => {
  return publicApi<{
    status: string;
    data: TreatmentCategory[];
  }>("/frontend/treatment-categories");
};

/* Treatments by category (FIXED) */
export const getTreatmentsByCategory = (
  categoryId: number,
  locationId = 1
) => {
  return publicApi<{
    status: string;
    data: {
      category: TreatmentCategory;
      treatments: {
        id: number;
        name: string;
        slug: string;
        thumbnail_image: string;
      }[];
    };
  }>(
    `/frontend/treatments-by-category?category_id=${categoryId}&location_id=${locationId}`
  );
};
export const getTreatmentById = (id: number) => {
  return publicApi<{
    status: string;
    data: any;
  }>("/frontend/get-treatment", {
    method: "POST",
    body: { id },
  });
};
