import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../PageHeader";
import { Button } from "@/components/ui/button";
import MmeberSHipGneral from "./MmeberSHipGneral";
import { MemberNav } from "./MemberNav";
import MemberActiveBranch from "./MemberActiveBranch";
import MemberPricing from "./MemberPricing";
import MemberFAQ from "./MemberFAQ";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { createMembership, getMembershipById, updateMembership } from "@/services/getMemberShip";
import { MemberShipSlogan } from "./MembershipSLogan";
import { Footer } from "../Footer";
import { getAllMembershipFaqs, getMembershipFaq } from "@/services/membershipFaqService";


/* ================= TYPES ================= */

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

const OK: ValidationResult = { valid: true, errors: [] };

interface MembershipPayload {
  name: string;
  status: "active" | "inactive";
  content: string;
  slogan: string;
  location_ids: number[];
  pricing: any[];
  faq: { question: string; answer: string }[];
}

/* ================= COMPONENT ================= */

function MembershipIndex() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  /* ---------- REFS ---------- */
  const generalRef = useRef<any>(null);
  const branchesRef = useRef<any>(null);
  const pricingRef = useRef<any>(null);
  const faqRef = useRef<any>(null);

  /* ---------- UI STATE ---------- */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const sloganRef = useRef<any>(null);

  /* ---------- VALIDATION POPUP ---------- */
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; field: string; message: string }[]
  >([]);

  /* ---------- FORM DATA ---------- */
  const [payload, setPayload] = useState<MembershipPayload>({
    name: "",
    status: "active",
    content: "",
    slogan: "",
    location_ids: [],
    pricing: [],
    faq: [],
  });
const [selectedPricingBranch, setSelectedPricingBranch] =
  useState<number | null>(null);

const selectedBranchObjects = payload.location_ids.map((id) => ({
  id,
  name:
    id === 1
      ? "Belsize Park"
      : id === 2
      ? "Finchley Central"
      : "Muswell Hill",
}));

const handleSectionChange = (section: string) => {
  if (activeSection === "pricing" && section !== "pricing") {
    setSelectedPricingBranch(null);
  }

  setActiveSection(section);
};

  /* ---------- LOAD EDIT DATA ---------- */
  useEffect(() => {
  if (isEdit && payload.pricing.length > 0 && selectedPricingBranch === null) {
    setSelectedPricingBranch(payload.pricing[0].location_id);
  }
}, [isEdit, payload.pricing]);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadMembership = async () => {
      try {
        setLoading(true);
        const res = await getMembershipById(Number(id));
        setPayload({
          name: res.name,
          status: res.status,
          content: res.content,
          slogan: res.slogan,
          location_ids: res.locations.map((l: any) => l.id),
          pricing: (res.pricing || []).map((p: any, i: number) => ({
    duration: p.duration,
    offer_price: p.offer_price,
    each_price: p.each_price,
    price: p.price,
    location_id: p.location_id,
    index: i + 1,
  })),

          faq: res.faq || [],
        });
      } catch {
        toast.error("Failed to load membership");
      } finally {
        setLoading(false);
      }
    };

    loadMembership();
  }, [id, isEdit]);

useEffect(() => {
  if (!isEdit || !id) return;
  if (activeSection !== "benefits") return; // FAQ tab

  const loadFaqs = async () => {
    try {
      const res = await getAllMembershipFaqs({
        sortBy: "index",
        sortDirection: "asc",
      });

      // ✅ correct path: res.data.data
      const faqs = res?.data?.data;

      if (Array.isArray(faqs)) {
        setPayload(prev => ({
          ...prev,
          faq: faqs.map((f: any) => ({
            question: f.question,
            answer: f.answer,
          })),
        }));
      }
    } catch {
      toast.error("Failed to load FAQs");
    }
  };

  loadFaqs();
}, [activeSection, id, isEdit]);

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const validators = [
      generalRef,
      branchesRef,
      pricingRef,
      sloganRef,
    ];
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
      setSaving(false);
      return;
    }

    try {
      if (isEdit && id) {
        await updateMembership({
            id: Number(id),
            ...payload,
            })
        toast.success("Membership updated successfully");
      } else {
        await createMembership(payload);
        toast.success("Membership created successfully");
      }

      navigate("/massage-membership");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- TABS ---------- */
  const renderTabContent = () => (
    <>
      {/* GENERAL */}
      <div className={cn(activeSection !== "general" && "hidden")}>
        <MmeberSHipGneral
          ref={generalRef}
          initialData={payload}
          onChange={(data) =>
            setPayload((prev) => ({ ...prev, ...data }))
          }
        />
      </div>

      {/* BRANCHES */}
      <div className={cn(activeSection !== "branches" && "hidden")}>
        <MemberActiveBranch
          ref={branchesRef}
          selectedBranches={payload.location_ids}
          onSelectionChange={(ids) =>
            setPayload((prev) => ({ ...prev, location_ids: ids }))
          }
        />
      </div>

      {/* PRICING */}
      <div className={cn(activeSection !== "pricing" && "hidden")}>
        <MemberPricing
                ref={pricingRef}
                branches={selectedBranchObjects}          
                selectedBranchId={selectedPricingBranch}  
                onSelectBranch={setSelectedPricingBranch} 
                value={payload.pricing}                   // 
                onChange={(pricing) =>
                    setPayload((prev) => ({
                    ...prev,
                    pricing,
                    }))
                }
                />
      </div>

      {/* FAQ */}
      <div className={cn(activeSection !== "benefits" && "hidden")}>
        <MemberShipSlogan
                ref={sloganRef}
                value={payload.slogan}
                onChange={(slogan) =>
                    setPayload((prev) => ({ ...prev, slogan }))
                }
                />
        <MemberFAQ
          ref={faqRef}
          value={payload.faq}
          onChange={(faq) =>
            setPayload((prev) => ({ ...prev, faq }))
          }
        />
      </div>
    </>
  );

  /* ================= UI ================= */

  return (
    <>
      {/* VALIDATION POPUP */}
      {showValidationPopup && (
        <AlertDialog open onOpenChange={setShowValidationPopup}>
          <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Please fix the following
              </AlertDialogTitle>
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

   <div className="bg-background flex">
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

        {/* CONTENT */}
        <div
        className={cn(
          "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-3 sm:px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
          <div className="sticky top-3 z-10 pb-3">
            {/* <PageHeader title={payload.name || 'MemberShip'} onMenuClick={() => setSidebarOpen(true)} /> */}
              <PageHeader
            onMenuClick={() => setSidebarOpen(true)}
            title={payload.name || "MemberShips"}
            showBack={
              activeSection === "pricing" && selectedPricingBranch !== null
            }
            onBack={() => {
              if (activeSection === "pricing") {
                setSelectedPricingBranch(null);
              }
            }}
          />
          </div>
                <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
                    <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
                        <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto overflow-x-hidden mb-3 lg:mb-0">
                                <MemberNav
                                activeItem={activeSection}
                                onItemChange={handleSectionChange}
                                />
                            </aside>
                            <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-3 lg:p-5 rounded-[20px] scrollbar-thin h-full">
                {renderTabContent()}
                            </section>
                        </div>
                        <div className="absolute bottom-4 right-6 flex gap-3">
                            <Button  variant="cancel" className="w-[105px]" onClick={() => navigate(-1)}>
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
      <Footer/>
    </>
  );
}

export default MembershipIndex;
