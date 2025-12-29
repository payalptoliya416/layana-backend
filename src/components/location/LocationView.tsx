import { Mail, Phone, Info, Plus, Smartphone } from "lucide-react";
import { Sidebar } from "../layout/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PageHeader } from "../layout/PageHeader";
import { useEffect, useState } from "react";
import { getLocationById } from "@/services/locationService";

type OpeningHour = {
  day: string;
  start_time: string | null;
  end_time: string | null;
    is_closed: 0 | 1;
};

type LocationData = {
  name: string;
  email: string;
  phone: string;
  opening_hours: OpeningHour[];
  parking_details?:  string;
};

function LocationView() {
     const { id } = useParams();
      const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [location, setLocation] = useState<LocationData | null>(null);
const [loading, setLoading] = useState(true);
const [parkingDetails, setParkingDetails] = useState("");
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
     "Sunday",
  ];

 const formatTime = (time?: string) => {
  // handle empty / null / invalid
  if (!time || !time.includes(":")) return "";

  const parts = time.split(":");
  if (parts.length < 2) return "";

  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return "";

  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;

  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
};
const [locationName, setLocationName] = useState<string>("");
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getLocationById(id);
      setLocation(data);
      setParkingDetails(data.parking_details || "");
       setLocationName(data.name)
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const openingMap: Record<string, OpeningHour> = {};

location?.opening_hours?.forEach((o) => {
  openingMap[o.day.toLowerCase()] = o;
});

  return (
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

            <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
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
                title={locationName || "Location"}
            onMenuClick={() => setSidebarOpen(true)}
              onBack={() => navigate(-1)}
               showBack = {true}
          />
        </div>
        <div className="flex-1 pl-[15px] pr-6 px-6 flex flex-col bg-card rounded-[12px] shadow-card p-5 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
            <div className="">
              {/* HEADER */}
              {/* <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {location?.name}
                </h1>
              </div> */}

              {/* CONTENT */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
                {/* CONTACT DETAILS */}
                <div>
                <div className="rounded-[12px] border border-border bg-card p-4 sm:p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground">
                      Contact details
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* EMAIL */}
                    <div className="flex gap-3 rounded-xl border border-border p-3 sm:p-4">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Location e-mail address
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                            {location?.email}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex gap-3 rounded-xl border border-border p-3 sm:p-4">
                      <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Location contact number
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                            {location?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                 <div className="rounded-[12px] border p-4 sm:p-6 shadow-sm">
  {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Parking details
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    These details will appear on the client's sale receipt for
                                    sales from this location.
                                </p>
                                </div>
                            </div>

                            {/* Inner Card */}
                            <div className="mt-6 rounded-[10px] border p-4">
                                <h3 className="text-sm font-semibold text-foreground mb-2 border-b pb-3">
                                Parking information
                                </h3>

                                <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p
                                  className="text-sm font-medium text-foreground"
                                  dangerouslySetInnerHTML={{ __html: parkingDetails }}
                                />
                                    {/* <p className="text-sm text-muted-foreground">
                                   18 England Lane, London, England
                                    </p> */}
                                </div>

                                <span className="rounded-full bg-background px-3 py-1 text-sm font-medium text-foreground border">
                                    Layana
                                </span>
                                </div>
                            </div>
                            </div>
                </div>
                <div className="rounded-[12px] border border-border bg-card p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Opening hours
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                        Opening hours for these locations are default working
                        hours for your team and will be visible to your clients.
                        You can amend business closed periods for events like
                        Bank Holidays in{" "}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-[15px] mt-5">
                    {DAYS.map((day) => {
                        const o = openingMap[day.toLowerCase()];
                          const isClosed =
    !o ||
    o.is_closed === 1 ||
    (!o.start_time && !o.end_time);
                        return (
                     <div
  key={day}
  className="border border-border p-4 rounded-[12px]"
>
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[30px]">
    
    {/* DAY */}
    <div className="
      w-full sm:min-w-[140px] sm:w-auto
      rounded-[10px]
      bg-[#EBF2F3]
      text-[#035865]
      text-base leading-[16px]
      py-[11px] h-[38px]
      text-center font-semibold
    ">
      {day}
    </div>

    {/* TIME / CLOSED */}
    {isClosed ? (
      <div className="flex justify-center sm:justify-start ml-16">
        <button
          className="
            w-full sm:w-[110px]
            rounded-[10px]
            bg-[#F3F4F6]
            py-[11px] h-[38px]
            text-[16px] font-semibold
          "
        >
          Closed
        </button>
      </div>
    ) : (
      <div className="
        flex items-center justify-between sm:justify-start
        gap-2 sm:gap-[5px]
        w-full sm:w-auto
      ">
        <button
          className="
            flex-1 sm:flex-none sm:w-[110px]
            rounded-[10px]
            bg-[#F3F4F6]
            py-[11px] h-[38px]
            text-[16px] font-semibold
          "
        >
          {formatTime(o.start_time)}
        </button>

        <span className="text-[#B8B9BA] hidden sm:inline">–</span>

        <button
          className="
            flex-1 sm:flex-none sm:w-[110px]
            rounded-[10px]
            bg-[#F3F4F6]
            py-[11px] h-[38px]
            text-[16px] font-semibold
          "
        >
          {formatTime(o.end_time)}
        </button>
      </div>
    )}
  </div>
</div>

                        );
                    })}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationView;
