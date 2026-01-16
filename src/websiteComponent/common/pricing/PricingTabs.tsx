import { useState } from "react";

const tabs = ["Massage", "Beauty"];

export default function PricingTabs({ children }: { children: any }) {
  const [activeTab, setActiveTab] = useState("Beauty");

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center border-b mb-10 mx-auto w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm lg:text-base tracking-wide px-5 ${
              activeTab === tab
                ? "border-b-2 border-black font-semibold"
                : "text-[#666666]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Content */}
      {children(activeTab)}
    </>
  );
}
