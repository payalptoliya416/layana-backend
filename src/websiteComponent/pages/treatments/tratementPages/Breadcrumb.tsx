import { Link, useParams, useLocation } from "react-router-dom";
import { slugToTitle } from "./slugToTitle";
import { withBase } from "@/websiteComponent/common/Header";

export function Breadcrumb() {
  const { locationSlug } = useParams();
  const { pathname } = useLocation();

  if (!locationSlug) return null;

  const cleanPath = pathname.replace(/\/$/, "");
  const showTreatments =
    cleanPath.includes(`/${locationSlug}/treatments/`);

  return (
    <div className="mt-[5px] text-sm sm:text-xl lg:text-2xl text-white/90 flex items-center justify-center gap-2 flex-wrap">
      
      {/* LOCATION */}
      <Link
        to={withBase(`/${locationSlug}`)}
        className="hover:underline"
      >
        {slugToTitle(locationSlug)}
      </Link>

      {/* TREATMENTS */}
      {showTreatments && (
        <>
          <span>/</span>
          <Link
            to={withBase(`/${locationSlug}/treatments`)}
            className="hover:underline"
          >
            Treatments
          </Link>
        </>
      )}
    </div>
  );
}
