
import environ_bg from "@/assets/environ_bg.png";
import environ from "@/assets/environ.png";
import { Phone } from "lucide-react";
import b1 from "@/assets/b1.png";
import b2 from "@/assets/b2.png";
import b3 from "@/assets/b3.png";
import b4 from "@/assets/b4.png";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import BeautyCard from "@/websiteComponent/common/massage/BeautyCard";
import { Breadcrumb } from "../tratementPages/Breadcrumb";
import { IoCall } from "react-icons/io5";

export const skinTreatments = [
  {
    title: "Essential Radiance Reveal",
    image: b1,
    description:
      "Help target the signs of sun-damage and pigmentation which boosts the skin with the correct combination of ingredients for a radiant appearance.",
    duration60: 65,
    duration90: 85,
  },
  {
    title: "Essential Youth Reset",
    image: b2,
    description:
      "Help soften the appearance of fine lines, sun-damage & sagging skin with this peptide and vitamin-packed treatment.",
    duration60: 65,
    duration90: 85,
  },
  {
    title: "Essential Moisture Boost",
    image: b3,
    description:
      "Help reduce the appearance of fine lines caused by dehydration and promote a more moisturised glow with hyaluronic acid.",
    duration60: 65,
    duration90: 85,
  },
  {
    title: "Essential Moisture Boost",
    image: b4,
    description:
      "Help reduce the appearance of fine lines caused by dehydration and promote a more moisturised glow with hyaluronic acid.",
    duration60: 65,
    duration90: 85,
  },
  {
    title: "Essential Moisture Boost",
    image: b1,
    description:
      "Help reduce the appearance of fine lines caused by dehydration and promote a more moisturised glow with hyaluronic acid.",
    duration60: 65,
    duration90: 85,
  },
];
function Beautyinviron() {
  return (
    <>
      <SimpleHeroBanner
        background={environ_bg}
        title="Environ Professional Electro-Sonic"
         breadcrumb={<Breadcrumb />}
      />
      {/* ----------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 lg:gap-[24px]">
            <div className="col-span-12 lg:col-span-6 mb-5 lg:mb-0">
              <img src={environ} alt="environ" className="w-full" />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div>
                <h3 className="text-[28px] lg:leading-[28px] mb-5">
                  Environ Professional Electro-Sonic
                </h3>
                <p className="text-[#666666] text-sm sm:text-base leading-[24px] sm:leading-[26px] text-justify mb-[25px] font-quattro">
                  Environ a globally recognised professional skin care brand,
                  used both to prevent and to treat sun damage, problem skin,
                  pigmentation and scarring. The good news is that Environ Skin
                  Care has created a way to overcome these potential side
                  effects of vitamin A with their proprietary Vitamin Step-Up
                  System. This system was created to help skin become more
                  comfortable with increased levels of vitamin A and other
                  ingredients.
                </p>
                <p className="text-[#666666] text-sm sm:text-base leading-[24px] sm:leading-[26px] text-justify mb-3 font-quattro">
                  We are professionally qualified Environ beauty specialist who
                  use high end Environ product range using Environ’s active
                  Vitamin A enriched skincare products and the Ionzyme DF
                  machine, we provide you with an award winning treatments.
                  Environ's Electro-sonic Ionzyme® DF Technology is specially
                  developed machine increases skin absorption by way of a gentle
                  pulsed electrical current and sound wave infusion.
                </p>
                <h3 className="text-[#282828] text-lg sm:text-[22px] leading-[24px] italic font-muli mb-[15px] sm:mb-[25px]">
                  "Pamper Your Way to Beautiful Skin."
                </h3>
                <p className="text-sm text-[#666666] sm:text-base mb-[5px] sm:mb-[16px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex gap-[10px] items-center">
                  <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                    <IoCall size={16} />
                  </div>
                  <span className="text-lg text-[#282828] font-quattro">
                    0208 371 6922
                  </span>
                </div>
                <div className="flex gap-2 md:gap-10 flex-wrap justify-center mt-[25px]">
                  <CommonButton>Book Now</CommonButton>
                  <CommonButton>BOOK CONSULtation</CommonButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ------ */}
      <section>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {skinTreatments.map((item, i) => (
              <BeautyCard key={i} {...item} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <CommonButton to="/treatments/massage">
              Browse All Treatments
            </CommonButton>
          </div>
        </div>
      </section>
    </>
  );
}

export default Beautyinviron;
