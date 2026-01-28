import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import white_logo from "@/assets/logo.svg";
import menuimg from "@/assets/menu.png";
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

const locationState = (loc: UILocation | null) =>
  loc
    ? {
        locationId: loc.id,
        locationSlug: loc.slug,
      }
    : undefined;

const getAvailableLocations = (
  locations: UILocation[],
  selectedLocation: UILocation | null,
) => {
  if (!selectedLocation) return locations;
  return locations.filter((loc) => loc.slug !== selectedLocation.slug);
};
/* ================= COMPONENT ================= */

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [locations, setLocations] = useState<UILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UILocation | null>(
    null,
  );  
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
      const formatted: UILocation[] = res.data.map((item: LocationApi) => ({
        id: item.id,
        label: item.name,
        slug: item.slug,
      }));

      setLocations(formatted);
    });
  }, []);

  const underlineClass =
    "relative uppercase after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto pt-[25px] pb-[20px] flex items-center justify-between text-white">
        {/* Logo */}
        <Link to="/">
          <img
            src={white_logo}
            alt="Layana"
            className="w-[100px] sm:w-[126px]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-[20px] text-[11px] xl:text-xs tracking-[2px] font-muli ml-12 pr-8">
          {menu.map((item) => {
            const hasLocation = !!selectedLocation;

            const resolvedPath =
              hasLocation && item.basePath
                ? `/${selectedLocation.slug}${item.basePath}`
                : item.basePath;
          const hasDropdown = !!item.dropdownKey;

          const shouldShowDropdown =
            hasDropdown && !selectedLocation && locations.length > 1;
            return (
              <div
                key={item.label}
                className="relative"
               onMouseEnter={() => {
              if (shouldShowDropdown) {
                setActiveDropdown(item.dropdownKey);
              }
            }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    className={underlineClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  (() => {
                    if (item.label === "Contact Us") {
  const contactPath = selectedLocation
    ? `/${selectedLocation.slug}/contact-us`
    : "/contact-us";

  return (
    <Link
      to={contactPath}
      state={locationState(selectedLocation)}
      className={underlineClass}
    >
      {item.label}
    </Link>
  );
}

                    return (
            //           <Link
            //   to={resolvedPath}
            //   state={locationState(selectedLocation)}
            //   className={shouldShowDropdown ? "uppercase" : underlineClass}
            // >
            //   {item.label}
            // </Link>
            <>
            {shouldShowDropdown ? (
  <button
    type="button"
    className="uppercase cursor-pointer"
    onClick={(e) => e.preventDefault()} // stop navigation
  >
    {item.label}
  </button>
) : (
  <Link
    to={resolvedPath}
    state={locationState(selectedLocation)}
    className={underlineClass}
  >
    {item.label}
  </Link>
)}</>
                    );
                  })()
                )}

                {activeDropdown === item.dropdownKey && (
                  <DesktopDropdown
                    item={item}
                    locations={locations}
                    onSelectLocation={(loc) => setSelectedLocation(loc)}
                  />
                )}
              </div>
            );
          })}
        </nav>

        <div
          className="relative hidden lg:block group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 text-sm tracking-widest
             max-w-[160px] overflow-hidden"
          >
            <FaLocationDot size={18} className="shrink-0" />

            <span
              className="block truncate whitespace-nowrap overflow-hidden font-quattro text-xs xl:text-sm"
              title={selectedLocation?.label ?? "Choose Location"}
            >
              {selectedLocation?.label ?? "Choose Location"}
            </span>
          </button>

          {activeDropdown === "location" && (
            <DesktopLocations
              baseUrl={""}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelect={(loc) => {
                setSelectedLocation(loc);
                setActiveDropdown(null);
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-5 sm:gap-2 lg:hidden">
          <div className="relative block lg:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === "location" ? null : "location",
                );
              }}
              className="flex items-center gap-2 text-xs tracking-widest"
            >
              <FaLocationDot size={14} />
              {selectedLocation?.label ?? "Choose Location"}
            </button>

            {activeDropdown === "location" && (
              <DesktopLocations
                baseUrl={""}
                locations={locations}
                selectedLocation={selectedLocation}
                onSelect={(loc) => {
                  setSelectedLocation(loc);
                  setActiveDropdown(null);
                }}
              />
            )}
          </div>
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <img src={menuimg} alt="menu" />}
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
                {menu.map((item) => {
                  const hasDropdown = !!item.dropdownKey;
                  const hasLocation = !!selectedLocation;

                  return (
                    <div key={item.label}>
                      {/* ================= EXTERNAL ================= */}
                      {item.external && (
                        <a
                          href={item.href}
                          target="_blank"
                          className="block uppercase"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}

                      {/* ================= DROPDOWN ITEMS ================= */}
                      {hasDropdown && !hasLocation && (
                        <>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === item.dropdownKey
                                  ? null
                                  : item.dropdownKey,
                              )
                            }
                            className="w-full flex justify-between items-center uppercase"
                          >
                            <span>{item.label}</span>
                            <ChevronDown size={14} />
                          </button>

                          {activeDropdown === item.dropdownKey && (
                            <MobileLocations
                              locations={locations}
                              selectedLocation={selectedLocation}
                              basePath={item.basePath!}
                              onSelectLocation={(loc) =>
                                setSelectedLocation(loc)
                              }
                              onClose={() => {
                                setOpen(false);
                                setActiveDropdown(null);
                              }}
                            />
                          )}
                        </>
                      )}
                      
                      {/* ================= DIRECT LINK (location selected) ================= */}
                      {
                        item.basePath &&
                        hasLocation &&
                          item.basePath !== "/contact-us" && (
                          <Link
                            to={`/${selectedLocation.slug}${item.basePath}`}
                            onClick={() => setOpen(false)}
                            className="block uppercase"
                          >
                            {item.label}
                          </Link>
                        )}

                      {/* ================= NORMAL LINK ================= */}
                      {!item.external && !hasDropdown && item.basePath && (
                        <Link
                          to={selectedLocation
                              ? `/${selectedLocation.slug}${item.basePath}`
                              : item.basePath}
                          onClick={() => setOpen(false)}
                          className="block uppercase"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
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
  <div className="absolute left-0 top-full pt-2 ">
    <div className="w-[150px] sm:w-[160px] bg-white rounded-b-md overflow-hidden pt-[10px]">
      {getAvailableLocations(locations, selectedLocation).map((loc) => (
        <Link
          key={loc.slug}
          to={`${baseUrl}/${loc.slug}`}
          state={locationState(loc)}
          onClick={() => onSelect(loc)}
          className="block px-3 py-[5px] hover:bg-[#f6eee9] transition duration-200 text-[12px] text-black tracking-[2px]"
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
        to={`/${loc.slug}${basePath}`}
        state={locationState(loc)}
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

const DesktopDropdown = ({
  item,
  locations,
  onSelectLocation,
}: {
  item: any;
  locations: UILocation[];
  onSelectLocation: (loc: UILocation) => void;
}) => {

 if (item.dropdownKey === "prices") {
    return (
      <div className="absolute left-0 top-full pt-2 w-[160px]">
        <div className="bg-white rounded-b-md overflow-hidden pt-[10px]">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              to={`/${loc.slug}/prices`}
              state={locationState(loc)}
              onClick={() => onSelectLocation(loc)}
              className="block px-3 py-[5px] text-xs text-black hover:bg-[#f6eee9] transition duration-200"
            >
              {loc.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  // ================= OTHER DROPDOWNS =================
  return (
    <div className="absolute left-0 top-full pt-2 w-[160px]">
      <div className="bg-white rounded-b-md overflow-hidden pt-[10px] ">
        {locations.map((loc) => (
          <Link
            key={loc.slug}
            to={`/${loc.slug}${item.basePath}`}
            state={locationState(loc)}
            onClick={() => onSelectLocation(loc)}
            className="block px-3 py-[5px] text-xs text-black hover:bg-[#f6eee9] transition duration-200"
          >
            {loc.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
