"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";
import { getLocations, Location } from "@/services/locationService";
import check from "@/assets/check.png";

/* ================= TYPES ================= */

interface PopupActiveBranchProps {
  selectedBranches: (number | string)[];
  onSelectionChange: (ids: (number | string)[]) => void;
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
  { selectedBranches, onSelectionChange },
  ref
) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

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

  /* ---------- VALIDATION ---------- */
 useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    const hasMainPage = selectedBranches.includes("H");

    // only numeric branch ids
    const branchIds = selectedBranches.filter(
      (id) => typeof id === "number"
    ) as number[];

    // check if any ACTIVE branch selected
    const hasActiveBranch = branchIds.some((id) => {
      const branch = locations.find((l) => l.id === id);
      return branch && branch.status !== "inactive";
    });

    if (hasActiveBranch || hasMainPage) {
      return {
        valid: true,
        errors: [],
      };
    }

    return {
      valid: false,
      errors: [
        {
          section: "Branches",
          field: "branches",
          message:
            "Please select at least one active branch",
        },
      ],
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

      {/* ================= MAIN PAGE CHECKBOX ================= */}
      {/* ================= MAIN PAGE (LIKE LOCATION CARD) ================= */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 border xl:border-0 p-2 xl:p-0 rounded-lg xl:rounded-none">
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
    <span className="text-sm text-muted-foreground">
     Location Slug:
    </span>

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
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 border xl:border-0 p-2 xl:p-0 rounded-lg xl:rounded-none"
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
