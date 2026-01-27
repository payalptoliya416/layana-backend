import React, { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { Footer } from "../layout/Footer";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AboutNav from "./AboutNav";
import AboutContent from "./AboutContent";
import AboutVisuals from "./AbouteVisuals";
import { getSpaLandingPage, updateSpaLandingPage } from "@/services/spaPackageService";

function SpapackageAboutIndex() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("content");
const handleCancle = () => {
  window.history.back();
};
  const contentRef = useRef<{ validate: () => Promise<any> }>(null);
  const visualsRef = useRef<{ validate: () => Promise<any> }>(null);

  const [saving, setSaving] = useState(false);

  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; message: string }[]
  >([]);

  const [aboutPayload, setAboutPayload] = useState({
    description: "",        
      gallery_image: "",
  });
useEffect(() => {
  const fetchLanding = async () => {
    try {
      const res = await getSpaLandingPage();

     if (res?.status === "success") {
  setAboutPayload({
    description: res.data.description || "",
      gallery_image: res.data.gallery_image || "",
  });
}
    } catch (err) {
      toast.error("Failed to load landing page data");
    }
  };

  fetchLanding();
}, []);
  // ✅ SAVE FUNCTION
const handleSave = async () => {
  if (saving) return;
  setSaving(true);

  try {
    const payload = {
      gallery_image: aboutPayload.gallery_image,
      description: aboutPayload.description,
    };

    const res = await updateSpaLandingPage(payload);

    if (res?.status === "success") {
      toast.success("Landing Page Saved Successfully!");
    } else {
      toast.error(res?.message || "Failed to save");
    }
  } catch (err) {
    toast.error("Something went wrong while saving");
  } finally {
    setSaving(false);
  }
};

  // ✅ CONTENT CHANGE
const handleContentChange = useCallback((description: string) => {
  setAboutPayload((prev) => ({
    ...prev,
    description,
  }));
}, []);

const handleVisualChange = (gallery_image: string) => {
  setAboutPayload((prev) => ({
    ...prev,
    gallery_image,
  }));
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
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
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
     
        {/* MAIN */}
        <div
                 className={cn(
                   "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-3 sm:px-5",
                   sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
                 )}
               >    
          {/* HEADER */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Spa Package About"
              onMenuClick={() => setSidebarOpen(true)}
              showBack={true}
              onBack={() => window.history.back()}
            />
          </div>

          {/* CONTENT WRAPPER */}
      <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
          <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
               <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0 gap-2 lg:gap-5">
                {/* NAV */}
                 <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <AboutNav
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                </aside>

                {/* SECTION */}
                <section className="flex-1 min-h-0 overflow-hidden border border-border rounded-[20px] flex flex-col">
                   <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-3 lg:p-5">
                    {/* CONTENT TAB */}
                    <div className={cn(activeSection !== "content" && "hidden")}>
                   <AboutContent
  ref={contentRef}
  initialData={aboutPayload.description}
  onChange={handleContentChange}
/>
                    </div>

                    {/* VISUALS TAB */}
                    <div className={cn(activeSection !== "visuals" && "hidden")}>
                      <AboutVisuals
  ref={visualsRef}
  initialData={aboutPayload.gallery_image}
  onChange={handleVisualChange}
/>
                    </div>
                  </div>
                </section>
              </div>

              {/* SAVE BUTTON */}
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

      <Footer />
    </>
  );
}

export default SpapackageAboutIndex;
