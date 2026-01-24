import { useEffect, useState } from "react";

export default function PricingTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: (activeTab: string) => React.ReactNode;
}) {
  return (
    <>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center mb-10 mx-auto w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-3 text-sm lg:text-[17px] tracking-[2px] px-5 border-b ${
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
