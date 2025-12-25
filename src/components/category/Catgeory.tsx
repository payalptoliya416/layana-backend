import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "@/services/getCategory";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type Category = {
  id: number;
  name: string;
    status: "Live" | "Draft";
};

function SortableRow({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: any;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 px-4 py-3 text-sm rounded-[10px] mx-[15px] my-1 transition-all",
        index % 2 === 0 ? "bg-card" : "bg-muted",
        "hover:bg-muted/70"
      )}
    >
      {/* DRAG */}
      <td
        {...attributes}
        {...listeners}
        className="w-10 flex justify-center cursor-grab text-muted-foreground hover:text-foreground whitespace-nowrap"
      >
        <GripVertical size={18} />
      </td>

      {/* TREATMENT */}
      <td className="text-muted-foreground whitespace-nowrap w-[30%]">
        {item.name}
      </td>
      <td className="flex-1 text-muted-foreground whitespace-nowrap w-[30%]">
         {item.status
    ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
    : ""}
      </td>

      {/* ACTIONS */}
      <td className="w-[100px] flex justify-end gap-2 whitespace-nowrap">
        <button
          onClick={() => onEdit(item.id)}
          className="
            h-7 w-7 rounded-full
            border border-border
            bg-card
            flex items-center justify-center
            text-muted-foreground
            hover:text-foreground hover:bg-muted
          "
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="
            h-7 w-7 rounded-full
            border border-border
            bg-card
            flex items-center justify-center
            text-muted-foreground
            hover:bg-muted
          "
        >
          <Trash2 size={15}/>
        </button>
      </td>
    </tr>
  );
}

function Catgeory() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 👈 accidental drag avoid
    }),
    useSensor(KeyboardSensor)
  );
