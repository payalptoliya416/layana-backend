import {
  ChevronDown,
  GripVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddFaqModal from "@/components/treatment/AddFaqModal";
import { Sidebar } from "../layout/Sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import {
  MembershipFaq,
  reorderFAQ,
} from "@/services/getMemberShip";
import { toast } from "sonner";
import {
  createMembershipFaq,
  deleteMembershipFaq,
  getMembershipFaqs,
  updateMembershipFaq,
} from "@/services/membershipFaqService";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { getTableCount } from "@/services/getTeam";
import { getAllFAQs } from "./getAllFAQ";
import { Footer } from "../layout/Footer";
import { useAutoRowsmembership } from "@/hooks/useAutoRowsmembership";

export interface FAQItem {
  id?: number;
  question: string;
  answer: string;
}

interface UIFaq extends FAQItem {
  id: number;
}

function SortableFAQ({
  faq,
  index,
  isOpen,
  onToggle,
  onDelete,
  onEdit,
}: {
  faq: UIFaq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: faq.id,
      transition: {
        duration: 250,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div data-row className={cn("flex items-center rounded-xl bg-card")}>
      <div
        ref={setNodeRef}
        style={style}
        data-row
        className="rounded-xl border border-border bg-card flex-1"
      >
        <div className="flex gap-4 items-start  px-4 py-4">
          {/* DRAG */}
          <span
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
          >
            <GripVertical size={18} />
          </span>

          <div className="flex-1 space-y-3 ">
            <div
              className="flex justify-between gap-4 flex-wrap cursor-pointer flex-col lg:flex-row"
              onClick={onToggle}
            >
              <div className="flex gap-2 text-sm font-medium">
                <span className="font-semibold">Q.</span>
                {faq.question}
              </div>

              <div className="flex items-center gap-2 ml-auto lg:ml-0">
                <button
                  onClick={onToggle}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <button
                  onClick={onEdit}
                  className="
                    h-7 w-7 rounded-full
                    border border-border
                    bg-card
                    flex items-center justify-center
                    text-muted-foreground
                    hover:text-foreground hover:bg-muted
                "
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={onDelete}
                  className="
                    h-7 w-7 rounded-full
                    border border-border
                    bg-card
                    flex items-center justify-center
                    text-muted-foreground
                    hover:bg-muted
                "
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && faq.answer && (
          <div
            className={cn(
              "overflow-hidden transition-[max-height] duration-300",
              isOpen ? "max-h-[300px]" : "max-h-0",
            )}
          >
            <div className="flex gap-2 text-sm text-muted-foreground border-t px-4 py-4">
              {/* <span className="font-semibold text-foreground">Ans.</span> */}
              {faq.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MembershipsFAQs() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* FAQ STATE */
  const [value, setValue] = useState<MembershipFaq[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor),
  );
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"id" | "name" | "index">("index");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { containerRef, rowsPerPage } = useAutoRowsmembership();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const uiFaqs = value.map((f) => ({
    ...f,
    id: f.id,
  }));

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await getMembershipFaqs({
        page,
        perPage: rowsPerPage,
        search: debouncedSearch,
        sortBy,
        sortDirection,
      });
      if (!res?.data?.data || res.data.data.length === 0) {
        setValue([]); // 👈 clear table
        setPagination(null); // 👈 remove pagination
        return;
      }
      setValue(res.data.data);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load FAQs");
      setValue([]); // 👈 safety clear
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [page, debouncedSearch, sortBy, sortDirection, rowsPerPage]);

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

    /* ================= UI INSTANT REORDER ================= */
    const oldIndex = value.findIndex((f) => f.id === activeId);
    const newIndex = value.findIndex((f) => f.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      setValue((prev) => arrayMove(prev, oldIndex, newIndex));
    }

    try {
      /* ================= 1️⃣ TOTAL COUNT ================= */
      const totalCount = await getTableCount("memberships_faqs");

      /* ================= 2️⃣ FETCH ALL FAQS ================= */
      const allFaqs = await getAllFAQs(totalCount);
      // ⚠️ FAQ specific — same as getAllTeams
      /* ================= 3️⃣ FIND DRAG INDEX ================= */
      const fromIndex = allFaqs.findIndex((f) => f.id === activeId);
      const toIndex = allFaqs.findIndex((f) => f.id === overId);

      if (fromIndex === -1 || toIndex === -1) return;

      /* ================= 4️⃣ GLOBAL REORDER ================= */
      const reordered = arrayMove(allFaqs, fromIndex, toIndex);
      /* ================= 5️⃣ BUILD PAYLOAD ================= */
      const payload = reordered.map((item, index) => ({
        id: item.id,
        index: index + 1,
      }));
      /* ================= 6️⃣ UPDATE DB ================= */
      await reorderFAQ(payload);

      /* ================= 7️⃣ REFRESH PAGE ================= */
      fetchFaqs();
    } catch (error) {
      toast.error("Reorder failed");
      fetchFaqs();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteMembershipFaq(deleteId);
      toast.success("FAQ deleted successfully");
      // 👇 check if this was last item on the page
      if (value.length === 1 && page > 1) {
        setPage((p) => p - 1); // go to previous page
      } else {
        fetchFaqs(); // stay on same page
      }
      setValue((prev) => prev.filter((f) => f.id !== deleteId));
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="bg-background flex overflow-hidden">
        {/* SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
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
        <div
          className={cn(
            "flex-1 flex flex-col h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]",
          )}
        >
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="FAQ's"
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
                  onClick={() => {
                    setEditingIndex(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground w-full sm:w-auto justify-center text-center"
                >
                  <Plus size={18} /> Add FAQ
                </button>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <div className="w-full rounded-2xl border border-border bg-card flex flex-col flex-1 h-[calc(98vh-300px)]">
                    <div className="sticky top-0 z-[9] bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
                      <div className="w-10"></div>
                      <div
                        className="flex-1 pl-4 border-l cursor-pointer flex items-center justify-between text-left"
                        onClick={() => {
                          setSortBy("name");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc",
                          );
                        }}
                      >
                        FAQs
                        <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                          <span className="text-[10px]">
                            <img src="/top.png" alt="" />
                          </span>
                          <span className="text-[10px] -mt-1">
                            <img src="/down.png" alt="" />
                          </span>
                        </span>
                      </div>
                      <div className="w-[100px] pl-4 border-l">Actions</div>
                    </div>
                    <div
                      ref={containerRef}
                      className="flex-1 overflow-y-auto scrollbar-thin p-4"
                    >
                      <DndContext
                        sensors={sensors}
                        measuring={{
                          droppable: {
                            strategy: MeasuringStrategy.Always,
                          },
                        }}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={uiFaqs.map((f) => f.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {uiFaqs.length === 0 ? (
                              <div className="py-10 text-center text-muted-foreground text-sm">
                                No FAQs added
                              </div>
                            ) : (
                              uiFaqs.map((faq, index) => (
                                <SortableFAQ
                                  key={faq.id}
                                  faq={faq}
                                  index={index}
                                  isOpen={openId === faq.id}
                                  onToggle={() =>
                                    setOpenId(openId === faq.id ? null : faq.id)
                                  }
                                  onDelete={() => setDeleteId(faq.id)}
                                  onEdit={() => {
                                    setEditingIndex(index);
                                    setIsModalOpen(true);
                                  }}
                                />
                              ))
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                  <div className="shrink-0">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="max-w-[420px] rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">
                Delete FAQ?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
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

        {/* MODAL */}
        <AddFaqModal
          open={isModalOpen}
          onClose={() => {
            setEditingIndex(null);
            setIsModalOpen(false);
          }}
          defaultQ={editingIndex !== null ? value[editingIndex].question : ""}
          defaultA={editingIndex !== null ? value[editingIndex].answer : ""}
          onSave={async (q, a) => {
            try {
              if (editingIndex !== null) {
                const faq = value[editingIndex];
                await updateMembershipFaq({
                  id: faq.id,
                  question: q,
                  answer: a,
                });

                setValue((prev) =>
                  prev.map((f, i) =>
                    i === editingIndex ? { ...f, question: q, answer: a } : f,
                  ),
                );

                toast.success("FAQ updated successfully");
              } else {
                const res = await createMembershipFaq({
                  question: q,
                  answer: a,
                });

                setValue((prev) => [...prev, res.data]);
                toast.success("FAQ added successfully");
              }
              fetchFaqs();
              setEditingIndex(null);
              setIsModalOpen(false);
            } catch {
              toast.error("Save failed");
            }
          }}
        />
      </div>
      <Footer />
    </>
  );
}

export default MembershipsFAQs;
