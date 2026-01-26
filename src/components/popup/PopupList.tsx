import React, { useEffect, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useAutoRows } from "@/hooks/useAutoRows";
import { deletePopup, getPopups, PopupItem } from "@/services/popup";
import { toast } from "sonner";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Footer } from "../layout/Footer";

function PopupSortableRow({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: PopupItem;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
const getStatusLabel = (status: number) => {
  return status === 1 ? "Active" : "Inactive";
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

        {/* NAME */}
        <div className="w-[25%] pl-4">
          <p className="font-medium">{item.title}</p>
        </div>

        {/* STATUS */}
        <div className="flex-1 pl-4">
           {getStatusLabel(item.status)}
        </div>

        {/* ACTIONS */}
        <div className="w-[160px] flex justify-start gap-2 pl-8">
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
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="xl:hidden mx-3 my-2 rounded-xl border bg-card p-4 space-y-2">
        <div className="flex justify-between items-start">

          <div className="flex-1 px-3">
            <span
              className={cn(
                "inline-block mb-2 px-3 py-1 rounded-sm text-xs",
                item.status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {item.status === 1 ? "Active" : "Inactive"}
            </span>

             <p className="font-medium">{item.title}</p>
          </div>

          <div className="flex gap-2">
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

function PopupList() {
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
  const [sortBy, setSortBy] = useState<"id" | "name" | "status" | "index">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { containerRef, rowsPerPage } = useAutoRows();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPopups = async () => {
    if (!rowsPerPage) return;

    try {
      setLoading(true);

      const res = await getPopups({
        page,
        perPage: rowsPerPage,
        search: debouncedSearch,
        sortBy,
        sortDirection,
      });

      setPopups(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load popups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, [page, debouncedSearch, sortBy, sortDirection, rowsPerPage]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const statusMap: Record<number, { label: string; className: string }> = {
    1: {
      label: "Active",
      className: "bg-green-100 text-green-700",
    },
    0: {
      label: "Inactive",
      className: "bg-red-100 text-red-700",
    },
  };

const handleDeleteConfirm = async () => {
  if (!deleteId) return;

  try {
    setIsDeleting(true);
    await deletePopup(deleteId);
    toast.success("Popup deleted successfully");
    fetchPopups();
  } catch {
    toast.error("Failed to delete popup");
  } finally {
    setIsDeleting(false);
    setDeleteId(null);
  }
};


  return (
    <>
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
          "flex-1 flex flex-col transition-all h-[calc(95vh-24px)] duration-300 mt-3 px-3 sm:px-5",
          sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
        )}
      >
        <div className="sticky top-3 z-10 pb-3">
          <PageHeader
            title={"Popup"}
            // title={teamName || "Team"}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        <div
          className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-2xl shadow-card p-5
    relative overflow-hidden h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]"
        >
          <div className="flex flex-col flex-1">
            <div className="mb-2 flex items-center justify-between  shrink-0 flex-wrap gap-1 sm:gap-2">
              <div className="relative w-full sm:w-[256px] rounded-full p-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className=" w-full h-[40px] sm:h-[48px] rounded-full border border-input bg-card
                   pl-2 sm:pl-6 pr-[41px] text-[16px] text-foreground placeholder:text-muted-foreground
                outline-none focus:ring-2 focus:ring-ring/20"
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
                onClick={() => navigate("/popup/add")}
                className="flex items-center gap-2 rounded-full bg-primary px-3 sm:px-5 py-3 text-xs sm:text-sm text-primary-foreground shadow-button hover:opacity-90 transition w-full sm:w-auto justify-center"
              >
                <Plus size={16} /> Add popup
              </button>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(98vh-300px)]">
                  {/* ================= HEADER (DESKTOP) ================= */}
                  <div className="sticky top-0 z-[9] bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
                    <div
                      className="w-[25%] pl-4 cursor-pointer flex items-center justify-between text-left"
                      onClick={() => {
                        setSortBy("name");
                        setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
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
                        setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
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
                  <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto scrollbar-thin"
                  >
                    {!popups || popups.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-sm">
                        No Data found
                      </div>
                    ) : (
                      <DndContext
                        collisionDetection={closestCenter}
                        sensors={sensors}
                        measuring={{
                          droppable: {
                            strategy: MeasuringStrategy.Always,
                          },
                        }}
                      >
                        <SortableContext
                          items={popups.map((i) => i.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {popups.map((item, index) => (
                            <PopupSortableRow
                              key={item.id}
                              item={item}
                              index={index}
                              onEdit={(id) => navigate(`/popup/add/${id}`)}
                              onDelete={(id) => setDeleteId(id)}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>
                 {pagination && (
                    <div
                      data-pagination
                      className="flex items-center justify-center gap-6 px-4 py-2 text-sm text-muted-foreground"
                    >
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
                        Delete Popup?
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this Popup? This action
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
    <Footer/>
    </>
  );
}

export default PopupList;
