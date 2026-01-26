"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import check from "@/assets/check.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTreatments } from "@/services/treatmentService";
import { getTableCount } from "@/services/getTeam";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

/* ================= TYPES ================= */

interface PopupActiveBranchProps {
  selectedBranches: (number | string)[];
  onSelectionChange: (ids: (number | string)[]) => void;
  treatmentIds: number[];
  onTreatmentChange: (ids: number[]) => void;
}

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

/* ================= COMPONENT ================= */

const PopupActiveBranch = forwardRef<
  { validate: () => Promise<ValidationResult> },
  PopupActiveBranchProps
>(function PopupActiveBranch(
  {
    selectedBranches,
    onSelectionChange,
    treatmentIds,        // ✅ ADD
    onTreatmentChange,   // ✅ ADD
  },
  ref
) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState<{ id: number; name: string }[]>(
    []
  );
  /* ---------- FETCH LOCATIONS ---------- */
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

  useEffect(() => {
  const loadTreatments = async () => {
    try {
      const totalCount = await getTableCount("treatements");
      const data = await getAllTreatments(totalCount);
      setTreatments(
  data
    .filter((t) => t.status === "live")
    .map((t) => ({
      id: t.id,
      name: t.name,
    }))
);
    } catch (e) {
      console.error("Failed to load treatments");
    }
  };

  loadTreatments();
}, []);


  /* ---------- VALIDATION ---------- */
  useImperativeHandle(ref, () => ({
    async validate(): Promise<ValidationResult> {
      // ❌ treatment is OPTIONAL → no check needed

      const hasMainPage = selectedBranches.includes("H");

      const branchIds = selectedBranches.filter(
        (id) => typeof id === "number"
      ) as number[];

      const hasActiveBranch = branchIds.some((id) => {
        const branch = locations.find((l) => l.id === id);
        return branch && branch.status !== "inactive";
      });

      // ✅ AT LEAST ONE LOCATION REQUIRED
      if (!hasMainPage && !hasActiveBranch) {
        return {
          valid: false,
          errors: [
            {
              section: "Branches",
              field: "location_ids",
              message:
                "Please select at least one location",
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

  /* ---------- TOGGLE BRANCH ---------- */
  const toggleBranch = (location: Location) => {
    if (location.status === "inactive") return;

    const updated = selectedBranches.includes(location.id)
      ? selectedBranches.filter((b) => b !== location.id)
      : [...selectedBranches, location.id];

    onSelectionChange(updated);
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-3">
      {/* ================= TREATMENT SELECT ================= */}
   <div className="grid grid-cols-12 gap-5">
    <div className="col-span-12 xl:col-span-6">
      <label className="text-sm font-medium">
        Treatments <sup className="text-destructive">*</sup>
      </label>
      <Popover>
  <PopoverTrigger asChild>
    <button className="form-input flex justify-between items-center">
      <span className="text-left">
        {treatmentIds.length > 0
          ? `${treatmentIds.length} treatment selected`
          : "Select treatments"}
      </span>
      <span className="text-muted-foreground">▼</span>
    </button>
  </PopoverTrigger>
<PopoverContent
  align="start"
  className="w-[var(--radix-popover-trigger-width)] p-2 max-h-[260px] overflow-y-auto"
>
  {treatments.length === 0 ? (
    /* ===== EMPTY STATE ===== */
    <div className="px-3 py-2 text-center text-sm text-muted-foreground">
      No active treatments found
    </div>
  ) : (
    treatments.map((t) => {
      const checked = treatmentIds.includes(t.id);

      return (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            const updated = checked
              ? treatmentIds.filter((x) => x !== t.id)
              : [...treatmentIds, t.id];

            onTreatmentChange(updated);
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-1",
            checked
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted"
          )}
        >
          {/* CUSTOM CHECKBOX */}
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border",
              checked
                ? "bg-primary border-primary text-white"
                : "border-muted-foreground"
            )}
          >
            {checked && <Check size={12} />}
          </span>

          <span className="flex-1 text-left">{t.name}</span>
        </button>
      );
    })
  )}
</PopoverContent>

</Popover>

    </div>
   </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 border xl:border-0 p-2 xl:p-0 rounded-lg xl:rounded-none">
        {/* LEFT CARD */}
        <button
          onClick={() => {
            const updated = selectedBranches.includes("H")
              ? selectedBranches.filter((id) => id !== "H")
              : [...selectedBranches, "H"];

            onSelectionChange(updated);
          }}
          className={cn(
            "flex w-full items-center gap-4 overflow-hidden rounded-[12px] border transition-all",
            selectedBranches.includes("H")
              ? "border-primary"
              : "border-border bg-card"
          )}
        >
          {/* LEFT STRIP */}
          <div
            className={cn(
              "flex h-full w-[44px] items-center justify-center transition-colors",
              selectedBranches.includes("H") ? "bg-[#EBF2F3]" : "bg-muted"
            )}
          >
            <img
              src={check}
              alt=""
              className={cn(
                "h-5 w-5 transition-opacity",
                selectedBranches.includes("H")
                  ? "opacity-100"
                  : "opacity-30 grayscale"
              )}
            />
          </div>

          {/* NAME */}
          <span
            className={cn(
              "py-4 text-base font-medium",
              selectedBranches.includes("H")
                ? "text-primary"
                : "text-foreground"
            )}
          >
            Main Page
          </span>
        </button>

        {/* RIGHT CARD */}
        <div className="flex items-center gap-[10px] rounded-[10px] border border-border bg-card py-[13px] px-[15px]">
          <span className="text-sm text-muted-foreground">Location Slug:</span>

          <span className="rounded-md bg-muted py-2 px-3 text-sm text-foreground">
            Home
          </span>
        </div>
      </div>

      {/* ================= BRANCH LIST ================= */}
      <div className="space-y-3">
        {locations.map((location) => {
          const isSelected = selectedBranches.includes(location.id);

          return (
            <div
              key={`location-${location.id}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 border xl:border-0 p-2 xl:p-0 rounded-lg xl:rounded-none"
            >
              {/* LEFT CARD */}
              <button
                disabled={location.status === "inactive"}
                onClick={() => toggleBranch(location)}
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
                  <img
                    src={check}
                    alt=""
                    className={cn(
                      "h-5 w-5 transition-opacity",
                      isSelected ? "opacity-100" : "opacity-30 grayscale",
                      location.status === "inactive" && "opacity-20 grayscale"
                    )}
                  />
                </div>

                {/* NAME */}
                <span
                  className={cn(
                    "py-4 text-base font-medium",
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
});

PopupActiveBranch.displayName = "PopupActiveBranch";
export default PopupActiveBranch;
