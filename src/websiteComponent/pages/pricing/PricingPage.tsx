import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import pricing_bg from "@/assets/pricing_bg.jpeg";
import PricingTabs from "@/websiteComponent/common/pricing/PricingTabs";
import PricingAccordion from "@/websiteComponent/common/pricing/PricingAccordion";
import { useEffect, useState } from "react";
import { Breadcrumb } from "../treatments/tratementPages/Breadcrumb";
import { useLocation } from "react-router-dom";
import {
  getPricingByLocation,
  getTreatmentCategories,
  TreatmentCategory,
} from "@/websiteComponent/api/treatments.api";
import Loader from "@/websiteComponent/common/Loader";

function MassageHeader() {
  return (
    <div className="grid grid-cols-12 bg-[#f5eee9] text-xs sm:text-sm lg:text-base leading-[20px] font-bold">
      <div className="col-span-4 sm:col-span-6 p-2 leading-[18px]">
        MASSAGE TREATMENTS
      </div>
      <div className="col-span-3 text-center p-2 leading-[18px]">
        Indicative Pressure
      </div>
      <div className="col-span-3 sm:col-span-2 p-2 leading-[18px] text-right">
        Duration
      </div>
      <div className="col-span-2 sm:col-span-1 text-right p-2 leading-[18px]">
        Price
      </div>
    </div>
  );
}

function MassageRow({ name, pressure, duration, price }: any) {
  return (
    <div className="grid grid-cols-12 bg-[#fff4e9] text-xs sm:text-sm lg:text-base my-2 font-mulish">
      <div className="col-span-4 sm:col-span-6 p-2 leading-[18px]">{name}</div>
      <div className="col-span-3 text-center p-2 leading-[18px]">
        {pressure}
      </div>
      <div className="col-span-3 sm:col-span-2 p-2 text-[#666666] leading-[18px] text-right">
        {duration}
      </div>
      <div className="col-span-2 sm:col-span-1 text-right font-medium p-2">
        {price}
      </div>
    </div>
  );
}

