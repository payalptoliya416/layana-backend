import im1 from "@/assets/im1.png";
import im2 from "@/assets/im2.png";
import ever from "@/assets/ever.png";
import home_banner from "@/assets/home-banner.png";
import { Link } from "react-router-dom";
import home_bg from "@/assets/home_bg.png";

import ban1 from "@/assets/ban1.png";
import ban2 from "@/assets/ban2.png";
import ban3 from "@/assets/ban3.png";
import ban4 from "@/assets/ban4.png";


import team1 from "@/assets/team1.png";
import team2 from "@/assets/team2.png";
import team3 from "@/assets/team3.png";
import team4 from "@/assets/team4.png";
import slide1 from "@/assets/hero1.png";
import slide2 from "@/assets/hero2.jpeg";
import CommonHeroSlider from "@/websiteComponent/common/home/CommonHeroSlider";
import SplitContentSection from "@/websiteComponent/common/home/SplitContentSection";
import PageBanner from "@/websiteComponent/common/home/PageBanner";
import ServiceCard from "@/websiteComponent/common/home/ServiceCard";
import TeamCard from "@/websiteComponent/common/home/TeamCard";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import BrandSlider from "@/websiteComponent/common/home/BrandSlider";

const homeSlides = [
  {
    image: slide1,
    title: "Your Wellness in\nYour Control",
    text: "A team of professional hairstylists with more than fifteen years of experience in fashioning memorable and creative looks",
  },
  {
    image: slide2,
    title: "Luxury Spa\nExperience",
    text: "Indulge in premium treatments designed to relax your body and rejuvenate your skin.",
  },
];

const services = [
  { title: "Beauty", image: ban1 },
  { title: "Advanced Skin Care", image: ban2 },
  { title: "Massage", image: ban3 },
  { title: "Laser Hair Removal", image: ban4 },
];

const team = [
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team1,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team2,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team3,
  },
  {
    name: "JOHN DOE",
    role: "Massage Therapist",
    bio: "I am massage therapist and I completed formal training and certificate and diploma programs in USA.",
    image: team4,
  },
];
function Home() {
  return (
    <>
    <CommonHeroSlider slides={homeSlides} />
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
          <div className="grid grid-cols-12 lg:gap-[50px]">
            <div className="col-span-12 lg:col-span-6 mb-[50px] lg:mb-0">
              <div>
                <img src={im1} alt="finchley" className="w-full mb-5" />
                <h3 className="font-mulish text-[12px] leading-[14px] font-normal tracking-[0.1em] uppercase mb-[15px]">
                  FINCHLEY CENTRAL
                </h3>
                <div className="flex justify-between items-center">
                  <h2 className="text-[32px] leading-[32px] font-quattro font-normal tracking-[0.2em] text-black mb-[15px]">
                    Layana
                  </h2>
                  <h2 className="font-mulish text-base leading-[16px] font-normal text-[#282828] text-right">
                    medispa
                  </h2>
                </div>
                <Link
                  to="#"
                  className="font-mulish text-xs leading-[14px] font-normal tracking-[0.1em] uppercase underline underline-offset-1 text-black"
                >
                  EXPLORE NOW
                </Link>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div>
                <img src={im2} alt="finchley" className="w-full mb-5" />
                <h3 className="font-mulish text-[12px] leading-[14px] font-normal tracking-[0.1em] uppercase mb-[15px]">
                  MUSWELL HILL
                </h3>
                <div className="flex justify-between items-center">
                  <h2 className="text-[32px] leading-[32px] font-quattro font-normal tracking-[0.2em] text-black mb-[15px]">
                    Layana
                  </h2>
                  <h2 className="font-mulish text-base leading-[16px] font-normal text-[#282828] text-right">
                    spa on the hill
                  </h2>
                </div>
                <Link
                  to="#"
                  className="font-mulish text-xs leading-[14px] font-normal tracking-[0.1em] uppercase underline underline-offset-1 text-black"
                >
                  EXPLORE NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- */}
      <SplitContentSection
        tag="Beauty"
        title="Do even more for your skin in less steps than ever"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
        image={ever}
         buttons={[{ label: "Read More" }]}
      />
      {/* --- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <img src={home_banner} alt="banner" className="w-full" />
        </div>
      </section>
      {/* ------ */}
      <PageBanner
        title="Your wellness in"
        subtitle="your control"
        backgroundImage={home_bg}
      />
      {/* --- */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item) => (
            <ServiceCard
              key={item.title}
              title={item.title}
              image={item.image}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[36px] mb-14">
            {team.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>

          <div className="flex justify-center">
            <CommonButton>View All</CommonButton>
          </div>

        </div>
      </section>
      {/* -------- */}
      <BrandSlider />
      {/* ---- */}
    </>
  );
}

export default Home;
