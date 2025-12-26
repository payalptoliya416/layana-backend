import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getLocations, Location } from "@/services/locationService";
interface Branch {
  id: number;
  name: string;
}

interface BranchSelectorProps {
  branches: Branch[];        // ✅ ADD THIS
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function BranchSelector({
  branches,
  selectedId,
  onSelect,
}: BranchSelectorProps) {
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
    return loc?.status !== "inactive";
  });

  return (
    <> 
    {activeBranches.length > 0 && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
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
                "rounded-[10px] border px-6 py-5 text-left text-xl leading-[20px] font-medium transition-all bg-card  text-foreground",
                active
                  ? "border-primary  shadow-[0_0_0_1px_hsl(var(--primary))]"
                  : "border-border   hover:border-primary/40"
              )}
            >
              {location.name}
            </button>
          );
        })}
      </div>
    )}
    </>
  );
}
