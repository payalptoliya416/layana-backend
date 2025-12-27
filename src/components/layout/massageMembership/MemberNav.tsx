import {
  Users,
  Clock,
  UserRound,
  ParkingCircle,
  Image,
  MapPin,
  PoundSterling,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SecondaryNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const navItems: SecondaryNavItem[] = [
  { icon: Users, label: "General", id: "general" },
  { icon: MapPin, label: "Active Branches", id: "branches" },
  { icon: PoundSterling, label: "Pricing", id: "pricing" },
  { icon: Star, label: "Benefits & FAQ's", id: "benefits" },
];

interface SecondaryNavProps {
  activeItem: string;
  onItemChange: (id: string) => void;
}

export function MemberNav({ activeItem, onItemChange }: SecondaryNavProps) {
  return (
    <nav
      className="h-full w-full overflow-x-auto
      lg:overflow-visible
      scrollbar-hide "
    >
      {/* Outer Card */}
      <div
        className="bg-card space-y-2   flex
      lg:flex-col w-full
      gap-2
      lg:gap-2  flex-wrap justify-center
      py-2"
      >
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-5 py-2 lg:py-4 rounded-md lg:rounded-[16px] text-sm transition-all whitespace-nowrap",
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
