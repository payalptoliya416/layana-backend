import { useEffect, useState } from "react";
import { X, MapPin, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import white_logo from "@/assets/logo.svg";
import menuimg from "@/assets/menu.png";
import { WEBSITE_BASE } from "@/route/config";
import { getLocations } from "../api/webLocationService";
import { FaLocationDot } from "react-icons/fa6";
import { getTreatmentCategories } from "../api/treatments.api";

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

type Category = {
  id: number;
  name: string;
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
  { label: "Contact Us", basePath: "/#" },
];

/* ================= DATA ================= */

const getPriceBlocks = (
  locations: UILocation[],
  selectedLocation: UILocation | null,
  categories: Category[],
) => {
  const activeLocations = selectedLocation
    ? locations.filter((l) => l.slug === selectedLocation.slug)
    : locations;

  return activeLocations.map((loc) => ({
    loc,
    services: categories.map((cat) => ({
      label: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
    })),
  }));
};

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

const isSinglePriceService = (
  selectedLocation: UILocation | null,
  locations: UILocation[],
  categories: Category[],
) => {
  const blocks = getPriceBlocks(
    locations,
    selectedLocation,
    categories,
  );

  return (
    blocks.length === 1 &&
    blocks[0].services.length === 1
  );
};
/* ================= COMPONENT ================= */

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [locations, setLocations] = useState<UILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UILocation | null>(
    null,
  );
const [categories, setCategories] = useState<Category[]>([]);
  const { locationSlug } = useParams();

useEffect(() => {
  getTreatmentCategories().then((res) => {
    setCategories(res.data);
  });
}, []);
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

  const hasSingleDropdownItem = (
    item: any,
    locations: UILocation[],
    selectedLocation: UILocation | null,
  ) => {
   if (item.dropdownKey === "prices") {
 return isSinglePriceService(
  selectedLocation,
  locations,
  categories,
);
}

    // Other dropdowns (treatments / memberships / spa)
    return locations.length === 1;
  };

  const underlineClass =
    "relative uppercase after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto pt-[25px] pb-[20px] flex items-center justify-between text-white">
        {/* Logo */}
        <Link to={withBase("/")}>
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
            const isPrice = item.dropdownKey === "prices";
            const hasDropdown = !!item.dropdownKey;
            const singleDropdown = hasSingleDropdownItem(
              item,
              locations,
              selectedLocation,
            );

            const disableClick =
              !singleDropdown && (isPrice || (hasDropdown && !hasLocation));

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (!item.dropdownKey) return;

                  if (
                    hasSingleDropdownItem(item, locations, selectedLocation)
                  ) {
                    setActiveDropdown(null);
                    return;
                  }

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
                    const isPrice = item.dropdownKey === "prices";
                    const hasDropdown = !!item.dropdownKey;
                    const hasLocation = !!selectedLocation;

                    const singleDropdown = hasSingleDropdownItem(
                      item,
                      locations,
                      selectedLocation,
                    );

                    const disableClick =
                      !singleDropdown &&
                      (isPrice || (hasDropdown && !hasLocation));

                    if (disableClick) {
                      return (
                        <span className="uppercase cursor-pointer">
                          {item.label}
                        </span>
                      );
                    }

                    // ✅ CLICK ENABLED
                    if (item.basePath === "/#") {
                    // if (item.basePath === "/contact-us") {
                      return (
                        <Link
                          to={withBase("/"
                          )}
                          // to={withBase(
                          //   selectedLocation
                          //     ? `/${selectedLocation.slug}/contact-us`
                          //     : "/contact-us",
                          // )}
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
                        state={locationState(selectedLocation)}
                        className="uppercase  cursor-pointer"
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
                     categories={categories}
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
        {/* <div className="flex items-center gap-2 lg:hidden">
           <div
          className="relative block lg:hidden group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="flex items-center gap-2 text-xs tracking-widest hover:text-white">
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
        </div> */}

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
                  const isPrice = item.dropdownKey === "prices";
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

                      {/* ================= PRICES (always dropdown) ================= */}
                      {/* {isPrice && (
                        <>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === "prices" ? null : "prices",
                              )
                            }
                            className="w-full flex justify-between items-center uppercase"
                          >
                            <span>{item.label}</span>
                            <ChevronDown size={14} />
                          </button>

                          {activeDropdown === "prices" && (
                            <MobilePrices
                              selectedLocation={selectedLocation} // ✅ ADD
                              onClose={() => {
                                setOpen(false);
                                setActiveDropdown(null);
                              }}
                            />
                          )}
                        </>
                      )} */}
{isPrice && (() => {
  const singlePrice = isSinglePriceService(
  selectedLocation,
  locations,
   categories,
);

  // 🔹 SINGLE SERVICE → direct click
  if (singlePrice) {
const blocks = getPriceBlocks(locations, selectedLocation,  categories,);
const service = blocks[0].services[0];
    return (
   <Link
  to={withBase(
    `/${blocks[0].loc.slug}/prices/${service.slug}`,
  )}
  onClick={() => setOpen(false)}
  className="block uppercase"
>
  {item.label}
</Link>

    );
  }

  // 🔹 MULTIPLE SERVICES → dropdown
  return (
    <>
      <button
        onClick={() =>
          setActiveDropdown(
            activeDropdown === "prices" ? null : "prices",
          )
        }
        className="w-full flex justify-between items-center uppercase"
      >
        <span>{item.label}</span>
        <ChevronDown size={14} />
      </button>

      {activeDropdown === "prices" && (
        <MobilePrices
         locations={locations}
           categories={categories}
          selectedLocation={selectedLocation}
          onClose={() => {
            setOpen(false);
            setActiveDropdown(null);
          }}
        />
      )}
    </>
  );
})()}

                      {/* ================= DROPDOWN ITEMS ================= */}
                      {!isPrice && hasDropdown && !hasLocation && (
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
                      {!isPrice &&
                        item.basePath &&
                        hasLocation &&
                        item.basePath !== "/#" && (
                        // item.basePath !== "/contact-us" && (
                          <Link
                            to={withBase(
                              `/${selectedLocation.slug}${item.basePath}`,
                            )}
                            onClick={() => setOpen(false)}
                            className="block uppercase"
                          >
                            {item.label}
                          </Link>
                        )}

                      {/* ================= NORMAL LINK ================= */}
                      {!item.external && !hasDropdown && item.basePath && (
                        <Link
                          to={withBase(
                            selectedLocation
                              ? `/${selectedLocation.slug}${item.basePath}`
                              : item.basePath,
                          )}
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
          className="block px-3 mb-[10px] text-[12px] text-black tracking-[2px]"
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

const MobilePrices = ({
  locations,
  selectedLocation,
  onClose,
  categories,
}: {
  locations: UILocation[];
  selectedLocation: UILocation | null;
   categories: Category[];
  onClose: () => void;
}) => {
  const blocksToShow = getPriceBlocks(
    locations,
    selectedLocation,
        categories,
  );

  return (
    <div className="ml-4 mt-2 space-y-3">
      {blocksToShow.map((block: any) => (
        <div key={block.loc.slug}>
          <div className="text-sm font-semibold">
            {block.loc.label}
          </div>

          {block.services.map((s: any) => (
            <Link
              key={s.slug}
              to={withBase(`/${block.loc.slug}/prices/${s.slug}`)}
              state={locationState(block.loc)}
              onClick={onClose}
              className="block text-sm ml-3 py-2"
            >
              {s.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

const DesktopDropdown = ({
  item,
  locations,
  selectedLocation,
   categories,
  onSelectLocation,
}: {
  item: any;
  locations: UILocation[];
  selectedLocation: UILocation | null;
   categories: Category[];
  onSelectLocation: (loc: UILocation) => void;
}) => {
  // ================= PRICES =================
  if (item.dropdownKey === "prices") {

const blocksToShow = getPriceBlocks(
  locations,
  selectedLocation,
    categories,
);

    return (
      <div className="absolute left-0 top-full pt-2">
        <div className="w-[165px] bg-white rounded-b-md overflow-hidden pt-[10px]">
         {blocksToShow.map((block: any) => (
  <div key={block.loc.slug} className="pb-2">
    {/* 🔹 Location name (API) */}
    <div className="px-3 mb-[10px] text-[14px] text-black font-medium">
      {block.loc.label}
    </div>

    {/* 🔹 Services (STATIC as-is) */}
    {block.services.map((s: any) => (
      <Link
        key={s.slug}
        to={withBase(`/${block.loc.slug}/prices/${s.slug}`)}
        state={locationState(block.loc)}
        className="block pl-5 mb-[10px] text-[12px] text-black"
      >
        {s.label}
      </Link>
    ))}
  </div>
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
            to={withBase(`/${loc.slug}${item.basePath}`)}
            state={locationState(loc)}
            onClick={() => onSelectLocation(loc)}
            className="block px-3 mb-[10px] text-xs text-black "
          >
            {loc.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
