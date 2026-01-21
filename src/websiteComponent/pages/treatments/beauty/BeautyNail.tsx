
import beauty_nail_bg from "@/assets/beauty_nail_bg.png";
import nail1 from "@/assets/nail1.png";
import nail2 from "@/assets/nail2.png";
import nail3 from "@/assets/nail3.png";
import { Phone } from "lucide-react";
import { useState } from "react";
import { nailsData, pricingTooltips } from "./massageBeautyData";
import PriceTooltip from "./PriceTooltip";
import PriceAccordion from "./PriceAccordion";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageGallery from "@/websiteComponent/common/massage/MassageGallery";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import { Breadcrumb } from "../tratementPages/Breadcrumb";
import { IoCall } from "react-icons/io5";

export const images = [nail1, nail2, nail3];

function BeautyNail() {
  return (
    <>
      <SimpleHeroBanner
        background={beauty_nail_bg}
        title="Nails"
        breadcrumb={<Breadcrumb />}
      />
      {/* ------- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto !px-0 lg:px-4">
          <div className="grid grid-cols-12 lg:gap-[24px]">
            <div className="col-span-12 lg:col-span-8 mb-6 lg:mb-0">
              <MassageGallery images={images} />
              <div className="mt-[30px] px-4 lg:px-0">
                <h3 className="text-[28px] lg:leading-[28px] mb-5">Nails</h3>
                <p className="text-[#666666] text-sm sm:text-base leading-[24px] sm:leading-[26px] text-justify mb-[25px] font-quattro">
                  We thrive to perform every nail treatment to meet our
                  customers expectation in our luxurious beauty salon is very
                  conveniently located in Finchley, North London 2 mins away
                  from Finchley Central station, via bust is almost at the door
                  of luxurious beauty salon and paid parking is nearby. Thai
                  Manee spa has built reputation based on excellent customer
                  service and outstanding beauty treatments in Finchley. We
                  built everything with passion to make sure, Thai Manee spa is
                  one stop for all your beauty treatments along beautifully
                  present saloon, relaxation massages and laser treatments.Our
                  treatments are designed to provide best experience with an
                  impressive price. Our professional and experienced therapists
                  always aim for best with nail tips and advice, be it Manicure,
                  Pedicure, Shellac, Gel, Hard Gel with many colour choices and
                  great nail polish.
                </p>
                <h3 className="text-[#282828] text-lg sm:text-[22px] leading-[24px] italic font-muli mb-[15px] sm:mb-[25px]">
                  Happiness is a freshly painted nails.
                </h3>
                <p className="text-sm text-[#666666] sm:text-base mb-[5px] sm:mb-[16px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-[10px] items-center">
                    <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                      <IoCall size={16} />
                    </div>
                    <span className="text-lg text-[#282828] font-quattro">
                      0208 371 6922
                    </span>
                  </div>
                  <CommonButton>Book Now</CommonButton>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 mx-4 lg:mx-0 bg-[#F7EFEC]">
              <div className=" p-5">
                <h2 className="text-2xl mb-[5px]">Nails Price List</h2>
                <PriceAccordion data={nailsData} />
         
                {/* Footer labels */}
                <div className="grid grid-cols-3 gap-4 text-xs mt-6">
                  <PriceTooltip
                    label="Express"
                    title={pricingTooltips.Express.title}
                    text={pricingTooltips.Express.text}
                  />
                  <PriceTooltip
                    label="Classic"
                    title={pricingTooltips.Classic.title}
                    text={pricingTooltips.Classic.text}
                  />
                  <PriceTooltip
                    label="Deluxe"
                    title={pricingTooltips.Deluxe.title}
                    text={pricingTooltips.Deluxe.text}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BeautyNail;
