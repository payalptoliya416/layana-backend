import spapackages_bg from "@/assets/spapackages_bg.png";
import spa from "@/assets/spa.png";
import PackageCard from "./SpaPackagesData";
import { useEffect, useState } from "react";
import { PackageModal } from "./PackageModal";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
import { useLocation, useParams } from "react-router-dom";
import {
  getSpaPackages,
  SpaPackage,
} from "@/websiteComponent/api/spaPackage.api";
import {
  getLocations,
  getSpaLandingPage,
  SpaLandingPageData,
} from "@/websiteComponent/api/webLocationService";
import Loader from "@/websiteComponent/common/Loader";

function SpaPackages() {
  const location = useLocation();
  const locationId = location.state?.locationId as number | undefined;
  const { locationSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(
    null,
  );
  const [packages, setPackages] = useState<SpaPackage[]>([]);
  const [landingData, setLandingData] = useState<SpaLandingPageData | null>(
    null,
  );
  const [activePopup, setActivePopup] = useState<SpaPackage | null>(null);

  const finalLocationId = locationId ?? resolvedLocationId;

  /* ================= RESOLVE LOCATION ID ================= */
  useEffect(() => {
    if (!finalLocationId) return;

    getSpaLandingPage().then((res) => {
      if (res.status === "success") {
        setLandingData(res.data);
      }
    });
  }, [finalLocationId]);

  useEffect(() => {
    if (locationId) {
      setResolvedLocationId(locationId);
      return;
    }

    if (!locationSlug) return;

    getLocations().then((res) => {
      const locations = res.data ?? [];
      const matched = locations.find(
        (loc: { id: number; slug: string }) => loc.slug === locationSlug,
      );

      if (matched) {
        setResolvedLocationId(matched.id);
      }
    });
  }, [locationId, locationSlug]);

  /* ================= FETCH SPA PACKAGES ================= */
  useEffect(() => {
    if (!finalLocationId) return;
    setLoading(true);
    getSpaPackages(finalLocationId).then((res) => {
      if (res.status === "success") {
        setPackages(res.data);
      }
      setLoading(false);
    });
  }, [finalLocationId]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <SimpleHeroBanner
        background={spapackages_bg}
        title="Spa Packages"
        breadcrumb={<Breadcrumb />}
      />
      {/* ----- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 lg:gap-[50px]">
            <div className="col-span-12 lg:col-span-6 mb-5 lg:mb-0">
              <img src={landingData?.gallery_image || spa} alt="spa" />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: landingData?.description || "",
                }}
                className="text-[#666666] mb-[15px] quill-content"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ---- */}
      <section className="pb-12 lg:pb-[110px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[45px]">
            {packages.map((item, i) => (
              <PackageCard
                key={i}
                item={item}
                onReadMore={() => setActivePopup(item)}
              />
            ))}
          </div>
          {activePopup && (
            <PackageModal
              data={activePopup}
              onClose={() => setActivePopup(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default SpaPackages;
