
import SocialStrip from "./SocialStrip";
import white_logo from "@/assets/white_logo.png";

function Footer() {
  return (
    <>
      <SocialStrip />
      <footer className="bg-[#282828] text-white pt-[38px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-16">
            {/* Logo */}
            <div className="lg:col-span-1 mx-auto">
              <img src={white_logo} alt="Layana" />
            </div>
              <div className="grid grid-cols-2 gap-8 lg:col-span-2">

                <div>
              <ul className="space-y-[10px] text-xs font-quattro">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Infrared Sauna</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Cool Peel</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Image Facials</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Nails & Waxing</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Laser Hair Removal</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Skin Rejuvenation</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Red Vein Removal</a></li>
              </ul>
                </div>

            {/* Column 2 */}
            <div>
             <ul className="space-y-[10px] text-xs font-quattro">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Pigmentation Removal</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Deep Tissue Massage</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Thai Traditional Massage</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Aromatherapy Massage</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Thai Foot Reflexology</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Contact Us</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Terms & Conditions</a></li>
            </ul>
            </div>
              </div>

            {/* Subscribe */}
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

          {/* Bottom bar */}
          <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
            Thai Mane © 2015 – {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
