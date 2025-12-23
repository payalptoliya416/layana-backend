import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { TreatmentForm } from "@/components/treatment/TreatmentForm";
import { BranchList } from "@/components/branches/BranchList";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VisualsForm } from "@/components/treatment/Visuals";
import { BenefitsSection } from "@/components/treatment/BenefitsSection";
import { FAQSection } from "@/components/treatment/FAQSection";
import BranchSEOPage from "@/components/treatment/BranchSEOPage";
import { createTreatmentMessage, getTreatmentById, updateTreatmentMessage } from "@/services/treatmentService";
  import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Pricing } from "@/components/treatment/Pricing"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface BenefitsFaqPayload {
  slogan: string;
  benifites: string[];
  faq: { question: string; answer: string }[];
}

interface TreatmentPayload {
  general: any;
  Location: number[];
  visuals: any;
  pricing: any[];
  benifits_faq: BenefitsFaqPayload;
  seo: any[];
}
type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

const OK: ValidationResult = { valid: true, errors: [] };

const Index = () => {
const { id } = useParams();
const isEdit = Boolean(id);
const generalRef = useRef<any>(null);
const branchesRef = useRef<any>(null);
const visualsRef = useRef<any>(null);
const pricingRef = useRef<any>(null);
const benefitsRef = useRef<any>(null);
const faqRef = useRef<any>(null);
const seoRef = useRef<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
const [loadingTreatment, setLoadingTreatment] = useState(false);
const selectedBranchObjects = selectedBranches.map((id) => ({
  id,
  name:
    id === 1
      ? "Belsize Park"
      : id === 2
      ? "Finchley Central"
      : "Muswell Hill",
}));
const [treatmentPayload, setTreatmentPayload] = useState<TreatmentPayload>({
  general: {},
  Location: [],
  visuals: {},
  pricing: [],
  benifits_faq: {
    slogan: "",
    benifites: [],
    faq: [],
  },
  seo: [],
});
const initialTreatmentData = useMemo(() => {

  return {
    name: treatmentPayload.general?.name || "",
    Slug: treatmentPayload.general?.Slug || "",
    Category: treatmentPayload.general?.Category || "",
    Status:
      treatmentPayload.general?.Status || "draft",
    indicative_pressure:treatmentPayload.general?.indicative_pressure || "medium",
    Content: treatmentPayload.general?.Content || "",
  };
}, [isEdit, treatmentPayload.general]);

const [benefitsFaq, setBenefitsFaq] = useState({
  slogan: "",
  benifites: [] as string[],
  faq: [] as { question: string; answer: string }[],
});
const [selectedSeoBranch, setSelectedSeoBranch] =
  useState<number | null>(null);

const navigate = useNavigate();
const [showValidationPopup, setShowValidationPopup] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
const [validationErrors, setValidationErrors] = useState<
  { section: string; field: string; message: string }[]
>([]);
const handleCancle = ()=>{
  navigate('/treatments-list')
}
const [saving, setSaving] = useState(false);

// const handleSaveTreatment = async () => {
//    const validators = [
//     generalRef,
//     branchesRef,
//     visualsRef,
//     pricingRef,
//     benefitsRef,
//     faqRef,
//     seoRef,
//   ];

//   const results: ValidationResult[] = await Promise.all(
//     validators.map(async (ref) => {
//       try {
//         return (await ref.current?.validate?.()) ?? OK;
//       } catch (err) {
//         console.error("Validation error:", err);
//         return OK;
//       }
//     })
//   );

//   const allErrors = results.flatMap((r) => r.errors || []);

//   if (allErrors.length > 0) {
//     setValidationErrors(allErrors);
//     setShowValidationPopup(true);
//     return;
//   }

//   // ✅ API CALL
//   try {
//     const payload = {
//       ...(isEdit ? { id: Number(id) } : {}),
//       ...treatmentPayload,
//       Location: selectedBranches,
//     };

//     const res = isEdit
//       ? await updateTreatmentMessage(payload)
//       : await createTreatmentMessage(payload);

//     if (res?.status === "success" || res?.data?.status === "success") {
//       toast.success(res.message || res.data.message);
//       navigate("/treatments-list");
//     }
//   } catch {
//     toast.error("Something went wrong");
//   }
// };
const handleSaveTreatment = async () => {
  if (saving) return;

  setSaving(true); // ✅ 🔥 THIS WAS MISSING

  const isDraft = treatmentPayload.general?.Status === "draft";

  const validators = isDraft
    ? [generalRef]
    : [
        generalRef,
        branchesRef,
        visualsRef,
        pricingRef,
        benefitsRef,
        faqRef,
        seoRef,
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
    setSaving(false); // 🔴 stop loader on validation error
    return;
  }

  try {
    const payload = {
      ...(isEdit ? { id: Number(id) } : {}),
      ...treatmentPayload,
      Location: selectedBranches,
    };

    const res = isEdit
      ? await updateTreatmentMessage(payload)
      : await createTreatmentMessage(payload);

    if (res?.status === "success" || res?.data?.status === "success") {
      toast.success(res.message || res.data.message);
      navigate("/treatments-list");
    }
  } catch {
    toast.error("Something went wrong");
  } finally {
    setSaving(false); // ✅ always stop loader
  }
};


useEffect(() => {
  if (!id || loadingTreatment) return;

  const loadTreatment = async () => {
    try {
      setLoadingTreatment(true);

      const data = await getTreatmentById(Number(id));
      const locationIds = (data.locations || []).map(
        (loc: { id: number }) => loc.id
      );

      setTreatmentPayload({
        general: data.general,
        Location: locationIds,
        visuals: data.visuals || {},
        pricing: data.pricing || [],
        benifits_faq: data.benifits_faq || {
          slogan: "",
          benifites: [],
          faq: [],
        },
        seo: data.seo || [],
      });

      setSelectedBranches(locationIds);

      setBenefitsFaq(data.benifits_faq || {
        slogan: "",
        benifites: [],
        faq: [],
      });
    } catch (err) {
      console.error("Edit load failed", err);
    } finally {
      setLoadingTreatment(false);
    }
  };

  loadTreatment();
}, [id]);

const pageTitle = useMemo(() => {
  if (activeSection === "seo" && selectedSeoBranch) {
    return "Branch SEO";
  }

  if (isEdit && treatmentPayload.general?.name) {
    return treatmentPayload.general.name;
  }

  return "Add Treatment";
}, [activeSection, selectedSeoBranch, isEdit, treatmentPayload.general?.name]);
const isTitleLoading =
  isEdit && loadingTreatment && !treatmentPayload.general?.name;

const [selectedPricingBranch, setSelectedPricingBranch] =
  useState<number | null>(null);

const selectedCategory = treatmentPayload.general?.Category;
useEffect(() => {
  if (selectedCategory) {
  }
}, [selectedCategory]);


const renderTabContent = () => {
  return (
    <>
      {/* GENERAL */}
      <div className={cn(activeSection !== "general" && "hidden")}>
        <TreatmentForm
          ref={generalRef}
          initialData={initialTreatmentData}
          onChange={(general) =>
            setTreatmentPayload((prev) => ({
              ...prev,
              general,
            }))
          }
        />
      </div>

      {/* BRANCHES */}
      <div className={cn(activeSection !== "branches" && "hidden")}>
        <BranchList
          ref={branchesRef}
           category={selectedCategory}
          selectedBranches={selectedBranches}
          onSelectionChange={(ids) => {
            setSelectedBranches(ids);
            setTreatmentPayload((prev) => ({
              ...prev,
              Location: ids,
            }));
          }}
        />
      </div>

      {/* VISUALS */}
      <div className={cn(activeSection !== "visuals" && "hidden")}>
        <VisualsForm
          ref={visualsRef}
             category={selectedCategory}
          initialData={treatmentPayload.visuals}
          onChange={(visuals) =>
            setTreatmentPayload((prev) => ({
              ...prev,
              visuals,
            }))
          }
        />
      </div>

      {/* PRICING */}
      <div className={cn(activeSection !== "pricing" && "hidden")}>
        <Pricing
          ref={pricingRef}
             category={selectedCategory}
          branches={selectedBranchObjects}
          selectedBranchId={selectedPricingBranch}
          onSelectBranch={setSelectedPricingBranch}
          initialData={treatmentPayload.pricing}
          onChange={(pricing) =>
            setTreatmentPayload((prev) => ({
              ...prev,
              pricing,
            }))
          }
        />
      </div>

      {/* BENEFITS + FAQ */}
      <div className={cn(activeSection !== "benefits" && "hidden")}>
        <div className="space-y-10">
          <BenefitsSection
             category={selectedCategory}
            ref={benefitsRef}
            value={benefitsFaq}
            onChange={(data) => {
              setBenefitsFaq(data);
              setTreatmentPayload((prev) => ({
                ...prev,
                benifits_faq: {
                  slogan: data.slogan || "",
                  benifites: data.benifites,
                  faq: data.faq,
                },
              }));
            }}
          />

          <FAQSection
            ref={faqRef}
               category={selectedCategory}
            value={benefitsFaq.faq}
            onChange={(faq) => {
              setBenefitsFaq((prev) => {
                const updated = { ...prev, faq };
                setTreatmentPayload((p) => ({
                  ...p,
                  benifits_faq: updated,
                }));
                return updated;
              });
            }}
          />
        </div>
      </div>

      {/* SEO */}
      <div className={cn(activeSection !== "seo" && "hidden")}>
        <BranchSEOPage
          ref={seoRef}
             category={selectedCategory}
          branches={selectedBranchObjects}
          selectedBranchId={selectedSeoBranch}
          initialData={treatmentPayload.seo}
          onSelectBranch={setSelectedSeoBranch}
          onChange={(seo) =>
            setTreatmentPayload((prev) => ({
              ...prev,
              seo,
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
              <span className="text-destructive">
                {e.message}
              </span>
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
          "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-3 z-10 pb-3">
        <PageHeader
        onMenuClick={() => setSidebarOpen(true)}
        title={pageTitle}
          isTitleLoading={isTitleLoading}
        showBack={
          (activeSection === "pricing" && selectedPricingBranch !== null) ||
          (activeSection === "seo" && selectedSeoBranch !== null)
        }
        onBack={() => {
          if (activeSection === "pricing") {
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
          {/* Main Card with equal height tabs and content */}
            <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
              <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                {/* Secondary Navigation - Sticky left side */}
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <SecondaryNav
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                </aside>

                {/* Tab Content - Scrollable */}
                <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-3 lg:p-5 rounded-[20px] scrollbar-thin h-full">
                  {renderTabContent()}
                </section>
              </div>
             <div className="flex items-center justify-end gap-3 pt-4 absolute bottom-4 right-6">
                  <Button type="button" variant="cancel" className="w-[105px]" onClick={handleCancle}>
                    Cancel
                  </Button>
                      <Button
            type="button"
            variant="save"
            onClick={handleSaveTreatment}
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
};

export default Index;
