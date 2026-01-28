import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import MemberNav from "./MemberNav";
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
import TermsDescriptionEditor from "../terms&condition/TermsDescriptionEditor";
import MemberPolicy from "./MemberPolicy";
import { getMembershipLandingPage, updateMembershipLandingPage } from "@/services/spaPackageService";
import { toast } from "sonner";

function MembershipTerms() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { section: string; field: string; message: string }[]
  >([]);
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [membershipPayload, setMembershipPayload] = useState({
    description: "",
    policy: [],
    terms_condition: "", 
  });
  const policyRef = useRef<{ validate: () => Promise<any> }>(null);
useEffect(() => {
  const fetchLanding = async () => {
    try {
      const res = await getMembershipLandingPage();

      if (res?.status === "success") {
        setMembershipPayload({
          description: res.data.description || "",
          policy: res.data.policy || [],
          terms_condition: res.data.terms_condition || "",
        });
      }
    } catch (err) {
      toast.error("Failed to load membership landing page");
    }
  };

  fetchLanding();
}, []);
const handleSave = async () => {
  if (saving) return;
  setSaving(true);

  let errors: any[] = [];

  // ✅ General Validation
  if (!membershipPayload.description.trim()) {
    errors.push({
      section: "General",
      field: "description",
      message: "Membership description is required",
    });
  }
  if (!membershipPayload.terms_condition.trim()) {
  errors.push({
    section: "Terms",
    field: "terms",
    message: "Terms & Condition content is required",
  });
}

  // ✅ Policy Validation
  if (policyRef.current?.validate) {
    const policyResult = await policyRef.current.validate();

    if (!policyResult.valid) {
      errors = [...errors, ...policyResult.errors];
    }
  }

  // ❌ Show Popup
  if (errors.length > 0) {
    setValidationErrors(errors);
    setShowValidationPopup(true);
    setSaving(false);
    return;
  }

  // ✅ API SAVE CALL
  try {
    const res = await updateMembershipLandingPage(membershipPayload);

    if (res?.status === "success") {
      toast.success(res.message || "Membership Terms Updated Successfully ✅");
    } else {
      toast.error(res?.message || "Failed to save membership terms");
    }
  } catch (err) {
    toast.error("Something went wrong while saving");
  } finally {
    setSaving(false);
  }
};



  // ✅ Cancel
  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
    {showValidationPopup && (
  <AlertDialog open onOpenChange={setShowValidationPopup}>
    <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
      {/* HEADER */}
      <AlertDialogHeader className="pb-3 border-b border-border">
        <AlertDialogTitle className="text-lg font-semibold">
          Please fix the following validation
        </AlertDialogTitle>
        <p className="text-sm text-muted-foreground">
          Some required fields are missing
        </p>
      </AlertDialogHeader>

      {/* BODY */}
      <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
        {validationErrors.map((e, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
          >
            <span className="mt-[6px] h-2 w-2 rounded-full bg-destructive shrink-0" />

            <div className="text-sm">
              <span className="font-medium">{e.section}</span>
              <span className="text-muted-foreground"> → </span>
              <span className="text-destructive">{e.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <AlertDialogFooter className="mt-5 flex justify-end">
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
        {/* Sidebar Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Sidebar Mobile */}
        <div className="lg:hidden">
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-10"
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
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]",
          )}
        >
          {/* HEADER */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Landing Page"
              onMenuClick={() => setSidebarOpen(true)}
              showBack={true}
              onBack={() => window.history.back()}
            />
          </div>

          {/* WRAPPER */}
          {/* Content Wrapper */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
            <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
              {/* LEFT NAV */}
              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0 gap-2 lg:gap-5">
                <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                  <MemberNav
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                </aside>
                <section className="flex-1 min-h-0 overflow-hidden border border-border rounded-[20px] flex flex-col">
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-3 lg:p-5">
                    {/* GENERAL TAB */}
                    <div
                      className={cn(activeSection !== "general" && "hidden")}
                    >
                      <h2 className="text-sm font-medium mb-3">
                        Content <sup className="text-destructive">*</sup>
                      </h2>
                      <div className="h-[calc(100dvh-370px)] sm:h-[calc(100dvh-380px)] lg:h-[calc(100dvh-330px)] overflow-y-auto [&_.ql-container]:overflow-hidden [&_.ql-editor]:overflow-hidden">
                                            <TermsDescriptionEditor
                                              value={membershipPayload.description}
                                              onChange={(val) =>
                                                setMembershipPayload((prev) => ({
                                                  ...prev,
                                                  description: val,
                                                }))
                                              }
                                              fullHeight
                                            />
                      </div>
                    </div>

                    {/* POLICY TAB */}
                    <div className={cn(activeSection !== "policy" && "hidden")}>
                      <MemberPolicy
                        ref={policyRef}
                        initialData={membershipPayload.policy}
                        onChange={(policyList) =>
                          setMembershipPayload((prev) => ({
                            ...prev,
                            policy: policyList,
                          }))
                        }
                      />
                    </div>

                    {/* TERMS TAB */}
                <div className={cn(activeSection !== "terms" && "hidden")}>
                  <h2 className="text-sm font-medium mb-2">
                    Term & Condition <sup className="text-destructive">*</sup>
                  </h2>

                  <TermsDescriptionEditor
                    value={membershipPayload.terms_condition}
                    onChange={(val) =>
                      setMembershipPayload((prev) => ({
                        ...prev,
                        terms_condition: val,
                      }))
                    }
                    fullHeight
                  />
                </div>

                  </div>
                </section>
              </div>

              {/* RIGHT CONTENT */}
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 absolute bottom-4 right-6">
              <Button
                type="button"
                variant="cancel"
                className="w-[105px]"
                onClick={handleCancel}
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

      <Footer />
    </>
  );
}

export default MembershipTerms;
