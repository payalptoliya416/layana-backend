
import contact_us_bg from "@/assets/contact_us_bg.png";
import contactus from "@/assets/contactus.png";
import { useEffect, useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import { useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { submitEnquiry } from "@/websiteComponent/api/enquiryService";
import { toast } from "sonner";
import { getLocations } from "@/websiteComponent/api/webLocationService";

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const locations = {
  belsize: {
    name: "Belsize Park",
    hours: "Mon to Sun\n10.00 am to 09.00 pm",
    address: "18, Englands Lane\nLondon, NW3 4TG",
    phone: "020 4542 7449",
    email: "belsizepark@layana.co.uk",
  },
  finchley: {
    name: "Finchley Central",
    hours: "Mon to Sun\n10.00 am to 09.00 pm",
    address: "92 – 94, Ballards Lane\nLondon, N3 2DL",
    phone: "0208 371 6922",
    email: "finchley@layana.co.uk",
  },
  muswell: {
    name: "Muswell Hill",
    hours: "Mon to Sun\n10.00 am to 09.00 pm",
    address: "400, Muswell Hill Broadway\nLondon, N10 1DJ",
    phone: "0208 095 0415",
    email: "muswellhill@layana.co.uk",
  },
};

function ContactUs() {
  const [active, setActive] = useState<"belsize" | "finchley" | "muswell">(
    "belsize"
  );
  const data = locations[active];
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  //  const locationId = state?.locationId;
const [locationId, setLocationId] = useState<number | null>(
  state?.locationId ?? null
);

const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
useEffect(() => {
  // Jo already state mathi locationId aavi gayo hoy to kai karvani jarur nathi
  if (locationId) return;

  getLocations().then((res) => {
    const finchley = res.data.find(
      (item: any) => item.slug === "finchley-central"
    );

    if (finchley) {
      setLocationId(finchley.id);
    }
  });
}, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const validateForm = () => {
  const newErrors: FormErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
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

  return (
    <>
      <SimpleHeroBanner
        background={contact_us_bg}
        title="Contact Us"
        subtitle="Finchley Central"
      />
      {/* ------- */}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-16 mb-14 mx-auto border-b border-[#66666633] w-max">
            <button
              onClick={() => setActive("belsize")}
              className={`pb-4 tracking-widest text-sm ${
                active === "belsize" ? "border-b border-black" : "text-black/40"
              }`}
            >
              Belsize Park
            </button>

            <button
              onClick={() => setActive("finchley")}
              className={`pb-4 tracking-widest text-sm ${
                active === "finchley"
                  ? "border-b border-black"
                  : "text-black/40"
              }`}
            >
              Finchley Central
            </button>

            <button
              onClick={() => setActive("muswell")}
              className={`pb-4 tracking-widest text-sm ${
                active === "muswell" ? "border-b border-black" : "text-black/40"
              }`}
            >
              Muswell Hill
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 text-center">
            {/* Hours */}
            <div className="flex flex-col items-center md:border-r border-black/20 mb-5 md:mb-0">
              <div className="w-[45px] h-[45px] rounded-full bg-[#f7efe8] flex items-center justify-center mb-[15px]">
                <Clock size={18} />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal">Hours</h4>
              <p className="text-sm whitespace-pre-line font-quattro text-para">{data.hours}</p>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center md:border-r border-black/20 mb-5 md:mb-0">
              <div className="w-[45px] h-[45px] rounded-full bg-[#f7efe8] flex items-center justify-center mb-[15px]">
                <MapPin size={18} />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal">
                Location
              </h4>
              <p className="text-sm whitespace-pre-line font-quattro text-para">{data.address}</p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center">
              <div className="w-[45px] h-[45px] rounded-full bg-[#f7efe8] flex items-center justify-center mb-[15px]">
                <Phone size={18} />
              </div>
              <h4 className="text-[22px] leading-[24px] mb-3 font-normal">
                Contact
              </h4>
              <p className="text-sm whitespace-pre-line font-quattro text-para">{data.phone} <br/> {data.email}</p>
            </div>
          </div>
        </div>
      </section>
      {/* -------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="border-[5px] border-[#F6F6F6]">
            <div className="border-[5px] border-[#F6F6F6] bg-[#F7EFEC] p-4 md:p-5 text-center">
              <h3 className="text-[#282828] text-base md:text-2xl">Parking Details</h3>
            </div>
            <div className="p-5">
              <p className="text-[#666666] font-muli font-light text-sm md:text-lg mb-[15px] italic font-quattro">
                We are delighted to offer various parking choices at our
                Finchley central location.
              </p>
              <p className="text-[#666666] font-muli font-light text-sm md:text-lg mb-[15px] italic font-quattro">
                Parking on Ballard’s Lane is available under a Pay & Display
                system. Free street parking available on both Cleverly Groove
                and Falkland Avenue, but please note that controlled hours are
                in effect. For further details, refer to the parking signboards.
              </p>
             <p className="text-[#666666] font-muli font-light text-sm md:text-lg mb-[15px] italic font-quattro">
                Customers can also enjoy two hours of complimentary parking at
                Tesco on Ballard's Lane, with applicable conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ------ */}
      <SplitContentSection
        tag=""
        title="Make An Appointment With Ease"
        description="At Thai Manee, we always love to hear from our customers..."
        image={contactus}
        buttons={[
          {
            label: "Direction",
            variant: "secondary",
            onClick: () => console.log("Direction"),
          },
          { label: "Book Now", onClick: () => console.log("Book Now") },
        ]}
      />
      {/* ------ */}
       <section className="py-12 lg:py-[110px]">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
        <h2 className="text-[28px] leading-[28px] mb-[25px] font-bold">Enquire</h2>
        <form className="space-y-[35px]" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="text-left">
            <label className="block text-base mb-[15px] leading-[16px]">Name</label>
            <input
               name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter Your Name"
              className="w-full border-b border-[#666666]/30 pb-[10px] outline-none text-sm text-[#666666] font-quattro"
            />
            {errors.name && (
  <p className="text-red-500 text-xs mt-2">{errors.name}</p>
)}
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-base mb-[15px] leading-[16px]">Email Address</label>
            <input
               name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter Your Email Address"
              className="w-full border-b border-[#666666]/30 pb-[10px] outline-none text-sm text-[#666666] font-quattro"
            />
            {errors.email && (
  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
)}
          </div>

          {/* Phone */}
        <div className="text-left">
          <label className="block text-base mb-[15px] leading-[16px]">
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
            <label className="block text-base mb-[15px] leading-[16px]">Messages</label>
            <textarea
             name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Messages"
            rows={4}
              className="w-full border-b border-[#666666]/30 pb-[10px] outline-none text-sm resize-none text-[#666666] font-quattro"
            />
            {errors.message && (
  <p className="text-red-500 text-xs mt-2">{errors.message}</p>
)}
          </div>

          {/* Button */}
          <div className="pt-10">
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
    </section>
    </>
  );
}

export default ContactUs;
