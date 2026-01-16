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
  return (
    <>
      <CommonHeroSlider slides={homeSlides} />
      <section className="w-full bg-white py-12 lg:py-[110px]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="w-full">
            <img
              src={finchley_im1}
              alt="Finchley Central Spa"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

          <div>
            <h2 className="font-mulish text-4xl font-light tracking-wide mb-[15px]">
              Finchley Central
            </h2>

            <p className="font-mulish uppercase text-sm tracking-widest mb-5">
              Ballards Lane, London
            </p>

            <p className="font-quattro text-[#666666] text-base leading-relaxed mb-[15px]">
              Welcome to the Thai Maneee Spa established by experienced team in
              the industry to bring one-stop destination for relaxation and
              beauty at one place! Located in the heart of Finchley Central, our
              Massage Spa offers a unique and authentic experience.
            </p>

            <p className="mb-[15px] text-[#666666] text-base leading-relaxed">
              With our fully trained therapists who specialise in various
              massage techniques such as Thai Yoga Massage, Aromatherapy, Hot
              Stone Therapy, Deep Tissue or Sports Massage – we promise you'll
              emerge feeling rejuvenated. But wait… our services don't stop
              there! We also offer exceptional Beauty Treatments including Hydra
              facial and facials using high-end skincare products by Crystal
              Clear and Environ which cater to all skin types.
            </p>

            <p className="mb-[15px] text-[#666666] text-base leading-relaxed">
              Struggling with body hair? Look no further than our Laser Hair
              Removal treatments that use state of the art technology ensuring
              painless hair removal leaving you with smooth skin like never
              before.
            </p>

            <button className="font-mulish underline cursor-pointer border-black tracking-widest hover:text-[#666666] text-base transition">
              Treatment Menu
            </button>
          </div>
        </div>
      </section>

      {/* --- */}
        <section className="w-full bg-white pb-12 lg:pb-[110px]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3">

        {/* Hours */}
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <Clock className="w-[18px] h-[18px] text-black" />
          </div>
          <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">Hours</h4>
          <p className="text-[#666666] text-lg font-quattro">
            Mon To Sun <br />
            10:00 am to 09:00 pm
          </p>
        </div>

        {/* Location */}
        <div className="flex flex-col items-center text-center px-6 border-y md:border-y-0 md:border-x border-gray-200 py-5 md:py-0 md:my-0 my-5">
          <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <MapPin className="w-[18px] h-[18px] text-black" />
          </div>
          <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">Location</h4>
          <p className="text-[#666666] text-lg font-quattro">
            92 – 94, Ballards Lane, London, <br />
            N3 2DL
          </p>
          <a
            href="#"
            className="mt-[10px] text-sm tracking-widest underline underline-offset-0 hover:text-para"
          >
            Get Directions
          </a>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center text-center px-6">
          <div className="w-[45px] h-[45px] rounded-full bg-[#f6efec] flex items-center justify-center mb-[15px]">
            <Phone className="w-[18px] h-[18px] text-black" />
          </div>
          <h4 className="tracking-[0.2em] text-[22px] leading-[24px] uppercase mb-3">Contact</h4>
          <p className="text-[#666666] text-lg font-quattro">
            0208 371 6922 <br />
            finchley@layana.co.uk
          </p>
        </div>

      </div>
       </section>

       {/* ------ */}
             
<PageBanner
  title="Your wellness in"
  subtitle="your control"
  backgroundImage={home_bg}
/>
{/* -------- */}
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
    <div className="py-12 lg:pb-[110px]"/>
    {/* --------- */}
        <SplitContentSection
        tag="SERVICES"
        title="Cosmetic beauty treatments perfect for your nails"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
        image={ever2}
         buttons={[{ label: "Read More" }]}
      />
      {/* --------- */}
           <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <img src={home_banner} alt="banner" className="w-full" />
        </div>
      </section>
    </>
  );
}

export default FinchleyCenteral;
