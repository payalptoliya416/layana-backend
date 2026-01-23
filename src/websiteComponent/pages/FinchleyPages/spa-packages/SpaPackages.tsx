
import spapackages_bg from "@/assets/spapackages_bg.png";
import spa from "@/assets/spa.png";
import PackageCard from "./SpaPackagesData";
import { useEffect, useState } from "react";
import { PackageModal } from "./PackageModal";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
import { useLocation, useParams } from "react-router-dom";
import { getSpaPackages, SpaPackage } from "@/websiteComponent/api/spaPackage.api";
import { getLocations } from "@/websiteComponent/api/webLocationService";

function SpaPackages() {
   const location = useLocation();
  const locationId = location.state?.locationId as number | undefined;
  const { locationSlug } = useParams();

  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(null);
  const [packages, setPackages] = useState<SpaPackage[]>([]);

  const [activePopup, setActivePopup] = useState<SpaPackage | null>(null);

  const finalLocationId = locationId ?? resolvedLocationId;

  /* ================= RESOLVE LOCATION ID ================= */
  useEffect(() => {
    if (locationId) {
      setResolvedLocationId(locationId);
      return;
    }

    if (!locationSlug) return;

    getLocations().then((res) => {
      const locations = res.data ?? [];
      const matched = locations.find(
        (loc: { id: number; slug: string }) => loc.slug === locationSlug
      );

      if (matched) {
        setResolvedLocationId(matched.id);
      }
    });
  }, [locationId, locationSlug]);

  /* ================= FETCH SPA PACKAGES ================= */
  useEffect(() => {
    if (!finalLocationId) return;

    getSpaPackages(finalLocationId).then((res) => {
      if (res.status === "success") {
        setPackages(res.data);
      }
    });
  }, [finalLocationId]);

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
              <img src={spa} alt="spa-package" />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <h3 className="text-[28px] md:text-4xl mb-5 font-light">
               Find your perfect escape
              </h3>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
               Special occasions call for something extra special, then is better way to celebrate a luxurious spa package. Whether it's a birthday, anniversary, or just a well-deserved treat, indulging in a spa day can elevate the occasion to new heights of relaxation and rejuvenation. By opting for a spa package, you're not just treating yourself or loved ones you're investing in moments of tranquillity that will be cherished long after the occasion has passed. 
              </p>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
              When it comes to spa packages for special occasions, there are a variety of options to choose from that cater to different preferences and needs. One popular type is Luxury Pamper package, designed to help you unwind and destress with soothing massage, calming, and beautifying treatments.
              </p>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
                For those celebrating a special milestone with their partner, couples' same type of packages can be offered a romantic retreat where you can enjoy side-by-side pampering sessions together. These packages often include luxury pamper package, heavenly body and feet, mini spa package, Aromatherapy massage & exfoliation or back & toe massages.  
              </p>
              <p className="text-[0d0d0d] text-sm md:text-base font-quattro leading-[26px] text-justify font-semibold">Ready to escape into bliss? Book your spa package today and treat yourself or a loved for relaxation and well-being."</p>
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
