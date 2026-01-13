import { useCallback, useMemo, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../ui/button";
import { Footer } from "../layout/Footer";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import PriceNav from "./PriceNav";
import PricesGeneral from "./PricesGeneral";
import { PricesPrice } from "./PricesPrice";
import PackageBranch from "../spaPackages/PackageBranch";

/* ================= TYPES ================= */

type PricePayload = {
  general: {
    category: string;
    subCategory: string;
  };
  location: number[];        // 👈 selected branches
  pricing: any[];
};

function PricesIndex() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] =
    useState<"general" | "branches" | "pricing">("general");

  const generalRef = useRef<{ validate: () => Promise<any> }>(null);
  const branchRef = useRef<{ validate: () => Promise<any> }>(null);
  const pricingRef = useRef<{ validate: () => Promise<any> }>(null);

  const [saving, setSaving] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; field: string; message: string }[]
  >([]);

  /* ===== Payload ===== */
  const [payload, setPayload] = useState<PricePayload>({
    general: {
      category: "",
      subCategory: "",
    },
    location: [],
    pricing: [],
  });

  /* ===== All Branches (later API) ===== */
  const allBranches = useMemo(
    () => [
      { id: 1, name: "Main Branch" },
      { id: 2, name: "City Clinic" },
      { id: 3, name: "South Wing" },
    ],
    []
  );

  /* ===== Selected Branch Objects for pricing ===== */
  const selectedBranchObjects = useMemo(() => {
    return payload.location.map((id) => {
      const b = allBranches.find((x) => x.id === id);
      return { id, name: b?.name || "" };
    });
  }, [payload.location, allBranches]);

  const [showPricingGrid, setShowPricingGrid] = useState(true);
  const [selectedPricingBranch, setSelectedPricingBranch] =
    useState<number | null>(null);

  /* ================= Handlers ================= */

  const handleGeneralChange = useCallback((general) => {
    setPayload((prev) => ({
      ...prev,
      general,
    }));
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setValidationErrors([]);

    const refs = [generalRef, branchRef, pricingRef];

    const results = await Promise.all(
      refs.map(async (ref) => {
        if (!ref?.current?.validate) return { valid: true, errors: [] };
        const res = await ref.current.validate();
        return {
          valid: res?.valid !== false,
          errors: Array.isArray(res?.errors) ? res.errors : [],
        };
      })
    );

    const allErrors = results.flatMap((r) => r.errors);

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setShowValidationPopup(true);
      setSaving(false);
      return;
    }

    try {
      const finalPayload = {
        category: payload.general.category,
        sub_category: payload.general.subCategory,
        branches: payload.location,
        pricing: payload.pricing,
      };

      toast.success("Prices saved successfully");
    } catch {
      toast.error("Failed to save prices");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  const renderTabContent = () => {
    return (
      <>
        {/* GENERAL */}
        <div className={cn(activeSection !== "general" && "hidden")}>
          <PricesGeneral
            ref={generalRef}
            initialData={payload.general}
            onChange={handleGeneralChange}
          />
        </div>

        {/* BRANCH */}
        <div className={cn(activeSection !== "branches" && "hidden")}>
          <PackageBranch
            ref={branchRef}
            locations={payload.location}
            onChange={(ids) =>
              setPayload((prev) => ({
                ...prev,
                location: ids,
                pricing: prev.pricing.filter((p) =>
                  ids.includes(p.location_id)
                ),
              }))
            }
          />
        </div>

        {/* PRICING */}
        <div className={cn(activeSection !== "pricing" && "hidden")}>
          <PricesPrice
            ref={pricingRef}
            branches={selectedBranchObjects}
            showGrid={showPricingGrid}
            selectedBranchId={selectedPricingBranch}
            onSelectBranch={(id) => {
              setSelectedPricingBranch(id);
              setShowPricingGrid(false);
            }}
            initialData={payload.pricing}
            onChange={(pricing) =>
              setPayload((prev) => ({
                ...prev,
                pricing,
              }))
            }
          />
        </div>
      </>
    );
  };

  return (
    <>
      {/* VALIDATION POPUP */}
      {showValidationPopup && (
        <AlertDialog open onOpenChange={setShowValidationPopup}>
          <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Validation Errors</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="mt-4 space-y-2">
              {validationErrors.map((e, i) => (
                <div
                  key={i}
                  className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm"
                >
                  <strong>{e.section}</strong> → {e.message}
                </div>
              ))}
            </div>

            <AlertDialogFooter className="mt-6">
              <Button onClick={() => setShowValidationPopup(false)}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="bg-background flex">
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title={
                payload.general.category
                  ? `${payload.general.category}`
                  : "Pricing"
              }
              showBack={activeSection === "pricing" && !showPricingGrid}
              onBack={() => {
                setShowPricingGrid(true);
                setSelectedPricingBranch(null);
              }}
            />
          </div>
   <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
     <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
      <div className="lg:flex w-full gap-5 h-full overflow-y-auto">

            <aside className="w-[250px] border border-border p-4 rounded-[20px]">
              <PriceNav
                activeItem={activeSection}
                onItemChange={(s) => setActiveSection(s as any)}
              />
            </aside>
            <section className="flex-1 border border-border p-5 rounded-[20px] overflow-y-auto">
              {renderTabContent()}
            </section>
      </div>
             <div className="flex items-center justify-end gap-3 pt-4 absolute bottom-4 right-6">
                          <Button
                            type="button"
                            variant="cancel"
                            className="w-[105px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="save"
                            className="w-[105px] flex items-center justify-center gap-2"
                          >
                            {saving ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Saving
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
     </div>
   </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PricesIndex;