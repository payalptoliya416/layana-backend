import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import logo1 from "@/assets/logo1.png";
import logo2 from "@/assets/logo2.png";
import logo3 from "@/assets/logo3.png";
import logo4 from "@/assets/logo4.jpg";
import logo5 from "@/assets/logo5.png";
import logo6 from "@/assets/logo6.png";
import logo7 from "@/assets/logo7.png";

const brands = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

export default function BrandSlider() {
  return (
    <section className="bg-[#F6F6F6] py-[65px]">
      <div className="">
        <Swiper
          loop
          slidesPerView={2}
          spaceBetween={80}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {brands.map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center">
                <img
                  src={logo}
                  alt="brand"
                  className=""
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}