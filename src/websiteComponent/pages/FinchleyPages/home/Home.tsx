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
import { useEffect, useState } from "react";
import { getHomePageData } from "@/websiteComponent/api/pricing.api";
import HomeOfferModal from "./HomeOfferModal";
import Loader from "@/websiteComponent/common/Loader";
import { getLocations, Locationweb } from "@/websiteComponent/api/webLocationService";
import { withBase } from "@/websiteComponent/common/Header";

function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
const [locations, setLocations] = useState<Locationweb[]>([]);
const locationImages = [l1, l2, l3];
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
    ? "lg:grid-cols-1"
    : treatmentCount === 2
    ? "lg:grid-cols-2"
    : treatmentCount === 3
    ? "lg:grid-cols-3"
    : "lg:grid-cols-4";

const cardHeightClass =
  treatmentCount === 2 || treatmentCount === 3
    ? "h-[420px] sm:h-[642px]"
    : "h-[420px]";

  if (loading || !homeData) {
  return (
    <div className="py-20 text-center">
      <Loader />
    </div>
  );
}

  return (
    <>
     {showOfferModal && (
    <HomeOfferModal onClose={handleCloseOfferModal} />
  )}
    {slides.length > 0 && (
  <CommonHeroSlider slides={slides} />
)}
      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 lg:gap-[50px]">
            <div className="col-span-12 lg:col-span-6 mb-5 lg:mb-0">
              <p className="text-[25px] leading-[36px] font-light text-justify">
                A team of professional hairstylists with more than fifteen years
                of experience in fashioning memorable and creative looks
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <p className="text-base leading-[26px] font-normal text-justify font-quattro text-para">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ---- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
         <div className="grid grid-cols-12 md:gap-[50px] items-stretch">
            {locations?.map((loc, index) => (
            <div   key={loc.id} className="col-span-12 md:col-span-4 mb-[50px] md:mb-0">
             <div className="h-full">
                <div className="w-full h-[200px] md:h-[600px] mb-5 overflow-hidden">
                <img
                  src={locationImages[index % locationImages.length]}
                  alt="finchley"
                  className="w-full h-full object-cover md:object-fill"
                />
              </div>
                              
                <div className="flex justify-between items-center  mb-[15px]">
                  <h3 className="font-mulish text-[12px] leading-[14px] font-normal tracking-[0.1em] uppercase">
                  {loc.name}
                </h3>
                  <h2 className="font-mulish text-base leading-[16px] font-normal text-[#282828] text-right">
                     {loc.city}
                  </h2>
                </div>
                <Link
                   to={withBase(`/${loc.slug}`)}
                state={{ id: loc.id, slug: loc.slug }}
                  className="font-mulish text-xs leading-[14px] font-normal tracking-[0.1em] uppercase underline underline-offset-1 text-black"
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
          <div
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
        title="Your wellness in"
        subtitle="your control"
        backgroundImage={homeData.visuals.promo_3_image}
      />
      {/* --- */}
      <section className="w-full">
         <div  className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass}`}>
          {homeData.treatments.map((item: any) => (
            <ServiceCard
              key={item.id}
              title={item.name}
              image={item.thumbnail_image}
              link={`/treatments/${item.slug}`}
              id={item.id}
                heightClass={cardHeightClass} 
            />
          ))}
        </div>
      </section>
      
      {/* -------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <h2 className="font-quattro text-center text-[36px] mb-14">
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

          <div className="flex justify-center mt-24">
            <CommonButton to="/websiteurl/team">View All</CommonButton>
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
