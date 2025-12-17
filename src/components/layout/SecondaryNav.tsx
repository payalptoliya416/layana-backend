import { Users, MapPin, Image, Star, Search, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecondaryNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const navItems: SecondaryNavItem[] = [
  { icon: Users, label: "General", id: "general" },
  { icon: MapPin, label: "Active Branches", id: "branches" },
  { icon: Image, label: "Visuals", id: "visuals" },
  { icon: Banknote, label: "Pricing", id: "pricing" },
  { icon: Star, label: "Benefits & FAQ's", id: "benefits" },
  { icon: Search, label: "SEO", id: "seo" },
];

interface SecondaryNavProps {
  activeItem: string;
  onItemChange: (id: string) => void;
}

export function SecondaryNav({ activeItem, onItemChange }: SecondaryNavProps) {
  return (
    <nav className="h-full">
      {/* Outer Card */}
      <div className="bg-card space-y-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-5 py-4 rounded-[16px] text-sm transition-all",
                isActive
                  ? `
        bg-card
        border border-primary
        text-primary  font-medium
         shadow-[0_6px_20px_hsl(var(--foreground)/0.05),inset_8px_8px_30px_hsl(var(--primary)/0.15)]
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
