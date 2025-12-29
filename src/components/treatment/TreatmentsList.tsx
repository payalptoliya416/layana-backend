import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
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

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteTreatmentMessage } from "@/services/deleteServices";
import { getAllTreatments, getTreatments, reorderTreatment } from "@/services/treatmentService";
import { toast } from "sonner";
import { useAutoRows } from "@/hooks/useAutoRows";
import { Button } from "../ui/button";
import { getTableCount } from "@/services/getTeam";

/* ---------------- TYPES ---------------- */
type Treatment = {
  id: number;
  category: string;
  name: string;
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>

      {/* ================= DESKTOP ROW ================= */}
         <div
          data-row
        className={cn(
          "hidden lg:flex items-center px-4 py-3 mx-4 my-1 rounded-xl gap-2",
          index % 2 === 0 ? "bg-card" : "bg-muted",
          "hover:bg-muted/70"
        )}
      >
        {/* DRAG */}
        <div
          {...attributes}
          {...listeners}
          className="w-10 flex justify-center cursor-grab text-muted-foreground"
        >
          <GripVertical size={18} />
        </div>

        {/* CATEGORY */}
        <div className="w-[30%]  font-medium text-muted-foreground whitespace-nowrap">
          {item.category}
        </div>

        {/* TREATMENT */}
        <div className="flex-1  text-muted-foreground whitespace-nowrap">
          {item.name}
        </div>

        {/* ACTIONS */}
        <div className="w-[100px] flex justify-end gap-2 pr-4">
          <button
            onClick={() => onEdit(item.id)}
            className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="lg:hidden mx-3 my-2 rounded-xl border bg-card p-2 sm:p-4 space-y-2">
        <div className="flex items-start gap-1 justify-between">
        <div className="flex gap-3 items-center">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical size={18} />
          </div>

          <div className="flex-1">
             <p className="text-sm text-muted-foreground  mb-2">
              {item.category}
            </p>
            <p className="font-medium text-foreground">
              {item.name}
            </p>
           
          </div>
        </div>
        <div className="flex justify-end gap-2 self-start">
          <button
            onClick={() => onEdit(item.id)}
            className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground"
          >
            <Trash2 size={16} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function TreatmentsList() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }, // 👈 accidental drag avoid
  }),
  useSensor(KeyboardSensor)
);
const [treatments, setTreatments] = useState<Treatment[]>([]);
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState<any>(null);
const [sortBy, setSortBy] = useState<"id" | "category" | "name" | "index">("id");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
const { containerRef, rowsPerPage } = useAutoRows();
const [refreshKey, setRefreshKey] = useState(0);

const fetchTreatments = async () => {
  try {
    const res = await getTreatments({
      page,
       perPage: rowsPerPage,
      search,
      sortBy,
      sortDirection,
    });

    setTreatments(Array.isArray(res?.data) ? res.data : []);
    setPagination(res?.pagination ?? null);
  } catch (e) {
        setTreatments([]); 
    toast.error("Failed to load treatments");
  }
};

useEffect(() => {
    if (!rowsPerPage) return;
  fetchTreatments();
}, [page, sortBy, sortDirection,rowsPerPage, search ,refreshKey]);

useEffect(() => {
  const delay = setTimeout(() => {
    setPage(1); // reset page on search
  }, 400);

  return () => clearTimeout(delay);
}, [search]);

const [deleteId, setDeleteId] = useState<number | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

// const handleDragEnd = async (event: any) => {
//   const { active, over } = event;
//   if (!over || active.id === over.id) return;
//   const oldIndex = treatments.findIndex((i) => i.id === active.id);
//   const newIndex = treatments.findIndex((i) => i.id === over.id);

//   if (oldIndex === -1 || newIndex === -1) return;

//   const previous = [...treatments];

//   // ✅ UI ma turant reorder
//   const reordered = arrayMove(treatments, oldIndex, newIndex);
//   setTreatments(reordered);

//   try {
//     // ✅ existing API params j use thase
//     await reorderTreatment({
//       id: active.id,
//       index: newIndex + 1,
//     });

//   } catch (error) {
//     // ❌ fail thay to rollback
//     setTreatments(previous);
//     toast.error("Reorder failed");
//   }
// };

