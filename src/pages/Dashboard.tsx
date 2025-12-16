import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-[96px]" : "ml-[284px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-background px-6 pt-3">
          <PageHeader title="Dashboard" />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-3 overflow-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border/60 p-8 min-h-[500px]">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-lg">Dashboard content coming soon...</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-3">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
