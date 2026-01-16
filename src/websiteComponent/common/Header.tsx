import { useState } from "react";
import { X, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import white_logo from "@/assets/white_logo.png";
import menuimg from "@/assets/menu.png";
import { WEBSITE_BASE } from "@/route/config";

/* ================= MENU ================= */
const withBase = (path: string) =>
  `${WEBSITE_BASE}${path.startsWith("/") ? path : `/${path}`}`;

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
    dropdownData: [
      { label: "Belsize Park", slug: "belsize-park" },
      { label: "Finchley Central", slug: "finchley-central" },
      { label: "Musswell Hill", slug: "muswell-hill" },
    ],
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
    dropdownData: [
      { label: "Belsize Park", slug: "belsize-park" },
      { label: "Finchley Central", slug: "finchley-central" },
      { label: "Musswell Hill", slug: "muswell-hill" },
    ],
  },

  {
    label: "Spa Packages",
    dropdownKey: "spa",
    basePath: "/spa-packages",
    dropdownData: [
      { label: "Belsize Park", slug: "belsize-park" },
      { label: "Finchley Central", slug: "finchley-central" },
      { label: "Musswell Hill", slug: "muswell-hill" },
    ],
  },

  {
    label: "Gift Cards",
    href: "https://www.fresha.com/vouchers/provider/rmxjfmmk",
    external: true,
  },
  { label: "Contact Us", href: "/contact-us" },
];

/* ================= DATA ================= */

const locations = [
  { label: "Belsize Park", slug: "belsize-park" },
  { label: "Finchley Central", slug: "finchley-central" },
  { label: "Muswell Hill", slug: "muswell-hill" },
];

