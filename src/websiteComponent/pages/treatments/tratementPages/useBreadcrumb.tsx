import { useParams } from "react-router-dom";
import { slugToTitle } from "./slugToTitle";

export function useBreadcrumb() {
  const { locationSlug, treatmentSlug } = useParams();

  return [
    slugToTitle(locationSlug),
    "Treatments",
    slugToTitle(treatmentSlug),
  ].filter(Boolean).join(" / ");
}
