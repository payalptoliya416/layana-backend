import { Phone } from "lucide-react";
import oilMassage from "@/assets/oilMassage.png";
import {
  massageTreatmentsData,
  type MassageTreatmentTabs,
} from "./massageTreatmentsData";

import img1 from "@/assets/slider1.png";
import img2 from "@/assets/slider2.png";
import img3 from "@/assets/slider3.png";
import img4 from "@/assets/slider4.png";
import Faq, { FaqItem } from "@/websiteComponent/common/massage/FAQ";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageGallery from "@/websiteComponent/common/massage/MassageGallery";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import MassageCard from "@/websiteComponent/common/home/MasssageCard";

export const images = [img1, img2, img3, img4];

const faqData: FaqItem[] = [
  {
    question: "Lorem Ipsum is simply dummy text of the printing?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Lorem Ipsum is simply dummy?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    question: "Excepteur sint occaecat cupidatat non proident?",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

const CARD_COLORS = ["#FBF3EC", "#F9EEE7", "#FFF4E9"];

function OilMassage() {
  const activeTab: MassageTreatmentTabs = "Massage";

  return (
    <>
      <SimpleHeroBanner
        background={oilMassage}
        title="Thai Oil Massage"
        subtitle="Finchley Central / Treatments / Massage"
      />
      {/* ----- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto !px-0 lg:px-4">
          <div className="grid grid-cols-12 lg:gap-[50px]">
            <div className="col-span-12 lg:col-span-6 mb-6 lg:mb-0">
               <MassageGallery images={images} />
            </div>
            <div className="col-span-12 lg:col-span-6 px-4 lg:px-0">
              <div className="mb-[42px]">
                <h3 className="text-[28px] md:text-4xl mb-[15px] md:mb-5 leading-[36px] font-light">
                  Thai Oil Massage
                </h3>
                <p className="text-xs sm:text-base leading-[26px] font-normal text-[#666666] mb-[15px] font-quattro text-justify">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <p className="text-xs sm:text-base leading-[26px] font-normal text-[#666666] mb-[15px] font-quattro text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="mb-[30px]">
                <h3 className="text-[#282828] text-xl md:text-[22px] leading-[36px] md:leading-[24px] mb-[15px] md:mb-5">
                  Benefits of Thai Oil Massage
                </h3>
                <ul className="list-disc list-outside pl-5">
                  <li className="font-quattro text-[#666666] text-xs sm:text-base mb-[10px]">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting.
                  </li>
                  <li className="font-quattro text-[#666666] text-xs sm:text-base mb-[10px]">
                    Lorem Ipsum is simply dummy text of the printing.
                  </li>
                  <li className="font-quattro text-[#666666] text-xs sm:text-base mb-[10px]">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#282828] text-lg sm:text-[22px] leading-[24px] italic font-muli mb-[15px] sm:mb-[30px]">
                  "An ancient healing therapy for body & mind."
                </h3>
                <p className="text-sm text-[#666666] sm:text-base mb-[5px] sm:mb-[10px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex gap-[10px] items-center mb-[30px]">
                  <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                    <Phone size={16} />
                  </div>
                  <span className="text-lg text-[#282828] font-quattro">0208 371 6922</span>
                </div>
                <div className="flex items-center text-[18px] font-mulish text-[#666666] tracking-wide mb-[37px]">
                  <div className="px-[10px]">
                    60 min:{" "}
                    <span className="font-semibold text-black mt-5 sm:mt-0">£60.00</span>
                  </div>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="px-[10px]">
                    90 min:{" "}
                    <span className="font-semibold text-black mt-5 sm:mt-0">£80.00</span>
                  </div>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="px-[10px]">
                    120 min:{" "}
                    <span className="font-semibold text-black mt-5 sm:mt-0">£100.00</span>
                  </div>
                </div>
                  <div className="flex gap-5 md:gap-10 flex-wrap justify-center">
                    <CommonButton>Book Now</CommonButton>
                    <CommonButton>Buy a Gift</CommonButton>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- */}
      <section className="bg-[#F6F6F6] py-[50px]">
        <div className="container mx-auto">
          <Faq items={faqData} title="Frequently Asked Questions" />
        </div>
      </section>

      {/* ----- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">
          <h3 className="text-[28px] sm:text-4xl mb-[50px] text-center font-mulish font-light">
            You might also like...
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {massageTreatmentsData[activeTab]
              .slice(0, 3) 
              .map((item, index) => (
                <MassageCard
                  key={index}
                  title={item.title}
                  image={item.image}
                  bgColor={CARD_COLORS[index % CARD_COLORS.length]}
                />
              ))}
          </div>

          {/* Browse all button */}
          <div className="flex justify-center">
            <CommonButton to="/treatments/massage">
              Browse All Treatments
            </CommonButton>
          </div>
        </div>
      </section>
    </>
  );
}

export default OilMassage;
