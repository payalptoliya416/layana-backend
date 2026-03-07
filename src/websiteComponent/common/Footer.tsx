import { ArrowRight, Headset } from "lucide-react";
import white_logo from "@/assets/white_logo.png";
import footerbanner from "@/assets/footerbanner.png";
import {
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getLocations } from "../api/webLocationService";
import Loader from "./Loader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { submitEnquiry } from "../api/enquiryService";
import { getTreatmentCategories } from "../api/treatments.api";
import { FaWhatsapp } from "react-icons/fa";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/layanauk",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/layana.uk/",
  },
  {
    icon: Mail,
    href: "mailto:info@layana.co.uk",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/+447367123786",
  },
];

function Footer() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const locationId = location.state?.locationId as number | undefined;
  const { locationSlug } = useParams();
  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(
    null,
  );
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const DEFAULT_LOCATION_SLUG = "finchley-central";
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();
  const activeSlug = locationSlug || DEFAULT_LOCATION_SLUG;
  const hasLocationSlug = !!locationSlug;
  const importantLinks = [
    { label: "Treatments", path: "/treatments" },
    { label: "Prices", path: "/prices" },
    { label: "Memberships", path: "/memberships" },
    { label: "Spa Packages", path: "/spa-packages" },
    { label: "Contact", path: "/contact-us" },
    { label: "Terms & Conditions", path: "/terms-condition", direct: true },
  ];
  const activeLocation = locations.find((loc) => loc.slug === activeSlug);

  const phoneNumber = activeLocation?.phone || activeLocation?.mobile || "";
  /* ================= RESOLVE LOCATION ID ================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const res = await getTreatmentCategories();

        setCategories(res?.data ?? []);
      } catch (err) {
        console.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);

      try {
        const res = await getLocations();
        const allLocations = res.data ?? [];

        setLocations(allLocations);
        const slugToUse = locationSlug || DEFAULT_LOCATION_SLUG;
        const matched = allLocations.find((loc: any) => loc.slug === slugToUse);

        if (matched) {
          setResolvedLocationId(matched.id);
        } else {
          setResolvedLocationId(null);
          setError("Location not found");
        }
      } catch (err) {
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [locationSlug]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const locRes = await getLocations();
        setLocations(locRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleNewsletterSubmit = async () => {
    setMessage("");
    setError("");

    if (!resolvedLocationId) {
      setError("Location not found. Please refresh.");
      return;
    }

    if (!newsletterEmail) {
      setError("Please enter your email");
      return;
    }

    try {
      setSubmitting(true);

      const res = await submitEnquiry({
        location_id: resolvedLocationId,
        email: newsletterEmail,
        type: "subscribe",
      });
      if (res?.success) {
        setMessage("Subscribed successfully!");
        setNewsletterEmail("");
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setNewsletterEmail("");
    setMessage("");
    setError("");
  }, [location.pathname]);
const buildLink = (path: string, direct?: boolean) => {
  if (direct) return path;

  // location wise prefix
  return `/${activeSlug}${path}`;
};

  return (
    <>
      <section
        className="relative w-full min-h-[520px] flex items-center justify-center text-center  bg-[left_center] xl:bg-[center] bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${footerbanner})`,
        }}
      >
        <div className="absolute inset-0 bg-[#282828]/40 xl:bg-transparent"></div>
        {/* content */}
        <div className="relative z-10 max-w-3xl px-6">
          {/* arrow */}
          <a
            href="#"
            className="
            group
            w-[53px] h-[53px] mx-auto rounded-full
            border bg-white xl:bg-transparent xl:border-[#000]
            flex items-center justify-center
            mb-[41px]
            transition-all duration-300 ease-in-out
            hover:bg-[#282828]
            hover:border-[#282828]
          "
          >
            <ArrowRight
              size={20}
              className="
              text-[#000]
              transition-all duration-300
              group-hover:text-white
              group-hover:translate-x-[2px]
            "
            />
          </a>
          {/* heading */}
          <h1 className="font-muli text-[28px] md:text-[36px] lg:text-[40px] md:leading-[36px] lg:leading-[48px] tracking-wide mb-8 text-white xl:text-[#282828]">
            YOUR WELLNESS IN YOUR CONTROL
          </h1>

          {/* buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/book-consultaion"
              className="
              border border-white xl:border-[#282828]
              bg-white xl:bg-[#282828]
              text-[#282828] xl:text-white
              px-[37px] py-[23px]
              text-sm font-bold tracking-widest uppercase
              transition-all duration-300 ease-in-out
              hover:bg-transparent
              hover:text-white xl:hover:text-[#282828]
            "
            >
              Appointment
            </Link>

            <a
              href={phoneNumber ? `tel:${phoneNumber}` : "#"}
              className="group flex items-center border border-white xl:border-[#282828] uppercase
            tracking-widest text-xs p-2
            transition-all duration-300
            xl:hover:bg-[#282828] hover:bg-white"
            >
              <span
                className="flex items-center justify-center w-[50px] h-[50px]
              bg-white  xl:bg-[#282828]
              transition-colors duration-300
              xl:group-hover:bg-white group-hover:bg-[#282828]"
              >
                <Headset
                  size={20}
                  className="text-[#282828] xl:text-white
                transition-colors duration-300
                xl:group-hover:text-[#282828] group-hover:text-white"
                />
              </span>

              {/* text */}
              <span
                className="px-3 py-3 text-sm font-bold
              text-white xl:text-[#282828]
              transition-colors duration-300
              xl:group-hover:text-white group-hover:text-[#282828]"
              >
                Make a Call
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#1d252d] text-[#cfd3d8]">
        {/* ================= TOP STRIP ================= */}
        <div className="border-y border-[#e5ddd4]/55">
          <div className="container mx-auto px-0 sm:px-8">
            <div className="grid grid-cols-1 items-stretch overflow-hidden lg:grid-cols-[1fr_0.9fr_1.15fr] lg:divide-x lg:divide-[#e5ddd4]/55">
              {/* Social icons */}
              <div className="flex h-full items-center justify-center gap-3 border-b border-[#e5ddd4]/55 px-6 py-6 sm:justify-start md:px-10 lg:border-b-0 lg:px-10 lg:py-6">
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Social link ${i + 1}`}
                    className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#e5ddd4] text-[#f3f1ea] transition-colors duration-300 hover:border-[#e5ddd4] hover:text-[#e5ddd4]"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              {/* Logo */}
              <div className="flex h-full items-center justify-center border-b border-[#e5ddd4]/55 px-6 py-6 lg:border-b-0 lg:px-10 lg:py-6">
                <Link to="/">
                  <img
                    src={white_logo}
                    alt="Layana"
                    className="h-auto w-[138px] sm:w-[152px]"
                  />
                </Link>
              </div>

              {/* Newsletter */}
              <div className="flex h-full flex-col justify-center px-6 py-6 sm:px-10 lg:px-10 lg:py-6">
                <p className="font-muli text-[16px] uppercase tracking-[0.08em] text-white">
                  Our Newsletter
                </p>
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-0">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="h-[42px] flex-1 sm:min-w-[250px] lg:min-w-[280px] border-b border-[#e5ddd4]/55 bg-transparent pr-4 text-[13px] text-[#cfd3d8] placeholder:text-[#a8b0b7] focus:outline-none"
                  />
                  <button
                    onClick={handleNewsletterSubmit}
                    disabled={submitting}
                    className="h-[42px] min-w-[140px] bg-[#e5ddd4] px-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1d252d] transition-colors duration-300 hover:bg-[#d8cec4] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Submitting..." : "Subscribe"}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
                {message && (
                  <p className="mt-2 text-sm text-green-400">{message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-16 lg:py-10">
              <div>
                <h4 className="font-muli text-[17px] uppercase tracking-[0.04em] text-white after:mt-4 after:block after:h-px after:w-10 after:bg-[#e5ddd4] after:content-['']">
                  ABOUT LAYANA
                </h4>

                {activeLocation ? (
                  <ul className="mt-8 space-y-5 text-[14px] leading-7 text-[#aeb5bb]">
                    {/* Address */}
                    <li>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          activeLocation.address_line_1 +
                            ", " +
                            activeLocation.address_line_2 +
                            ", " +
                            activeLocation.postcode,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 text-[#aeb5bb] transition-colors duration-300 hover:text-[#e5ddd4]"
                      >
                        <div className="pt-1">
                          <MapPin size={15} className="text-[#e5ddd4] transition-colors duration-300 group-hover:text-[#e5ddd4]" />
                        </div>
                        <span>
                          {activeLocation.address_line_1},{" "}
                          {activeLocation.address_line_2},{" "}
                          {activeLocation.postcode}
                        </span>
                      </a>
                    </li>

                    {/* Phone */}
                    <li>
                      <a
                        href={`tel:${activeLocation.phone}`}
                        className="group flex items-center gap-3 text-[#aeb5bb] transition-colors duration-300 hover:text-[#e5ddd4]"
                      >
                        <div className="pt-0.5">
                          <Phone size={15} className="text-[#e5ddd4] transition-colors duration-300 group-hover:text-[#e5ddd4]" />
                        </div>
                        {activeLocation.phone}
                      </a>
                    </li>

                    {/* Email */}
                    <li>
                      <a
                        href={`mailto:${activeLocation.email}`}
                        className="group flex items-center gap-3 text-[#aeb5bb] transition-colors duration-300 hover:text-[#e5ddd4]"
                      >
                        <div className="pt-0.5">
                          <Mail size={15} className="text-[#e5ddd4] transition-colors duration-300 group-hover:text-[#e5ddd4]" />
                        </div>
                        {activeLocation.email}
                      </a>
                    </li>
                  </ul>
                ) : (
                  <p className="mt-8 text-sm text-[#aeb5bb]">
                    Location details not available
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-muli text-[17px] uppercase tracking-[0.04em] text-white after:mt-4 after:block after:h-px after:w-10 after:bg-[#e5ddd4] after:content-['']">
                  IMPORTANT LINKS
                </h4>
                <ul className="mt-8 space-y-4 text-[13px]">
                  {importantLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={buildLink(item.path, item.direct)}
                        className="group flex items-center gap-2 uppercase tracking-[0.02em] text-[#aeb5bb] transition-colors duration-300 hover:text-[#e5ddd4]"
                      >
                        <ChevronRight size={14} className="text-[#e5ddd4] transition-colors duration-300 group-hover:text-[#e5ddd4]" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-muli text-[17px] uppercase tracking-[0.04em] text-white after:mt-4 after:block after:h-px after:w-10 after:bg-[#e5ddd4] after:content-['']">
                  CATEGORIES
                </h4>
                <ul className="mt-8 space-y-4 text-[13px]">
                  {categoriesLoading ? (
                    <li className="text-[#aeb5bb]"></li>
                  ) : categories.length === 0 ? (
                    <li className="text-[#aeb5bb]"></li>
                  ) : (
                    categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() =>
                            navigate(`/${activeSlug}/treatments`, {
                              state: { categoryId: cat.id },
                            })
                          }
                          className="group flex items-center gap-2 uppercase tracking-[0.02em] text-[#aeb5bb] transition-colors duration-300 hover:text-[#e5ddd4]"
                        >
                          <ChevronRight size={14} className="text-[#e5ddd4] transition-colors duration-300 group-hover:text-[#e5ddd4]" />
                          {cat.name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-muli text-[17px] uppercase tracking-[0.04em] text-white after:mt-4 after:block after:h-px after:w-10 after:bg-[#e5ddd4] after:content-['']">
                  OUR LOCATIONS
                </h4>
                <div className="mt-8 space-y-0">
                  {loading ? (
                    <div className="flex justify-center py-6">
                      <Loader />
                    </div>
                  ) : (
                    locations.map((loc) => (
                      <a
                        key={loc.id}
                        href={`/${loc.slug}`}
                        className="flex items-center gap-4 border-b border-[#e5ddd4]/35 py-4 first:pt-0 last:border-b-0"
                      >
                        {/* image */}
                        <div className="h-[62px] w-[62px] flex-shrink-0 overflow-hidden rounded-full">
                          <img
                            src={loc.shop_banner_image}
                            alt={loc.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* text */}
                        <div className="min-w-0">
                          <p className="font-muli text-[15px] text-white">
                            {loc.name}
                          </p>
                          <p className="text-xs text-[#BEBEBE]">
                            {loc.address_line_1}, {loc.address_line_2},{" "}
                            {loc.postcode}
                          </p>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="border-t border-[#e5ddd4]/35">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-5 py-4">
            <div className="text-center text-sm text-[#aeb5bb]">
              Layana &copy; 2015 - {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
