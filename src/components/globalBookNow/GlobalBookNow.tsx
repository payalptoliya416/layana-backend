import React, { useEffect, useState } from "react";
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
  getGlobalBookNow,
  saveGlobalBookNow,
} from "@/services/globalBookNowService";
import { Footer } from "../layout/Footer";

function GlobalBookNow() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialValue, setInitialValue] = useState("");
  const [value, setValue] = useState("");
  const [hasChange, setHasChange] = useState(false);

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  /* ------------------ Helpers ------------------ */

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  /* ------------------ Fetch ------------------ */

  const fetchBookingLink = async () => {
    try {
      setLoading(true);
      const res = await getGlobalBookNow();
      const url = res.data?.value || "";
      setInitialValue(url);
      setValue(url);
      setHasChange(false);
    } catch {
      toast.error("Failed to load booking link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingLink();
  }, []);

  /* ------------------ Save ------------------ */

  const handleSave = async () => {
    if (!value.trim()) {
      setError("Booking URL is required");
      setShowError(true);
      return;
    }

    if (!isValidUrl(value)) {
      setError("Please enter a valid URL (https://...)");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      await saveGlobalBookNow(value);
      toast.success("Global booking link updated");
      fetchBookingLink();
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

  /* ------------------ UI ------------------ */

  return (
    <>
      {/* Validation Popup */}
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent className="max-w-[520px] rounded-2xl p-6">
          <AlertDialogHeader className="pb-3 border-b border-border">
            <AlertDialogTitle className="text-lg font-semibold text-foreground">
              Please fix the following validation
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <strong>Global Booking URL:</strong>{" "}
            <span className="text-destructive">{error}</span>
          </div>

          <AlertDialogFooter>
            <Button onClick={() => setShowError(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-background flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar */}
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

        {/* Main Content */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Global Book Now"
              onMenuClick={() => setSidebarOpen(true)}
              onBack={() => navigate(-1)}
              showBack
            />
          </div>
 <div
        className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-2xl shadow-card p-5
        overflow-hidden h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]"
        >
              <div className="flex-1 flex flex-col overflow-hidden">
                     <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-12">
  <div className="col-span-12 xl:col-span-6 xl:col-start-4">
                  <div>
                <label className="text-sm font-medium">
                   Booking URL{" "}
                  <span className="text-destructive">*</span>
                </label>

                <input
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setHasChange(e.target.value !== initialValue);
                  }}
                  placeholder="https://example.com"
                  className="mt-2 w-full h-[48px] rounded-xl border px-4 text-sm bg-card focus:ring-2 focus:ring-ring/30"
                />
                  </div>
                  <div className="pt-6 flex justify-center gap-3">
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
                     </div>
              </div>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default GlobalBookNow;
