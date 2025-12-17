import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import check from "@/assets/check.png";
interface BranchListProps {
  selectedBranches: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const BranchList = forwardRef<
  { validate: () => boolean },
  BranchListProps
>(function BranchList(
  { selectedBranches, onSelectionChange },
  ref
) {
const [error, setError] = useState<string | null>(null);

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

useImperativeHandle(ref, () => ({
  validate() {
    if (selectedBranches.length === 0) {
      setError("Please select at least one branch");
      return false;
    }
    setError(null);
    return true;
  },
}));

const toggleBranch = (id: number) => {
  const updated = selectedBranches.includes(id)
    ? selectedBranches.filter((b) => b !== id)
    : [...selectedBranches, id];

  onSelectionChange(updated);

  if (updated.length > 0) {
    setError(null); // ✅ clear error when fixed
  }
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
  {/* Add Branch */}
  {/* <div className="flex justify-end">
  <button
    className="
      flex items-center gap-2
      rounded-full
      bg-primary
      px-5 py-2.5
      text-sm font-medium
      text-primary-foreground
      shadow-button
      hover:opacity-90
      transition
    "
  >
    <Plus className="h-4 w-4" />
    Add Branches
  </button>
</div>
 */}
{error && (
  <p className="text-sm text-destructive mt-2">
    {error}
  </p>
)}
  {/* List */}
  <div className="space-y-3">
    {locations.map((location) => {
    const isSelected = selectedBranches.includes(location.id);

      return (
         <div key={`location-${location.id}`} className="grid grid-cols-2 gap-4">
          {/* LEFT CARD */}
        <button
  onClick={() => toggleBranch(location.id)}
  className={cn(
    "flex w-full items-center gap-4 overflow-hidden rounded-[12px] border transition-all",
    isSelected
      ? "border-primary"
      : "border-border bg-card"
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
        isSelected ? "opacity-100" : "opacity-30 grayscale"
      )}
    />
  </div>

  {/* NAME */}
  <span
    className={cn(
      "py-4 text-base font-medium transition-colors ",
      isSelected ? "text-primary" : "text-foreground"
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