const pricesData = [
  {
    location: "Finchley Central",
    services: [
      { label: "Massage & Beauty", slug: "massage-beauty" },
      { label: "Skin", slug: "skin" },
      { label: "Laser", slug: "laser" },
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

/* ================= COMPONENT ================= */

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
const underlineClass =
  "relative uppercase after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#e6c9a2] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto py-[22px] flex items-center justify-between text-white">
        {/* Logo */}
        <Link to={withBase("/")}>
          <img src={white_logo} alt="Layana" className="w-[114px]" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-[25px] text-sm tracking-widest font-muli">
          {menu.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.dropdownKey && setActiveDropdown(item.dropdownKey)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                   className={`hover:text-[#e6c9a2] ${underlineClass}`}
                >
                  {item.label}
                </a>
              ) : item.dropdownKey ? (
                <span className="cursor-pointer hover:text-[#e6c9a2] uppercase">
                  {item.label}
                </span>
              ) : (
                <Link to={withBase(item.href)} className="uppercase">
                  {item.label}
                </Link>
              )}

              {activeDropdown === item.dropdownKey && (
                <DesktopDropdown item={item} />
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Location */}
        <div
          className="relative hidden lg:block group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="flex items-center gap-2 text-sm tracking-widest hover:text-[#e6c9a2]">
            <MapPin size={14} />
            {selectedLocation ?? "Choose Location"}
          </button>

          {activeDropdown === "location" && (
            <DesktopLocations
              baseUrl={withBase("/finchley")}
              onSelect={(label) => {
                setSelectedLocation(label);
                setActiveDropdown(null);
              }}
            />
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2">
           <div
          className="relative block lg:hidden group"
          onMouseEnter={() => setActiveDropdown("location")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="flex items-center gap-2 text-xs tracking-widest hover:text-[#e6c9a2]">
            <MapPin size={14} />
            {selectedLocation ?? "Choose Location"}
          </button>

          {activeDropdown === "location" && (
            <DesktopLocations
              baseUrl={withBase("/finchley")}
              onSelect={(label) => {
                setSelectedLocation(label);
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
        <div className="lg:hidden bg-black/85 text-white px-6 py-6 space-y-4">
          {menu.map((item) => (
            <div key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block tracking-widest text-sm py-2"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === item.dropdownKey
                        ? null
                        : item.dropdownKey || null
                    )
                  }
                  className="w-full flex justify-between items-center tracking-widest text-sm py-2"
                >
                  <span>{item.label}</span>
                  {item.dropdownKey && <ChevronDown size={14} />}
                </button>
              )}
              {item.dropdownKey === "treatments" &&
                activeDropdown === "treatments" && (
                  <MobileLocations baseUrl={withBase("/treatments")} onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
                )}

              {item.dropdownKey === "memberships" &&
                activeDropdown === "memberships" && (
                  <MobileLocations baseUrl={withBase("/memberships")}  onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }}/>
                )}

              {item.dropdownKey === "spa" && activeDropdown === "spa" && (
                <MobileLocations baseUrl={withBase("/spa-packages")}  onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }}/>
              )}

              {item.dropdownKey === "prices" && activeDropdown === "prices" && (
                <MobilePrices  onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
              )}

              {/* {!item.dropdown && (
                <Link to={item.href} className="block pl-4 py-2 text-sm">
                  Go
                </Link>
              )} */}
            </div>
          ))}
        </div>
      )}
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
            <Link
              to={withBase(item.href)}
              className="block uppercase"
               onClick={() => {
                  setOpen(false);
                  setActiveDropdown(null);
                }}
            >
              {item.label}
            </Link>
          )}

          {/* Dropdowns */}
          {item.dropdownKey === "treatments" &&
            activeDropdown === "treatments" && (
              <MobileLocations baseUrl={withBase("/treatments")} onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
            )}

          {item.dropdownKey === "memberships" &&
            activeDropdown === "memberships" && (
              <MobileLocations baseUrl={withBase("/memberships")} onClose={() => {
    setOpen(false);
    setActiveDropdown(null);
  }} />
            )}

          {item.dropdownKey === "spa" &&
            activeDropdown === "spa" && (
              <MobileLocations baseUrl={withBase("/spa-packages")} onClose={() => {
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

const DesktopLocations = ({
  baseUrl,
  onSelect,
}: {
  baseUrl: string;
  onSelect: (label: string) => void;
}) => (
  <div className="absolute left-0 top-full pt-2">
    <div className="w-[130px] sm:w-[160px] bg-white rounded-b-md overflow-hidden">
      {locations.map((loc) => (
        <Link
          key={loc.slug}
          to={baseUrl}
          onClick={() => onSelect(loc.label)}
          className="block px-3 py-2 text-sm text-black hover:bg-[#f6efec]"
        >
          {loc.label}
        </Link>
      ))}
    </div>
  </div>
);

const DesktopPrices = () => (
  <div className="absolute left-0 top-full pt-2">
    <div className="w-[165px] bg-white rounded-b-md overflow-hidden">
      {pricesData.map((block) => (
        <div key={block.location}>
          <div className="px-3 py-2 text-sm font-semibold text-black">
            {block.location}
          </div>

          {block.services.map((s) => (
            <Link
              key={s.slug}
              to={withBase(
                `/prices/${block.location.toLowerCase().replace(/ /g, "-")}/${s.slug}`
              )}
              className="block px-4 py-2 text-xs text-black hover:bg-[#f6efec]"
            >
              {s.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ================= MOBILE DROPDOWNS ================= */

const MobileLocations = ({
  baseUrl,
  onClose,
}: {
  baseUrl: string;
  onClose: () => void;
}) => (
  <div className="ml-4 mt-2 space-y-2">
    {locations.map((loc) => (
      <Link
        key={loc.slug}
        to={`${baseUrl}/${loc.slug}`}
        className="block text-sm"
          onClick={onClose}
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

const DesktopDropdown = ({ item }: { item: any }) => {
  if (item.dropdownKey === "prices") {
    return <DesktopPrices />;
  }

  if (!item.dropdownData) return null;
  return (
    <div className="absolute left-0 top-full pt-2 w-[160px] overflow-hidden">
      <div className="bg-white rounded-b-md">
      {item.dropdownKey === "prices"
        ? item.dropdownData.map((block: any) => (
            <div key={block.title} className="border-b last:border-0">
              <div className="px-3 py-2 font-semibold text-black">
                {block.title}
              </div>

              {block.items.map((s: any) => (
                <Link
                  key={s.slug}
                  to={withBase(
                    `${item.basePath}/${block.title
                      .toLowerCase()
                      .replace(/ /g, "-")}/${s.slug}`
                  )}
                  className="block px-2 py-2 text-sm text-black hover:bg-[#f6efec]"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          ))
        : item.dropdownData.map((d: any) => (
            <Link
              key={d.slug}
              to={withBase(`${item.basePath}/${d.slug}`)}
              className="block px-2 py-2 text-sm text-black hover:bg-[#f6efec]"
            >
              {d.label}
            </Link>
          ))}
      </div>
    </div>
  );
};
