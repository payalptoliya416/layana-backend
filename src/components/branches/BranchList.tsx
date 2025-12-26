import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import check from "@/assets/check.png";


interface BranchListProps {
  selectedBranches: number[];
  onSelectionChange: (ids: number[]) => void;
  category: string;
   onBack?: () => void;
}

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};
export const BranchList = forwardRef<
  { validate: () => Promise<ValidationResult> },
  BranchListProps
>(function BranchList(
  { selectedBranches, onSelectionChange ,category},
  ref
) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  
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

// useImperativeHandle(ref, () => ({
//   async validate(): Promise<ValidationResult> {
//     if (!selectedBranches || selectedBranches.length === 0) {
//       return {
//         valid: false,
//         errors: [
//           {
//             section: "Branches",
//             field: "branches",
//             message: "Please select at least one branch",
//           },
//         ],
//       };
//     }

//     return {
//       valid: true,
//       errors: [],
//     };
//   },
// }));
useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    if (!selectedBranches || selectedBranches.length === 0) {
      return {
        valid: false,
        errors: [
          {
            section: "Branches",
            field: "branches",
            message: "Please select at least one branch",
          },
        ],
      };
    }

    // ✅ check if at least one ACTIVE branch is selected
    const hasActiveBranch = selectedBranches.some((id) => {
      const branch = locations.find((l) => l.id === id);
      return branch && branch.status !== "inactive";
    });

    if (!hasActiveBranch) {
      return {
        valid: false,
        errors: [
          {
            section: "Branches",
            field: "branches",
            message: "Please select an active branch with pricing.",
          },
        ],
      };
    }

    return {
      valid: true,
      errors: [],
    };
  },
}));

const toggleBranch = (id: number) => {
   if (status === "inactive") return; 
   
  const updated = selectedBranches.includes(id)
    ? selectedBranches.filter((b) => b !== id)
    : [...selectedBranches, id];

  onSelectionChange(updated);

  // if (updated.length > 0) {
  //   setError(null); // ✅ clear error when fixed
  // }
};

  if (loading) {
    return (
     <div className="flex justify-center py-10">
  <div
    className="
      h-6 w-6 animate-spin rounded-full
      border-2 border-primary
      border-t-transparent
    "
  />
</div>
    );
  }

  return (
    <div className="space-y-4">

  {/* List */}
  <div className="space-y-3">
    {locations.map((location) => {
    const isSelected = selectedBranches.includes(location.id);
      return (
         <div key={`location-${location.id}`} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* LEFT CARD */}
        <button
         disabled={location.status === "inactive"}
  onClick={() => toggleBranch(location.id)}
  className={cn(
    "flex w-full items-center gap-4 overflow-hidden rounded-[12px] border transition-all",
     isSelected && location.status !== "inactive"
      ? "border-primary"
      : "border-border bg-card",
       location.status === "inactive" &&
      "cursor-not-allowed opacity-50 pointer-events-none"
  )}
>
  {/* LEFT STRIP */}
  <div
    className={cn(
      "flex h-full w-[44px] items-center justify-center transition-colors",
      isSelected ? "bg-[#EBF2F3]" : "bg-muted"
    )}
  >
    {/* CHECK ICON */}
    <img
      src={check}
      alt=""
      className={cn(
        "h-5 w-5 transition-opacity ",
        isSelected ? "opacity-100" : "opacity-30 grayscale",
         location.status === "inactive" && "opacity-20 grayscale"
      )}
    />
  </div>

  {/* NAME */}
  <span
    className={cn(
      "py-4 text-base font-medium transition-colors ",
      isSelected ? "text-primary" : "text-foreground",
      location.status === "inactive" && "text-muted-foreground"
    )}
  >
    {location.name}
  </span>
        </button>

          {/* RIGHT CARD */}
         <div className="flex items-center gap-[10px] rounded-[10px] border border-border bg-card py-[13px] px-[15px]">
  <span className="text-sm text-muted-foreground">
    Location Slug:
  </span>

  <span className="rounded-md bg-muted py-2 px-3 text-sm text-foreground">
    {location.slug}
  </span>
</div>
        </div>
      );
    })}
  </div>
</div>

  );
})
