"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";

import "swiper/css";

type Props = {
  images: string[];
};

export default function MassageGallery({ images }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="">
      
      {/* ================= TOP BIG SLIDER ================= */}
      <Swiper
        modules={[Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        className="w-full h-full mb-5 sm:mb-[30px] overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ================= BOTTOM THUMB SLIDER ================= */}
    <Swiper
  onSwiper={setThumbsSwiper}
  slidesPerView={3}
  watchSlidesProgress
  breakpoints={{
    0: {        // mobile
      spaceBetween: 16,
    },
    768: {      // tablet
      spaceBetween: 20,
    },
    1024: {     // desktop
      spaceBetween: 30,
    },
  }}
  className="w-full"
>
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="cursor-pointer overflow-hidden">
              <img
                src={img}
                className="w-full h-[120px] sm:h-[168px] object-cover hover:scale-110 transition"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
