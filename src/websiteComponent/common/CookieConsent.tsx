import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { initGA } from "../pages/cookies/analytics";

type CookiePreferences = {
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent() {
  const [show, setShow] = useState<boolean>(false);
  const [showPrefs, setShowPrefs] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
  });

  // ✅ Check saved consent
  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");

    if (!saved) {
      setShow(true);
    }
  }, []);

  // ✅ Accept All Cookies
  const handleAcceptAll = (): void => {
    const data: StoredConsent = {
      accepted: true,
      analytics: true,
      marketing: true,
    };

    localStorage.setItem("cookie_consent", JSON.stringify(data));
  initGA();
    setShow(false);
    setShowPrefs(false);
  };

  // ✅ Reject All Cookies
  const handleRejectAll = (): void => {
    const data: StoredConsent = {
      accepted: false,
      analytics: false,
      marketing: false,
    };

    localStorage.setItem("cookie_consent", JSON.stringify(data));

    setShow(false);
    setShowPrefs(false);
  };

  // ✅ Save Preferences
  const handleSavePreferences = (): void => {
    const data: StoredConsent = {
      accepted: true,
      ...preferences,
    };

    localStorage.setItem("cookie_consent", JSON.stringify(data));
  if (preferences.analytics) {
    initGA();
  }
    setShow(false);
    setShowPrefs(false);
  };

  const handleClose = (): void => {
    handleRejectAll();
  };

  if (!show) return null;

  return (
    <div
      className="
        fixed z-[9999]
        bottom-0 left-0 w-full
        sm:bottom-3 sm:right-3 sm:left-auto sm:w-[380px]
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

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        We use cookies to improve navigation and enhance your browsing
        experience.
      </p>

      {/* Preferences Panel */}
      {showPrefs && (
        <div className="mt-4 space-y-3 text-sm">
          {/* Analytics */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  analytics: e.target.checked,
                })
              }
            />
            Enable Analytics Cookies
          </label>

          {/* Marketing */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  marketing: e.target.checked,
                })
              }
            />
            Enable Marketing Cookies
          </label>

          <button
            onClick={handleSavePreferences}
            className="w-full mt-3 rounded-md bg-gray-800 py-2 text-white font-bold"
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* Buttons */}
      {!showPrefs && (
        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            className="w-full rounded-md bg-gray-800 py-3 text-white font-bold hover:bg-black transition"
          >
            Accept All
          </button>

          <button
            onClick={handleRejectAll}
            className="w-full rounded-md border border-black bg-gray-100 py-3 text-black font-bold hover:bg-gray-200 transition"
          >
            Reject All
          </button>

          <button
            onClick={() => setShowPrefs(true)}
            className="w-full text-sm underline text-gray-700"
          >
            Manage Preferences
          </button>
        </div>
      )}
    </div>
  );
}
