import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../PageHeader";

function MassageMembership() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <>
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

              <Sidebar
                collapsed={false}
                onToggle={() => setSidebarOpen(false)}
              />
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Sticky Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Categories"
              onMenuClick={() => setSidebarOpen(true)}
              onBack={() => navigate(-1)}
              showBack={true}
            />
          </div>

           {/* Content */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 overflow-hidden">
            <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
                <div className="">
                    
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MassageMembership;
