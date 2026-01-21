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

export const getTreatmentsByCategory = (
  categoryId: number,
  locationId: number
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
  }>("/frontend/treatments-by-category", {
    method: "POST",
    body: {
      category_id: categoryId,
      location_id: locationId,
    },
  });
};

export const getTreatmentById = ({
  id,
  location_id,
}: {
  id: number;
  location_id: number;
}) => {
  return publicApi<{
    status: string;
    data: any;
  }>("/frontend/get-treatment", {
    method: "POST",
    body: {
      id,
      location_id,
    },
  });
};

export type TreatmentView = {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
};

export type TreatmentSingleResponse = {
  status: "success" | "error";
  data: TreatmentView[];
};

export const getViewTreatmentById = (ids: number[]) => {
  return publicApi<TreatmentSingleResponse>(
    "/frontend/treatments-single",
    {
      method: "POST",
      body: { ids }, 
    }
  );
};
export const getTreatmentIdBySlug = (slug: string) => {
  return publicApi<{
    status: string;
    data: {
      id: number;
      name: string;
      slug: string;
    };
  }>(`/frontend/treatment-id-by-slug?slug=${slug}`, {
    method: "GET",
  });
};