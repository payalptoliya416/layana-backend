import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { createLocation } from "@/services/locationService";
import ParkingDetails from "./ParkingDetails";

type GeneralData = {
  name: string;
  slug: string;  
  status: string;
  freeText: string;
  email: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
};

type ContactData = {
  phone: string;
  address_line_1: string;
  address_line_2: string;
};

type WorkingData = {
  opening_time: string;
  closing_time: string;
  clock_in_threshold: string;
  clock_out_threshold: string;
};

type ParkingData = {
 business_additional : string;
 business_type : string;
 parking_details : string;
};

type LocationFormData = {
  general: Partial<GeneralData>;
  contact: Partial<ContactData>;
  working: Partial<WorkingData>;
  parking: Partial<ParkingData>; 
};


function LocationIndex() {
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
    navigate("/location");
  };
  const generalRef = useRef<any>(null);
  const contactRef = useRef<any>(null);
  const workingRef = useRef<any>(null);
  const parkingRef = useRef<any>(null);

  /* central data store */
const [formData, setFormData] = useState<LocationFormData>({
  general: {
    name: "",
    status: "",
    slug: "", 
    freeText: "",
    country: "",
    state: "",
    city: "",
    postcode: "",
  },
  contact: {
    phone: "",
    address_line_1: "",
    address_line_2: "",
  },
  working: {
    opening_time: "",
    closing_time: "",
    clock_in_threshold: "",
    clock_out_threshold: "",
  },
  parking:{
    business_additional: "",
    business_type : "",
    parking_details : ""
  }
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
    </>
  );

const handleSaveTreatment = async () => {
  setSaving(true);

  const results = await Promise.all([
    generalRef.current?.validate(),
    contactRef.current?.validate(),
    workingRef.current?.validate(),
  ]);

  const allErrors = results
    .filter((r) => !r.valid)
    .flatMap((r) => r.errors);

  if (allErrors.length > 0) {
    setSaving(false);
    setValidationErrors(
      allErrors.map((e) => ({
        section: e.section,
        message: e.message,
      }))
    );
    setShowValidationPopup(true);
    return;
  }

  const payload = {
    name: formData.general.name!,
    status: formData.general.status!,
      slug: formData.general.slug!,
      email :formData.general.email!,
    free_text: formData.general.freeText!,
    country: formData.general.country!,
    state: formData.general.state!,
    city: formData.general.city!,
    postcode: formData.general.postcode!,

    phone: formData.contact.phone!,
    address_line_1: formData.contact.address_line_1!,
    address_line_2: formData.contact.address_line_2,

     business_type: formData.parking.business_type!,
  business_additional: formData.parking.business_additional!,
  parking_details: formData.parking.parking_details!,

    opening_hours: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ].map((day) => ({
      day,
      start_time: formData.working.opening_time!,
      end_time: formData.working.closing_time!,
    })),
  };

  try {
    const res = await createLocation(payload);
console.log("res",res)
    toast.success("Location created successfully ✅");
    navigate("/location"); 
  } catch (err: any) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || "Failed to create location"
    );
  } finally {
    setSaving(false);
  }
};


  return (
    <>
    {showValidationPopup && (
 <AlertDialog open={showValidationPopup} onOpenChange={setShowValidationPopup}>
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
              title="Category"
              onMenuClick={() => setSidebarOpen(true)}
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
    </>
  );
}

export default LocationIndex;
