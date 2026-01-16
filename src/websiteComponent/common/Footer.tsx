import { ArrowRight, Headset } from "lucide-react";
import white_logo from "@/assets/white_logo.png";
import blog from "@/assets/blog.png";
import copy_img from "@/assets/copy_img.png";
import footerbanner from "@/assets/footerbanner.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

function Footer() {
  return (
    <>
      {/* <SocialStrip /> */}
      <section
        className="relative w-full min-h-[520px] flex items-center justify-center text-center  bg-[left_center] md:bg-[center]    bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${footerbanner})`,
        }}
      >
        {/* <div className="absolute inset-0 bg-[#c9ab8d]/30" /> */}
        {/* content */}
        <div className="relative z-10 max-w-3xl px-6">
          {/* arrow */}
          <div className="w-[53px] h-[53px] mx-auto rounded-full bg-[#9A563A] flex items-center justify-center mb-[41px]">
            <ArrowRight className="text-white" size={20} />
          </div>

          {/* heading */}
          <h1 className="text-white font-quattro text-[28px] md:text-[36px] lg:text-[40px] md:leading-[36px] lg:leading-[48px] tracking-wide mb-8">
            YOUR WELLNESS IN YOUR CONTROL
          </h1>

          {/* buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-[#9A563A] text-white px-[37px] py-[23px] text-sm  font-bold tracking-widest uppercase hover:bg-[#84462f] transition">
              Appointment
            </button>

            <button
              className="flex items-center border border-white bg-white text-[#9A563A] uppercase
              tracking-widest text-xs hover:bg-transparent hover:text-white transition p-2"
            >
              {/* left icon box */}
              <span className="flex items-center justify-center w-[50px] h-[50px] bg-[#9A563A]">
                <Headset size={20} className="text-white" />
              </span>

              {/* text */}
              <span className="px-3 py-3 text-sm font-bold">Make a Call</span>
            </button>
          </div>
        </div>
      </section>

      {/* <footer className="bg-[#282828] text-white pt-[38px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-16">
            <div className="lg:col-span-1 mx-auto">
              <img src={white_logo} alt="Layana" />
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div>
                <ul className="space-y-[10px] text-xs font-quattro">
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Infrared Sauna
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Cool Peel
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Image Facials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Nails & Waxing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Laser Hair Removal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Skin Rejuvenation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Red Vein Removal
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <ul className="space-y-[10px] text-xs font-quattro">
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Pigmentation Removal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Deep Tissue Massage
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Thai Traditional Massage
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Aromatherapy Massage
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Thai Foot Reflexology
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="hover:text-white"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <h4 className="font-mulish text-lg leading-[16px] mb-5">
                We don’t keep our secrets!
              </h4>

              <label className="block font-mulish text-sm leading-[14px] mb-[10px]">
                Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-white/40 pb-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-white mb-8"
              />

              <label className="block font-mulish text-[14px] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-white/40 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white mb-12"
              />

              <button className="border border-white px-10 py-3 text-[12px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition">
                Subscribe
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
            Thai Mane © 2015 – {new Date().getFullYear()}
          </div>
        </div>
      </footer> */}
      <footer className=" text-[#cfd6da]">
        {/* ================= TOP STRIP ================= */}
        <div className="bg-[#1F262B] border-b border-[#9A563A]">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 lg:gap-6 items-center ">
              {/* Social icons */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex justify-center lg:justify-start gap-3  py-[36px]">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <span
                    key={i}
                    className="w-[55px] h-[55px] rounded-full border border-[#BEBEBE] flex items-center justify-center hover:bg-[#9A563A] hover:border-[#9A563A] transition cursor-pointer"
                  >
                    <Icon size={22} />
                  </span>
                ))}
              </div>

              {/* Logo */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex justify-center sm:border-l lg:border-y-0 lg:border border-[#9A563A]  py-[36px]">
                <img src={white_logo} alt="Layana" className="h-[80px]" />
              </div>

              {/* Newsletter */}
              <div className="col-span-12 sm:col-span-12 lg:col-span-4 py-[36px]">
                <p className="text-xl tracking-widest uppercase mb-[19px] font-quattro  ">
                  Our Newsletter
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="flex-1 bg-transparent border-b border-[#FDE6D8]/30 text-[#BEBEBE] pr-4 py-2 text-sm focus:outline-none"
                  />
                  <button className="bg-[#9A563A] px-[23px] py-[14px] text-xs tracking-widest uppercase text-white">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div className=" bg-[#232B31]">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 sm:gap-10 lg:gap-1 py-[39px]">
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl font-quattro after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#9A563A] after:mt-3">
                  ABOUT LAYANA
                </h4>

                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3 items-center text-[#A3A2A2]">
                    <MapPin size={16} className="text-[#9A563A]" />
                    Centerl Park West La, New York
                  </li>
                  <li className="flex gap-3 items-center text-[#A3A2A2]">
                    <Phone size={16} className="text-[#9A563A]" />
                    +0 123 456 7890
                  </li>
                  <li className="flex gap-3 items-center text-[#A3A2A2]">
                    <Mail size={16} className="text-[#9A563A]" />
                    info@example.com
                  </li>
                </ul>

                <div className="mt-6">
                  <p className="text-white text-2xl mb-3 font-quattro">
                    Open Hours
                  </p>
                  <p className="text-base text-[#A3A2A2]">
                    Sunday to Friday{" "}
                    <span className="text-white">08:00 – 20:00</span>
                  </p>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl font-quattro after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#9A563A] after:mt-3">
                  IMPORTANT LINKS
                </h4>
                <ul className="space-y-3 text-sm">
                  {[
                    "Services",
                    "About Us",
                    "Price Plan",
                    "Contact",
                    "Terms & Conditions",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 uppercase text-[#BEBEBE]"
                    >
                      <ChevronRight size={14} className="text-[#9A563A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3 mb-10 sm:mb-0">
                <h4 className="relative text-white tracking-widest mb-6 text-xl font-quattro after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#9A563A] after:mt-3">
                  CATEGORIES
                </h4>
                <ul className="space-y-3 text-sm">
                  {[
                    "Pigmentation Removal",
                    "Deep Tissue Massage",
                    "Fragrance",
                    "Haircare",
                    "Bath & Body",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[#BEBEBE] uppercase"
                    >
                      <ChevronRight size={14} className="text-[#9A563A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <h4 className="relative text-white tracking-widest mb-6 text-xl font-quattro after:content-[''] after:block after:w-12 after:h-[2px] after:bg-[#9A563A] after:mt-3">
                  OUR LOCATIONS
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      title: "Finchley Central",
                      address: "400, Muswell Hill Broadway, London, N10 1DJ",
                    },
                    {
                      title: "Finchley Central",
                      address: "92 – 94, Ballards Lane, London, N3 2DL",
                    },
                    {
                      title: "Belsize Park",
                      address: "18, England’s Lane, London NW3 4TG",
                    },
                  ].map((loc, i) => (
                    <div key={i} className="flex gap-4 border-b border-[#9A563A] pb-[21px] items-center">
                      <div className="w-[68px] h-[68px] rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={blog}
                          alt="Layana"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-quattro">{loc.title}</p>
                        <p className="text-sm text-[#BEBEBE]">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="bg-[#1D2429]">
          <div className="container mx-auto flex justify-center sm:justify-between items-center flex-wrap gap-5 py-6">
        <div className="text-center text-sm ">
        Copyright © 2023{" "}
        <span className="text-[#9A563A]">LAYANA</span>. All Rights Reserved By
        ALEX
      </div>
      <img src={copy_img} alt="" />
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
