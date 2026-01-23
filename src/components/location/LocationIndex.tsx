import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { LocationNav } from "./LocationNav";
import LocationGeneral from "./LocationGeneral";
import LocationContactDetails from "./LocationContact";
import LocationWorkingHr from "./LocationWorkingHr";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  createLocation,
  getLocationById,
  updateLocation,
} from "@/services/locationService";
import ParkingDetails from "./ParkingDetails";
import { Footer } from "../layout/Footer";
import LocationSlider from "./LocationSlider";
import LocationAbout from "./LocationAbout";
import LocationPromo3 from "./LocationPromo3";
import BranchSEOPage from "../treatment/BranchSEOPage";
import LocationVisuals from "./LocationVisuals";
import LocationSEOPage from "./LocationSEOPage";

type GeneralData = {
  name: string;
  slug: string;
  status: string;
  freeText: string;
};

type ContactData = {
  phone: string;
  address_line_1: string;
  address_line_2: string;
  email: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
};

type WorkingData = {
  opening_hours: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
};

type ParkingData = {
  parking_details: string;
};

type LocationFormData = {
  general: Partial<GeneralData>;
  contact: Partial<ContactData>;
  working: Partial<WorkingData>;
  parking: Partial<ParkingData>;
};

function LocationIndex() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; message: string }[]
  >([]);

  const handleCancle = () => {
    navigate("/settings/location");
  };

  const generalRef = useRef<any>(null);
  const contactRef = useRef<any>(null);
  const workingRef = useRef<any>(null);
  const parkingRef = useRef<any>(null);
  const sliderRef = useRef<any>(null);
  const aboutRef = useRef<any>(null);
  const promo3Ref = useRef<any>(null);
  const seoRef = useRef<any>(null);
  const visualsRef = useRef<any>(null);

  /* central data store */
  const [formData, setFormData] = useState<LocationFormData>({
    general: {
      name: "",
      status: "",
      slug: "",
      freeText: "",
    },
    contact: {
      phone: "",
      address_line_1: "",
      address_line_2: "",
      email: "",
      country: "UK",
      state: "",
      city: "",
      postcode: "",
    },
    working: {
      opening_hours: [],
    },
    parking: {
      parking_details: "",
    },
  });

  const renderTabContent = () => (
    <>
      <div className={cn(activeSection !== "general" && "hidden")}>
        <LocationGeneral
          ref={generalRef}
          onChange={(data) => setFormData((p) => ({ ...p, general: data }))}
        />
      </div>

      <div className={cn(activeSection !== "contact" && "hidden")}>
        <LocationContactDetails
          ref={contactRef}
          onChange={(data) => setFormData((p) => ({ ...p, contact: data }))}
        />
      </div>

      <div className={cn(activeSection !== "working" && "hidden")}>
        <LocationWorkingHr
          ref={workingRef}
          onChange={(data) => setFormData((p) => ({ ...p, working: data }))}
        />
      </div>

      <div className={cn(activeSection !== "parking" && "hidden")}>
        <ParkingDetails
          ref={parkingRef}
          onChange={(data) => setFormData((p) => ({ ...p, parking: data }))}
        />
      </div>

      {/* SLIDER */}
      <div className={cn(activeSection !== "slider" && "hidden")}>
        <LocationSlider ref={sliderRef} />
      </div>

      {/* ABOUT */}
      <div className={cn(activeSection !== "about" && "hidden")}>
       <LocationAbout
  ref={aboutRef}
  onChange={(data) =>
    setFormData((p) => ({
      ...p,
      general: {
        ...p.general,
        ...data, // only for UI sync, payload still ref based
      },
    }))
  }
/>
      </div>

      {/* PROMO 3 */}
      <div className={cn(activeSection !== "promo3" && "hidden")}>
        
<LocationPromo3
  ref={promo3Ref}
  onChange={() => {}}
/>
      </div>

      <div className={cn(activeSection !== "visuals" && "hidden")}>
      <LocationVisuals
  ref={visualsRef}
  onChange={() => {}}
/>
      </div>
      {/* SEO */}
      <div className={cn(activeSection !== "seo" && "hidden")}>
         <LocationSEOPage ref={seoRef} />
      </div>
    </>
  );

  const handleSaveTreatment = async () => {
    setSaving(true);
const validators = [
  generalRef,
  contactRef,
  workingRef,
  parkingRef,
  sliderRef,
  aboutRef,
  promo3Ref,
  visualsRef,
  seoRef,
];

const results = await Promise.all(
  validators.map((ref) =>
    ref.current?.validate
      ? ref.current.validate()
      : { valid: true, errors: [] }
  )
);
const allErrors = results
  .filter((r) => r && r.valid === false)
  .flatMap((r) => r.errors ?? []);

   if (allErrors.length > 0) {
  setSaving(false);        // 🔥 MUST
  setValidationErrors(allErrors);
  setShowValidationPopup(true);
  return;
}

    const payload = {
      name: formData.general.name!,
      status: formData.general.status!,
      slug: formData.general.slug!,
      free_text: formData.general.freeText!,
      email: formData.contact.email!,
      country: formData.contact.country!,
      state: formData.contact.state!,
      city: formData.contact.city!,
      postcode: formData.contact.postcode!,
      phone: formData.contact.phone!,
      address_line_1: formData.contact.address_line_1!,
      address_line_2: formData.contact.address_line_2,
      parking_details: formData.parking.parking_details!,
      opening_hours: formData.working.opening_hours,

      slider: sliderRef.current?.getData(),
      ...aboutRef.current?.getData(),
      ...promo3Ref.current?.getData(),
      ...visualsRef.current?.getData(),
      ...seoRef.current?.getData?.(),
    };

    try {
      let res;

      if (isEdit && id) {
        res = await updateLocation(id, payload);
        toast.success("Location updated successfully");
      } else {
        res = await createLocation(payload);
        toast.success("Location created successfully");
      }

      navigate("/settings/location");
   } catch (err: any) {
  console.error("API ERROR 👉", err);

  const data = err?.response?.data;

  let messages: string[] = [];

  // ✅ Case 1: Laravel / backend validation object
  if (data?.errors && typeof data.errors === "object") {
    Object.values(data.errors).forEach((val: any) => {
      if (Array.isArray(val)) {
        messages.push(...val);
      } else if (typeof val === "string") {
        messages.push(val);
      }
    });
  }

  // ✅ Case 2: single message
  if (messages.length === 0 && data?.message) {
    messages.push(data.message);
  }

  // ✅ Case 3: totally unknown error
  if (messages.length === 0) {
    messages.push("Something went wrong. Please try again.");
  }

  // 🔥 convert to your required state format
  setValidationErrors(
    messages.map((msg) => ({
      section: "error",
      message: msg,
    }))
  );

  setShowValidationPopup(true);
} finally {
  setSaving(false);
}
  };
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchLocation = async () => {
      try {
        const data = await getLocationById(id);
        // ⬇️ CENTRAL STATE SET
        setFormData({
          general: {
            name: data.name,
            slug: data.slug,
            status: data.status,
            freeText: data.free_text,
          },
          contact: {
            phone: data.phone,
            address_line_1: data.address_line_1,
            address_line_2: data.address_line_2,
            email: data.email,
            country: data.country,
            state: data.state,
            city: data.city,
            postcode: data.postcode,
          },
          working: {
            opening_hours: data.opening_hours || [],
          },
          parking: {
            parking_details: data.parking_details,
          },
        });
        setLocationName(data.name);
        // ⬇️ PUSH DATA INTO CHILD FORMS
        generalRef.current?.setData({
          name: data.name,
          slug: data.slug,
          status: data.status,
          freeText: data.free_text,
        });

        contactRef.current?.setData({
          phone: data.phone,
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2,
          email: data.email,
          country: data.country,
          state: data.state,
          city: data.city,
          postcode: data.postcode,
        });

        workingRef.current?.setData({
          opening_hours: data.opening_hours || [],
        });

        parkingRef.current?.setData({
          parking_details: data.parking_details,
        });

        sliderRef.current?.setData(data.sliders ?? []);

        // ABOUT
       aboutRef.current?.setData({
          sub_title: data.about?.sub_title ?? "",
          about_btn_text: data.about?.btn_text ?? "",
          about_btn_link: data.about?.btn_link ?? "",
          about_description: data.about?.description ?? "",
        });


        // PROMO 3
       promo3Ref.current?.setData({
            title: data.promotion3?.title ?? "",
            subtitle: data.promotion3?.sub_title ?? "",
            promo_3_btn_text: data.promotion3?.btn_text ?? "",
            promo_3_btn_link: data.promotion3?.btn_link ?? "",
            promo_3_description: data.promotion3?.description ?? "",
          });


        // VISUALS
                visualsRef.current?.setData({
          about_image: data.about?.image ?? "",
          promo_1_image: data.promotion?.promotion_1_image ?? "",
          promo_2_image: data.promotion?.promotion_2_image ?? "",
          promo_3_image: data.promotion3?.image ?? "",
          shop_banner_image: data.shop_banner_image ?? ""
        });


        // SEO
            seoRef.current?.setData({
        analytics: data.seo?.analytics ?? "",
        seo_title: data.seo?.seo_title ?? "",
        meta_description: data.seo?.meta_description ?? "",
        seo_keyword: data.seo?.seo_keywords ?? [],
      });
      } catch (err) {
        toast.error("Failed to load location");
      }
    };

    fetchLocation();
  }, [id, isEdit]);

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
              title={locationName || "Location"}
              onMenuClick={() => setSidebarOpen(true)}
              onBack={() => navigate(-1)}
              showBack={true}
            />
          </div>
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
            <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
              <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <LocationNav
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

export default LocationIndex;
