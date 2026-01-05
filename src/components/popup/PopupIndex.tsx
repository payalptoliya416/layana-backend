"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";

import PopupGeneral from "./Popupgeneral";
import PopupActiveBranch from "./PopupActiveBranch";
import PopupVisualTab from "./PopupVisualTab";
import { PopupNav } from "./PopupNav";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { createPopup, getPopupById, updatePopup } from "@/services/popup";

type ValidationResult = {
    valid: boolean;
    errors: { section: string; field: string; message: string }[];
};

const OK: ValidationResult = { valid: true, errors: [] };


function PopupIndex() {
    const navigate = useNavigate();
      const { id } = useParams();
      const isEdit = Boolean(id);
    
    const generalRef = useRef<any>(null);
    const branchRef = useRef<any>(null);
    const visualRef = useRef<any>(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("general");
    const [showPricingGrid, setShowPricingGrid] = useState(true);
    const [displayName, setDisplayName] = useState("Popup");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedPricingBranch, setSelectedPricingBranch] =
        useState<number | null>(null);

    const handleSectionChange = (section: string) => {

        if (section === "pricing") {
            setShowPricingGrid(true);      // ✅ ALWAYS show grid first
            setSelectedPricingBranch(null);
        }

        setActiveSection(section);
    };
     /* ---------- VALIDATION POPUP ---------- */
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; field?: string; message: string }[]
  >([]);
    /* ---------- PAYLOAD ---------- */
const [payload, setPayload] = useState({
  status: "active" as "active" | "inactive",
  cta_enabled: false,
  cta_text: "",
  cta_link: "",
  cta_color: "#000000",
  location_ids: [] as (number | string)[],
  images: [] as string[],
});

   /* ---------- SAVE ---------- */
   useEffect(() => {
  if (!isEdit || !id) return;

  const loadPopup = async () => {
    try {
      setLoading(true);

      const res = await getPopupById(Number(id));

      setPayload({
        status: res.status === 1 ? "active" : "inactive",

        cta_enabled: res.is_cta ?? false,
        cta_text: res.cta_button_text ?? "",
        cta_link: res.cta_button_link ?? "",
        cta_color: res.cta_button_color ?? "#000000",

        location_ids: res.location_ids ?? [],

        images: res.banner_image ? [res.banner_image] : [],
      });

      setDisplayName("Edit Popup");
    } catch (error) {
      toast.error("Failed to load popup");
    } finally {
      setLoading(false);
    }
  };

  loadPopup();
}, [id, isEdit]);


 const buildPopupPayload = () => ({
  banner_image: payload.images?.[0] ?? null,

  location_ids: payload.location_ids,

  is_cta: payload.cta_enabled,

  cta_button_text: payload.cta_enabled
    ? payload.cta_text
    : null,

  cta_button_link: payload.cta_enabled
    ? payload.cta_link
    : null,

  cta_button_color: payload.cta_enabled
    ? payload.cta_color
    : null,

  status: payload.status === "active" ? 1 : 0,
});

 const handleSave = async () => {
  if (saving) return;
  setSaving(true);

  try {
    /* ---------- VALIDATION ---------- */
    const validators = [generalRef, branchRef, visualRef];

    const results: ValidationResult[] = await Promise.all(
      validators.map(async (ref) => {
        try {
          return (await ref.current?.validate?.()) ?? OK;
        } catch {
          return OK;
        }
      })
    );

    const allErrors = results.flatMap((r) => r.errors || []);

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setShowValidationPopup(true);
      return;
    }

    /* ---------- BUILD API PAYLOAD ---------- */
    const apiPayload = buildPopupPayload();

    /* ---------- API CALL ---------- */
    if (isEdit) {
      await updatePopup({
         id: Number(id),
        ...apiPayload,
      });

      toast.success("Popup updated successfully");
    } else {
      await createPopup(apiPayload);
      toast.success("Popup created successfully");
    }

    navigate(-1);
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
  } finally {
    setSaving(false);
  }
};

    /* ---------- TABS ---------- */
   const renderTabContent = () => (
    <>
      {/* GENERAL */}
      <div className={cn(activeSection !== "general" && "hidden")}>
        <PopupGeneral
          ref={generalRef}
          initialData={payload}
          onChange={(data) =>
            setPayload((prev) => ({ ...prev, ...data }))
          }
        />
      </div>

      {/* BRANCHES */}
      <div className={cn(activeSection !== "branches" && "hidden")}>
        <PopupActiveBranch
          ref={branchRef}
          selectedBranches={payload.location_ids}
          onSelectionChange={(ids) =>
            setPayload((prev) => ({
              ...prev,
              location_ids: ids,
            }))
          }
        />
      </div>

      {/* VISUAL (OPTIONAL) */}
      <div className={cn(activeSection !== "visual" && "hidden")}>
        <PopupVisualTab
          ref={visualRef}
          initialImages={payload.images}
          onChange={(images) =>
            setPayload((prev) => ({ ...prev, images }))
          }
        />
      </div>
    </>
  );


    return (
        <>
        {showValidationPopup && (
        <AlertDialog open onOpenChange={setShowValidationPopup}>
          <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
            <AlertDialogHeader className="pb-3 border-b border-border">
              <AlertDialogTitle className="text-lg font-semibold">
                Please fix the following validation
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                Some required fields are missing or invalid
              </p>
            </AlertDialogHeader>

            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
              {validationErrors.map((e, i) => (
                <div
                  key={i}
                  className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-sm"
                >
                  <strong>{e.section}:</strong>{" "}
                  <span className="text-destructive">{e.message}</span>
                </div>
              ))}
            </div>

            <AlertDialogFooter>
              <Button onClick={() => setShowValidationPopup(false)}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

        <div className="bg-background flex overflow-hidden">
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>
            <div className="lg:hidden">
                {sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/40 index-11"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
                    </>
                )}
            </div>
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-3 sm:px-5",
                    sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
                )}
            >
                <div className="sticky top-3 z-10 pb-3">
                    <PageHeader
                        title={"Popup"}
                        // title={teamName || "Team"}
                        onMenuClick={() => setSidebarOpen(true)}
                        onBack={() => navigate(-1)}
                        showBack={true}
                    />
                </div>
                <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
                    <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
                        <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                            <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto overflow-x-hidden mb-3 lg:mb-0">
                                <PopupNav
                                    activeItem={activeSection}
                                    onItemChange={handleSectionChange}
                                />
                            </aside>
                            <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-3 lg:p-5 rounded-[20px] scrollbar-thin h-full">
                                {renderTabContent()}
                            </section>
                        </div>
                        <div className="absolute bottom-4 right-6 flex gap-3">
                            <Button variant="cancel" className="w-[105px]" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="save"
                                onClick={handleSave}
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
        </>
    )
}

export default PopupIndex
