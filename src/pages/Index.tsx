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
import { Pricing } from "@/components/treatment/Pricing";
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

const handleSaveTreatment = async () => {
  const validations = [
    generalRef.current?.validate?.() ?? true,
    branchesRef.current?.validate?.() ?? true,
    visualsRef.current?.validate?.() ?? true,
    pricingRef.current?.validate?.() ?? true,
    benefitsRef.current?.validate?.() ?? true,
    faqRef.current?.validate?.() ?? true,
    seoRef.current?.validate?.() ?? true,
  ];
console.log("validations",validations)
  const hasError = validations.includes(false);

  if (hasError) {
    toast.error("Please fix validation errors");
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
  } catch (err) {
    toast.error("Something went wrong");
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

  const renderTabContent = () => {
    switch (activeSection) {
      case "general":
        return (
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
        );
      case "branches":
        return (
        <BranchList
        ref={branchesRef}
  selectedBranches={selectedBranches}
  onSelectionChange={(ids) => {
    setSelectedBranches(ids);
    setTreatmentPayload((prev) => ({
      ...prev,
      Location: ids,
    }));
  }}
/>
        );
      case "visuals":
        return (
      <VisualsForm
      ref={visualsRef}
  initialData={treatmentPayload.visuals}
  onChange={(visuals) =>
    setTreatmentPayload((prev) => ({
      ...prev,
      visuals,
    }))
  }
/>
        );
      case "pricing":
        return (
       <Pricing
       ref={pricingRef}
  branches={selectedBranchObjects}
  selectedBranchId={selectedPricingBranch}
  onSelectBranch={setSelectedPricingBranch}
  initialData={treatmentPayload.pricing}   // ✅ ADD
  onChange={(pricing) =>
    setTreatmentPayload((prev) => ({
      ...prev,
      pricing,
    }))
  }
/>
        );
    case "benefits":
  return (
    <div className="space-y-10">
      <BenefitsSection
       ref={benefitsRef}
        value={benefitsFaq}
        onChange={(data) => {
          setBenefitsFaq(data);
          setTreatmentPayload((prev) => ({
            ...prev,
            benifits_faq: {
            slogan: data.slogan || " ",
            benifites: data.benifites,
            faq: data.faq,
          },
          }));
        }}
      />

      <FAQSection
       ref={faqRef} 
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
  );
case "seo":
  return (
   <BranchSEOPage
   ref={seoRef}
  branches={selectedBranchObjects}
  selectedBranchId={selectedSeoBranch}
  initialData={treatmentPayload.seo}   // ✅ ADD
  onSelectBranch={setSelectedSeoBranch}
  onChange={(seo) =>
    setTreatmentPayload((prev) => ({
      ...prev,
      seo,
    }))
  }
/>
  );
      default:
        return null;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {/* <div className="flex"> */}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all h-[calc(100vh-24px)] duration-300",
          sidebarCollapsed ? "ml-[96px]" : "ml-[284px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-background px-6 pt-3">
        <PageHeader
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
        <div className="flex-1 pl-[15px] pr-6 py-3 overflow-hidden flex flex-col">
          {/* Main Card with equal height tabs and content */}
            <div className="flex-1 bg-card rounded-2xl shadow-card p-5 overflow-y-auto  scrollbar-hide">
            <div className="flex overflow-hidden h-[720px] overflow-y-auto">
              <div className="flex w-full gap-5 ">
                {/* Secondary Navigation - Sticky left side */}
                <aside className="w-[270px] flex-shrink-0 border border-border p-4 rounded-[20px] h-full">
                  <SecondaryNav
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                </aside>

                {/* Tab Content - Scrollable */}
                <section className="flex-1 overflow-y-auto scrollbar-thin border border-border p-5 rounded-[20px] scrollbar-thin h-full">
                  {renderTabContent()}
                </section>
              </div>
            </div>
             <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="cancel" className="w-[105px]">
          Cancel
        </Button>
              <Button
          type="button"
          variant="save"
          onClick={handleSaveTreatment}
          className="w-[105px]"
        >
          Save
        </Button>

           </div>
            </div>
        </div>

        {/* Footer */}
      </div>
      {/* </div> */}
    </div>
        <div className="px-6 pb-3">
          <Footer />
        </div>
    </>
  );
};

export default Index;
