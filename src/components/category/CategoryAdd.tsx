import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "@/services/getCategory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function CategoryAdd() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  /* ---------- EDIT MODE ---------- */
const { id } = useParams();
const editId = id ? Number(id) : undefined;
const isEdit = Boolean(editId);


  /* ---------- FORM STATE ---------- */
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
const [status, setStatus] = useState<"draft" | "live">("draft");
const [statusError, setStatusError] = useState<string | null>(null);

  /* ---------- FETCH SINGLE CATEGORY ---------- */
  useEffect(() => {
    if (!isEdit || !editId) return;

    const fetchCategory = async () => {
      try {
        setInitialLoading(true);
        const data = await getCategoryById(editId);
        setName(data.name); // 👈 API DATA SET
        setStatus(data.status ?? "draft");
      } catch {
        toast.error("Failed to load category");
        navigate(-1);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [isEdit, editId, navigate]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError("Category name is required");
      return;
    }

    setNameError(null);

    try {
      setLoading(true);

      if (isEdit && editId) {
        await updateCategory({ id: editId, name ,status  });
        toast.success("Category updated successfully");
      } else {
        await createCategory({ name });
        toast.success("Category created successfully");
      }

      navigate(-1);
    } catch {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-background flex">
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
                className="fixed inset-0 bg-black/40 z-10"
                onClick={() => setSidebarOpen(false)}
              />
              <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
            </>
          )}
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title={isEdit ? "Edit Category" : "Add Category"}
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>

          <div className="flex-1 bg-card rounded-2xl shadow-card p-6 overflow-hidden">
            {initialLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading category...
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Category Name <sup className="text-destructive">*</sup>
                    </label>

                    <input
                      className={cn(
                        "form-input mt-1",
                        nameError &&
                          "border-destructive focus:ring-destructive"
                      )}
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                    />

                    {nameError && (
                      <p className="mt-1 text-sm text-destructive">
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div>
  <label className="text-sm font-medium text-foreground">
    Status <sup className="text-destructive">*</sup>
  </label>

  <Select
    value={status}
    onValueChange={(v) => {
      setStatus(v as "draft" | "live");
      if (statusError) setStatusError(null);
    }}
  >
    <SelectTrigger
      className={cn(
        "form-input",
        statusError && "border-destructive focus:ring-destructive"
      )}
    >
      <SelectValue placeholder="Select status" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="draft">Draft</SelectItem>
      <SelectItem value="live">Live</SelectItem>
    </SelectContent>
  </Select>

  {statusError && (
    <p className="mt-1 text-sm text-destructive">{statusError}</p>
  )}
</div>

                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="cancel"
                    className="w-[105px]"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="save"
                    className="w-[105px]"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CategoryAdd;
