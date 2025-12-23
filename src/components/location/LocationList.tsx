import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { BranchLocation, getLocations } from "@/services/getLocation";

export type Category = {
  id: number;
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
      <td className="flex-1 text-muted-foreground whitespace-nowrap">
        {item.name}
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
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}

function LocationList() {
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

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [locations, setLocations] = useState<BranchLocation[]>([]);

useEffect(() => {
  const fetchTreatments = async () => {
    try {
      const res = await getLocations({
        page,
        perPage: 10,
        search,
        sortBy,
        sortDirection,
      });

        setLocations(res.data);
    //   setPagination(res.pagination);
    } catch (e) {
      toast.error("Failed to load treatments");
    }
  };

  fetchTreatments();
}, [page, sortBy, sortDirection, search]);

useEffect(() => {
  const delay = setTimeout(() => {
    setPage(1); // reset page on search
  }, 400);

  return () => clearTimeout(delay);
}, [search]);


const handleEdit = (id: number) => {
  navigate(`/treatments/edit/${id}`);
};
const handleDelete = async () => {
//   if (!deleteId) return;

//   try {
//     setIsDeleting(true);
//     await deleteTreatmentMessage(deleteId);

//     setTreatments((prev) => prev.filter((t) => t.id !== deleteId));
//     toast.success("Deleted successfully");
//   } catch (err) {
//     toast.error("Delete failed");
//   } finally {
//     setIsDeleting(false);
//     setDeleteId(null);
//   }
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
            <div className="flex flex-col flex-1 overflow-hidden">
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
                                        px-2 sm:px-6 pr-14
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
                  onClick={() => navigate("/location/add")}
                  className="
                        flex items-center gap-2
                        rounded-full
                        bg-primary
                        px-3 sm:px-5 py-3
                        text-xs sm:text-sm text-primary-foreground
                        shadow-button
                        hover:opacity-90
                        transition
                    "
                >
                  <Plus size={16} /> Add Location
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
                          <span>Location</span>
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
                                                      items={locations.map((i) => i.id)}
                                                      strategy={verticalListSortingStrategy}
                                                    >
                                                      {locations.map((item, index) => (
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
                           </tbody>
                              <tfoot>
                      <tr>
                        <td>

                      {pagination && (
                  <div className="shrink-0 flex items-center justify-between gap-6 px-4 py-2 text-sm text-muted-foreground">
                <span className="text-foreground font-medium">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
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
                        </td>
                      </tr>
                    </tfoot>
                    </table>
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

export default LocationList;
