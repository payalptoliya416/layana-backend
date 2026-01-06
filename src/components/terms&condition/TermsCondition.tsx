import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  getTermsCondition,
  saveTermsCondition,
} from "@/services/termsConditionService";
import TermsDescriptionEditor from "./TermsDescriptionEditor";

function TermsCondition() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [showRequired, setShowRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValue, setInitialValue] = useState("");
  const [value, setValue] = useState("");
  const [hasChange, setHasChange] = useState(false);

  /* ================= FETCH DATA ================= */

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await getTermsCondition();
      const html = res.data?.value || "";
      setInitialValue(html);
      setValue(html);
      setHasChange(false);
    } catch {
      toast.error("Failed to load terms & conditions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  /* ================= HANDLERS ================= */
const isEditorEmpty = (html: string) => {
  const stripped = html
    .replace(/<(.|\n)*?>/g, "") // remove tags
    .replace(/&nbsp;/g, "")
    .trim();

  return stripped.length === 0;
};

  const handleChange = (v: string) => {
    setValue(v);
    setHasChange(v !== initialValue);
  };

const handleSave = async () => {
  if (isEditorEmpty(value)) {
    setShowRequired(true); // ✅ OPEN VALIDATION POPUP
    return;
  }

  try {
    setLoading(true);
    await saveTermsCondition(value);
    toast.success("Terms & Conditions updated");
    fetchTerms();
  } catch {
    toast.error("Failed to save");
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setValue(initialValue);
    setHasChange(false);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-background flex">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-10"
              onClick={() => setSidebarOpen(false)}
            />
            <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
          </>
        )}
      </div>

      {/* CONTENT */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        {/* HEADER */}
        <div className="sticky top-3 z-10 pb-3">
          <PageHeader
            title="Terms & Condition"
            onMenuClick={() => setSidebarOpen(true)}
            onBack={() => navigate(-1)}
            showBack
          />
        </div>

        {/* CARD */}
        <div
        className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-2xl shadow-card p-5
        overflow-hidden h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]"
        >
        {/* CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* EDITOR MUST BE flex-1 */}
            <div className="flex-1 overflow-hidden">
            <TermsDescriptionEditor
                value={value}
                onChange={handleChange}
                fullHeight
            />
            </div>

            {/* FOOTER */}
            <div className="pt-4 flex justify-end gap-3">
            <Button
                type="button"
                variant="cancel"
                className="w-[105px]"
                onClick={handleCancel}
                disabled={loading}
            >
                Cancel
            </Button>

            <Button
                type="button"
                variant="save"
                onClick={handleSave}
                disabled={loading}
                className="w-[105px] flex items-center justify-center gap-2"
            >
                {loading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                </>
                ) : (
                "Save"
                )}
            </Button>
            </div>
        </div>
        </div>
      <AlertDialog open={showRequired} onOpenChange={setShowRequired}>
  <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
    <AlertDialogHeader className="pb-3 border-b border-border">
      <AlertDialogTitle className="text-lg font-semibold text-foreground">
        Please fix the following validation
      </AlertDialogTitle>
      <p className="text-sm text-muted-foreground">
        Some required fields are missing or invalid
      </p>
    </AlertDialogHeader>

    <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-sm">
        <strong>Terms & Conditions:</strong>{" "}
        <span className="text-destructive">This field is required</span>
      </div>
    </div>

    <AlertDialogFooter>
      <Button onClick={() => setShowRequired(false)}>OK</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </div>
    </div>
  );
}

export default TermsCondition;
