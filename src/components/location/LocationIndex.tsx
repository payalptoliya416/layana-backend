import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { LocationNav } from "./LocationNav";
import LocationGeneral from "./LocationGeneral";

function LocationIndex() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const renderTabContent = () => {
    return (
      <>
        {/* GENERAL */}
        <div className={cn(activeSection !== "general" && "hidden")}>
          <LocationGeneral />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-background flex overflow-hidden">
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

              <Sidebar
                collapsed={false}
                onToggle={() => setSidebarOpen(false)}
              />
            </>
          )}
        </div>
        <div
          className={cn(
            "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Sticky Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Category"
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
            <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
              <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <LocationNav
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                </aside>

                 <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-3 lg:p-5 rounded-[20px] scrollbar-thin h-full">
                  {renderTabContent()}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationIndex;
