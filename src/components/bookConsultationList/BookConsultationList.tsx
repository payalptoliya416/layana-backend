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
import { Button } from "../ui/button";
import { getTableCount, getTeams, reorderteam } from "@/services/getTeam";
import SwitchToggle from "../treatment/Toggle";
import { deleteTeam, TeamPayload, updateTeam } from "@/services/teamService";
import { useAutoRows } from "@/hooks/useAutoRows";
import { getAllTeams } from "../team/getAllTeams";
import { BookedConsultation, getBookedConsultationById, getBookedConsultations } from "@/services/bookedConsultation";

type Consultation = BookedConsultation;

export type Category = {
  id: number;
  name: string;
  status: "Live" | "Draft";
};
   
const GRID_COLS =
  "40px 150px 170px 260px 160px 140px 220px 60px";
function SortableRow({
  item,
  index,
  onEdit,
  onDelete,
    onView,
  onToggleFeatured,
}: {
  item: any;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number, value: boolean) => void;
  onView: (id: number) => void;
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
  className="hidden xl:grid items-center px-4 py-3 mx-4 my-1 rounded-xl justify-between"
  style={{ gridTemplateColumns: GRID_COLS }}
>
        <div
          {...attributes}
          {...listeners}
          className="w-10 flex justify-center "
        >
           {index + 1}
        </div>

        <div className={` pl-4`}>{item.firstName}</div>
        <div className={` pl-4`}>{item.lastName}</div>
        <div className={` pl-4`}>{item.email}</div>
        <div className={` pl-4`}>{item.mobile}</div>
        <div className={` pl-4`}>{item.type}</div>
        <div className={`$ pl-4`}>{item.treatments}</div>
        <div className="flex justify-center">
  <Eye
    size={18}
    className="cursor-pointer text-muted-foreground hover:text-foreground"
    onClick={() => onView(item.id)}
  />
</div>
       
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="xl:hidden mx-3 my-2 rounded-xl border bg-card p-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <div {...attributes} {...listeners} className="">
            {index + 1}
            </div>

            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {item.designation}
              </p>
              <p className="font-medium mb-1">{item.firstName} {item.lastName}</p>
                <p className="text-sm mb-1">{item.email}</p>
                <p className="text-sm mb-1">{item.mobile}</p>
                <p className="text-sm">{item.type} • {item.treatments}</p>
                <button
    onClick={() => onView(item.id)}
    className="absolute top-3 right-3 h-8 w-8 rounded-full border bg-muted flex items-center justify-center"
  >
    <Eye size={16} />
  </button>

            </div>
          </div>
          {/* <div className="flex gap-2">
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
              className="
            h-7 w-7 rounded-full
            border border-border
            bg-card
            flex items-center justify-center
            text-muted-foreground
            hover:bg-muted
          "
              onClick={() => onDelete(item.id)}
            >
              <Trash2 size={15} />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function BookConsultationList() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { containerRef, rowsPerPage } = useAutoRows();
const [viewId, setViewId] = useState<number | null>(null);
const [viewData, setViewData] = useState<Consultation | null>(null);
const [loadingView, setLoadingView] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"id" | "name" | "designation"| "index">("index");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [teams, setTeams] = useState<Consultation[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

//   const fetchTeams = async () => {
//     if (!rowsPerPage) return;
//     try {
//       const res = await getTeams({
//         page,
//         perPage: rowsPerPage,
//         search: debouncedSearch,
//         sortBy,
//         sortDirection,
//       });

//       setTeams(res?.data ?? []);
//       setPagination(res?.pagination ?? null);
//     } catch (e) {
//       setTeams([]);
//       toast.error("Failed to load Team");
//     }
//   };
 
const fetchTeams = async () => {
  if (!rowsPerPage) return;

  try {
    const res = await getBookedConsultations({
      page,
      perPage: rowsPerPage,
      search: debouncedSearch,
      sortBy,
      sortDirection,
    });

    setTeams(res.data);
    setPagination(res.pagination);
  } catch (e) {
    setTeams([]);
    toast.error("Failed to load booked consultations");
  }
};

useEffect(() => {
    fetchTeams();
  }, [page, sortBy, sortDirection, rowsPerPage, debouncedSearch]);

const handleView = async (id: number) => {
  try {
    setLoadingView(true);
    setViewId(id);

    const data = await getBookedConsultationById(id);

    setViewData(data);
  } catch {
    toast.error("Failed to load consultation");
  } finally {
    setLoadingView(false);
  }
};

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page when search changes
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

const handleDragEnd = async (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  // UI instant reorder (UX only)
  const oldIndex = teams.findIndex((i) => i.id === active.id);
  const newIndex = teams.findIndex((i) => i.id === over.id);

  if (oldIndex !== -1 && newIndex !== -1) {
    setTeams((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  try {
    // 1️⃣ get total count
    const totalCount = await getTableCount("staff_team");

    // 2️⃣ fetch ALL records dynamically
    const allTeams = await getAllTeams(totalCount);

    // 3️⃣ match dragged & target
    const fromIndex = allTeams.findIndex(
      (t) => t.id === active.id
    );
    const toIndex = allTeams.findIndex(
      (t) => t.id === over.id
    );

    if (fromIndex === -1 || toIndex === -1) return;

    // 4️⃣ global reorder
    const reordered = arrayMove(allTeams, fromIndex, toIndex);

    // 5️⃣ rebuild indexes (MATCHED)
    const payload = reordered.map((item, index) => ({
      id: item.id,
      index: index + 1,
    }));

    // 6️⃣ update DB
    await reorderteam(payload);

    // 7️⃣ refresh page
    fetchTeams();

  } catch (error) {
    fetchTeams();
  }
};

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

  const handleFeaturedToggle = async (id: number, value: boolean) => {
    try {
      await updateTeam(id, { featured: value });
      toast.success("Team updated");
      fetchTeams(); // 🔥 REFRESH LIST
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
            <PageHeader title="Book Consultation" onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* Content */}
          <div
            className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-2xl shadow-card p-5
    relative
    overflow-hidden
    h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]"
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
                {/* <button
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
                </button> */}
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(100vh-300px)]">
                    {/* ================= HEADER (DESKTOP) ================= */}
                  <div
                  className="sticky top-0 z-[9] bg-card border-b hidden xl:grid items-center h-[52px] px-4 text-sm font-medium text-primary mx-3 justify-between"
                  style={{ gridTemplateColumns: GRID_COLS }}
                >
                <div className="text-center text-muted-foreground">#</div>

                      <div
                        className={` pl-4 border-l cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("name");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                        First Name
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
                        className={`$pl-4 border-l flex-1 cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("designation");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                        Last Name{" "}
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
                        className={`pl-4 border-l flex-1 cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("designation");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                       Email{" "}
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
                        className={` pl-4 border-l flex-1 cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("designation");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                       Mobile{" "}
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
                        className={` pl-4 border-l flex-1 cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("designation");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                       Type{" "}
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
                        className={` pl-4 border-l cursor-pointer flex items-center justify-between text-left`}
                        onClick={() => {
                          setSortBy("designation");
                          setSortDirection((p) =>
                            p === "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                       Treatments{" "}
                        <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                          <span className="text-[10px]">
                            <img src="/top.png" alt="" />
                          </span>
                          <span className="text-[10px] -mt-1">
                            <img src="/down.png" alt="" />
                          </span>
                        </span>
                      </div>
                      <div className={` pl-4 border-l`}>Actions</div>
                    </div>

                    {/* ================= BODY ================= */}
                    <div ref={containerRef} className="flex-1  overflow-y-auto scrollbar-thins">
                      {!teams || teams.length === 0 ? (
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
                                onToggleFeatured={handleFeaturedToggle}
                                 onView={handleView}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  </div>
{viewId && (
  <AlertDialog open onOpenChange={() => { setViewId(null); setViewData(null); }}>
    <AlertDialogContent className="max-w-[720px] rounded-2xl p-6 bg-card">
      <AlertDialogHeader>
        <AlertDialogTitle>Consultation Details</AlertDialogTitle>
      </AlertDialogHeader>

      {loadingView ? (
        <div className="py-10 text-center">Loading...</div>
      ) : viewData && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>Name:</b> {viewData.firstName} {viewData.lastName}</div>
          <div><b>Email:</b> {viewData.email}</div>
          <div><b>Mobile:</b> {viewData.mobile}</div>
          <div><b>Type:</b> {viewData.type}</div>
          <div><b>Treatment:</b> {viewData.treatments}</div>
          <div><b>Date:</b> {viewData.day}</div>
          <div><b>Time:</b> {viewData.startTime} - {viewData.endTime}</div>

          <div className="col-span-2">
            <b>Skin Type:</b> {viewData.skin_type}, {viewData.skin_type_second}
          </div>

          <div className="col-span-2">
            <b>Skin Goal:</b> {viewData.skin_goal}
          </div>

          <div className="col-span-2">
            <b>Skin Care Product:</b> {viewData.skin_care_products}
          </div>

          <div className="col-span-2">
            <b>Message:</b>
            <div className="mt-2">
              {viewData.message}
            </div>
          </div>
        </div>
      )}

      <AlertDialogFooter className="mt-6">
        <Button variant="cancel" onClick={() => { setViewId(null); setViewData(null); }}>
          Close
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}

                  {/* ================= PAGINATION ================= */}
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

export default BookConsultationList;
