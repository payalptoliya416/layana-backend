import contact_us_bg from "@/assets/contact_us_bg.png";
import contact_us_bg1 from "@/assets/contact_us_bg1.png";
import loc1 from "@/assets/loc1.png";
import loc2 from "@/assets/loc2.png";
import { useEffect, useState } from "react";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import { useLocation, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { submitEnquiry } from "@/websiteComponent/api/enquiryService";
import { toast } from "sonner";
import {
  getLandingPageByLocation,
  getLocations,
} from "@/websiteComponent/api/webLocationService";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
import { IoLocationSharp } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import Loader from "@/websiteComponent/common/Loader";

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};
type LocationType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  slug: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postcode: string;
  parking_details: string;
};

const locationSections: Record<
  string,
  {
    title: string;
    description: string;
    image: any;
    direction: string;
    booking: string;
  }
> = {
  "finchley-central": {
    title: "Seamless Scheduling at Layana Spa in Minutes",
    description:
      "At Layana spas by Thai Manee, We always love to hear from our customers. Our customer care team respond to booking / any queries by e-mail or by telephone along with on-line booking.",
    image: loc1,
    direction:
      "https://www.google.com/maps/dir//92-94+Ballards+Ln,+London+N3+2DL,+UK/@51.6038931,-0.1947809,16z/data=!4m9!4m8!1m0!1m5!1m1!1s0x48761755e42bce49:0x36422c1b9d207767!2m2!1d-0.189631!2d51.6038865!3e0?entry=ttu",
    booking: "https://www.fresha.com/providers/rmxjfmmk",
  },

  "belsize-park": {
    title: "Make An Appointment With Ease",
    description: "At LAYANA, We always love to hear from our customers. Our customer care team also respond to booking / any queries by e-mail or by telephone along with on-line booking.",
    image: loc2,
    direction:
      "https://www.google.co.uk/maps/place/18+England's+Ln,+Belsize+Park,+London+NW3+4TG/@51.5463953,-0.1642362,17z/data=!3m1!4b1!4m6!3m5!1s0x48761aed8016cb59:0xee504d5b65bc871!8m2!3d51.5463953!4d-0.1616613!16s%2Fg%2F11bw3h8fsv?entry=tts&g_ep=EgoyMDI0MTAyMy4wIPu8ASoASAFQAw%3D%3D",
    booking:
      "https://www.fresha.com/a/layana-belsize-park-primrose-hill-london-18-englands-lane-fvfy7djn/booking?menu=true&multi=true&cartId=152373cc-6f7c-43c2-9e75-4e32a0116054",
  },

  "muswell-hill": {
    title: "Make An Appointment With Ease",
    description:
      "At LAYANA medispa, We always love to hear from our customers. Our customer care team also respond to booking / any queries by e-mail or by telephone along with on-line booking.",
    image: loc2,
    direction:
      "https://www.google.com/maps/dir//400+Muswell+Hill+Broadway,+London/@51.5918033,-0.1839486,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x48761a2cdd486789:0xaa65c654b397253c!2m2!1d-0.1427494!2d51.5918105!3e0?entry=ttu",
    booking: "https://www.fresha.com/providers/rmxjfmmk",
  },
};

