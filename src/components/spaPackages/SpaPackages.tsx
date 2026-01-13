import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import PackageNav from "./PackageNav";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import PackageVisuals from "./PackageVisuals";
import PackageBranch from "./PackageBranch";
import { PackagePricing } from "./PackagePricing";
import { SpaPackagePayload } from "@/services/spapackage";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { PackageGeneral } from "./PackageGeneral";
import { useParams } from "react-router-dom";
import {
  createSpaPackage,
  getSpaPackageById,
  updateSpaPackage,
} from "@/services/spaPackageService";
import { Footer } from "../layout/Footer";

function SpaPackages() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [selectedSeoBranch, setSelectedSeoBranch] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const [showPricingGrid, setShowPricingGrid] = useState(true);
  const [selectedPricingBranch, setSelectedPricingBranch] = useState<
    number | null
  >(null);
  const [saving, setSaving] = useState(false);

  const generalRef = useRef<{ validate: () => Promise<any> }>(null);
  const branchRef = useRef<{ validate: () => Promise<any> }>(null);
  const visualsRef = useRef<{ validate: () => Promise<any> }>(null);
  const pricingRef = useRef<{ validate: () => Promise<any> }>(null);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [packagePayload, setPackagePayload] = useState<SpaPackagePayload>({
    general: {
      name: "",
      slogan: "",
      description: "",
      status: "draft",
    },
    location: [],
    visuals: {
      btn_text: "",
      btn_link: "",
      image: "",
    },
    pricing: [],
  });
  const [allLocations, setAllLocations] = useState<
    { id: number; name: string }[]
  >([]);
  const selectedBranchObjects = useMemo(() => {
    return packagePayload.location.map((id) => {
      const loc = allLocations.find((l) => l.id === id);
      return {
        id,
        name: loc?.name || "",
      };
    });
  }, [packagePayload.location, allLocations]);

  const handleSectionChange = (section: string) => {
    if (section === "pricing") {
      setShowPricingGrid(true); // ✅ force grid
      setSelectedPricingBranch(null);
    }

    if (activeSection === "seo" && section !== "seo") {
      setSelectedSeoBranch(null);
    }

    setActiveSection(section);
  };
  const handleCancle = () => {
    navigate("/packages-list");
  };
  const [validationErrors, setValidationErrors] = useState<
    { section: string; field: string; message: string }[]
  >([]);
