import finchley_im1 from "@/assets/finchley-im1.png";
import { Clock, MapPin, Phone } from "lucide-react";
import home_bg from "@/assets/home_bg.png";
import ban3 from "@/assets/ban3.png";
import ban2 from "@/assets/ban2.png";
import ban5 from "@/assets/ban5.png";
import ban6 from "@/assets/ban6.png";
import ban7 from "@/assets/ban7.png";
import ban8 from "@/assets/ban8.png";
import ban9 from "@/assets/ban9.png";
import ban10 from "@/assets/ban10.png";
import ever2 from "@/assets/ever2.png";
import home_banner from "@/assets/home-banner.png";
import slide3 from "@/assets/slide3.png";
import PageBanner from "@/websiteComponent/common/home/PageBanner";
import ServiceCard from "@/websiteComponent/common/home/ServiceCard";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import CommonHeroSlider from "@/websiteComponent/common/home/CommonHeroSlider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLandingPageByLocation, getLocations } from "@/websiteComponent/api/webLocationService";
import Loader from "@/websiteComponent/common/Loader";
import banner_home from '@/assets/banner_home.jpg';
import { Helmet } from "react-helmet-async";

const homeSlides = [
  {
    image: slide3,
    title: "Relax, Indulge, Enjoy and  Love Yourself.",
    text: "",
  },
  {
    image: slide3,
    title: "Luxury Spa\nExperience",
    text: "",
  },
];

const services = [
  { title: "Massage", image: ban3 },
  { title: "Spa Programs", image: ban5 },
  { title: "Facials & Peels", image: ban6 },
  { title: "Skin", image: ban2 },
  { title: "Laser Hair Removal", image: ban7 },
  { title: "For your Eyes", image: ban8 },
  { title: "Waxing", image: ban9 },
  { title: "Nails", image: ban10 },
];