function ContactUs() {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [locationsData, setLocationsData] = useState<LocationType[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationType | null>(
    null,
  );
  const [locationId, setLocationId] = useState<number | null>(
    state?.locationId ?? null,
  );
const [locationsLoading, setLocationsLoading] = useState(true);
const [landingLoading, setLandingLoading] = useState(false);
  const { locationSlug } = useParams();
  const [landingData, setLandingData] = useState<any>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [initialLoad, setInitialLoad] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const activeSection =
    activeLocation?.slug && locationSections[activeLocation.slug];

  useEffect(() => {
       setLocationsLoading(true);

    getLocations().then((res) => {
      setLocationsData(res.data);

      if (state?.locationId) {
        const found = res.data.find(
          (loc: LocationType) => loc.id === state.locationId,
        );

        if (found) {
          setActiveLocation(found);
          setLocationId(found.id);
          return;
        }
      }

      // ✅ Default location Finchley
      const defaultLoc = res.data.find(
        (loc: LocationType) => loc.slug === "finchley-central",
      );

      if (defaultLoc) {
        setActiveLocation(defaultLoc);
        setLocationId(defaultLoc.id);
      }
    }) .finally(() => {
      setLocationsLoading(false);
    });
  }, []);

  useEffect(() => {
  if (!locationId) return;
   setLandingLoading(true);
 const startTime = Date.now();
  getLandingPageByLocation(locationId)
    .then((res) => {
      setLandingData(res.data);
    })
    .catch(() => {
      setLandingData(null);
    })
    .finally(() => {
      const elapsed = Date.now() - startTime;

      const minDelay = 400; // ✅ loader minimum 0.4 sec

      setTimeout(() => {
        setLandingLoading(false);
        setInitialLoad(false);
      }, elapsed < minDelay ? minDelay - elapsed : 0);
    });
}, [locationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const formatTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);

    const suffix = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 || 12;

    return `${hour12}:${minute} ${suffix}`;
  };
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationId) {
      toast.error("Location not selected");
      return;
    }

    // Frontend validation
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      const res = await submitEnquiry({
        location_id: locationId,
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        message: formData.message,
      });

      // ✅ SUCCESS (backend message)
      toast.success(res.message || "Enquiry submitted successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: any) {
      console.error(err);

      if (err?.errors) {
        const backendErrors: FormErrors = {};

        if (err.errors.name) backendErrors.name = err.errors.name[0];
        if (err.errors.email) backendErrors.email = err.errors.email[0];
        if (err.errors.mobile) backendErrors.phone = err.errors.mobile[0];
        if (err.errors.message) backendErrors.message = err.errors.message[0];

        setErrors(backendErrors);
      }

      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const contactbgImage =
    locationSlug === "finchley" || locationSlug === "finchley-central"
      ? contact_us_bg1
      : contact_us_bg;

  if (!activeLocation) {
    return (
      <div className="text-center py-20 text-lg">
        Loading location details...
      </div>
    );
  }

if (initialLoad && (locationsLoading || landingLoading)) {
  return (
    <div className="py-20 text-center">
      <Loader />
    </div>
  );
}

  return (
    <>
      <SimpleHeroBanner
        background={contactbgImage}
        title="Contact Us"
        breadcrumb={<Breadcrumb />}
      />
      {/* ------- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row justify-center mb-14 mx-auto w-max">
            {locationsData.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocation(loc);
                  setLocationId(loc.id);
                }}
                className={`tracking-[2px] text-base leading-[28px] border-b border-[#66666633] px-5 py-[10px] ${
                  activeLocation?.id === loc.id
                    ? "border-b border-black  font-semibold"
                    : "text-[#666666]"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-1 text-center">
            {/* Hours */}
            <div className="flex flex-col items-center border-black/20 mb-5 md:mb-0">
              <div className="w-[44px] h-[44px] rounded-full bg-[#F7EFEC] flex items-center justify-center mb-[15px]">
                <FaClock className="w-[16px] h-[16px] text-black" />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal tracking-[2px]">
                Hours
              </h4>
              <p className="text-[#666666] text-sm sm:text-lg font-quattro flex flex-col justify-center gap-1">
                {" "}
                {landingData?.opening_hours?.map((day: any) => (
                  <div key={day.id}>
                    {day.day.charAt(0).toUpperCase() + day.day.slice(1)} -{" "}
                    {day.is_closed
                      ? "Closed"
                      : `${formatTo12Hour(day.start_time)} - ${formatTo12Hour(
                          day.end_time,
                        )}`}
                  </div>
                ))}
              </p>
            </div>

            {/* Location */}
            <div
              className="flex flex-col items-center border-black/20 mb-5 md:mb-0  relative  md:before:content-['']
            md:before:absolute
            md:before:left-0
            md:before:top-1/2
            md:before:-translate-y-1/2
            md:before:h-32
            md:before:w-px
            md:before:bg-gray-300

            /* RIGHT LINE */
            md:after:content-['']
            md:after:absolute
            md:after:right-0
            md:after:top-1/2
            md:after:-translate-y-1/2
            md:after:h-32
            md:after:w-px
            md:after:bg-gray-300"
            >
              <div className="w-[44px] h-[44px] rounded-full bg-[#F7EFEC] flex items-center justify-center mb-[15px]">
                <IoLocationSharp className="w-[18px] h-[18px] text-black" />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal tracking-[2px]">
                Location
              </h4>
              <p className="text-[#666666] text-sm sm:text-lg font-quattro flex flex-col justify-center gap-1">
                {" "}
                {activeLocation?.address_line_1}
                <br />
                {activeLocation.address_line_2},{activeLocation.city},{" "}
                {activeLocation.state} ,{activeLocation.postcode}
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center">
              <div className="w-[44px] h-[44px] rounded-full bg-[#F7EFEC] flex items-center justify-center mb-[15px]">
                <BsFillTelephoneFill className="w-[16px] h-[16px] text-black" />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal tracking-[2px]">
                Contact
              </h4>
              <p className="text-[#666666] text-sm sm:text-lg font-quattro flex flex-col justify-center gap-1">
                {" "}
                {activeLocation.phone}
                <br />
                {activeLocation.email}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* -------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="border-[5px] border-[#F6F6F6]">
            <div className="border-[5px] border-[#F6F6F6] bg-[#F7EFEC] p-4 md:p-5 text-center">
              <h3 className="text-[#282828] text-base md:text-2xl">
                Parking Details
              </h3>
            </div>
            <div className="p-5">
              <div
                className="text-[#666666] font-muli font-light text-sm md:text-lg mb-[15px] italic font-quattro"
                dangerouslySetInnerHTML={{
                  __html: activeLocation.parking_details,
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* ------ */}
      {activeSection && (
        <SplitContentSection
          tag=""
          title={activeSection.title}
          description={activeSection.description}
          image={activeSection.image}
          buttons={[
            {
              label: "direction",
              link: activeSection.direction,
            },
            {
              label: "book now",
              link: activeSection.booking,
            },
          ]}
          titleClassName="font-bold"
        />
      )}

      {/* -finchley */}
      {/* <SplitContentSection
    tag=""
    title="Seamless Scheduling at Layana Spa in Minutes"
    description="At Layana spas by Thai Manee, We always love to hear from our customers. Our customer care team respond to booking / any queries by e-mail or by telephone along with on-line booking."
    image={loc1}
    buttons={[
      {label: "directiion",
        link: "https://www.google.com/maps/dir//92-94+Ballards+Ln,+London+N3+2DL,+UK/@51.6038931,-0.1947809,16z/data=!4m9!4m8!1m0!1m5!1m1!1s0x48761755e42bce49:0x36422c1b9d207767!2m2!1d-0.189631!2d51.6038865!3e0?entry=ttu"
      },
      {label: "book now",
        link :"https://www.fresha.com/providers/rmxjfmmk"
      },
    ]}
    titleClassName="font-bold"
  /> */}

      {/* --belsize-- */}
      {/* <SplitContentSection
    tag=""
    title="Make An Appointment With Ease"
    description="At LAYANA, We always love to hear from our customers. Our customer care team also respond to booking / any queries by e-mail or by telephone along with on-line booking."
    image={loc2}
    buttons={[
      {label: "directiion",
        link: "https://www.google.co.uk/maps/place/18+England's+Ln,+Belsize+Park,+London+NW3+4TG/@51.5463953,-0.1642362,17z/data=!3m1!4b1!4m6!3m5!1s0x48761aed8016cb59:0xee504d5b65bc871!8m2!3d51.5463953!4d-0.1616613!16s%2Fg%2F11bw3h8fsv?entry=tts&g_ep=EgoyMDI0MTAyMy4wIPu8ASoASAFQAw%3D%3D"
      },
      {label: "book now",
        link :"https://www.fresha.com/a/layana-belsize-park-primrose-hill-london-18-englands-lane-fvfy7djn/booking?menu=true&multi=true&cartId=ae991bb0-a668-4f1e-8e0e-b62aabc0e087"
      },
    ]}
    titleClassName="font-bold"
  /> */}
      {/* ---muswell hill */}
      {/* <SplitContentSection
    tag=""
    title="Make An Appointment With Ease"
    description="At LAYANA medispa, We always love to hear from our customers. Our customer care team also respond to booking / any queries by e-mail or by telephone along with on-line booking."
    image={loc2}
    buttons={[
      {label: "directiion",
        link: "https://www.google.com/maps/dir//400+Muswell+Hill+Broadway,+London/@51.5918033,-0.1839486,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x48761a2cdd486789:0xaa65c654b397253c!2m2!1d-0.1427494!2d51.5918105!3e0?entry=ttu"
      },
      {label: "book now",
        link :"https://www.fresha.com/providers/rmxjfmmk"
      },
    ]}
    titleClassName="font-bold"
  /> */}

      {/* ------ */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-7 lg:col-start-4">
              <h2 className="text-[28px] leading-[28px] mb-[40px] font-bold text-[#212529]">
                Enquire
              </h2>
              <form className="space-y-[25px]" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="text-left">
                  <label className="block text-base mb-0 leading-[16px]">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Your Name"
                    className="mt-[10px] w-full border-b border-[#666666]/30 pb-[10px] outline-none text-base text-[#666666] font-quattro"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="text-left">
                  <label className="block text-base mb-0 leading-[16px]">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="mt-[10px] w-full border-b border-[#666666]/30 pb-[10px] outline-none text-base text-[#666666] font-quattro"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="text-left">
                  <label className="block text-base mb-0 leading-[16px]">
                    Mobile Number
                  </label>

                  <PhoneInput
                    country="gb"
                    enableSearch
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: `+${value}`,
                      }))
                    }
                    containerClass="!w-full"
                    inputClass="
              !w-full
              !h-[48px]
              !pl-[60px]
              !border-0
              !border-b
              !border-[#666666]/30
              !rounded-none
              !text-sm
              !text-[#666666]
              !font-quattro
              focus:!outline-none
            "
                    buttonClass="
              !border-0
              !border-b
              !border-[#666666]/30
              !rounded-none
              !bg-transparent
            "
                    dropdownClass="!text-sm"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div className="text-left">
                  <label className="block text-base mb-[15px] leading-[16px]">
                    Messages
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Messages"
                    rows={4}
                    className="mt-[10px] w-full border-b border-[#666666]/30 pb-[10px] outline-none text-base resize-none text-[#666666] font-quattro"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="border border-black px-16 py-4 text-xs tracking-widest hover:bg-black hover:text-white transition h-[60px]"
                  >
                    {loading ? "SENDING..." : "SEND"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;
