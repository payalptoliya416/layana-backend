import { Instagram, Mail } from "lucide-react";

export default function FixedSocialBar() {
  return (
    <div className="fixed right-0 top-72 -translate-y-1/2 z-40 flex flex-col">
      {/* Instagram */}
      <a
        href="https://www.instagram.com/layana.uk/"
        target="_blank"
        className="w-[55px] h-[55px] bg-pink-600 flex items-center justify-center text-white mb-2"
      >
        <Instagram size={24} />
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/message/QZVCD34TB4OKC1"
        target="_blank"
        className="w-[55px] h-[55px] bg-green-500 flex items-center justify-center text-white mb-2"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-[24px]"
        />
      </a>

      {/* Email */}
      <a
        href="mailto:info@layana.co.uk"
        className="w-[55px] h-[55px] bg-red-500 flex items-center justify-center text-white"
      >
        <Mail size={24} />
      </a>
    </div>
  );
}
