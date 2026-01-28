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
    href: "https://wa.me/message/QZVCD34TB4OKC1",
  },
];

function Footer() {
const [locations, setLocations] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
  const location = useLocation();
  const locationId = location.state?.locationId as number | undefined;
  const { locationSlug } = useParams();
  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const DEFAULT_LOCATION_SLUG = "finchley-central";
  const [categories, setCategories] = useState<any[]>([]);
const [categoriesLoading, setCategoriesLoading] = useState(true);
const navigate = useNavigate();
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
      const matched = allLocations.find(
        (loc: any) => loc.slug === slugToUse
      );

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
    console.log("err",err)
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

  return (
    <>
      {/* <SocialStrip /> */}
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
          <h1 className="font-quattro text-[28px] md:text-[36px] lg:text-[40px] md:leading-[36px] lg:leading-[48px] tracking-wide mb-8 text-white xl:text-[#282828]">
            YOUR WELLNESS IN YOUR CONTROL
          </h1>

          {/* buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="
              border border-white xl:border-[#282828]
              bg-white xl:bg-[#282828]
              text-[#282828] xl:text-white
              px-[37px] py-[23px]
              text-sm font-bold tracking-widest uppercase
              transition-all duration-300 ease-in-out
              hover:bg-transparent
              hover:text-white xl:hover:text-[#282828]
            ">
              Appointment
            </button>

            <button
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
          </button>

          </div>
        </div>
      </section>

      <footer className=" text-[#cfd6da]">
        {/* ================= TOP STRIP ================= */}
        <div className="bg-[#282828] border-b border-[#f6eee9]">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 lg:gap-6 items-center ">
              {/* Social icons */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex justify-center lg:justify-start gap-3  py-[36px]">
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[55px] h-[55px] rounded-full border border-[#BEBEBE]
                  flex items-center justify-center
                  hover:bg-[#f6eee9] hover:text-[#282828]
                  transition cursor-pointer"
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>

              {/* Logo */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex justify-center sm:border-l lg:border-y-0 lg:border border-[#f6eee9]  py-[36px]">
                <Link to="#">
                <img src={white_logo} alt="Layana" className="h-[80px]" />
                </Link>
              </div>

              {/* Newsletter */}
              <div className="col-span-12 sm:col-span-12 lg:col-span-4 py-[36px]">
                <p className="text-xl tracking-widest uppercase mb-[19px]">
                  Our Newsletter
                </p>
                <div className="flex">
                  <input
                    type="email"
                     value={newsletterEmail}
                     onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 bg-transparent border-b border-[#FDE6D8]/30 text-[#BEBEBE] pr-4 py-2 text-sm focus:outline-none"
                  />
                  <button onClick={handleNewsletterSubmit}
                    disabled={submitting}
                    className="bg-[#f6eee9] px-[23px] py-[14px] text-xs tracking-widest uppercase text-black">
                     {submitting ? "Submitting..." : "Subscribe"}
                  </button>
                </div>
                              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div className=" bg-[#282828]">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 sm:gap-10 lg:gap-1 py-[39px]">
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#f6eee9] after:mt-3">
                  ABOUT LAYANA
                </h4>

                <ul className="space-y-4 text-sm">
                  <li>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <MapPin size={16} className="text-[#f6eee9]" />
                      Centerl Park West La, New York
                    </a>
                  </li>

                  <li>
                    <a
                      href="tel:+01234567890"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <Phone size={16} className="text-[#f6eee9]" />
                      +0 123 456 7890
                    </a>
                  </li>

                  <li>
                    <a
                      href="mailto:info@example.com"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <Mail size={16} className="text-[#f6eee9]" />
                      info@example.com
                    </a>
                  </li>
                </ul>

                <div className="mt-6">
                  <p className="text-white text-2xl mb-3">
                    Open Hours
                  </p>
                  <p className="text-base text-[#A3A2A2]">
                    Sunday to Friday{" "}
                    <span className="text-white">08:00 – 20:00</span>
                  </p>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#f6eee9] after:mt-3">
                  IMPORTANT LINKS
                </h4>
                <ul className="space-y-3 text-sm">
                  {[
                    { label: "Services", href: "#" },
                    { label: "About Us", href: "#" },
                    { label: "Price Plan", href: "#" },
                    { label: "Contact", href: "/contact-us" },
                    { label: "Terms & Conditions", href: "/term-condition" },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 uppercase text-[#BEBEBE] hover:text-white cursor-pointer"
                      >
                        <ChevronRight size={14} className="text-[#f6eee9]" />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#f6eee9] after:mt-3">
                  CATEGORIES
                </h4>
                <ul className="space-y-3 text-sm">
    {categoriesLoading ? (
      <li className="text-[#BEBEBE]">Loading...</li>
    ) : categories.length === 0 ? (
      <li className="text-[#BEBEBE]"></li>
    ) : (
      categories.map((cat) => (
        <li key={cat.id}>
         <button
  onClick={() =>
    navigate("/treatments", {
      state: { categoryId: cat.id },
    })
  }
            className="flex items-center gap-2 uppercase text-[#BEBEBE] hover:text-white cursor-pointer"
          >
            <ChevronRight size={14} className="text-[#f6eee9]" />
            {cat.name}
          </button>
        </li>
      ))
    )}
  </ul>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <h4 className="relative text-white tracking-widest mb-6 text-xl after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#f6eee9] after:mt-3">
                  OUR LOCATIONS
                </h4>
                <div className="space-y-3">
  {loading ? (
    <div className="py-6 flex justify-center">
      <Loader />
    </div>
  ) : (
    locations.map((loc , index) => (
      <a
        key={loc.id}
        href={`/${loc.slug}`}
        className="flex gap-4 border-b last:border-b-0 border-[#f6eee9] pb-[21px] items-center"
      >
        {/* image */}
        <div className="w-[68px] h-[68px] rounded-full overflow-hidden flex-shrink-0">
          <img
            src={loc.shop_banner_image}
            alt={loc.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* text */}
        <div>
          <p className="text-white font-quattro">
            {loc.name}
          </p>
          <p className="text-sm text-[#BEBEBE]">
            {loc.address_line_1},{" "}
            {loc.address_line_2},{" "}
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
        <div className="bg-[#282828] border-t border-[#f6eee9]">
          <div className="container mx-auto flex justify-center items-center flex-wrap gap-5 py-6">
            <div className="text-center text-sm ">
              Layana © 2015 - {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
