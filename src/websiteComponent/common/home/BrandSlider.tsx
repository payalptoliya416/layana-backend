import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type BrandSliderProps = {
  images: string[];
};

export default function BrandSlider({ images }: BrandSliderProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="bg-[#F6F6F6] py-[65px] px-5 sm:px-1">
      <Swiper
        loop
        slidesPerView={2}
        spaceBetween={60}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="flex justify-center items-center">
              <img
                src={img}
                alt={`partner-${i}`}
                className="max-h-[80px] object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
