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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
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
import { getTeams } from "@/services/getTeam";
import { deleteTeam, TeamPayload, updateTeam } from "@/services/teamService";
import { deleteMemberShip, getMemberships, MembershipPayload } from "@/services/getMemberShip";

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
  return (
    <div>
      {/* ================= DESKTOP ROW ================= */}
      <div
        className={cn(
          "hidden xl:flex items-center px-4 py-3 mx-4 my-1 rounded-xl",
          index % 2 === 0 ? "bg-card" : "bg-muted",
          "hover:bg-muted/70"
        )}
      >
        {/* NAME */}
        <div className="w-[25%] pl-4 font-medium">
          {item.name}
        </div>

        {/* STATUS */}
        <div className="w-[15%] pl-4 capitalize">
          {item.status}
        </div>

        {/* LOCATIONS */}
        <div className="w-[20%] pl-4">
          {item.locations?.length ?? 0}
        </div>

        {/* PRICING */}
        <div className="w-[20%] pl-4">
          {item.pricing?.length ?? 0}
        </div>

        {/* FAQ */}
        <div className="w-[10%] pl-4">
          {item.faq?.length ?? 0}
        </div>

        {/* ACTIONS */}
        <div className="w-[10%] flex justify-end gap-2 pr-4">
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
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              Status: {item.status}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Locations: {item.locations?.length ?? 0}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Pricing Plans: {item.pricing?.length ?? 0}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              FAQs: {item.faq?.length ?? 0}
            </p>
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


function TeamList() {
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
  const [sortBy, setSortBy] = useState<"id" | "name" | "featured">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [memberships, setMemberships] = useState<MembershipPayload[]>([]);

  const fetchMemberships = async () => {
    try {
      const res = await getMemberships({
        page,
        perPage: 10,
        search: debouncedSearch,
        sortBy: "id",
        sortDirection: "asc",
      });

      setMemberships(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load memberships");
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteMemberShip(deleteId);
      toast.success("Team deleted successfully");
     fetchMemberships();
    } catch {
      toast.error("Failed to delete team");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/team/edit/${id}`);
  };

  const handleFeaturedToggle = async (id: number, value: boolean) => {
    try {
      await updateTeam(id, { featured: value });
      toast.success("Team updated");
      fetchMemberships(); // 🔥 REFRESH LIST
    } catch {
      toast.error("Failed to update team");
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
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          {/* Sticky Header */}
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader title="Team" onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* Content */}
          <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col h-full bg-card rounded-2xl shadow-card p-5 overflow-hidden">
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
                  onClick={() => navigate("/team/add")}
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
                  <Plus size={16} /> Add Team
                </button>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(100vh-300px)]">
                    {/* ================= HEADER (DESKTOP) ================= */}
                   <div className="sticky top-0 z-10 bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
                        <div className="w-[25%] pl-4">Name</div>
                        <div className="w-[15%] pl-4 border-l">Status</div>
                        <div className="w-[20%] pl-4 border-l">Locations</div>
                        <div className="w-[20%] pl-4 border-l">Pricing</div>
                        <div className="w-[10%] pl-4 border-l">FAQs</div>
                        <div className="w-[10%] pl-4 border-l text-right pr-4">
                            Actions
                        </div>
                    </div>

                    {/* ================= BODY ================= */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                      {!memberships || memberships.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground text-sm">
                          No Data found
                        </div>
                      ) : (
                        <DndContext
                          collisionDetection={closestCenter}
                          sensors={sensors}
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
                        Delete Team?
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this Team? This action
                      cannot be undone.
                    </p>

                    <AlertDialogFooter className="mt-6">
                      <Button
                        variant="cancel"
                        onClick={() => setDeleteId(null)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
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

export default TeamList;
