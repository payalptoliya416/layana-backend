import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Search,
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
import { getTreatments, reorderTreatment } from "@/services/treatmentService";
import { toast } from "sonner";

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
  const { attributes, listeners, setNodeRef, transform, transition ,isDragging} =
    useSortable({ id: item.id });
 const style = {
  transform: CSS.Transform.toString(transform),
  transition: transition ?? "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
  opacity: isDragging ? 0.6 : 1,
};

  return (
  <div className="px-[15px]">
  <div
    ref={setNodeRef}
    style={style}
    className={cn(
      "rounded-[10px] px-4 py-3 flex items-center gap-4 text-sm transition-all",
      index % 2 === 0 ? "bg-card" : "bg-muted",
      "hover:bg-muted/70"
    )}
  >
    {/* DRAG HANDLE */}
    <div
      {...attributes}
      {...listeners}
      className="w-10 flex justify-center cursor-grab text-muted-foreground hover:text-foreground transition"
    >
      <GripVertical size={18} />
    </div>

    {/* CATEGORY */}
    <div className="w-[30%] font-medium text-foreground">
      {item.category}
    </div>

    {/* TREATMENT */}
    <div className="flex-1 text-muted-foreground">
      {item.name}
    </div>

    {/* ACTIONS */}
    <div className="w-[100px] flex justify-end gap-2">
      <button
        onClick={() => onEdit(item.id)}
        className="
          h-7 w-7 rounded-full
          border border-border
          bg-card
          flex items-center justify-center
          text-muted-foreground
          hover:text-foreground hover:bg-muted
          transition
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
          transition
        "
      >
        <Trash2 size={15} />
      </button>
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

const [sortBy, setSortBy] = useState<"name" | "category">("name");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
useEffect(() => {
  const fetchTreatments = async () => {
    try {

      const res = await getTreatments({
        page,
        sortBy,
        sortDirection,
      });

      setTreatments(res.data);
      setPagination(res.pagination);
    } catch (e) {
      toast.error("Failed to load treatments");
    }
  };

  fetchTreatments();
}, [page, sortBy, sortDirection]);
const isSortingActive = sortBy !== "name" || sortDirection !== "asc";
const [deleteId, setDeleteId] = useState<number | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

// const handleDragEnd = async (event: any) => {
//   const { active, over } = event;
//   if (!over || active.id === over.id) return;

//   if (isSortingActive) {
//     toast.warning("Disable sorting to reorder");
//     return;
//   }

//   const oldIndex = treatments.findIndex((i) => i.id === active.id);
//   const newIndex = treatments.findIndex((i) => i.id === over.id);

//   const reordered = arrayMove(treatments, oldIndex, newIndex);
//   setTreatments(reordered);

//   try {
//     await reorderTreatment({
//       id: active.id,
//       index: newIndex,
//     });

//     toast.success("Order updated");

//     const res = await getTreatments({
//       page,
//       sortBy,
//       sortDirection,
//     });

//     setTreatments(res.data);
//     setPagination(res.pagination);
//   } catch (error) {
//     toast.error("Reorder failed");

//     // ❌ rollback UI
//     setTreatments(treatments);
//   }
// };
const handleDragEnd = async (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  if (isSortingActive) {
    toast.warning("Disable sorting to reorder");
    return;
  }

  const oldIndex = treatments.findIndex((i) => i.id === active.id);
  const newIndex = treatments.findIndex((i) => i.id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  const previous = [...treatments]; // 🔐 save for rollback

  // 🔄 optimistic UI update
  const reordered = arrayMove(treatments, oldIndex, newIndex);
  setTreatments(reordered);

  try {
    await reorderTreatment({
      id: active.id,
      index: newIndex,
    });

    // 🔄 fetch fresh sorted data
    const res = await getTreatments({
      page,
      sortBy,
      sortDirection,
    });

    setTreatments(res.data);
    setPagination(res.pagination);

    toast.success("Order updated");
  } catch (error) {
    toast.error("Reorder failed");
    setTreatments(previous); // ⬅ rollback
  }
};

const handleEdit = (id: number) => {
  navigate(`/treatments/edit/${id}`);
};

const handleDelete = async () => {
  if (!deleteId) return;

  try {
    setIsDeleting(true);
    await deleteTreatmentMessage(deleteId);

    setTreatments((prev) => prev.filter((t) => t.id !== deleteId));
    toast.success("Deleted successfully");
  } catch (err) {
    toast.error("Delete failed");
  } finally {
    setIsDeleting(false);
    setDeleteId(null);
  }
};

const filtered = treatments.filter((t) => {
  const name = t.name?.toLowerCase() || "";
  const category = t.category?.toLowerCase() || "";
  const q = search.toLowerCase();

  return name.includes(q) || category.includes(q);
});
  return (
    <> 
      <div className="bg-background flex overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-5",
          sidebarCollapsed ? "ml-[96px]" : "ml-[272px]"
        )}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-30 pb-3">
          <PageHeader title="Treatments" />
        </div>
        
        <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* TOP BAR */}
            <div className="mb-5 flex items-center justify-between  shrink-0">
            <div className="relative w-[256px] rounded-full  p-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
        className="
          w-full h-[48px]
          rounded-full
          border border-input
          bg-card
          px-6 pr-14
          text-[16px] text-foreground
          placeholder:text-muted-foreground
          outline-none
          focus:ring-2 focus:ring-ring/20
              "
            />
    <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

                  <button
      onClick={() => navigate("/treatments")}
      className="
        flex items-center gap-2
        rounded-full
        bg-primary
        px-5 py-3
        text-sm text-primary-foreground
        shadow-button
        hover:opacity-90
        transition
      "
    >
                <Plus size={16} /> Add Treatment
              </button>
            </div>

            {/* TABLE */}
        <div className="rounded-2xl border border-border bg-card flex flex-col flex-1 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-[15px] shrink-0">
           <div className="
              flex items-center h-[52px]
              px-[16px]
              text-sm font-medium
              text-primary
              border-b border-border
            ">
            
            {/* DRAG COLUMN */}
            <div className="w-10 flex justify-center" />

            {/* CATEGORY */}
              <div
          onClick={() => {
            setSortBy("category");
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
          className="w-[30%] pl-4 border-l border-border flex items-center justify-between cursor-pointer"
      >
              <span>Category</span>
              <div className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                <span className="text-[10px]"><img src="/top.png" alt="" /></span>
                <span className="text-[10px] -mt-1"><img src="/down.png" alt="" /></span>
              </div>
            </div>

            {/* TREATMENT */}
                    <div
              onClick={() => {
                setSortBy("name");
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
                className="flex-1 pl-4 border-l border-border  flex items-center justify-between cursor-pointer"
              >
              <span>Treatment</span>
              <div className="flex flex-col ml-2 gap-1 text-muted-foreground leading-none mr-2">
                      <span className="text-[10px]"><img src="/top.png" alt="" /></span>
                <span className="text-[10px] -mt-1"><img src="/down.png" alt="" /></span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="w-[100px] pl-4 border-l border-border text-right">
              Actions
            </div>
          </div>
          </div>
  <div className="flex-1 overflow-y-auto scrollbar-thin">
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
      <AlertDialogCancel
        onClick={() => setDeleteId(null)}
        disabled={isDeleting}
      >
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
              <SortableContext
                items={filtered.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {filtered.map((item, index) => (
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
  </div>
        {pagination && (
  <div className="shrink-0 flex items-center justify-between gap-6 px-4 py-2 text-sm text-muted-foreground">
<span className="text-foreground font-medium">
  Page {pagination.current_page} of {pagination.last_page}
</span>
<div className="flex gap-6 items-center">

    {/* First */}
    <button
      disabled={pagination.current_page === 1}
      onClick={() => setPage(1)}
      className="hover:text-foreground disabled:opacity-40 text-2xl"
    >
      «
    </button>

    {/* Prev */}
    <button
      disabled={!pagination.prev_page_url}
      onClick={() => setPage((p) => p - 1)} 
      className="hover:text-foreground disabled:opacity-40 text-2xl"
    >
      ‹
    </button>

    {/* Page Info */}
    <span className="text-foreground font-medium">
      {pagination.current_page} / {pagination.last_page}
    </span>

    {/* Next */}
    <button
      disabled={!pagination.next_page_url}
      onClick={() => setPage((p) => p + 1)}
      className="hover:text-foreground disabled:opacity-40 text-2xl"
    >
      ›
    </button>

    {/* Last */}
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
       <Footer/>
    </>
  );
}
