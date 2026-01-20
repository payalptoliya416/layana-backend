"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

type Slide = {
  image: string;
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
};

type Props = {
  slides: Slide[];
  height?: string;
};

export default function CommonHeroSlider({ slides, height = "h-screen" }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

const handleButtonClick = (link?: string) => {
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
};
const showNavigation = slides.length > 1;

  return (
    <section className={`relative w-full ${height} overflow-hidden`}>
      <Swiper
        modules={[Navigation, EffectFade]}
        loop
        effect="fade"
        speed={800}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="w-full h-full bg-cover relative bg-center xl:bg-[position:100%_33%]"
              style={{ backgroundImage: `url(${slide.image})`,  }}
            >
              
              <div className="relative z-10 h-full flex items-center pt-[35px] md:pt-0">
                <div className="container mx-auto text-white">
                  <div className="grid grid-cols-12 px-3 sm:px-6 lg:px-0">
                    <div className="col-span-12 lg:col-span-6 text-center md:text-left px-5 sm:px-0">
                      <h1 className="text-3xl sm:text-[42px] leading-[52px] md:text-[65px] md:leading-[75px] font-normal mb-[25px] pr-5 font-muli">
                        {slide.title.split("\n").map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </h1>

                      <p className="text-sm sm:text-lg text-white/90 mb-[25px] max-w-[530px] mx-auto md:mx-0 font-quattro tracking-[1px]">
                        {slide.text}
                      </p>

                      {slide.buttonText && slide.buttonLink && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleButtonClick(slide.buttonLink);
    }}
    className="
      border border-white
      px-7 sm:px-[50px]
      py-4 sm:py-[23px]
      uppercase tracking-[2px] 
      text-xs leading-[14px]
      hover:bg-white hover:text-black
      transition-all duration-300 font-muli
    "
  >
    {slide.buttonText}
  </button>
)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev Button - Outside Swiper */}
      {showNavigation && (
      <button
        type="button"
        onClick={handlePrev}
        className="hero-prev group absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center gap-4 bg-transparent border-none p-0"
        aria-label="Previous slide"
      >
        <div className="flex items-center justify-center">
          <span className="w-5 sm:w-9 h-5 sm:h-9 border-t-2 border-l-2 border-white rotate-[-45deg] -ml-3 sm:ml-auto transition-transform duration-300" />
        </div>
        <span className="opacity-0 group-hover:opacity-100 text-white text-sm tracking-widest -ml-5 sm:-ml-10 group-hover:-ml-5 transition-all duration-500 hidden xl:block">
          PREV
        </span>
      </button> )}

      {/* Next Button - Outside Swiper */}
      {showNavigation && (
      <button
        type="button"
        onClick={handleNext}
        className="hero-next group absolute right-4 xl:right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center gap-4 bg-transparent border-none p-0"
        aria-label="Next slide"
      >
        <span className="opacity-0 group-hover:opacity-100 text-white text-sm tracking-widest -mr-5 sm:-mr-10 group-hover:-mr-5 transition-all duration-500 hidden xl:block">
          NEXT
        </span>
        <div className="flex items-center justify-center">
          <span className="w-5 sm:w-9 h-5 sm:h-9 border-t-2 border-r-2 border-white rotate-[45deg] -mr-3 sm:mr-auto transition-transform duration-300" />
        </div>
      </button>)}
    </section>
  );
}
