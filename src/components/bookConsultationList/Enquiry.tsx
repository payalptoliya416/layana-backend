"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Eye, EyeIcon, Search, X } from "lucide-react";
import { useAutoRows } from "@/hooks/useAutoRows";
import {
  getEnquiries,
  Enquiry,
  getEnquiryById,
} from "@/services/enquiryService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { useSortable } from "@dnd-kit/sortable";
type EnquiryDetail = Enquiry & {
  location?: {
    id: number;
    name: string;
    country: string;
    city: string;
    address_line_1: string;
    address_line_2: string;
  };
};
function EnquiryRow({
  item,
  index,
  onView,
}: {
  item: Enquiry;
  index: number;
  onView: (id: number) => void;
}) {
      const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id });
    
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
  return (
    <>
    <div ref={setNodeRef} style={style}>

      <div
      data-row
        className={cn(
          "hidden 2xl:flex items-center px-4 py-3 mx-4 my-1 rounded-xl",
          index % 2 === 0 ? "bg-card" : "bg-muted",
          "hover:bg-muted/70"
        )}
      >
        <div {...attributes} {...listeners} className="w-[40px] text-center text-sm font-medium">
          {index + 1}
        </div>
        <div className="w-[18%] pl-4 font-medium">{item.name}</div>
        <div className="w-[20%] pl-4">{item.email}</div>
        <div className="w-[15%] pl-4">{item.mobile}</div>
        <div className="w-[20%] pl-4">{item.location?.name}</div>
        <div className="w-[20%] pl-4 truncate">{item.message}</div>
        <div className="w-[100px] flex justify-center">
          <EyeIcon
            size={18}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onView(item.id)}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="2xl:hidden mx-3 my-2 rounded-xl border bg-card p-4 space-y-2">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">{item.email}</p>
        <p className="text-sm">{item.mobile}</p>
        <p className="text-sm">{item.location?.name}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.message}
        </p>
        <div className="w-full flex justify-end">
          <EyeIcon
           size={18}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onView(item.id)}
          />
        </div>
      </div>
    </div>
    </>
  );
}

export default function EnquiryList() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { containerRef, rowsPerPage } = useAutoRows();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
 const [sortBy, setSortBy] = useState<
  "id" | "name" | "email" | "mobile" | "created_at"
>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [viewId, setViewId] = useState<number | null>(null);
  const [viewData, setViewData] = useState<EnquiryDetail | null>(null);
  const [loadingView, setLoadingView] = useState(false);
  const fetchEnquiries = async () => {
    if (!rowsPerPage) return;
    try {
      const res = await getEnquiries({
        page,
        perPage: rowsPerPage,
        search: debouncedSearch,
        sortBy,
        sortDirection,
      });

       setEnquiries(res?.data ?? []);
     setPagination(res?.pagination ?? []);
     
    } catch {
      toast.error("Failed to load enquiries");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, rowsPerPage, sortBy, sortDirection, debouncedSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleView = async (id: number) => {
    try {
      setLoadingView(true);
      setViewId(id);
      const data = await getEnquiryById(id);
      setViewData(data);
    } catch {
      toast.error("Failed to load enquiry");
    } finally {
      setLoadingView(false);
    }
  };
  return (
    <>
      <div className="bg-background flex">
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

        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 h-[calc(95vh-24px)] mt-3 px-3 sm:px-5",
            sidebarCollapsed ? "lg:ml-[96px]" : "lg:ml-[272px]"
          )}
        >
          <div className="sticky top-3 z-10 pb-3">
            <PageHeader
              title="Enquiry"
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>
          <div
            className="flex-1 pl-[15px] pr-6 px-6 flex flex-col justify-evenly sm:justify-normal bg-card rounded-2xl shadow-card p-5
    relative
    overflow-hidden
    h-[calc(100dvh-160px)] lg:h-[calc(100vh-220px)]"
          >
            <div className="mb-2 flex items-center justify-between shrink-0 flex-wrap gap-2">
              <div className="relative w-full sm:w-[260px]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full h-11 rounded-full border px-4 pr-10 bg-card"
                />
                {search ? (
                  <X
                    className="absolute right-4 top-3 cursor-pointer"
                    onClick={() => setSearch("")}
                  />
                ) : (
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
             <div className="grid grid-cols-12">
                  <div className="col-span-12">
            <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(100vh-300px)]">
              <div className="sticky top-0 z-[9] bg-card border-b hidden 2xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
                <div className="w-[40px] text-center">#</div>
                <div
                  className="w-[18%]  border-l pl-4 cursor-pointer flex items-center justify-between"
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
                  className="w-[20%] pl-4 border-l cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    setSortBy("email");
                    setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
                  }}
                >
                  Email
                  <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                    <span className="text-[10px]">
                      <img src="/top.png" alt="" />
                    </span>
                    <span className="text-[10px] -mt-1">
                      <img src="/down.png" alt="" />
                    </span>
                  </span>
                </div>

                <div className="w-[15%] pl-4 border-l flex items-center justify-between cursor-pointer"  onClick={() => {
                        setSortBy("mobile");
                        setSortDirection(p => p === "asc" ? "desc" : "asc");
                    }}>Mobile
                    <span className="flex flex-col gap-1 ml-2 text-muted-foreground leading-none mr-2">
                    <span className="text-[10px]">
                      <img src="/top.png" alt="" />
                    </span>
                    <span className="text-[10px] -mt-1">
                      <img src="/down.png" alt="" />
                    </span>
                  </span>
                  </div>
                <div className="w-[20%] pl-4 border-l">Location </div>
                <div className="w-[20%] pl-4 border-l">Message </div>

                <div className="w-[100px] pl-4 border-l cursor-pointer flex items-center justify-between">
                  Action
                </div>
              </div>

              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto scrollbar-thin"
              >
                {enquiries.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    No Enquiries Found
                  </div>
                ) : (
                  enquiries.map((item, i) => (
                    <EnquiryRow
                      key={item.id}
                      item={item}
                      index={i}
                      onView={handleView}
                    />
                  ))
                )}
              </div>
            </div>
                  </div>
             </div>
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
                disabled={pagination.current_page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-2xl"
                >
                ‹
                </button>

                <span className="text-foreground font-medium">
                {pagination.current_page} / {pagination.last_page}
                </span>

                <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() =>
                    setPage((p) => Math.min(pagination.last_page, p + 1))
                }
                className="text-2xl"
                >
                ›
                </button>

                <button
                disabled={pagination.current_page === pagination.last_page}
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
      {viewId && (
        <AlertDialog
          open
          onOpenChange={() => {
            setViewId(null);
            setViewData(null);
          }}
        >
          <AlertDialogContent className="max-w-[700px] rounded-2xl p-6 bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Enquiry Details
              </AlertDialogTitle>
            </AlertDialogHeader>

            {loadingView ? (
              <div className="py-10 text-center">Loading...</div>
            ) : (
              viewData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{viewData.name}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{viewData.email}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Mobile</p>
                    <p className="font-medium">{viewData.mobile}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{viewData.location?.name}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Message</p>
                    <div className="mt-1 bg-card">{viewData.message}</div>
                  </div>
                </div>
              )
            )}

            <AlertDialogFooter className="mt-6">
              <Button
                variant="cancel"
                onClick={() => {
                  setViewId(null);
                  setViewData(null);
                }}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Footer />
    </>
  );
}