const noDataToastShownRef = useRef(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"id" | "category" | "status">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
const [category, setCategory] = useState<Category[]>([]);
const [deleteId, setDeleteId] = useState<number | null>(null);

useEffect(() => {
  const fetchTreatments = async () => {
    try {
      const res = await getCategory({
        page,
        perPage: 10,
        search,
        sortBy,
        sortDirection,
      });

      setCategory(res.data);
      setPagination(res.pagination);

       if (res.data.length === 0) {
        if (!noDataToastShownRef.current) {
          // toast.info("No categories found");
          noDataToastShownRef.current = true;
        }
      } else {
        noDataToastShownRef.current = false;
      }
    } catch (e) {
      toast.error("Failed to load treatments");
    }
  };

  fetchTreatments();
}, [page, sortBy, sortDirection, search]);

useEffect(() => {
  const delay = setTimeout(() => {
    setPage(1);
    noDataToastShownRef.current = false;
  }, 400);

  return () => clearTimeout(delay);
}, [search]);

const handleDelete = async () => {
  if (!deleteId) return;

  try {
    await deleteCategory(deleteId);
    toast.success("Category deleted successfully");

    const res = await getCategory({
      page,
      perPage: 10,
      search,
      sortBy,
      sortDirection,
    });

    setCategory(res.data);
    setDeleteId(null);
  } catch {
    toast.error("Failed to delete category");
  }
};

// -----------------------

  /* ---------- EDIT MODE ---------- */
const { id } = useParams();
const editId = id ? Number(id) : undefined;
const isEdit = Boolean(editId);
const [editingId, setEditingId] = useState<number | null>(null);

  /* ---------- FORM STATE ---------- */
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
const [status, setStatus] = useState<"Draft" | "Live">("Draft");
const [statusError, setStatusError] = useState<string | null>(null);

  /* ---------- FETCH SINGLE CATEGORY ---------- */
 

  useEffect(() => {
    if (!isEdit || !editId) return;

    const fetchCategory = async () => {
      try {
        setInitialLoading(true);
        const data = await getCategoryById(editId);
        setName(data.name); // 👈 API DATA SET
        setStatus(data.status ?? "Draft");
      } catch {
        toast.error("Failed to load category");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [isEdit, editId, navigate]);

 const handleEdit = (id: number) => {
  const selected = category.find((c) => c.id === id);
  if (!selected) return;

  setEditingId(id);
  setName(selected.name); // 👈 form ma value fill
   setStatus(selected.status); // 👈 form ma value fill
  setNameError(null);
  setStatusError(null);

  window.scrollTo({ top: 0, behavior: "smooth" }); // optional UX
};
  /* ---------- SUBMIT ---------- */
const handleSubmit = async () => {
  if (!name.trim()) {
    setNameError("Category name is required");
    return;
  }
   if (!status) {
    setStatusError("Status is required");
    return;
  }

  try {
    setLoading(true);

    if (editingId) {
      // UPDATE
      await updateCategory({ id: editingId, name , status });
      toast.success("Category updated successfully");
    } else {
      // CREATE
      await createCategory({ name , status});
      toast.success("Category created successfully");
    }

    // 🔁 REFRESH TABLE
    const res = await getCategory({
      page,
      perPage: 10,
      search,
      sortBy,
      sortDirection,
    });

     setCategory(res.data);

    // 🔄 RESET FORM
    setName("");
    setStatus("Draft");
    setEditingId(null);
    setNameError(null);
    setStatusError(null);;
  } catch {
    toast.error("Failed to save category");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="bg-background flex">
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

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-5",
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

          {/* Content */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 overflow-hidden">
              <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
            <div className=" mb-8">
                        {initialLoading ? (
                          <div className="text-sm text-muted-foreground">
                            Loading category...
                          </div>
                        ) : (
                          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
                            <div className="space-y-6 flex items-center justify-center ">
                                <div className="w-[80%] xl:w-[40%] rounded-2xl border border-border p-6 ">
                              <div className="mb-5">
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
                        setStatus(v as "Draft" | "Draft");
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
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                      </SelectContent>
                    </Select>

                    {statusError && (
                      <p className="mt-1 text-sm text-destructive">{statusError}</p>
                    )}
                  </div>

                              <div>
                            <div className="flex justify-center  gap-3 mt-5">
                              <Button
                                type="button"
                                variant="cancel"
                                className="w-[105px]"
                                onClick={() => {
                                    setName("");
                                    setEditingId(null);
                                    setNameError(null);
                                    setStatusError(null);
                                }}
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
                                {loading ? "Saving..." : editingId ? "Update" : "Save"}
                                </Button>
                            </div>
                              </div>
                                </div>
                            </div>
                          </div>
                        )}
            </div>

            <div className="">
               <div className="mb-2 flex items-center justify-between  shrink-0 flex-wrap gap-1 sm:gap-2">
                <div className="relative w-[150px] sm:w-[256px] rounded-full p-1">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="
                                        w-full h-[40px] sm:h-[48px]
                                        rounded-full
                                        border border-input
                                        bg-card
                                        pl-2 sm:pl-6 pr-[41px]
                                        text-[16px] text-foreground
                                        placeholder:text-muted-foreground
                                        outline-none
                                        focus:ring-2 focus:ring-ring/20
                                      "
                  />

                  {/* Search icon (jab search empty hoy) */}
                  {!search && (
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}

                  {/* Clear (X) icon (jab search ma text hoy) */}
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <div className="w-full overflow-auto rounded-2xl border border-border bg-card flex flex-col scrollbar-thin  max-h-[78vh]">
                    <table className="w-full text-sm text-left">
                          <thead className="sticky top-0 z-10 bg-card">
                             <tr
                        className="
                          flex items-center h-[52px]
                          px-[16px]
                          text-sm font-medium
                          text-primary
                          border-b border-border
                        "
                      >
                        {/* DRAG COLUMN */}
                        <th className="w-10 flex justify-center" />

                        {/* CATEGORY */}
                        <th
                          onClick={() => {
                            setSortBy("category");
                            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                          }}
                          className="
                            w-[30%] pl-4
                            border-l border-border
                            flex items-center justify-between
                            cursor-pointer
                            text-left
                          "
                        >
                          <span>Category</span>
                          <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                            <span className="text-[10px]">
                              <img src="/top.png" alt="" />
                            </span>
                            <span className="text-[10px] -mt-1">
                              <img src="/down.png" alt="" />
                            </span>
                          </span>
                        </th>
                        <th
                          onClick={() => {
                            setSortBy("status");
                            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                          }}
                          className="
                            w-[30%] pl-4
                            border-l border-border
                            flex items-center justify-between
                            cursor-pointer
                            text-left
                          "
                        >
                          <span>Status</span>
                          <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                            <span className="text-[10px]">
                              <img src="/top.png" alt="" />
                            </span>
                            <span className="text-[10px] -mt-1">
                              <img src="/down.png" alt="" />
                            </span>
                          </span>
                        </th>

                        {/* ACTIONS */}
                        <th
                          className="
                            w-[100px] pl-4
                            border-l border-border
                            text-right ml-auto
                          "
                        >
                          Actions
                        </th>
                      </tr>
                          </thead>
                           <tbody className="block flex-1 overflow-y-auto scrollbar-thin ">
                                    <DndContext
                                                    collisionDetection={closestCenter}
                                                    // onDragEnd={handleDragEnd}
                                                    sensors={sensors}
                                                    // measuring={{
                                                    //   droppable: {
                                                    //     strategy: MeasuringStrategy.Always,
                                                    //   },
                                                    // }}
                                                  >
                                                    <SortableContext
                                                      items={category.map((i) => i.id)}
                                                      strategy={verticalListSortingStrategy}
                                                    >
                                                     {category.length > 0 ? (
                                                category.map((item, index) => (
                                                    <SortableRow
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    onEdit={handleEdit}
                                                    onDelete={(id) => setDeleteId(id)}
                                                    />
                                                ))
                                                ) : (
                                                <tr className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                                                    <td className="text-center w-full">
                                                    {search
                                                        ? "No categories available."
                                                        : "No categories available."}
                                                    </td>
                                                </tr>
                                                )}
                                                    </SortableContext>
                                                  </DndContext>
                           </tbody>
                              <tfoot>
                      <tr>
                        <td>
                               <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the
                                            category.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                            
                                        <AlertDialogFooter>
                                          <AlertDialogCancel
                                            onClick={() => setDeleteId(null)}
                                          >
                                            Cancel
                                          </AlertDialogCancel>
                            
                                          <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                           </AlertDialog>
                        </td>
                      </tr>
                    </tfoot>
                    </table>
                  </div>
                        {pagination && (
                        <div className="shrink-0 flex items-center justify-center gap-6 px-4 py-2 text-sm text-muted-foreground">
                            {/* <span className="text-foreground font-medium">
                            Page {pagination.current_page} of {pagination.last_page}
                            </span> */}

                            <div className="flex gap-6 items-center">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() => setPage(1)}
                                className="hover:text-foreground disabled:opacity-40 text-2xl"
                            >
                                «
                            </button>

                            <button
                                disabled={!pagination.prev_page_url}
                                onClick={() => setPage((p) => p - 1)}
                                className="hover:text-foreground disabled:opacity-40 text-2xl"
                            >
                                ‹
                            </button>

                            <span className="text-foreground font-medium">
                                {pagination.current_page} / {pagination.last_page}
                            </span>

                            <button
                                disabled={!pagination.next_page_url}
                                onClick={() => setPage((p) => p + 1)}
                                className="hover:text-foreground disabled:opacity-40 text-2xl"
                            >
                                ›
                            </button>

                            <button
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => setPage(pagination.last_page)}
                                className="hover:text-foreground disabled:opacity-40 text-2xl"
                            >
                                »
                            </button>
                            </div>
                        </div>
                        )}
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

export default Catgeory;
