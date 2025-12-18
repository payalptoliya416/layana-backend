import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
    <div className="bg-background flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-5",
          sidebarCollapsed ? "ml-[96px]" : "ml-[272px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-3 z-30 pb-3">
          <PageHeader title="Dashboard" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="bg-card rounded-2xl shadow-card border border-border/60 p-8 flex justify-center items-center  h-full">
            <div className="">
              <img src="/loader.png" alt="" className="max-w-[300px]" />
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
