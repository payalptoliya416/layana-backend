import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
    <div className="bg-background flex">
      {/* Sidebar */}
    
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
        <PageHeader title="Treatments"   onMenuClick={() => setSidebarOpen(true)}/>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="bg-card rounded-2xl shadow-card border border-border/60 p-8 flex justify-center items-center  h-full">
            <div className="">
              <img src="/loader.png" alt="" className="max-w-[220px] lg:max-w-[300px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
          <Footer/>
    </>
    
  );
};

export default Dashboard;