function MassageContent({ data }: { data: any }) {
  if (!data) return null;

  return (
    <>
      <MassageHeader />

      {/* Dynamic Treatments */}
      {data.treatments.map((t: any) => (
        <div key={t.id}>
          {t.pricing.map((p: any, index: number) => (
            <MassageRow
              key={p.id}
              name={index === 0 ? t.name : ""} // ✅ only first time name
              pressure={index === 0 ? (t.indicative_pressure ?? "-") : ""}
              duration={`${p.minute} min`}
              price={`£${p.price}`}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function SpaHeader() {
  return (
    <div className="grid grid-cols-12 bg-[#f5eee9] text-xs sm:text-sm lg:text-base leading-[20px] font-bold">
      <div className="col-span-6 sm:col-span-8 p-2">SPA PACKAGES</div>
      <div className="col-span-3 sm:col-span-2 p-2 text-right">Duration</div>
      <div className="col-span-3 sm:col-span-2 text-right p-2">Price</div>
    </div>
  );
}

function SpaRow({ title, duration, price, description }: any) {
  return (
    <div className="">
      <div className="grid grid-cols-12 bg-[#fff4e9] text-xs sm:text-sm lg:text-base leading-[18px] my-2 font-bold font-mulish">
        <div className="col-span-6 sm:col-span-8 p-2">{title}</div>
        <div className="col-span-3 sm:col-span-2 p-2 text-right">
          {duration}
        </div>
        <div className="col-span-3 sm:col-span-2 text-right p-2">{price}</div>
      </div>
      <div className="grid grid-cols-12">
        {description && (
          <div className="col-span-6 sm:col-span-8 p-2">
            <div className="text-xs sm:text-sm lg:text-base text-[#a3a09e] font-quattro">
              {description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpaPackagesContent({ data }: { data: any }) {
  if (!data?.packages || data.packages.length === 0) return null;

  return (
    <>
      <SpaHeader />

      {data.packages.map((pkg: any) => (
        <div key={pkg.id} className="mb-4">
          {pkg.pricing.map((p: any, index: number) => (
            <SpaRow
              key={p.id}
              title={index === 0 ? pkg.name : ""} // ✅ only first time title
              duration={`${p.duration} min`}
              price={`£${p.price}`}
              description={
                index === 0 ? ( // ✅ description only once
                  <div
                    dangerouslySetInnerHTML={{
                      __html: pkg.description,
                    }}
                  />
                ) : null
              }
            />
          ))}
        </div>
      ))}
    </>
  );
}

// --beauty Tab content -- start
function BeautySubHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#f5eee9] px-4 py-2 text-xs sm:text-sm lg:text-base font-semibold text-center">
      {title}
    </div>
  );
}
function BeautyRow({
  title,
  description,
  price,
}: {
  title: string;
  description?: React.ReactNode;
  price: string;
}) {
  return (
    <div className="my-2 text-xs sm:text-sm lg:text-base">
      <div className="grid grid-cols-12 gap-x-4 gap-y-1 items-start bg-[#fff4e9]">
        {/* LEFT COLUMN */}
        <div className="col-span-12 sm:col-span-7 p-2">
          <div className="font-medium text-[#666666]">{title}</div>
        </div>

        {/* RIGHT COLUMN (PRICE) */}
        <div className="col-span-12 sm:col-span-5 text-left sm:text-right font-medium break-words p-2">
          {price}
        </div>
      </div>
      {description && (
        <div className="text-xs sm:text-sm lg:text-base text-[#666666] font-quattro py-4 px-2">
          {description}
        </div>
      )}
    </div>
  );
}
function NailsContent() {
  return (
    <>
      <BeautySubHeader title="Manicure & Pedicure" />

      <BeautyRow
        title="Manicure"
        price="Polish Change £15  |  Express £20  |  Classic £25  |  Deluxe £35"
      />

      <BeautyRow
        title="Pedicure"
        price="Polish Change £15  |  Express £22  |  Classic £28  |  Deluxe £38"
      />

      <BeautySubHeader title="Shellac" />

      <BeautyRow
        title="Shellac Manicure"
        price="Express £25  |  Classic £30  |  Deluxe £40"
      />

      <BeautyRow
        title="Shellac Pedicure"
        price="Express £30  |  Classic £35  |  Deluxe £45"
      />

      <BeautyRow
        title="Soak Off & Shellac Manicure"
        price="Express £30  |  Classic £35  |  Deluxe £45"
      />

      <BeautyRow title="Soak Off" price="£10" />

      <BeautyRow title="Add-on French Nail" price="£10" />
    </>
  );
}
function FemaleWaxingContent() {
  return (
    <>
      <BeautyRow title="Underarm" price="£15" />
      <BeautyRow title="Bikini Line" price="£15" />
      <BeautyRow title="Extended Bikini" price="£26" />
      <BeautyRow title="Brazilian" price="£33" />
      <BeautyRow title="Hollywood" price="£38" />
      <BeautyRow title="Hollywood & Full Leg (Strip wax)" price="£55" />
      <BeautyRow
        title="Leg : Lower | Upper | 3/4 | Full Leg"
        price="£17 | £20 | £25 | £29"
      />
    </>
  );
}
function FacialContent() {
  return (
    <>
      <BeautyRow
        title="Essential Radiance Reveal"
        description="Help target the signs of sun-damage and pigmentation with this treatment which boosts the skin with the correct combination of ingredients for an even-toned, radiant-looking appearance."
        price="60 min £70  |  90 min £95"
      />

      <BeautyRow
        title="Essential Youth Reset"
        description="Help soften the appearance of fine lines, sun-damage & sagging skin with this peptide and vitamin-packed treatment."
        price="60 min £70  |  90 min £95"
      />

      <BeautyRow
        title="Focus-On Eye Treatment"
        description="This innovative, intense and non-invasive treatment helps smooth the look of facial lines."
        price="30 min £50"
      />
    </>
  );
}
// --beauty Tab content -- end

function PricingPage() {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const location = useLocation();
  const [activeAccordionId, setActiveAccordionId] = useState<number | null>(
    null,
  );
  const { locationId, categoryId } = location.state || {};
  const [activeTab, setActiveTab] = useState<string>("");
  const [pricingData, setPricingData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<number | string | null>(
    null,
  );

  useEffect(() => {
    getTreatmentCategories().then((res) => {
      const data = res.data;
      setCategories(data);

      if (data.length === 0) return;
      if (categoryId) {
        const found = data.find((c) => c.id === categoryId);

        if (found) {
          setActiveTab(found.name);
          setActiveAccordionId(found.id);
          setOpenAccordion(found.id);
          return;
        }
      }

      setActiveTab(data[0].name);
      setActiveAccordionId(data[0].id);
      setOpenAccordion(data[0].id);
    });
  }, [categoryId]);

  useEffect(() => {
    if (pricingData?.category?.id) {
      setOpenAccordion(pricingData.category.id);
    }
  }, [pricingData]);

  const handleToggle = (id: number | string) => {
    if (openAccordion !== id) {
      setOpenAccordion(id);
      return;
    }
    setOpenAccordion(null);
  };

  useEffect(() => {
    if (!locationId || !activeAccordionId) return;

    getPricingByLocation(locationId, activeAccordionId)
      .then((res) => {
        setPricingData(res.data);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, [locationId, activeAccordionId]);

  if (initialLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <SimpleHeroBanner
        background={pricing_bg}
        title="Treatments Price"
        breadcrumb={<Breadcrumb />}
      />

      {/* ---- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <PricingTabs
            tabs={categories.map((c) => c.name)}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);

              const found = categories.find((c) => c.name === tab);
              if (found) {
                setActiveAccordionId(found.id);
              }
            }}
          >
            {() => (
              <>
                {pricingData && (
                  <PricingAccordion
                    title={pricingData.category.name}
                    isOpen={openAccordion === pricingData.category.id}
                    onToggle={() => handleToggle(pricingData.category.id)}
                  >
                    <MassageContent data={pricingData} />
                  </PricingAccordion>
                )}
                {pricingData?.packages?.length > 0 &&
                  pricingData.category.id === categories[0]?.id && (
                    <PricingAccordion
                      title="Spa Packages"
                      isOpen={openAccordion === "spa"}
                      onToggle={() => handleToggle("spa")}
                    >
                      <SpaPackagesContent data={pricingData} />
                    </PricingAccordion>
                  )}
              </>
            )}
          </PricingTabs>
        </div>
      </section>
    </>
  );
}

export default PricingPage;
