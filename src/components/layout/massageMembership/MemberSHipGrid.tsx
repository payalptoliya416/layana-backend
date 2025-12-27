import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */

interface Branch {
  id: number;
  name: string;
}

interface MemberShipGridProps {
  branches: Branch[];          // allowed branches (ids + names)
  selectedId: number | null;   // selected branch id
  onSelect: (id: number) => void;
}

/* ================= COMPONENT ================= */

function MemberSHipGrid({
  branches,
  selectedId,
  onSelect,
}: MemberShipGridProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD LOCATIONS ---------- */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  /* ---------- FILTER ACTIVE ---------- */
  const activeBranches = branches.filter((branch) => {
    const loc = locations.find((l) => l.id === branch.id);
    return loc && loc.status !== "inactive";
  });

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (activeBranches.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No active branches available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {activeBranches.map((branch) => {
        const active = selectedId === branch.id;
        const location = locations.find((l) => l.id === branch.id);
        if (!location) return null;

        return (
          <button
            key={branch.id}
            type="button"
            onClick={() => onSelect(branch.id)}
            className={cn(
              "w-full rounded-lg border py-5 xl:py-[25px] px-5 text-left text-lg font-medium bg-card text-foreground transition",
              active
                ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
                : "border-border hover:border-muted-foreground/40"
            )}
          >
            {location.name}
          </button>
        );
      })}
    </div>
  );
}

export default MemberSHipGrid;
