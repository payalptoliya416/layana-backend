import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import {
  Eye,
  GripVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  deleteMembership,
  getAllMemberships,
  getMemberships,
  MembershipPayload,
  reorderMembership,
} from "@/services/getMemberShip";
import { useAutoRows } from "@/hooks/useAutoRows";
import { getTableCount } from "@/services/getTeam";

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
          "hidden xl:flex items-center px-4 py-3 mx-4 my-1 rounded-xl",
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

        {/* NAME */}
        <div className="w-[25%] pl-4">{item.name}</div>

        {/* STATUS */}
        <div className="flex-1 pl-4">
          {item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : ""}
        </div>

        {/* <div className="w-[20%] pl-4">
          {item.locations?.length ?? 0}
        </div>

        <div className="w-[20%] pl-4">
          {item.pricing?.length ?? 0}
        </div>

        <div className="w-[10%] pl-4">
          {item.faq?.length ?? 0}
        </div> */}

        {/* ACTIONS */}
        <div className="w-[160px] flex justify-end gap-2 pl-4">
          <td className="w-[160px] flex justify-start gap-2 whitespace-nowrap pl-4">
            <button
              onClick={() => onEdit(item.id)}
              className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted"
            >
              <Trash2 size={14} />
            </button>
          </td>
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="xl:hidden mx-3 my-2 rounded-xl border bg-card p-4 space-y-2">
        <div className="flex justify-between items-center">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground capitalize">
               <span
                  className={cn(
                    "inline-block mb-2 px-3 py-1 rounded-sm text-xs",
                    item.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                {item.status}
                </span>
            </p>
            <p className="font-medium">{item.name}</p>
{/* 
            <p className="text-sm text-muted-foreground mt-1">
              Locations: {item.locations?.length ?? 0}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Pricing Plans: {item.pricing?.length ?? 0}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              FAQs: {item.faq?.length ?? 0}
            </p> */}
          </div>

          <div className="flex gap-2 self-start">
            <button
              onClick={() => onEdit(item.id)}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MassageMemberShip() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"id" | "name" | "status" | 'index'>("index");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { containerRef, rowsPerPage } = useAutoRows();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [memberships, setMemberships] = useState<MembershipPayload[]>([]);

  const fetchMemberships = async () => {
       if (!rowsPerPage) return;
    try {
      const res = await getMemberships({
        page,
        perPage: rowsPerPage,
        search: debouncedSearch,
        sortBy,
        sortDirection,
      });

      setMemberships(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load memberships");
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [page, debouncedSearch, sortBy, sortDirection,rowsPerPage]);
  
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);
  
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const activeId = Number(active.id);
  const overId = Number(over.id);

  // 🔹 UI instant reorder
  const oldIndex = memberships.findIndex(m => m.id === activeId);
  const newIndex = memberships.findIndex(m => m.id === overId);

  if (oldIndex !== -1 && newIndex !== -1) {
    setMemberships(prev => arrayMove(prev, oldIndex, newIndex));
  }

  try {
    const totalCount = await getTableCount("memberships");
    const allMemberships = await getAllMemberships(totalCount);

    const fromIndex = allMemberships.findIndex(m => m.id === activeId);
    const toIndex = allMemberships.findIndex(m => m.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = arrayMove(allMemberships, fromIndex, toIndex);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      index: index + 1,
    }));

    await reorderMembership(payload);
    fetchMemberships();

  } catch {
    toast.error("Reorder failed");
    fetchMemberships();
  }
};

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteMembership(deleteId);
      toast.success("Membership deleted successfully");
      fetchMemberships();
    } catch {
      toast.error("Failed to delete Membership");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/massage-membership/edit/${id}`);
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
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Sticky Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Memberships"
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>

          {/* Content */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-2xl shadow-card p-5 overflow-hidden h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]">
            <div className="flex flex-col flex-1 overflow-hidden">
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
                  onClick={() => navigate("/massage-membership/add")}
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
                  <Plus size={16} /> Add Membership
                </button>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <div className="w-full rounded-2xl border border-border bg-card flex flex-colh-[calc(98vh-300px)]">
                    {/* ================= HEADER (DESKTOP) ================= */}
                    <div className="sticky top-0 z-[9] bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
                      <div className="w-10"></div>
                      <div 
                        className="w-[25%] pl-4 cursor-pointer flex items-center justify-between text-left"
                        onClick={() => {
                          setSortBy("name");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                        Name
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
                        className="flex-1 pl-4 border-l cursor-pointer flex items-center justify-between text-left"
                        onClick={() => {
                          setSortBy("status");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                        Status
                        <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                          <span className="text-[10px]">
                            <img src="/top.png" alt="" />
                          </span>
                          <span className="text-[10px] -mt-1">
                            <img src="/down.png" alt="" />
                          </span>
                        </span>
                      </div>
                      <div className="w-[10%] pl-4 border-l text-left pr-4">
                        Actions
                      </div>
                    </div>

                    {/* ================= BODY ================= */}
                    <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin">
                      {!memberships || memberships.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground text-sm">
                          No Data found
                        </div>
                      ) : (
                        <DndContext
                        
                          onDragEnd={handleDragEnd}
                          collisionDetection={closestCenter}
                          sensors={sensors}
                           measuring={{
                                        droppable: {
                                          strategy: MeasuringStrategy.Always,
                                        },
                                      }}
                        >
                          <SortableContext
                            items={memberships.map((i) => i.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {memberships.map((item, index) => (
                              <SortableRow
                                key={item.id}
                                item={item}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={(id) => setDeleteId(id)}
                                // onToggleFeatured={handleFeaturedToggle}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  </div>

                  {/* ================= PAGINATION ================= */}
                  {pagination && (
                    <div className="flex items-center justify-center gap-6 px-4 py-2 text-sm text-muted-foreground">
                      <button
                        disabled={pagination.current_page === 1}
                        onClick={() => setPage(1)}
                        className="text-2xl"
                      >
                        «
                      </button>
                      <button
                        disabled={!pagination.prev_page_url}
                        onClick={() => setPage((p) => p - 1)}
                        className="text-2xl"
                      >
                        ‹
                      </button>
                      <span className="text-foreground font-medium">
                        {pagination.current_page} / {pagination.last_page}
                      </span>
                      <button
                        disabled={!pagination.next_page_url}
                        onClick={() => setPage((p) => p + 1)}
                        className="text-2xl"
                      >
                        ›
                      </button>
                      <button
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        onClick={() => setPage(pagination.last_page)}
                        className="text-2xl"
                      >
                        »
                      </button>
                    </div>
                  )}
                </div>
                <AlertDialog
                  open={!!deleteId}
                  onOpenChange={() => setDeleteId(null)}
                >
                  <AlertDialogContent className="max-w-[420px] rounded-2xl p-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg">
                        Delete Membership?
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this Membership? This action
                      cannot be undone.
                    </p>

                    <AlertDialogFooter className="mt-6">
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
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                        className="rounded-[10px]"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MassageMemberShip;
