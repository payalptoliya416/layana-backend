import {
  Users,
  Clock,
  UserRound,
  ParkingCircle,
  PanelRight,
  Info,
  AppWindowMac,
  Search,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SecondaryNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const navItems: SecondaryNavItem[] = [
  { icon: UserRound, label: "General", id: "general" },
  { icon: Users, label: "Contact Details", id: "contact" },
  { icon: Clock, label: "Working Hours", id: "working" },
  { icon: ParkingCircle, label: "Parking Details", id: "parking" },
  { icon: Image , label: "Visuals", id: "visuals" },
  { icon: PanelRight , label: "Slider", id: "slider" },
  { icon: Info , label: "About", id: "about" },
  { icon: AppWindowMac , label: "Promo 3", id: "promo3" },
  { icon: Search, label: "SEO", id: "seo" },
];

interface SecondaryNavProps {
  activeItem: string;
  onItemChange: (id: string) => void;
}

export function LocationNav({ activeItem, onItemChange }: SecondaryNavProps) {
  return (
    <nav className="h-full w-full overflow-x-auto
      lg:overflow-visible px-4 scrollbar-hide ">
      {/* Outer Card */}
      <div
        className="bg-card lg:space-y-2   flex
      lg:flex-col w-full
      gap-2 width-scroll
      lg:gap-2  flex-nowrap 
      py-2 after:content-[''] after:w-2 after:flex-shrink-0"
      >
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-2 sm:px-5 py-2 lg:py-4 rounded-md lg:rounded-[16px] text-sm transition-all whitespace-nowrap",
                isActive
                  ? `
        bg-card
        border border-primary
        text-primary  font-medium
         greenshadow
      `
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary " : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
