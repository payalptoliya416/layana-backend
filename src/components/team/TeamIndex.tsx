import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import TeamGeneral from "./TeamGeneral";
import TeamVisuals from "./TeamVisuals";
import { TeamNav } from "./TeamNav";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { createTeam, getTeamById, updateTeam } from "@/services/teamService";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export type TeamGeneralForm = {
  name: string;
  designation: string;
  featured: boolean;
  description: string;
};

/* ---------- Visual Tab ---------- */
export type TeamVisualForm = {
  images: string[];
};

/* ---------- Full Form ---------- */
export type LocationFormData = {
  general: TeamGeneralForm;
  visuals: TeamVisualForm;
};

function TeamIndex() {
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

  /* ---------- refs ---------- */
  const generalRef = useRef<any>(null);
  const visualRef = useRef<any>(null);

  /* ---------- central data store ---------- */
  const [formData, setFormData] = useState<LocationFormData>({
    general: {
      name: "",
      designation: "",
      featured: false,
      description: "",
    },
    visuals: {
      images: [],
    },
  });

  /* ---------- cancel ---------- */
  const handleCancel = () => {
    navigate("/team");
  };

  /* ---------- render tabs ---------- */
  const renderTabContent = () => (
    <>
      <div className={cn(activeSection !== "general" && "hidden")}>
        <TeamGeneral
          ref={generalRef}
          initialData={formData.general}
          onChange={(data) =>
           setFormData((prev) => ({
            ...prev,
            general: {
                ...prev.general, // ✅ keeps required fields
                ...data,         // ✅ overwrite only changed fields
            },
            }))}
        />
      </div>

      <div className={cn(activeSection !== "visuals" && "hidden")}>
        <TeamVisuals
          ref={visualRef}
          initialImages={formData.visuals.images}
          onChange={(images) =>
            setFormData((p) => ({
              ...p,
              visuals: { images },
            }))
          }
        />
      </div>
    </>
  );

  /* ---------- SAVE ---------- */
  const handleSaveTeam = async () => {
    setSaving(true);

    const results = await Promise.all([
      generalRef.current?.validate(),
      visualRef.current?.validate?.(), 
    ]);

    const allErrors = results
      .filter((r) => r && !r.valid)
      .flatMap((r) => r.errors);

    if (allErrors.length) {
      toast.error(allErrors[0].message);
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
      name: formData.general.name,
      designation: formData.general.designation,
      featured: formData.general.featured,
      description: formData.general.description,
      images: formData.visuals.images,
    };

    try {
      if (isEdit && id) {
        await updateTeam(id, payload);
        toast.success("Team updated successfully");
      } else {
        await createTeam(payload);
        toast.success("Team created successfully");
      }

      navigate("/team");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- EDIT MODE LOAD ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchTeam = async () => {
      try {
        const data = await getTeamById(id);
        // ⬇️ central state
        setFormData({
          general: {
            name: data.name,
            designation: data.designation,
            featured: data.featured,
            description: data.description,
          },
          visuals: {
            images: data.images || [],
          },
        });

        // ⬇️ push to children
        generalRef.current?.setData({
          name: data.name,
          designation: data.designation,
          featured: data.featured,
          description: data.description,
        });

        visualRef.current?.setData?.({
          images: data.images || [],
        });
      } catch {
        toast.error("Failed to load team");
      }
    };

    fetchTeam();
  }, [id, isEdit]);

  const handleCancle = () => {
    navigate("/team");
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
          "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-3 z-10 pb-3">
          <PageHeader
            title={"Team"}
            onMenuClick={() => setSidebarOpen(true)}
               onBack={() => navigate(-1)}
               showBack = {true}
          />
        </div>

        <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 relative overflow-hidden">
          <div className="flex w-full gap-5 flex-1 overflow-y-auto scrollbar-thin pb-14">
            <div className="lg:flex w-full gap-5 h-full overflow-y-auto">
              <aside className="lg:w-[270px] flex-shrink-0 border border-border lg:p-4 rounded-[20px] lg:h-full overflow-y-auto mb-3 lg:mb-0">
                <TeamNav
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
                              onClick={handleSaveTeam}
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

export default TeamIndex;
