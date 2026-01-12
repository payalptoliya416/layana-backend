import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import check from "@/assets/check.png";

/* ================= TYPES ================= */

interface PackageBranchProps {
  locations: number[];              // selected location ids
  onChange: (ids: number[]) => void;
}

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

/* ================= COMPONENT ================= */

const PackageBranch = forwardRef<
  { validate: () => Promise<ValidationResult> },
  PackageBranchProps
>(function PackageBranch({ locations: selectedLocations, onChange }, ref) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  /* ================= FETCH LOCATIONS ================= */

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  /* ================= VALIDATION ================= */
useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    const errors = [];

    if (!selectedLocations || selectedLocations.length === 0) {
      errors.push({
        section: "Branches",
        field: "branches",
        message: "Please select at least one branch",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));

/* ================= TOGGLE ================= */

  const toggleBranch = (id: number, status: string) => {
    if (status === "inactive") return;

    const updated = selectedLocations.includes(id)
      ? selectedLocations.filter((b) => b !== id)
      : [...selectedLocations, id];

    onChange(updated);
  };

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {locations.map((location) => {
          const isSelected = selectedLocations.includes(location.id);

          return (
            <div
              key={`location-${location.id}`}
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 border xl:border-0 p-2 xl:p-0 rounded-lg xl:rounded-none"
            >
              {/* LEFT CARD */}
              <button
                disabled={location.status === "inactive"}
                onClick={() =>
                  toggleBranch(location.id, location.status)
                }
                className={cn(
                  "flex w-full items-center gap-4 overflow-hidden rounded-[12px] border transition-all",
                  isSelected && location.status !== "inactive"
                    ? "border-primary"
                    : "border-border bg-card",
                  location.status === "inactive" &&
                    "cursor-not-allowed opacity-50 pointer-events-none"
                )}
              >
                {/* STRIP */}
                <div
                  className={cn(
                    "flex h-full w-[44px] items-center justify-center",
                    isSelected ? "bg-[#EBF2F3]" : "bg-muted"
                  )}
                >
                  <img
                    src={check}
                    alt=""
                    className={cn(
                      "h-5 w-5",
                      isSelected
                        ? "opacity-100"
                        : "opacity-30 grayscale",
                      location.status === "inactive" &&
                        "opacity-20 grayscale"
                    )}
                  />
                </div>

                {/* NAME */}
                <span
                  className={cn(
                    "py-4 text-base font-medium",
                    isSelected ? "text-primary" : "text-foreground",
                    location.status === "inactive" &&
                      "text-muted-foreground"
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
                <span className="rounded-md bg-muted py-2 px-3 text-sm">
                  {location.slug}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default PackageBranch;
