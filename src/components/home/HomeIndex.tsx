import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { Footer } from "../layout/Footer";
import { HomeNav } from "./HomeNav";
import HomeSlider from "./HomeSlider";
import HomePromo1 from "./HomePromo1";
import HomeVisuals from "./HomeVisuals";
import { getHomePage, saveHomePage } from "@/services/homeServices";
import HomeSEOPage from "./HomeSEOPage";

export type HomeSliderItem = {
  index: number;
  title: string;
  btn_text: string;
  btn_link: string;
};

export type HomeSliderData = HomeSliderItem[];

/* ================= PROMO 1 ================= */
export type HomePromo1Data = {
  title: string;
  sub_title: string;
  btn_text: string;
  btn_link: string;
  description: string;
  bg_color: string;
};

/* ================= VISUALS ================= */
export type HomeVisualsData = {
  promo_1_image: string;
  promo_2_image: string;
  promo_3_image: string;
  partner_image: string[];
};

/* ================= SEO ================= */
export type HomeSEOData = {
  analytics: string;
  seo_title: string;
  meta_description: string;
  seo_keyword: string[];
};

/* ================= MAIN FORM ================= */
export type HomeFormData = {
  slider: HomeSliderData;
  promo_1: HomePromo1Data;
  visuals: HomeVisualsData;
  seo: HomeSEOData;
};

function HomeIndex() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("slider");
  const [saving, setSaving] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; message: string }[]
  >([]);

  const handleCancle = () => {
    navigate("/settings/location");
  };

  const sliderRef = useRef<any>(null);
  const promo1Ref = useRef<any>(null);
  const seoRef = useRef<any>(null);
  const visualsRef = useRef<any>(null);

  const [formData, setFormData] = useState<HomeFormData>({
    slider: [
      {
        index: 1,
        title: "",
        btn_text: "",
        btn_link: "",
      },
    ],

    promo_1: {
      title: "",
      sub_title: "",
      btn_text: "",
      btn_link: "",
      description: "",
      bg_color: "#FFFFFF",
    },

    visuals: {
      promo_1_image: "",
      promo_2_image: "",
      promo_3_image: "",
      partner_image: [],
    },

    seo: {
      analytics: "",
      seo_title: "",
      meta_description: "",
      seo_keyword: [],
    },
  });

const renderTabContent = () => (
  <>
    <div className={cn(activeSection !== "slider" && "hidden")}>
      <HomeSlider ref={sliderRef} />
    </div>

    <div className={cn(activeSection !== "promo1" && "hidden")}>
      <HomePromo1 ref={promo1Ref} />
    </div>

    <div className={cn(activeSection !== "visuals" && "hidden")}>
      <HomeVisuals ref={visualsRef} />
    </div>

    <div className={cn(activeSection !== "seo" && "hidden")}>
     <HomeSEOPage ref={seoRef} />
    </div>
  </>
);

  const handleSaveTreatment = async () => {
  setSaving(true);

  const validators = [sliderRef, promo1Ref, visualsRef, seoRef];

  const results = await Promise.all(
    validators.map((ref) =>
      ref.current?.validate
        ? ref.current.validate()
        : { valid: true, errors: [] }
    )
  );

  const allErrors = results
    .filter((r) => r.valid === false)
    .flatMap((r) => r.errors ?? []);

  if (allErrors.length) {
    setSaving(false);
    setValidationErrors(allErrors);
    setShowValidationPopup(true);
    return;
  }

  const payload = {
    slider: sliderRef.current.getData(),
    promo_1: promo1Ref.current.getData(),
    visuals: visualsRef.current.getData(),
    seo: seoRef.current.getData(),
  };

  try {
    await saveHomePage(payload);
    toast.success("Home page updated successfully");
  } catch (err: any) {
  const data = err?.response?.data;

  let errors: { section: string; message: string }[] = [];

  if (data?.errors && typeof data.errors === "object") {
    Object.entries(data.errors).forEach(([key, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((msg) => {
          errors.push({
            section: key, 
            message: msg,
          });
        });
      }
    });
  }

  // fallback
  if (errors.length === 0) {
    errors.push({
      section: "Error",
      message: data?.message || "Something went wrong",
    });
  }

  setValidationErrors(errors);
  setShowValidationPopup(true);
} finally {
  setSaving(false);
}

};

useEffect(() => {
  const fetchHome = async () => {
    try {
      const data = await getHomePage();

      sliderRef.current?.setData(data.slider ?? []);

      promo1Ref.current?.setData({
        title: data.promo_1?.title ?? "",
        sub_title: data.promo_1?.sub_title ?? "",
        btn_text: data.promo_1?.btn_text ?? "",
        btn_link: data.promo_1?.btn_link ?? "",
        description: data.promo_1?.description ?? "",
        bg_color: data.promo_1?.bg_color ?? "",
      });

      visualsRef.current?.setData({
        promo_1_image: data.visuals?.promo_1_image ?? "",
        promo_2_image: data.visuals?.promo_2_image ?? "",
        promo_3_image: data.visuals?.promo_3_image ?? "",
        partner_image: data.visuals?.partner_image ?? [],
      });

      seoRef.current?.setData({
        analytics: data.seo?.analytics ?? "",
        seo_title: data.seo?.seo_title ?? "",
        meta_description: data.seo?.meta_description ?? "",
        seo_keyword: data.seo?.seo_keyword ?? [],
      });
    } catch (e) {
    //   toast.error("Failed to load home page");
    }
  };

  fetchHome();
}, []);

  return (
    <>
      {showValidationPopup && (
        <AlertDialog
          open={showValidationPopup}
          onOpenChange={setShowValidationPopup}
        >
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
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-destructive shrink-0" />

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
                  title={"Home"}
                  onMenuClick={() => setSidebarOpen(true)}
                  onBack={() => navigate(-1)}
                  showBack={true}
                />
              </div>
              <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
                <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
                  <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                    <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                      <HomeNav
                        activeItem={activeSection}
                        onItemChange={setActiveSection}
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
          <Footer />
    </>
  );
}

export default HomeIndex;
