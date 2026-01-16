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

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/layanauk",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/layana.uk/",
  },
  {
    icon: Mail,
    href: "mailto:info@layana.co.uk",
  },
  {
    icon: Linkedin, // WhatsApp mate lucide ma icon nathi, niche note joi lo
    href: "https://wa.me/message/QZVCD34TB4OKC1",
  },
];

function Footer() {
  return (
    <>
      {/* <SocialStrip /> */}
      <section
        className="relative w-full min-h-[520px] flex items-center justify-center text-center  bg-[left_center] md:bg-[center] bg-no-repeat bg-cover mt-12 lg:mt-[110px]"
        style={{
          backgroundImage: `url(${footerbanner})`,
        }}
      >
        {/* <div className="absolute inset-0 bg-[#c9ab8d]/30" /> */}
        {/* content */}
        <div className="relative z-10 max-w-3xl px-6">
          {/* arrow */}
          <a
            href="#"
            className="w-[53px] h-[53px] mx-auto rounded-full bg-[#9A563A] flex items-center justify-center mb-[41px]"
          >
            <ArrowRight className="text-white" size={20} />
          </a>

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

      <footer className=" text-[#cfd6da]">
        {/* ================= TOP STRIP ================= */}
        <div className="bg-[#1F262B] border-b border-[#9A563A]">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 lg:gap-6 items-center ">
              {/* Social icons */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex justify-center lg:justify-start gap-3  py-[36px]">
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[55px] h-[55px] rounded-full border border-[#BEBEBE]
      flex items-center justify-center
      hover:bg-[#9A563A] hover:border-[#9A563A]
      transition cursor-pointer"
                  >
                    <Icon size={22} />
                  </a>
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
                  <li>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <MapPin size={16} className="text-[#9A563A]" />
                      Centerl Park West La, New York
                    </a>
                  </li>

                  <li>
                    <a
                      href="tel:+01234567890"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <Phone size={16} className="text-[#9A563A]" />
                      +0 123 456 7890
                    </a>
                  </li>

                  <li>
                    <a
                      href="mailto:info@example.com"
                      className="flex gap-3 items-center text-[#A3A2A2] hover:text-white cursor-pointer"
                    >
                      <Mail size={16} className="text-[#9A563A]" />
                      info@example.com
                    </a>
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
                    { label: "Services", href: "/services" },
                    { label: "About Us", href: "/about-us" },
                    { label: "Price Plan", href: "/prices" },
                    { label: "Contact", href: "/contact-us" },
                    { label: "Terms & Conditions", href: "/terms" },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 uppercase text-[#BEBEBE] hover:text-white cursor-pointer"
                      >
                        <ChevronRight size={14} className="text-[#9A563A]" />
                        {item.label}
                      </a>
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
                    <li key={item}>
                      <a
                        href="#"
                        className="flex items-center gap-2 uppercase text-[#BEBEBE] hover:text-white cursor-pointer"
                      >
                        <ChevronRight size={14} className="text-[#9A563A]" />
                        {item}
                      </a>
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
                    <a
                      key={i}
                      href="#"
                      className="flex gap-4 border-b border-[#9A563A] pb-[21px] items-center"
                    >
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
                    </a>
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
              Copyright © 2023 <span className="text-[#9A563A]">LAYANA</span>.
              All Rights Reserved By ALEX
            </div>
            <img src={copy_img} alt="" />
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
