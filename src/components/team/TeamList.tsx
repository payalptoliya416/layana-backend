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
import { Button } from "../ui/button";
import { getTeams } from "@/services/getTeam";
import SwitchToggle from "../treatment/Toggle";
import { deleteTeam, TeamPayload } from "@/services/teamService";

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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

      <td className="text-muted-foreground whitespace-nowrap w-[30%]">
        {item.designation}
      </td>
      <td className="text-muted-foreground whitespace-nowrap w-[30%]">
        <p dangerouslySetInnerHTML={{ __html: item.description }} />
      </td>
      <td className="text-muted-foreground whitespace-nowrap w-[30%]">
       <SwitchToggle
      value={item.featured}
      onChange={() => {}}
    />
      </td>
      {/* ACTIONS */}
      <td className="w-[160px] flex justify-end gap-2 whitespace-nowrap ml-auto">
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
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
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
  const [teams, setTeams] = useState<TeamPayload[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTeams = async () => {
    try {
      const res = await getTeams({
        page,
        perPage: 10,
        search: debouncedSearch,
        sortBy,
        sortDirection,
      });

      setTeams(res?.data ?? []);
      setPagination(res?.pagination ?? null);
    } catch (e) {
      setTeams([]);
      toast.error("Failed to load Team");
    }
  };
  useEffect(() => {
    fetchTeams();
  }, [page, sortBy, sortDirection, debouncedSearch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page when search changes
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteTeam(deleteId);
      toast.success("Team deleted successfully");
      fetchTeams();
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
              title="Team"
              onMenuClick={() => setSidebarOpen(true)}
            />
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
                  <div className="w-full overflow-auto rounded-2xl border border-border bg-card flex flex-col h-[calc(100vh-300px)] scrollbar-thin">
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

                          <th
                            onClick={() => {
                              setSortBy("name");
                              setSortDirection((prev) =>
                                prev === "asc" ? "desc" : "asc"
                              );
                            }}
                            className="
                            w-[30%] pl-4
                            border-l border-border
                            flex items-center justify-between
                            cursor-pointer
                            text-left
                          "
                          >
                            <span>Team</span>
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
                            setSortBy("featured");
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
                        <span>Designation</span>
                        <span className="flex flex-col gap-1 ml-2 mr-2">
                            <img src="/top.png" />
                            <img src="/down.png" />
                        </span>
                        </th>
                         <th
                        onClick={() => {
                            setSortBy("featured");
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
                        <span>Description</span>
                        <span className="flex flex-col gap-1 ml-2 mr-2">
                            <img src="/top.png" />
                            <img src="/down.png" />
                        </span>
                        </th>
                         <th
                        onClick={() => {
                            setSortBy("featured");
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
                        <span>Featured</span>
                        <span className="flex flex-col gap-1 ml-2 mr-2">
                            <img src="/top.png" />
                            <img src="/down.png" />
                        </span>
                        </th>

                          {/* ACTIONS */}
                          <th
                            className="
                            w-[160px] pl-4
                            border-l border-border
                            text-right ml-auto pr-4
                          "
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="block flex-1 overflow-y-auto scrollbar-thin">
                        {!teams || teams.length === 0 ? (
                          <tr className="flex items-center justify-center py-4">
                            <td className="text-muted-foreground text-sm">
                              No Data found
                            </td>
                          </tr>
                        ) : (
                          <DndContext
                            collisionDetection={closestCenter}
                            sensors={sensors}
                          >
                            <SortableContext
                              items={teams.map((i) => i.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {teams.map((item, index) => (
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
                      </tbody>
                      <tfoot>
                        <tr>
                          <td>
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
                                  Are you sure you want to delete this Team?
                                  This action cannot be undone.
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
                          disabled={
                            pagination.current_page === pagination.last_page
                          }
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
      <Footer />
    </>
  );
}

export default TeamList;
