
import beauty_waxing_bg from "@/assets/beauty_waxing_bg.png";
import waxing1 from "@/assets/waxing1.png";
import waxing2 from "@/assets/waxing2.png";
import waxing3 from "@/assets/waxing3.png";
import {waxingData } from "./massageBeautyData";
import PriceAccordion from "./PriceAccordion";
import { Phone } from "lucide-react";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageGallery from "@/websiteComponent/common/massage/MassageGallery";
import CommonButton from "@/websiteComponent/common/home/CommonButton";

export const images = [waxing1, waxing2, waxing3];

function BeautyWaxing() {
  return (
    <>
      <SimpleHeroBanner
        background={beauty_waxing_bg}
        title="Waxing"
        subtitle="Finchley Central / Treatments / Beauty"
      />
      {/* ------- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto !px-0 lg:px-4">
          <div className="grid grid-cols-12 lg:gap-[50px]">
            <div className="col-span-12 lg:col-span-8 mb-6 lg:mb-0">
              <MassageGallery images={images} />
              <div className="mt-[30px] px-4 lg:px-0">
                <h3 className="text-[28px] lg:leading-[28px] mb-5">Waxing</h3>
                <p className="text-[#666666] text-sm sm:text-base leading-[24px] sm:leading-[26px] text-justify mb-[25px] font-quattro">
                Beautifully presented salon based in Finchley, North London offering a selection of waxing services for women and men. Thai Manee beauty salon is easy to get to via public transport, Finchley Central train station is a 2-minute walk away, via bus is almost at the door of our luxurious beauty salon and paid parking is nearby. Our mission is to give you quick, efficient, affordable waxing without compromising on quality. Our professionally qualified therapists have many years of experience in the beauty industry and specialises in waxing, eyebrows threading as pain-free as possible. greatest professionalism. Book your next waxing appointment at Thai Manee beauty salon.
                </p>
                <p className="text-sm text-[#666666] sm:text-base mb-[5px] sm:mb-[10px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-[10px] items-center">
                    <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                      <Phone size={16} />
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
                <PriceAccordion data={waxingData} />
                <div className="py-[55px]">
                    <h2 className="text-lg font-muli italic text-center">“Happiness is a freshly painted nails”.</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BeautyWaxing;
