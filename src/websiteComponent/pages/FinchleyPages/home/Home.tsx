import l1 from "@/assets/l1.jpg";
import l2 from "@/assets/l2.jpg";
import l3 from "@/assets/l3.jpg";
import { Link } from "react-router-dom";
import CommonHeroSlider from "@/websiteComponent/common/home/CommonHeroSlider";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import PageBanner from "@/websiteComponent/common/home/PageBanner";
import ServiceCard from "@/websiteComponent/common/home/ServiceCard";
import TeamCard from "@/websiteComponent/common/home/TeamCard";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import BrandSlider from "@/websiteComponent/common/home/BrandSlider";
import { useEffect, useMemo, useState } from "react";
import { getHomePageData } from "@/websiteComponent/api/pricing.api";
import Loader from "@/websiteComponent/common/Loader";
import { getLocations, Locationweb } from "@/websiteComponent/api/webLocationService";
import { withBase } from "@/websiteComponent/common/Header";
import { Helmet } from "react-helmet-async";

function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
const [locations, setLocations] = useState<Locationweb[]>([]);
const locationImages = [ l1, l2 ,l3];

useEffect(() => {
  const seen = localStorage.getItem("home_offer_modal_seen");

  if (!seen) {
    setShowOfferModal(true);
  }
}, []);

  useEffect(() => {
    getHomePageData()
      .then((res) => {
        setHomeData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

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
  

  const slides = homeData?.slider?.map((item: any) => ({
  image: item.image,
  title: item.title,
  text: item.description,
  buttonText: item.btn_text,
  buttonLink: item.btn_link,
})) ?? [];

const handleCloseOfferModal = () => {
  localStorage.setItem("home_offer_modal_seen", "true");
  setShowOfferModal(false);
};

const treatmentCount = homeData?.treatments?.length ?? 0;
const gridClass =
  treatmentCount === 1
    ? "lg:grid-cols-4"
    : treatmentCount === 2
    ? "lg:grid-cols-4"
    : treatmentCount === 3
    ? "lg:grid-cols-3"
    : "lg:grid-cols-4";

const cardHeightClass =
   treatmentCount === 3
    ? "h-[420px] md:h-[482px] lg:h-[642px]"
    : "h-[420px] md:h-[482px]";


useEffect(() => {
  if (!homeData?.seo?.analytics) return;

  const raw = homeData.seo.analytics;
  const cleanText = raw.replace(/<[^>]*>/g, "").trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Layana",
    description: cleanText,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(jsonLd);

  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
  };
}, [homeData?.seo?.analytics]);

  const decodeHtmlEntities = (str: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  const processAnalytics = (analytics: string): string => {
    // Check if content appears to be HTML-encoded
    if (analytics.includes('&lt;') || analytics.includes('&gt;')) {
      return decodeHtmlEntities(analytics);
    }
    return analytics;
  };

  if (loading || !homeData) {
  return (
    <div className="py-20 text-center">
      <Loader />
    </div>
  );
}

  return (
    <>
 {homeData?.seo && (
  <Helmet>

    <meta
      name="description"
      content={homeData?.seo.meta_description}
    />

    {homeData?.seo.seo_keyword?.length > 0 && (
      <meta
        name="keywords"
        content={homeData?.seo.seo_keyword.join(", ")}
      />
    )}

    {/* {homeData?.seo.analytics && (
     <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: processAnalytics(homeData?.seo.analytics) 
          }}
        />
    )} */}
  </Helmet>
)}

     {/* {showOfferModal && (
    <HomeOfferModal onClose={handleCloseOfferModal} />
  )} */}
    {slides.length > 0 && (
  <CommonHeroSlider slides={slides} />
)}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 lg:gap-[24px]">
            <div className="col-span-12 lg:col-span-6 mb-5 lg:mb-0">
              <p className="text-lg sm:text-[25px] sm:leading-[36px] font-light text-justify font-muli">
               A team of skilled wellness, beauty and aesthetic experts with over a decade of expertise in delivering the treatments.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <p className="text-sm sm:text-base sm:leading-[26px] font-normal text-justify font-quattro text-[#666666]">
               At Layana by Thai Manee, we are here to reveal the luxurious self-care of pampering and revival. If you're seeking a retreat that harmoniously combines non-surgical proficiency and spa luxury, then look no further. Immerse yourself in our tranquil environment where cutting-edge procedures harmonise perfectly with serene surroundings for wellness. Join us to experience the magical experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ---- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
         <div className="grid grid-cols-12 md:gap-[24px] items-stretch">
            {locations?.map((loc, index) => (
            <div   key={loc.id} className="col-span-12 md:col-span-4 mb-[50px] md:mb-0 last:mb-0">
             <div className="h-full">
                <div className="w-full h-[200px] md:h-[600px] mb-5 overflow-hidden">
                <img
                  src={locationImages[index % locationImages.length]}
                  alt="finchley"
                  className="w-full h-full object-cover"
                />
              </div>
                              
                <div className="flex justify-between items-center  mb-[15px]">
                  <h3 className="font-muli text-[13px] font-normal tracking-[0.1em] uppercase">
                  {loc.name}
                </h3>
                  <h2 className="font-muli text-base leading-[16px] font-normal text-[#282828] text-right">
                     {loc.free_text}
                  </h2>
                </div>
                <Link
                   to={withBase(`/${loc.slug}`)}
                state={{ id: loc.id, slug: loc.slug }}
                  className="text-[13px] font-bold tracking-[0.1em] uppercase underline underline-offset-1 text-black"
                >
                  EXPLORE NOW
                </Link>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- */}
   
      <SplitContentSection
        tag={homeData.promo_1.sub_title}
        title={homeData.promo_1.title}
        description={
          <div className="leading-[27px] text-base"
            dangerouslySetInnerHTML={{ __html: homeData.promo_1.description }}
          />
        }
        image={homeData.visuals.promo_1_image}
        bgColor={homeData.promo_1.bg_color}
        buttons={[
          {
            label: homeData.promo_1.btn_text,
            link: homeData.promo_1.btn_link,
          },
        ]}
      />

      {/* --- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <img src={homeData.visuals.promo_2_image} alt="banner" className="w-full" />
        </div>
      </section>

      {/* ------ */}
      <PageBanner
        title="Your wellness in your"
        subtitle="control"
        backgroundImage={homeData.visuals.promo_3_image}
      />
      {/* --- */}
      <section className="w-full">
         <div  className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass}`}>
          {homeData.treatments.map((item: any,index) => (
            <ServiceCard
              key={item.id}
              index={index}
              title={item.name}
              image={item.thumbnail_image}
              link={`/${item.location_slug}/treatments/${item.slug}`}
              id={item.id}
              heightClass={cardHeightClass} 
               locationId={item.location_id}
            />
          ))}
        </div>
      </section>
      
      {/* -------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <h2 className="font-muli text-center text-[42px] mb-10">
            Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {homeData.teams.map((member: any, index: number) => (
              <TeamCard
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                index={index}
              />
            ))}
          </div>

          <div className="flex justify-center mt-16 lg:mt-24">
             <CommonButton to="/websiteurl">View All</CommonButton>
             {/* <CommonButton to="/websiteurl/team">View All</CommonButton> */}
          </div>
        </div>
      </section>
      {/* -------- */}
      {homeData?.visuals?.partner_image?.length > 0 && (
        <BrandSlider images={homeData.visuals.partner_image} />
      )}
      {/* ---- */}
    </>
  );
}

export default Home;
