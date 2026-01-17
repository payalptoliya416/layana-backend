
import beauty_bg from "@/assets/beauty_bg.png";
import type { MassageTreatmentTabs } from "../tratementPages/massageTreatmentsData";
import { useState } from "react";
import { massageBeautyData, type MassageBeautyTabs } from "./massageBeautyData";
import MassageCard from "@/websiteComponent/common/home/MasssageCard";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";

const tabs: MassageTreatmentTabs[] = [
  "Skin",
  "Massage",
  // "Laser Hair Removal",
  // "Beauty",
];

const CARD_COLORS = [
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
];

function Beauty() {
      const [activeTab, setActiveTab] = useState<MassageBeautyTabs>("Beauty");
  return (
    <>
      <SimpleHeroBanner
        background={beauty_bg}
        title="Treatments"
        subtitle="Finchley Central"
      />
        <section className="pt-12 lg:pt-[110px]">
              <div className="container mx-auto">
                <div className="mb-10">
                  {/* Tabs */}
                  <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-14">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab;
      
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="group relative w-full sm:w-auto text-center py-4 sm:py-0"
                        >
                          {/* Label */}
                          <span
                            className={`block text-sm tracking-widest uppercase transition
                              ${
                                  isActive ? "text-black" : "text-[#666666] group-hover:text-black"
                              }
                              `}
                          >
                            {tab}
                          </span>
      
                          {/* Mobile divider */}
                          <span
                            className={`absolute left-0 bottom-0 w-full h-[1px] sm:hidden
                    ${isActive ? "bg-black" : "bg-gray-200"}
                  `}
                          />
      
                          {/* Desktop underline */}
                          {isActive && (
                            <span className="hidden sm:block absolute left-0 -bottom-[10px] w-full h-[2px] bg-black" />
                          )}
                        </button>
                      );
                    })}
                  </div>
      
                  {/* Desktop long baseline */}
                  <div className="hidden sm:block w-full h-[1px] bg-gray-200 mt-2" />
                </div>
      
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {massageBeautyData[activeTab].map((item, index) => (
                    <MassageCard key={index} title={item.title} image={item.image} bgColor={CARD_COLORS[index % CARD_COLORS.length]}   slug="" />
                  ))}
                </div>
              </div>
            </section>
    </>
  );
}

export default Beauty;
