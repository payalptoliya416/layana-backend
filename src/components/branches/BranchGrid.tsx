import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
}

interface BranchGridProps {
  branches: Branch[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  priceCount?: Record<number, number>;
}

export default function BranchGrid({
  branches,
  selectedId,
  onSelect,
  priceCount,
}: BranchGridProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, []);

  const activeBranches = branches.filter((branch) => {
    const loc = locations.find((l) => l.id === branch.id);
    return loc?.status !== "draft";
  });
  if (activeBranches.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No active branches available
      </div>
    );
  }
  return (
    <>
      {activeBranches.length !== 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {activeBranches.map((branch) => {
            const active = selectedId === branch.id;
            const location = locations.find((l) => l.id === branch.id);

            if (!location) return null;
            const count = priceCount?.[branch.id] ?? 0;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => onSelect(branch.id)}
                className={cn(
                  "w-full rounded-lg border py-5 xl:py-[25px] px-5 text-left text-sm sm:text-xl font-medium bg-card text-foreground transition",
                  active
                    ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
                    : "border-border hover:border-muted-foreground/40",
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{location.name}</span>

                  {/* ✅ Show only if count > 0 */}
                  {count > 0 && (
                    <span className="text-sm text-muted-foreground border w-8 h-8 rounded-full flex justify-center items-center">
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
