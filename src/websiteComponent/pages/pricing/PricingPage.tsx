import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import pricing_bg from "@/assets/pricing_bg.jpeg";
import PricingTabs from "@/websiteComponent/common/pricing/PricingTabs";
import PricingAccordion from "@/websiteComponent/common/pricing/PricingAccordion";
import { useState } from "react";
import { Breadcrumb } from "../treatments/tratementPages/Breadcrumb";

function MassageHeader() {
  return (
    <div className="grid grid-cols-12 p-2 bg-[#f5eee9] text-xs sm:text-sm lg:text-base font-bold">
      <div className="col-span-5 sm:col-span-6">MASSAGE TREATMENTS</div>
      <div className="col-span-3 text-center">Indicative Pressure</div>
      <div className="col-span-2 text-center">Duration</div>
      <div className="col-span-2 sm:col-span-1 text-right">Price</div>
    </div>
  );
}

function MassageRow({ name, pressure, duration, price }: any) {
  return (
    <div className="grid grid-cols-12 bg-[#fff4e9] text-xs sm:text-sm lg:text-base my-2">
      <div className="col-span-5 sm:col-span-6 p-2">{name}</div>
      <div className="col-span-3 text-center p-2">{pressure}</div>
      <div className="col-span-2 text-center p-2 text-[#666666]">
        {duration}
      </div>
      <div className="col-span-2 sm:col-span-1 text-right font-medium p-2">
        {price}
      </div>
    </div>
  );
}

function MassageContent() {
  return (
    <>
      <MassageHeader />

      <MassageRow
        name="Body Exfoliation"
        pressure=""
        duration="30 min"
        price="£49"
      />

      <MassageRow
        name="Signature Head Massage"
        pressure="Light To Medium"
        duration="30 min"
        price="£40"
      />

      <MassageRow
        name="Thai Oil Signature Massage"
        pressure="Medium"
        duration="60 min"
        price="£65"
      />
      <MassageRow duration="90 min" price="£85" />
      <MassageRow duration="120 min" price="£110" />

      <MassageRow
        name="Deep Tissue Massage"
        pressure="Firm"
        duration="60 min"
        price="£65"
      />
      <MassageRow duration="90 min" price="£85" />
      <MassageRow duration="120 min" price="£110" />

      <MassageRow
        name="Back, Neck, Shoulder & Head Massage"
        pressure="Light To Medium"
        duration="30 min"
        price="£40"
      />
      <MassageRow duration="45 min" price="£50" />
      <MassageRow duration="60 min" price="£65" />

      <MassageRow
        name="Swedish Massage"
        pressure="Light To Medium"
        duration="60 min"
        price="£65"
      />
      <MassageRow duration="90 min" price="£85" />
      <MassageRow duration="120 min" price="£110" />
    </>
  );
}

function SpaHeader() {
  return (
    <div className="grid grid-cols-12 p-2 bg-[#f5eee9] text-xs sm:text-sm lg:text-base font-bold">
      <div className="col-span-7 sm:col-span-8">SPA PACKAGES</div>
      <div className="col-span-2 text-center">Duration</div>
      <div className="col-span-3 sm:col-span-2 text-right">Price</div>
    </div>
  );
}

function SpaRow({ title, duration, price, description }: any) {
  return (
    <div className="">
      <div className="grid grid-cols-12 bg-[#fff4e9] text-xs sm:text-sm lg:text-base my-2 font-bold">
        <div className="col-span-8 p-2">{title}</div>
        <div className="col-span-2 text-center p-2">{duration}</div>
        <div className="col-span-2 text-right p-2">{price}</div>
      </div>
      <div className="grid grid-cols-12">
        {description && (
          <div className="col-span-8 p-2">
            <div className="text-xs sm:text-sm lg:text-base text-[#666666] font-quattro">
              {description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpaContent() {
  return (
    <>
      <SpaHeader />

      <SpaRow
        title="Mini Spa Package"
        duration="120 min"
        price="£129"
        description={
          <>
            Aromatherapy Massage 60 min <br />
            I Spa Image Ormedic Facial 60 min <br />* Upgrade to Signature
            Hydro2Facial (£25)
          </>
        }
      />

      <SpaRow
        title="Luxury Pamper Packages"
        duration="195 min"
        price="£195"
        description={
          <>
            Aromatherapy Massage – 60 min, Body Scrub – 20 min <br />
            Deluxe Pedicure OR Gel Manicure – 60 min, I Spa Image Vital C –
            Anti-aging – 55 min
          </>
        }
      />

      <SpaRow
        title="Aromatherapy & Body Exfoliation"
        duration="80 min"
        price="£110"
        description="Aromatherapy Massage 60 min & Body Scrub – 20 min"
      />

      <SpaRow title="Back & Toe" duration="60 min" price="£70" />
      <SpaRow duration="90 min" price="£90" />

      <SpaRow title="Heavenly Body & Feet" duration="90 min" price="£90" />
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
  const [openAccordion, setOpenAccordion] = useState<{
    Massage: string | null;
    Beauty: string | null;
  }>({
    Massage: "MASSAGE",
    Beauty: "NAILS",
  });
  const toggleAccordion = (tab: "Massage" | "Beauty", key: string) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [tab]: prev[tab] === key ? null : key,
    }));
  };
  return (
    <>
      <SimpleHeroBanner
        background={pricing_bg}
        title="Treatments Price"
        breadcrumb={<Breadcrumb />}
      />

      {/* ---- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">
          <PricingTabs>
            {(activeTab: string) => (
              <>
                {activeTab === "Massage" && (
                  <>
                    <PricingAccordion
                      title="MASSAGE"
                      isOpen={openAccordion.Massage === "MASSAGE"}
                      onToggle={() => toggleAccordion("Massage", "MASSAGE")}
                    >
                      <MassageContent />
                    </PricingAccordion>

                    <PricingAccordion
                      title="SPA PACKAGES"
                      isOpen={openAccordion.Massage === "SPA"}
                      onToggle={() => toggleAccordion("Massage", "SPA")}
                    >
                      <SpaContent />
                    </PricingAccordion>
                  </>
                )}

                {activeTab === "Beauty" && (
                  <>
                    <PricingAccordion
                      title="NAILS"
                      isOpen={openAccordion.Beauty === "NAILS"}
                      onToggle={() => toggleAccordion("Beauty", "NAILS")}
                    >
                      <NailsContent />
                    </PricingAccordion>

                    <PricingAccordion
                      title="FEMALE WAXING"
                      isOpen={openAccordion.Beauty === "WAXING"}
                      onToggle={() => toggleAccordion("Beauty", "WAXING")}
                    >
                      <FemaleWaxingContent />
                    </PricingAccordion>

                    <PricingAccordion
                      title="FACIAL"
                      isOpen={openAccordion.Beauty === "FACIAL"}
                      onToggle={() => toggleAccordion("Beauty", "FACIAL")}
                    >
                      <FacialContent />
                    </PricingAccordion>
                  </>
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
