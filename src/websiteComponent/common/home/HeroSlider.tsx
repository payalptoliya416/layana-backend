"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import slide1 from "@/assets/hero1.png";
import slide2 from "@/assets/hero2.jpeg";

const slides = [
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
export default function HeroSlider() {

  return (
    <section className="relative w-full h-screen overflow-hidden">
  <Swiper
  modules={[Navigation, EffectFade]}
  loop
  effect="fade"
  onBeforeInit={(swiper) => {
    // Ensure navigation object exists
    if (typeof swiper.params.navigation === "boolean") {
      swiper.params.navigation = {};
    }

    swiper.params.navigation = {
      ...(swiper.params.navigation || {}),
      prevEl: ".hero-prev",
      nextEl: ".hero-next",
    };
  }}
  navigation
  className="w-full h-full"
>

  {slides.map((slide, i) => (
    <SwiperSlide key={i}>
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${slide.image})` }}
      >

        <div className="relative z-10 h-full flex items-center pt-[35px] md:pt-auto">
          <div className="container mx-auto text-white">
            <div className="grid grid-cols-12">
             <div className="col-span-12 lg:col-span-6 text-center md:text-left">
            <h1 className="text-[42px] leading-[52px] md:text-[65px] md:leading-[75px] font-normal mb-[25px] font-mulish">
              {slide.title.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </h1>

            <p className="text-lg text-white mb-[25px] font-quattro max-w-[476px]">
              {slide.text}
            </p>

            <button className="border border-white px-[50px] py-[23px] uppercase tracking-[0.15em] text-xs hover:bg-black hover:border-black transition cursor-pointer">
              Book Now
            </button>
             </div>
            </div>
          </div>
        </div>
      </div>
    </SwiperSlide>
  ))}

{/* Prev */}
<div className="hero-prev group absolute left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center gap-4">
  <div className="flex items-center justify-center">
    <span className="w-9 h-9 border-t-2 border-l-2 border-white rotate-[-45deg]" />
  </div>
  <span className="opacity-0 group-hover:opacity-100 text-white text-sm tracking-widest -ml-10 group-hover:-ml-5 transition-all duration-500">
    PREV
  </span>

</div>

{/* Next */}
<div className="hero-next group absolute right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center gap-4">
  <span className="opacity-0 group-hover:opacity-100 text-white text-sm tracking-widest -mr-10 group-hover:-mr-5 transition-all duration-500">
    NEXT
  </span>
  <div className="flex items-center justify-center">
    <span className="w-9 h-9 border-t-2 border-r-2 border-white rotate-[45deg]" />
  </div>

</div>

</Swiper>
    </section>
  );
}
