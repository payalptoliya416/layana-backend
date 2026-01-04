import React, { useState } from 'react'
import { Sidebar } from '../layout/Sidebar';
import { cn } from '@/lib/utils';
import { PageHeader } from '../layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAutoRows } from '@/hooks/useAutoRows';

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
    const [sortBy, setSortBy] = useState<"id" | "name" | "status" | 'index'>("index");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const { containerRef, rowsPerPage } = useAutoRows();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    //   const [memberships, setMemberships] = useState<MembershipPayload[]>([]);

    return (
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
                        onBack={() => navigate(-1)}
                        showBack={true}
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
                                onClick={() => navigate("/popup/add")}
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
                                <Plus size={16} /> Add popup
                            </button>
                        </div>
                        <div className="grid grid-cols-12">
                            <div className="col-span-12">
                                <div className="w-full rounded-2xl border border-border bg-card flex flex-col h-[calc(98vh-300px)]">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupList
