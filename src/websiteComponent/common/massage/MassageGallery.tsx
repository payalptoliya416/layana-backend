

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
        className="w-full
        max-h-[524px]
        object-cover
        lg:max-w-[516px]
        lg:max-h-[524px] mb-5 sm:mb-[30px] overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
             className="
        w-full
        h-auto
        object-cover
        lg:max-w-[516px]
        lg:max-h-[524px]
      "
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
      spaceBetween: 10,
    },
    768: {      // tablet
      spaceBetween: 10,
    },
    1024: {     // desktop
      spaceBetween: 10,
    },
  }}
  className="w-full"
>
       {images.map((img, i) => (
  <SwiperSlide key={i}>
    <div className="cursor-pointer overflow-hidden aspect-square">
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
  </SwiperSlide>
))}
      </Swiper>
    </div>
  );
}
