import React from "react";
import { Users, MapPin, Image, PoundSterling } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const packageNavItems: PackageNavItem[] = [
  { icon: Users, label: "General", id: "general" },
  { icon: MapPin, label: "Active Branches", id: "branches" },
  { icon: Image, label: "Visual", id: "visual" },
  { icon: PoundSterling, label: "Price", id: "pricing" },
];

interface PackageNavProps {
  activeItem: string;
  onItemChange: (id: string) => void;
}

const PackageNav: React.FC<PackageNavProps> = ({
  activeItem,
  onItemChange,
}) => {
  return (
    <nav
      className="
        h-full w-full overflow-x-auto
        lg:overflow-visible px-4
        scrollbar-hide
      "
    >
      <div
        className="
          bg-card flex lg:flex-col
          gap-2 lg:gap-2
          w-full width-scroll
          py-2 after:content-[''] after:w-2 after:flex-shrink-0 
        "
      >
        {packageNavItems.map((item) => {
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
                    text-primary font-medium
                    greenshadow
                  `
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default PackageNav;
