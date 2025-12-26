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
}

export default function BranchGrid({
  branches,
  selectedId,
  onSelect,
}: BranchGridProps) {

const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("locations",locations)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
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
const activeBranches = branches.filter((branch) => {
  const loc = locations.find((l) => l.id === branch.id);
  return loc?.status !== "inactive";
});
  return (
    <>
    {
      activeBranches.length !== 0 && 
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
              "w-full rounded-lg border py-5 xl:py-[25px] px-5 text-left text-xl font-medium bg-card text-foreground transition",
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
    }
    </>
  );
}
