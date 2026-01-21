
import PageBanner from "@/websiteComponent/common/home/PageBanner";
import ServiceCard from "@/websiteComponent/common/home/ServiceCard";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import CommonHeroSlider from "@/websiteComponent/common/home/CommonHeroSlider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLandingPageByLocation, getLocations } from "@/websiteComponent/api/webLocationService";
import Loader from "@/websiteComponent/common/Loader";
import { Helmet } from "react-helmet-async";
import { FaClock } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";

function FinchleyCenteral() {
  const { locationSlug } = useParams<{ locationSlug: string }>();

const [loading, setLoading] = useState(true);
const [landingData, setLandingData] = useState<any>(null);
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
    ? "h-[420px] md:h-[482px] lg:h-[642px]"
    : "h-[420px] md:h-[482px]";


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
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="w-full">
            <img
              src={landingData?.about?.image}
              alt="Finchley Central Spa"
              className="lg:!max-w-none"
            />
          </div>

          <div>
            <h2 className="font-muli text-4xl tracking-wide mb-[15px]">
             {landingData.location.name}
            </h2>

            <p className="font-muli uppercase text-base tracking-widest mb-5">
              {landingData.location.city}, {landingData.location.country}
            </p>

            <div
            className="font-quattro text-[#666666] text-sm sm:text-base leading-[26px] mb-[15px] text-justify"
              dangerouslySetInnerHTML={{
                __html: landingData.about?.description ?? "",
              }}
            />

            <a href={landingData.about?.btn_link} className="underline cursor-pointer border-black tracking-widest hover:text-[#666666] text-base transition">
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
            <FaClock className="w-[16px] h-[16px] text-black" />
          </div>
          <h4 className="tracking-[2px] text-sm sm:text-[22px] leading-[24px] mb-4">Hours</h4>
          <p className="text-[#666666] text-sm sm:text-lg font-quattro flex flex-wrap justify-center gap-1">
              {/* {landingData.opening_hours.map((day: any) => (
            <div key={day.id}>
              {day.day.charAt(0).toUpperCase() + day.day.slice(1)} :{" "}
              {day.is_closed
                ? "Closed"
                : `${day.start_time} - ${day.end_time}`}
            </div>
          ))} */}
          Monday : 06:20 - 06:50
          </p>
        </div>

       {/* Location */}
        {landingData?.location && (
          <div  className="
  relative
  flex flex-col items-center text-center px-6
  py-5 md:py-0
  my-5 md:my-0

  /* LEFT LINE */
  md:before:content-['']
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
  md:after:bg-gray-300
">
            <div className="w-[42px] sm:w-[45px] h-[42px] sm:h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
              <IoLocationSharp  className="w-[18px] h-[18px] text-black" />
            </div>

            <h4 className="tracking-[2px] text-sm sm:text-[22px] leading-[24px] mb-4">
              Location
            </h4>

            <p className="text-[#666666] text-sm sm:text-lg font-quattro">
              {landingData.location.address_line_1}
             , {""}
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
              className="mt-[10px] text-base font-semibold tracking-[2px] underline hover:text-para font-mulish"
            >
              Get Directions
            </a>
          </div>
        )}

        {/* Contact */}
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <BsFillTelephoneFill  className="w-[16px] h-[16px] text-black" />
          </div>
          <h4 className="tracking-[2px] text-sm sm:text-[22px] leading-[24px] mb-4">Contact</h4>
          <p className="text-[#666666] text-sm sm:text-lg font-quattro">
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
         {landingData.treatments.map((item: any, index) => (
          <ServiceCard
            key={item.id}
            index={index}
            title={item.name}
           link={`/finchley-central/treatments/${item.slug}`}
            image={item.thumbnail_image}
            id={item.id}
              heightClass={cardHeightClass} 
          />
        ))}
      </div>
    </section>
    <div className="pb-12 lg:pb-[110px]"/>
    {/* --------- */}
     {landingData.promotion3 && (
  <SplitContentSection
    tag={landingData.promotion3.sub_title}
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
           <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <img src={landingData.promotion.promotion_2_image} alt="banner" className="w-full" />
        </div>
      </section>
    </>
  );
}

export default FinchleyCenteral;
