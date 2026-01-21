
import spapackages_bg from "@/assets/spapackages_bg.png";
import spa from "@/assets/spa.png";
import PackageCard, { spaPackages, type PackageItem } from "./SpaPackagesData";
import { useState } from "react";
import { PackageModal } from "./PackageModal";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";

function SpaPackages() {
  const [activePopup, setActivePopup] = useState<PackageItem | null>(null);
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
          <div className="grid grid-cols-12 lg:gap-[24px]">
            <div className="col-span-12 lg:col-span-6 mb-5 lg:mb-0">
              <img src={spa} alt="spa-package" />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <h3 className="text-[28px] md:text-4xl mb-5 font-light">
                Lorem Ipsum is simply
              </h3>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularized in the 1960s with the release of Letterset sheets
                containing Lorem Ipsum passages.
              </p>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
                and more recently with desktop publishing software like Aldus
                PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
                simply dummy text of the printing and typesetting industry.
              </p>
              <p className="text-[#666666] mb-[15px] font-quattro text-sm md:text-base leading-[26px] text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum. Lorem Ipsum is simply dummy
                text of the printing and typesetting industry.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ---- */}
      <section>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spaPackages.map((item, i) => (
              <PackageCard
                key={i}
                item={item}
                onReadMore={() => setActivePopup(item)}
              />
            ))}
          </div>
          {activePopup?.popup && (
            <PackageModal
              data={activePopup.popup}
              onClose={() => setActivePopup(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default SpaPackages;