function FinchleyCenteral() {
  const { locationSlug } = useParams<{ locationSlug: string }>();

const [loading, setLoading] = useState(true);
const [landingData, setLandingData] = useState<any>(null);
console.log("landingData",landingData?.treatments)
useEffect(() => {
  if (!locationSlug) return;

  const fetchData = async () => {
    setLoading(true); // 🔥 important

    try {
      // 1️⃣ get all locations
      const locRes = await getLocations();

      // ✅ FIXED: correct path
      const selectedLocation = locRes.data.find(
        (loc: any) => loc.slug === locationSlug
      );

      if (!selectedLocation) {
        console.error("Invalid location slug");
        setLandingData(null);
        return;
      }

      // 2️⃣ call landing page API with ID
      const landingRes = await getLandingPageByLocation(
        selectedLocation.id
      );

      // ✅ FIXED: actually set data
      setLandingData(landingRes.data);
    } catch (err) {
      console.error(err);
      setLandingData(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [locationSlug]);

useEffect(() => {
  if (!landingData?.seo?.analytics) return;

  const raw = landingData.seo.analytics;
  const cleanText = raw.replace(/<[^>]*>/g, "").trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Layana",
    description: cleanText,
  };

  // 🔥 Remove existing JSON-LD if any
  const existingScript = document.getElementById("landing-jsonld");
  if (existingScript) {
    existingScript.remove();
  }

  // 🔥 Create fresh JSON-LD script
  const script = document.createElement("script");
  script.id = "landing-jsonld";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);

  document.head.appendChild(script);

  return () => {
    script.remove();
  };
}, [landingData?.seo?.analytics]);

const treatmentCount = landingData?.treatments?.length ?? 0;
const gridClass =
  treatmentCount === 1
    ? "lg:grid-cols-1"
    : treatmentCount === 2
    ? "lg:grid-cols-2"
    : treatmentCount === 3
    ? "lg:grid-cols-3"
    : "lg:grid-cols-4";

    const cardHeightClass =
  treatmentCount === 2 || treatmentCount === 3
    ? "h-[420px] lg:h-[642px]"
    : "h-[420px]";


 if (loading) {
  return <div className="py-20 text-center"><Loader/></div>;
}

if (!landingData) {
  return <div className="py-20 text-center"></div>;
}
  
  return (
    <>

     {landingData?.seo && (
      <Helmet>
    
        <meta
          name="description"
          content={landingData?.seo.meta_description}
        />
    
        {landingData?.seo.seo_keyword?.length > 0 && (
          <meta
            name="keywords"
            content={landingData?.seo.seo_keyword.join(", ")}
          />
        )}
    

         {/* {landingData.seo.analytics && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: landingData.seo.analytics,
        }}
      />
    )} */}
      </Helmet>
    )}

      <CommonHeroSlider
  slides={landingData.sliders.map((s: any) => ({
    image: s.image,
    title: s.title,
    text: s.description ?? "",
    buttonText: s.btn_text,
    buttonLink: s.btn_link,
  }))}
/>
      <section className="w-full bg-white py-12 lg:py-[110px]">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="w-full">
            <img
              src={landingData?.about?.image}
              alt="Finchley Central Spa"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-muli text-4xl tracking-wide mb-[15px]">
             {landingData.location.name}
            </h2>

            <p className="font-muli uppercase text-sm tracking-widest mb-5">
              {landingData.location.city}, {landingData.location.country}
            </p>
            <div
            className="font-quattro text-[#666666] text-base leading-relaxed mb-[15px]"
              dangerouslySetInnerHTML={{
                __html: landingData.about?.description ?? "",
              }}
            />

            <a href={landingData.about?.btn_link} className="font-mulish underline cursor-pointer border-black tracking-widest hover:text-[#666666] text-base transition">
               {landingData.about?.btn_text}
            </a>
          </div>
        </div>
      </section>

      {/* --- */}
        <section className="w-full bg-white pb-12 lg:pb-[110px]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3">

        {/* Hours */}
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-[44px] h-[44px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <Clock className="w-[18px] h-[18px] text-black" />
          </div>
          <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">Hours</h4>
          <p className="text-[#666666] text-lg font-quattro flex flex-wrap justify-center gap-1">
              {landingData.opening_hours.map((day: any) => (
    <div key={day.id}>
       {day.day.charAt(0).toUpperCase() + day.day.slice(1)} :{" "}
      {day.is_closed
        ? "Closed"
        : `${day.start_time} - ${day.end_time}`}
    </div>
  ))}
          </p>
        </div>

        {/* Location */}
       {/* Location */}
{landingData?.location && (
  <div className="flex flex-col items-center text-center px-6 border-y md:border-y-0 md:border-x border-gray-200 py-5 md:py-0 md:my-0 my-5">
    <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
      <MapPin className="w-[18px] h-[18px] text-black" />
    </div>

    <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">
      Location
    </h4>

    <p className="text-[#666666] text-lg font-quattro">
      {landingData.location.address_line_1}
      <br />
      {landingData.location.address_line_2}
      <br />
      {landingData.location.postcode}
    </p>

    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${landingData.location.address_line_1}, ${landingData.location.address_line_2}, ${landingData.location.postcode}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-[10px] text-base font-normal tracking-widest underline hover:text-para"
    >
      Get Directions
    </a>
  </div>
)}

        {/* Contact */}
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <Phone className="w-[18px] h-[18px] text-black" />
          </div>
          <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">Contact</h4>
          <p className="text-[#666666] text-lg font-quattro">
            {landingData.location.phone} <br />
            {landingData.location.email}
          </p>
        </div>

      </div>
       </section>

       {/* ------ */}
             
<PageBanner
  title="Your wellness in your"
  subtitle="control"
  backgroundImage={landingData.promotion.promotion_1_image}
/>
{/* -------- */}
  <section className="w-full">
      <div  className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass}`}>
         {landingData.treatments.map((item: any) => (
          <ServiceCard
            key={item.id}
            title={item.name}
            link={`/finchley-central/${item.slug}`}
            image={item.thumbnail_image}
              heightClass={cardHeightClass} 
          />
        ))}
      </div>
    </section>
    <div className="py-12 lg:pb-[110px]"/>
    {/* --------- */}
     {landingData.promotion3 && (
  <SplitContentSection
    tag={landingData.sub_title}
    title={landingData.promotion3.title}
    description={
      <div
        dangerouslySetInnerHTML={{
          __html: landingData.promotion3.description,
        }}
      />
    }
    image={landingData.promotion3.image}
    buttons={[
      {
        label: landingData.promotion3.btn_text,
        link: landingData.promotion3.btn_link, 
      },
    ]}
  />
)}

      {/* --------- */}
           <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">
          <img src={landingData.promotion.promotion_2_image} alt="banner" className="w-full" />
        </div>
      </section>
    </>
  );
}

export default FinchleyCenteral;
