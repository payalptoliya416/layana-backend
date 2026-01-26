import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem("cookie_consent");

    if (!cookieAccepted) {
      setShow(true);
    }
  }, []);

  // Accept all cookies
  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  // Close popup
  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="
        fixed z-[9999]
        bottom-0 left-0 w-full
        sm:bottom-3 sm:right-3 sm:left-auto sm:w-[360px]
        max-w-[100%]
        bg-[#f7efec] p-6 
        rounded-t-2xl sm:rounded-2xl shadow
      "
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 text-black"
      >
        <X size={20} />
      </button>

      {/* Heading */}
      <h2 className="text-lg font-semibold text-black">
        Let's tailor your experience
      </h2>

      {/* Description */}
      <p className="mt-3 text-base leading-relaxed text-gray-500 font-quattro">
        Our website uses cookies to enhance your browsing experience. These
        cookies don't directly identify you but personalise your visit. You can
        manage your preferences, although blocking some cookies may impact the
        site's services.
      </p>

      {/* Buttons */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={handleAccept}
          className="w-full rounded-md bg-gray-800 py-3 text-white font-bold hover:bg-black transition"
        >
          Accept all
        </button>

        <button
          className="w-full rounded-md border border-black bg-gray-100 py-3 text-black font-bold hover:bg-gray-200 transition"
        >
          Manage preferences
        </button>
      </div>
    </div>
  );
}
