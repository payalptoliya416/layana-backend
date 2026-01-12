import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  ChevronDown,
  Sparkles,
  Bolt,
  UserCheck,
  Package,
  House,
} from "lucide-react";
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
  { icon: House, label: "Home", href: "/home" },
  { icon: Sparkles, label: "Treatments", href: "/treatments-list" },
  { icon: Package, label: "Spa Packages", href: "/packages-list" },
  { icon: Users, label: "Team", href: "/team" },
  {
    icon: UserCheck,
    label: "Memberships",
    children: [
      {
        label: "Memberships",
        href: "/massage-membership",
      },
      {
        label: "FAQ's",
        href: "/membership-faqs",
      },
    ],
  },
  { icon: Package, label: "Popup", href: "/popup" },
  { icon: Bolt, label: "Bussiness Settings", href: "/settings" },
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

useEffect(() => {
  navItems.forEach((item) => {
    if (
      item.children?.some((child) =>
        location.pathname.startsWith(child.href)
      )
    ) {
      setExpandedItems((prev) =>
        prev.includes(item.label) ? prev : [...prev, item.label]
      );
    }
  });
}, [location.pathname]);

const NavItemContent = ({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) => {
const isExpanded =
  expandedItems.includes(item.label) ||
  (item.children?.some(child =>
    location.pathname.startsWith(child.href)
  ) ?? false);

  const isActive = item.href
    ? location.pathname === item.href ||
      location.pathname.startsWith(item.href + "/")
    : isExpanded;

  return (
    <>
  <div className="relative">
  <button
    // onClick={() => {
    //   if (item.children) {
    //     setExpandedItems((prev) =>
    //       prev.includes(item.label)
    //         ? prev.filter((i) => i !== item.label)
    //         : [...prev, item.label]
    //     );
    //   } else if (item.href) {
    //     navigate(item.href);
    //   }
    // }}
    onClick={() => {
  // ✅ If sidebar is collapsed & item has submenu → just expand sidebar
  if (collapsed && item.children) {
    onToggle(); // collapsed = false
    return;
  }

  // ✅ Normal behaviour when expanded
  if (item.children) {
    setExpandedItems((prev) =>
      prev.includes(item.label)
        ? prev.filter((i) => i !== item.label)
        : [...prev, item.label]
    );
  } else if (item.href) {
    navigate(item.href);
  }
}}
    className={cn(
      "sidebar-nav-item w-full flex items-center gap-3",
      isActive && "sidebar-nav-item-active",
      collapsed && "justify-center"
    )}
  >
    {/* ICON */}
    {collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <item.icon className="w-5 h-5" />
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      </Tooltip>
    ) : (
      <item.icon className="w-5 h-5" />
    )}

    {/* LABEL */}
    {!collapsed && (
      <span className="flex-1 text-left text-sm">
        {item.label}
      </span>
    )}

    {/* ARROW */}
    {!collapsed && item.children && (
      <ChevronDown
        className={cn(
          "w-4 h-4 transition-transform",
          isExpanded && "rotate-180"
        )}
      />
    )}
  </button>

  {/* ✅ COLLAPSED → FLYOUT SUBMENU */}
  {/* {!collapsed && item.children && isExpanded && (
    <div className="absolute left-full top-0 ml-2 w-44 rounded-xl bg-sidebar shadow-lg p-1 z-50">
      {item.children.map((child) => {
        const isChildActive =
          location.pathname === child.href ||
          location.pathname.startsWith(child.href + "/");

        return (
          <button
            key={child.label}
            onClick={() => navigate(child.href)}
            className={cn(
              "block w-full text-left px-3 py-2 rounded-lg text-sm",
              isChildActive
                ? "bg-sidebar-accent font-medium"
                : "hover:bg-sidebar-accent"
            )}
          >
            {child.label}
          </button>
        );
      })}
    </div>
  )} */}

  {/* ✅ EXPANDED → NORMAL SUBMENU */}
  {!collapsed && item.children && isExpanded && (
    <div className="ml-8 mt-1 space-y-1">
      {item.children.map((child) => {
        const isChildActive =
          location.pathname === child.href ||
          location.pathname.startsWith(child.href + "/");

        return (
          <button
            key={child.label}
            onClick={() => navigate(child.href)}
            className={cn(
              "block w-full text-left px-4 py-2 rounded-lg text-sm",
              isChildActive
                ? "bg-sidebar-accent font-medium"
                : "hover:bg-sidebar-accent"
            )}
          >
            {child.label}
          </button>
        );
      })}
    </div>
  )}
</div>
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
             <NavItemContent item={item} collapsed={collapsed} />
          </div>
        ))}
        <div className=""></div>
      </nav>
    </aside>
  );
}
