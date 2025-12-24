import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, LayoutDashboard, Users, Building2, UserCog, Settings, ChevronDown, Sparkles, ChartColumnStacked, MapPin, Bolt } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LayanLogo from "@/assets/LayanLogo.png";
import LayanLogoDark from "@/assets/LayanLogo-dark.png";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  children?: { label: string; href: string; active?: boolean }[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  // { icon: ChartColumnStacked, label: "Category", href: "/settings/category" },
  // { icon: MapPin, label: "Location", href: "/settings/location" },
  { icon: Users , label: "Treatments", href: "/treatments-list" },
  { icon: Bolt , label: "Bussiness Settings", href: "/settings" },
  // { icon: Users, label: "Team & Clients", children: [{ label: "Clients", href: "/clients" }, { label: "Staff", href: "/staff" }] },
  // { icon: Building2, label: "Operations", children: [{ label: "Schedule", href: "/schedule" }, { label: "Reports", href: "/reports" }] },
  // { icon: UserCog, label: "Team Management", children: [{ label: "Roles", href: "/roles" }, { label: "Permissions", href: "/permissions" }] },
  // { icon: Settings, label: "Business Settings", children: [{ label: "General", href: "/settings" }, { label: "Billing", href: "/billing" }] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
const [isDark, setIsDark] = useState(
  localStorage.getItem("theme") === "dark"
);
useEffect(() => {
  const updateTheme = () => {
    setIsDark(localStorage.getItem("theme") === "dark");
  };

  // custom event (same tab)
  window.addEventListener("theme-change", updateTheme);

  // storage event (fallback / other tabs)
  window.addEventListener("storage", updateTheme);

  return () => {
    window.removeEventListener("theme-change", updateTheme);
    window.removeEventListener("storage", updateTheme);
  };
}, []);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const isTreatmentsActive = location.pathname.includes('/treatments');

  const NavItemContent = ({ item }: { item: NavItem }) => {
    const isExpanded = expandedItems.includes(item.label);
   const isActive =
  item.href
    ? location.pathname === item.href ||
      location.pathname.startsWith(item.href + "/")
    : item.children?.some(child =>
        location.pathname === child.href ||
        location.pathname.startsWith(child.href + "/")
      );
    
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                if (item.href) {
                  navigate(item.href);
                } else if (item.children) {
                  toggleExpanded(item.label);
                }
              }}
              className={cn(
                "sidebar-nav-item w-full justify-center px-0",
                isActive && "sidebar-nav-item-active"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <>
        <button
          onClick={() => {
            if (item.href) {
              navigate(item.href);
            } else if (item.children) {
              toggleExpanded(item.label);
            }
          }}
          className={cn(
            "sidebar-nav-item w-full",
            isActive && "sidebar-nav-item-active"
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left whitespace-nowrap text-sm">{item.label}</span>
          {item.children && (
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </button>
        {item.children && isExpanded && (
          <div className="ml-8 mt-1 space-y-1 animate-fade-in">
            {item.children.map((child) => (
              <button
                key={child.label}
                onClick={() => navigate(child.href)}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
   <aside
  className={cn(
    "fixed left-0 top-0 ml-3 mt-3 index flex flex-col shrink-0",
    "h-[calc(95vh-24px)]", // 👈 full height minus margin
    "bg-sidebar rounded-[24px] shadow-sidebar transition-all duration-300",
    collapsed ? "w-[72px]" : "w-[260px]"
  )}
>
      {/* Logo Row with Collapse Toggle */}
      <div className="relative flex items-center h-[80px] px-4 pt-2 justify-center">
        {!collapsed ? (
          <div className="flex items-center">
            <img 
              src={isDark ? LayanLogoDark : LayanLogo}
              alt="Layana" 
              className="h-12 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="mx-auto">
            <img 
              src={isDark ? "/favicon-dark.png" : "/favicon.png"}
              alt="Layana" 
              className="h-8 w-auto object-contain"
            />
          </div>
        )}

        {/* Collapse Toggle Button - Aligned with logo row */}
        <button
          onClick={onToggle}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 w-7 h-7 rounded-full bg-card border border-border shadow-toggle flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft 
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              collapsed && "rotate-180"
            )} 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <div key={item.label}>
            <NavItemContent item={item} />
          </div>
        ))}
      <div className="">
        {/* {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="sidebar-nav-item w-full justify-center px-0">
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {selectedSpa}
            </TooltipContent>
          </Tooltip>
        ) : (
          <button className="sidebar-nav-item w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">
                {selectedSpa}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-sidebar-foreground" />
          </button>
        )} */}

        {/* Treatments - Active Item */}
        {/* <div className="mt-2">
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => navigate('/treatments-list')}
                  className={cn(
                    "sidebar-nav-item w-full justify-center px-0",
                    isTreatmentsActive && "sidebar-nav-item-active"
                  )}
                >
                  <Users className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Treatments
              </TooltipContent>
            </Tooltip>
          ) : (
            <button 
              onClick={() => navigate('/treatments-list')}
              className={cn(
                "sidebar-nav-item w-full",
                isTreatmentsActive && "sidebar-nav-item-active"
              )}
            >
              <Users className="w-5 h-5" />
              <span>Treatments</span>
            </button>
          )}
        </div> */}
      </div>
      </nav>

      {/* Spa Selector & Treatments */}
    </aside>
  );
}
