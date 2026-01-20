import { useEffect, useState } from "react";
import { X, MapPin, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import white_logo from "@/assets/logo.svg";
import menuimg from "@/assets/menu.png";
import { WEBSITE_BASE } from "@/route/config";
import { getLocations } from "../api/webLocationService";
import { FaLocationDot } from "react-icons/fa6";

type UILocation = {
    id?: number;
  label: string;
  slug: string;
};
type LocationApi = {
  id: number;
  name: string;
  slug: string;
};

/* ================= MENU ================= */
export const withBase = (path?: string) => {
  if (!path) return WEBSITE_BASE;
  return `${WEBSITE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

const menu = [
  {
    label: "Book Now",
    href: "https://www.fresha.com/providers/rmxjfmmk",
    external: true,
  },
  {
    label: "Treatments",
    dropdownKey: "treatments",
    basePath: "/treatments",
  },
  {
    label: "Prices",
    dropdownKey: "prices",
    basePath: "/prices",
  },
  {
    label: "Memberships",
    dropdownKey: "memberships",
    basePath: "/memberships",
  },
  {
    label: "Spa Packages",
    dropdownKey: "spa",
    basePath: "/spa-packages",
  },
  {
    label: "Gift Cards",
    href: "https://www.fresha.com/vouchers/provider/rmxjfmmk",
    external: true,
  },
  { label: "Contact Us", basePath: "/contact-us" },
];

/* ================= DATA ================= */
const pricesServices = [
  { label: "Massage & Beauty", slug: "massage-beauty" },
  { label: "Skin", slug: "skin" },
];
const pricesData = [
  {
    location: "Finchley Central",
    services: [
      { label: "Massage & Beauty", slug: "massage-beauty" },
      { label: "Skin", slug: "skin" },
    ],
  },
  {
    location: "Muswell Hill",
    services: [{ label: "Massage & Beauty", slug: "massage-beauty" }],
  },
  {
    location: "Belsize Park",
    services: [{ label: "Massage & Beauty", slug: "massage-beauty" }],
  },
];

const getAvailableLocations = (
  locations: UILocation[],
  selectedLocation: UILocation | null
) => {
  if (!selectedLocation) return locations;
  return locations.filter(
    (loc) => loc.slug !== selectedLocation.slug
  );
};
/* ================= COMPONENT ================= */

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [locations, setLocations] = useState<UILocation[]>([]);
const [selectedLocation, setSelectedLocation] = useState<UILocation | null>(null);

const { locationSlug } = useParams();

useEffect(() => {
  if (!locationSlug) {
    setSelectedLocation(null);
    return;
  }

  if (locations.length) {
    const found = locations.find((l) => l.slug === locationSlug);
    setSelectedLocation(found ?? null);
  }
}, [locationSlug, locations]);

useEffect(() => {
  getLocations().then((res) => {
    const formatted: UILocation[] = res.data.map(
      (item: LocationApi) => ({
           id: item.id,
        label: item.name,
        slug: item.slug,
      })
    );

    setLocations(formatted);
  });
}, []);


const underlineClass =
  "relative uppercase after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#e6c9a2] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto pt-[25px] pb-[22px] flex items-center justify-between text-white">
        {/* Logo */}
        <Link to={withBase("/")}>
          <img src={white_logo} alt="Layana" className="w-[126px]" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-[20px] text-sm tracking-widest font-muli mx-10">
     {menu.map((item) => {
  const hasLocation = !!selectedLocation;

const resolvedPath =
  hasLocation && item.basePath
    ? `/${selectedLocation.slug}${item.basePath}`
    : item.basePath;
const isPrice = item.dropdownKey === "prices";
const hasDropdown = !!item.dropdownKey;

const disableClick =
  isPrice || (hasDropdown && !hasLocation);
  return (
    <div
      key={item.label}
      className="relative"
     onMouseEnter={() => {
  if (!item.dropdownKey) return;

  if (item.dropdownKey === "prices") {
    setActiveDropdown("prices");
    return;
  }

  if (!selectedLocation) {
    setActiveDropdown(item.dropdownKey);
  }
}}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* {item.external ? (
  <a href={item.href} target="_blank" className={underlineClass}>
    {item.label}
  </a>
) : item.basePath ? (
  item.basePath === "/contact-us" ? (
    <Link
      to={withBase(
        selectedLocation
          ? `/${selectedLocation.slug}/contact-us`
          : "/contact-us"
      )}
      state={
        selectedLocation
          ? {
              locationId: selectedLocation.id,
              locationSlug: selectedLocation.slug,
            }
          : undefined
      }
      className="uppercase hover:text-[#e6c9a2]"
    >
      {item.label}
    </Link>
  ) : (
    <Link
      to={withBase(resolvedPath)}
      className="uppercase hover:text-[#e6c9a2]"
    >
      {item.label}
    </Link>
  )
) : (
  <span className="uppercase">{item.label}</span>
)} */}

{item.external ? (
  <a href={item.href} target="_blank" className={underlineClass}>
    {item.label}
  </a>
) : (
  (() => {
    const isPrice = item.dropdownKey === "prices";
    const hasDropdown = !!item.dropdownKey;
    const hasLocation = !!selectedLocation;

    const disableClick =
      isPrice || (hasDropdown && !hasLocation);

    if (disableClick) {
      // ⛔ CLICK DISABLED CASES
      return (
        <button
          type="button"
          className="uppercase cursor-default"
        >
          {item.label}
        </button>
      );
    }

    // ✅ CLICK ENABLED
    if (item.basePath === "/contact-us") {
      return (
        <Link
          to={withBase(
            selectedLocation
              ? `/${selectedLocation.slug}/contact-us`
              : "/contact-us"
          )}
          state={
            selectedLocation
              ? {
                  locationId: selectedLocation.id,
                  locationSlug: selectedLocation.slug,
                }
              : undefined
          }
          className="uppercase "
        >
          {item.label}
        </Link>
      );
    }

    return (
      <Link
        to={withBase(resolvedPath)}
        className="uppercase"
      >
        {item.label}
      </Link>
    );
  })()
)}

      {/* Dropdown only if NO location selected */}
       {activeDropdown === item.dropdownKey && (
  <DesktopDropdown
    item={item}
    locations={locations}
    selectedLocation={selectedLocation}
    onSelectLocation={(loc) => setSelectedLocation(loc)}
  />
)}
        </div>
    );
    })}
        </nav>

        {/* Desktop Location */}
        <div
          className="relative hidden lg:block group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
  className="flex items-center gap-2 text-sm tracking-widest hover:text-[#e6c9a2]
             max-w-[160px] overflow-hidden"
>
  <FaLocationDot size={18} className="shrink-0" />

  <span
    className="block truncate whitespace-nowrap overflow-hidden"
    title={selectedLocation?.label ?? "Choose Location"}
  >
  {selectedLocation?.label ?? "Choose Location"}
  </span>
</button>

          {activeDropdown === "location" && (
            <DesktopLocations
            baseUrl={withBase("")}
            locations={locations}
              selectedLocation={selectedLocation}
            onSelect={(loc) => {
    setSelectedLocation(loc);
    setActiveDropdown(null);
  }}
          />
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
           <div
          className="relative block lg:hidden group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="flex items-center gap-2 text-xs tracking-widest hover:text-[#e6c9a2]">
            <FaLocationDot size={14} />
           {selectedLocation?.label ?? "Choose Location"}
          </button>

          {activeDropdown === "location" && (
            <DesktopLocations
              baseUrl={withBase("")}
              selectedLocation={selectedLocation}
               locations={locations}
              onSelect={(loc) => {
    setSelectedLocation(loc);
    setActiveDropdown(null);
  }}
            />
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <img src={menuimg} alt="menu"/>}
        </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <>
       {/* ================= MOBILE SIDEBAR ================= */}
<div
  className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
    open ? "pointer-events-auto" : "pointer-events-none"
  }`}
>
  {/* Overlay */}
   <div
    onClick={() => setOpen(false)}
    className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
      open ? "opacity-100" : "opacity-0"
    }`}
  />

  {/* Sidebar */}
 <div
    className={`absolute right-0 top-0 h-full w-[85%] max-w-[360px]
    bg-[#f6efec] text-black
    transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "translate-x-full"}`}
  >
    {/* Close button */}
    <div className="flex justify-end p-3">
    <button
      onClick={() => setOpen(false)}
      className="bg-black rounded-full text-white w-[35px] h-[35px] flex justify-center items-center"
    >
      <X size={24} />
    </button>
    </div>

    {/* Menu */}
    <div className="h-full flex flex-col px-4 space-y-6 tracking-widest text-sm">
      {menu.map((item) => (
        <div key={item.label}>
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              className="block uppercase"
               onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ) : item.dropdownKey ? (
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === item.dropdownKey
                    ? null
                    : item.dropdownKey
                )
              }
              className="w-full flex justify-between items-center uppercase"
            >
              <span>{item.label}</span>
              <ChevronDown size={14} />
            </button>
          ) : (
            <>
            {item.basePath && selectedLocation && (
  <Link
    to={withBase(`${selectedLocation.slug}/${item.basePath}`)}
    onClick={() => setOpen(false)}
    className="block uppercase"
  >
    {item.label}
  </Link>
)}
</>
          )}

          {/* Dropdowns */}
          {item.dropdownKey === "treatments" &&
 !selectedLocation &&
 activeDropdown === "treatments" && (
   <MobileLocations
    selectedLocation={selectedLocation}
     locations={locations}
       onSelectLocation={(loc) => setSelectedLocation(loc)}
     basePath="/treatments"
     onClose={() => {
       setOpen(false);
       setActiveDropdown(null);
     }}
   />
 )}

          {item.dropdownKey === "memberships" &&
            activeDropdown === "memberships" && (
              <MobileLocations   selectedLocation={selectedLocation}  onSelectLocation={(loc) => setSelectedLocation(loc)} locations={locations} basePath={withBase("/memberships")} onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
            )}

          {item.dropdownKey === "spa" &&
            activeDropdown === "spa" && (
              <MobileLocations  selectedLocation={selectedLocation}  onSelectLocation={(loc) => setSelectedLocation(loc)} locations={locations} basePath={withBase("/spa-packages")} onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
            )}

          {item.dropdownKey === "prices" &&
            activeDropdown === "prices" && <MobilePrices onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />}
        </div>
      ))}
    </div>
  </div>
</div>

        </>
      )}
    </header>
  );
}

/* ================= DESKTOP DROPDOWNS ================= */

type DesktopLocationsProps = {
  baseUrl: string;
  locations: UILocation[];
    onSelect: (loc: UILocation) => void;
};

const DesktopLocations = ({
  baseUrl,
  locations,
  selectedLocation,
  onSelect,
}: {
  baseUrl: string;
  locations: UILocation[];
  selectedLocation: UILocation | null;
  onSelect: (loc: UILocation) => void;
}) => (
  <div className="absolute left-0 top-full pt-2">
    <div className="w-[130px] sm:w-[160px] bg-white rounded-b-md overflow-hidden">
      {getAvailableLocations(locations, selectedLocation).map((loc) => (
        <Link
          key={loc.slug}
          to={`${baseUrl}/${loc.slug}`}
          onClick={() => onSelect(loc)}
          className="block px-3 py-2 text-sm text-black hover:bg-[#f6efec]"
        >
          {loc.label}
        </Link>
      ))}
    </div>
  </div>
);


/* ================= MOBILE DROPDOWNS ================= */

const MobileLocations = ({
  basePath,
  locations,
  selectedLocation,
  onClose,
  onSelectLocation,
}: {
  basePath: string;
  locations: UILocation[];
  selectedLocation: UILocation | null;
  onClose: () => void;
  onSelectLocation: (loc: UILocation) => void;
}) => (
  <div className="ml-4 mt-2 space-y-2">
    {getAvailableLocations(locations, selectedLocation).map((loc) => (
      <Link
        key={loc.slug}
        to={withBase(`/${loc.slug}${basePath}`)}
        onClick={() => {
          onSelectLocation(loc);
          onClose();
        }}
        className="block text-sm"
      >
        {loc.label}
      </Link>
    ))}
  </div>
);


const MobilePrices = ({ onClose }: { onClose: () => void }) => (
  <div className="ml-4 mt-2 space-y-3">
    {pricesData.map((block) => (
      <div key={block.location}>
        <div className="text-sm font-semibold">{block.location}</div>
        {block.services.map((s) => (
          <Link
            key={s.slug}
            to={withBase(
              `/prices/${block.location.toLowerCase().replace(/ /g, "-")}/${
                s.slug
              }`
            )}
             onClick={onClose}
            className="block text-smml-3 py-1"
          >
            {s.label}
          </Link>
        ))}
      </div>
    ))}
  </div>
);

const DesktopDropdown = ({
  item,
  locations,
  selectedLocation,
  onSelectLocation,
}: {
  item: any;
  locations: UILocation[];
  selectedLocation: UILocation | null;
  onSelectLocation: (loc: UILocation) => void;
}) => {
  // ================= PRICES =================
  if (item.dropdownKey === "prices") {
    const blocksToShow = selectedLocation
      ? pricesData.filter(
          (p) =>
            p.location.toLowerCase() ===
            selectedLocation.label.toLowerCase()
        )
      : pricesData;

    return (
      <div className="absolute left-0 top-full pt-2">
        <div className="w-[165px] bg-white rounded-b-md overflow-hidden">
          {blocksToShow.map((block) => {
            const loc = locations.find(
              (l) =>
                l.label.toLowerCase() ===
                block.location.toLowerCase()
            );

            if (!loc) return null;

            return (
              <div key={block.location}>
                <div className="px-3 py-2 text-sm font-semibold text-black">
                  {block.location}
                </div>
                {block.services.map((s) => (
                  <Link
                    key={s.slug}
                    to={withBase(`/${loc.slug}/prices/${s.slug}`)}
                    onClick={() => onSelectLocation(loc)}
                    className="block px-4 py-2 text-xs text-black hover:bg-[#f6efec]"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= OTHER DROPDOWNS =================
  return (
    <div className="absolute left-0 top-full pt-2 w-[160px]">
      <div className="bg-white rounded-b-md overflow-hidden">
        {locations.map((loc) => (
          <Link
            key={loc.slug}
            to={withBase(`/${loc.slug}${item.basePath}`)}
            onClick={() => onSelectLocation(loc)}
            className="block px-3 py-2 text-sm text-black hover:bg-[#f6efec]"
          >
            {loc.label}
          </Link>
        ))}
      </div>
    </div>
  );
};