useEffect(() => {
  if (!isEdit || !id) return;

  const fetchPackage = async () => {
    try {
      const data = await getSpaPackageById(Number(id));
      setPackagePayload({
        general: {
          name: data.name || "",
          slogan: data.slogan || "",
          description: data.description || "",
          status: data.status || "draft",
        },
        location: data.location_ids || [],
        visuals: {
          btn_text: data.visuals?.btn_text || "",
          btn_link: data.visuals?.btn_link || "",
          image: data.visuals?.image || "",
        },
        pricing: (data.pricing || []).map((p: any) => ({
          location_id: p.location_id,
          duration: String(p.duration),
          price: String(p.price),
          is_bold: Boolean(p.is_bold),
        })),
      });
    } catch (e) {
      toast.error("Failed to load spa package");
    }
  };

  fetchPackage();
}, [id, isEdit]);

  const handleSavePackage = async () => {
    if (saving) return;
    setSaving(true);
    setValidationErrors([]);

    const isDraft = packagePayload.general.status === "draft";

    const validators = [
      generalRef,
      ...(isDraft ? [] : [generalRef, branchRef, pricingRef, visualsRef]),
    ];

    const results = await Promise.all(
      validators.map(async (ref) => {
        if (!ref?.current?.validate) {
          return { valid: true, errors: [] };
        }

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
      /** ✅ FINAL API PAYLOAD (Backend match) */
      const payload = {
        ...(isEdit ? { id: Number(id) } : {}),
        general: {
          name: packagePayload.general.name,
          slogan: packagePayload.general.slogan,
          description: packagePayload.general.description,
          status: packagePayload.general.status,
        },
        location: packagePayload.location,
        visuals: packagePayload.visuals,
        pricing: packagePayload.pricing.map((p, index) => ({
          location_id: p.location_id,
          duration: Number(p.duration),
          price: Number(p.price),
          is_bold: Boolean(p.is_bold),
          index: index + 1,
        })),
      };


      const res = isEdit
        ? await updateSpaPackage(payload)
        : await createSpaPackage(payload);

      if (res?.status === "success") {
        toast.success(res.message || "Saved successfully");
        navigate("/packages-list");
      } else {
        toast.error(res?.message || "Failed to save package");
      }
    } catch (err: any) {
  const apiErrors = err?.response?.data?.errors;

  if (apiErrors && typeof apiErrors === "object") {
    const formattedErrors = Object.entries(apiErrors).flatMap(
      ([key, messages]: any) => {
        const [section, field] = key.split(".");

        return messages.map((msg: string) => ({
          section:
            section === "visuals"
              ? "Visuals"
              : section === "general"
              ? "General"
              : section === "pricing"
              ? "Pricing"
              : section,
          field,
          message: msg,
        }));
      }
    );

    setValidationErrors(formattedErrors);
    setShowValidationPopup(true);
  } else {
    toast.error("Something went wrong");
  }
} finally {
  setSaving(false);
}
  };

  const handleGeneralChange = useCallback((general) => {
    setPackagePayload((prev) => ({
      ...prev,
      general,
    }));
  }, []);
  const renderTabContent = () => {
    return (
      <>
        {/* GENERAL */}
        <div className={cn(activeSection !== "general" && "hidden")}>
          <PackageGeneral
            ref={generalRef}
            initialData={packagePayload.general}
            onChange={handleGeneralChange}
          />
        </div>

        {/* BRANCHES */}
        <div className={cn(activeSection !== "branches" && "hidden")}>
          <PackageBranch
            ref={branchRef}
            locations={packagePayload.location}
            onChange={(ids) =>
              setPackagePayload((prev) => ({
                ...prev,
                location: ids,
                pricing: prev.pricing.filter((p) =>
                  ids.includes(p.location_id)
                ),
              }))
            }
          />
        </div>

        {/* VISUALS */}
        <div className={cn(activeSection !== "visual" && "hidden")}>
          <PackageVisuals
            ref={visualsRef}
            status={packagePayload.general.status} // 👈 ADD THIS
            initialData={packagePayload.visuals}
            onChange={(visuals) =>
              setPackagePayload((prev) => ({
                ...prev,
                visuals,
              }))
            }
          />
        </div>

        {/* PRICING */}
        <div className={cn(activeSection !== "pricing" && "hidden")}>
          <PackagePricing
            ref={pricingRef}
            branches={selectedBranchObjects}
            showGrid={showPricingGrid}
            selectedBranchId={selectedPricingBranch}
            onSelectBranch={(id) => {
              setSelectedPricingBranch(id);
              setShowPricingGrid(false);
            }}
            initialData={packagePayload.pricing}
            onChange={(pricing) =>
              setPackagePayload((prev) => ({
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
      {showValidationPopup && (
        <AlertDialog open onOpenChange={setShowValidationPopup}>
          <AlertDialogContent className="max-w-[520px] rounded-2xl p-6 scrollbar-thin">
            {/* HEADER */}
            <AlertDialogHeader className="pb-3 border-b border-border">
              <AlertDialogTitle className="text-lg font-semibold text-foreground">
                Please fix the following validation
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                Some required fields are missing or invalid
              </p>
            </AlertDialogHeader>

            {/* BODY */}
            <div className="mt-4 max-h-[320px] overflow-y-auto pr-1 space-y-2">
              {validationErrors.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 lg:py-2"
                >
                  {/* DOT */}
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-destructive shrink-0" />

                  {/* TEXT */}
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">
                      {e.section}
                    </span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="text-destructive">{e.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <AlertDialogFooter className="mt-6 flex justify-end">
              <Button
                variant="default"
                className="rounded-full px-6"
                onClick={() => setShowValidationPopup(false)}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="bg-background flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          {sidebarOpen && (
            <>
              {/* overlay */}
              <div
                className="fixed inset-0 bg-black/40 index-11"
                onClick={() => setSidebarOpen(false)}
              />

              <Sidebar
                collapsed={false}
                onToggle={() => setSidebarOpen(false)}
              />
            </>
          )}
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Sticky Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              onMenuClick={() => setSidebarOpen(true)}
              title={
    isEdit && packagePayload.general.name
      ? packagePayload.general.name
      : "Spa Packages"
  }
              showBack={
                (activeSection === "pricing" &&
                  selectedPricingBranch !== null) ||
                (activeSection === "seo" && selectedSeoBranch !== null)
              }
              onBack={() => {
                if (activeSection === "pricing") {
                  setShowPricingGrid(true);
                  setSelectedPricingBranch(null);
                }
                if (activeSection === "seo") {
                  setSelectedSeoBranch(null);
                }
              }}
            />
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
            <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
              <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <PackageNav
                    activeItem={activeSection}
                    onItemChange={handleSectionChange}
                  />
                </aside>
                <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-3 lg:p-5 rounded-[20px] scrollbar-thin h-full">
                  {renderTabContent()}
                </section>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 absolute bottom-4 right-6">
                <Button
                  type="button"
                  variant="cancel"
                  className="w-[105px]"
                  onClick={handleCancle}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="save"
                  onClick={handleSavePackage}
                  disabled={saving}
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
      <Footer/>
    </>
  );
}

export default SpaPackages;
