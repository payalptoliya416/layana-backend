import { useState } from "react";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../PageHeader";
import {
  Building2,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function BussinessSetting() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();
const items = [
  {
    title: "Categories",
    icon: Building2,
    gradient: "from-[#14878E]/10 to-transparent",
    iconBg: "#14878E",
    path: "/settings/category",
  },
  {
    title: "Location",
    icon: MapPin,
    gradient: "from-[#EF4444]/10 to-transparent",
    iconBg: "#EF4444",
    path: "/settings/location",
  },
];

  return (
    <div className="bg-background flex">
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      {/* MOBILE */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <>
            {/* overlay */}
            <div
              className="fixed inset-0 bg-black/40 index-11"
              onClick={() => setSidebarOpen(false)}
            />

            <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
          </>
        )}
      </div>
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-3 z-10 pb-3">
          <PageHeader
            title="Business Settings"
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>
        <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-[12px] shadow-card p-5 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="
                  relative
                  rounded-[28px]
                  border
                  border-[#EEF2F3] dark:border-[#1E293B]
                  bg-white dark:bg-[#0F172A]
                  px-[25px]
                  py-[35px]
                  cursor-pointer
                  transition
                  hover:shadow-lg
                  dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                "
              >
                {/* INNER GLOW */}
                <div
                  className={`
                    pointer-events-none
                    absolute
                    inset-2
                    rounded-[24px]
                    bg-gradient-to-br
                    ${item.gradient}
                  `}
                />

                {/* CONTENT */}
                <div className="relative z-10 flex flex-col justify-center items-center">
                  {/* ICON */}
                  <div
                    className="
                      h-[36px]
                      w-[36px]
                      rounded-[12px]
                      flex
                      items-center
                      justify-center
                      mb-[15px]
                    "
                    style={{
                      backgroundColor: item.iconBg,
                      boxShadow: `0px 16px 32px ${item.iconBg}55`,
                    }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>

                  {/* TITLE */}
                  <p className="text-base font-bold text-[#414347] dark:text-[#E5E7EB]">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BussinessSetting;