const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const activeId = Number(active.id);
  const overId = Number(over.id);

  // UI reorder (current page)
  const oldIndex = treatments.findIndex((i) => i.id === activeId);
  const newIndex = treatments.findIndex((i) => i.id === overId);

  if (oldIndex !== -1 && newIndex !== -1) {
    setTreatments((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  try {
    const totalCount = await getTableCount("treatments");
    const allTreatments = await getAllTreatments(totalCount);

    const fromIndex = allTreatments.findIndex(
      (t) => t.id === activeId
    );
    const toIndex = allTreatments.findIndex(
      (t) => t.id === overId
    );

    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = arrayMove(allTreatments, fromIndex, toIndex);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      index: index + 1,
    }));

    await reorderTreatment(payload);
    fetchTreatments();

  } catch {
    fetchTreatments();
  }
};


const handleEdit = (id: number) => {
  navigate(`/treatments-list/treatments/edit/${id}`);
};

const handleDelete = async () => {
  if (!deleteId) return;

  try {
    setIsDeleting(true);
    await deleteTreatmentMessage(deleteId);

    setTreatments((prev) => prev.filter((t) => t.id !== deleteId));
    toast.success("Deleted successfully");
    setRefreshKey((prev) => prev + 1);
  } catch (err) {
    toast.error("Delete failed");
  } finally {
    setIsDeleting(false);
    setDeleteId(null);
  }
};

 const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <> 
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
      
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        {/* HEADER */}
        <div className="sticky top-0 sidebar-index pb-3">
          
          <PageHeader title="Treatments"   onMenuClick={() => setSidebarOpen(true)}/>
        </div>
        
        <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* TOP BAR */}
            <div className="mb-2 flex items-center justify-between  shrink-0 flex-wrap gap-1 sm:gap-2">
         <div className="relative w-full sm:w-[256px] rounded-full p-1">
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

                  <button
      onClick={() => navigate("/treatments-list/treatments")}
      className="
        flex items-center gap-2
        rounded-full
        bg-primary
        px-3 sm:px-5 py-3
        text-xs sm:text-sm text-primary-foreground
        shadow-button
        hover:opacity-90
        transition w-full sm:w-auto justify-center
      "
    >
                <Plus size={16} /> Add Treatment
              </button>
            </div>
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                treatment.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
 <Button
                        variant="cancel"
                           onClick={() => setDeleteId(null)}
                        disabled={isDeleting}
                        className="rounded-[10px]"
                      >
                        Cancel
                      </Button>
               <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-[10px]"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
               </AlertDialog>
          
            <div className="grid grid-cols-12">
  <div className="col-span-12">
    <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(98dvh-300px)] sm:h-[calc(99.5dvh-300px)]">
      {/* ================= HEADER (DESKTOP ONLY) ================= */}
      <div className="sticky top-0 z-[8] bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">

        <div className="w-10" />

        <div
          onClick={() => {
            setSortBy("category");
            setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
          }}
          className="w-[30%] pl-4 border-l cursor-pointer flex items-center justify-between text-left"
        >
          Category
          <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                          <span className="text-[10px]">
                            <img src="/top.png" alt="" />
                          </span>
                          <span className="text-[10px] -mt-1">
                            <img src="/down.png" alt="" />
                          </span>
                        </span>
        </div>

        <div
          onClick={() => {
            setSortBy("name");
            setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
          }}
          className="flex-1 pl-4 border-l cursor-pointer flex items-center justify-between text-left"
        >
          Treatment

          <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                          <span className="text-[10px]">
                            <img src="/top.png" alt="" />
                          </span>
                          <span className="text-[10px] -mt-1">
                            <img src="/down.png" alt="" />
                          </span>
                        </span>
        </div>

        <div className="w-[100px] pl-4 border-l text-left pr-4">
          Actions
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div  ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {treatments.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No Treatment found
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext
              items={treatments.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {treatments.map((item, index) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>

    {/* ================= PAGINATION ================= */}
    {pagination && (
      <div className="h-[56px] flex items-center justify-center gap-6 px-4 py-2 text-sm text-muted-foreground">
        <button disabled={pagination.current_page === 1} onClick={() => setPage(1)} className="text-2xl">«</button>
        <button disabled={!pagination.prev_page_url} onClick={() => setPage(p => p - 1)} className="text-2xl">‹</button>
        <span className="text-foreground font-medium">
          {pagination.current_page} / {pagination.last_page}
        </span>
        <button disabled={!pagination.next_page_url} onClick={() => setPage(p => p + 1)} className="text-2xl">›</button>
        <button disabled={pagination.current_page === pagination.last_page} onClick={() => setPage(pagination.last_page)} className="text-2xl">»</button>
      </div>
    )}
  </div>
</div>

          </div>
        </div>
      </div>
      </div>
       <Footer/>
    </>
  );
}
