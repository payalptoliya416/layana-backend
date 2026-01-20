import { Link, useParams } from "react-router-dom";
import { slugToTitle } from "./slugToTitle";
import { withBase } from "@/websiteComponent/common/Header";

export function Breadcrumb() {
  const { locationSlug, treatmentSlug } = useParams();

  if (!locationSlug) return null;

  return (
    <div className="mt-[5px] text-xl text-white/90 flex items-center justify-center gap-2 flex-wrap">
      <Link to={withBase(`/${locationSlug}`)} className="hover:underline">
        {slugToTitle(locationSlug)}
      </Link>

      <span>/</span>

      <Link
        to={withBase(`/${locationSlug}/treatments`)}
        className="hover:underline"
      >
        Treatments
      </Link>

      {treatmentSlug && (
        <>
          <span>/</span>
          <span className="opacity-90">{slugToTitle(treatmentSlug)}</span>
        </>
      )}
    </div>
  );
}
