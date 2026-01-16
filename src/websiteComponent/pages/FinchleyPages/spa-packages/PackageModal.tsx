
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import type { PackageItem } from "./SpaPackagesData";

export function PackageModal({
  data,
  onClose,
}: {
  data: PackageItem["popup"];
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}   // 👈 outside click closes
    >
      <div
        className="relative w-full max-w-[574px] bg-white border-[10px] border-[#F3F3F3] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 👈 stop closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-[30px] h-[30px] bg-white/80 flex items-center justify-center text-lg font-bold z-10"
        >
          ✕
        </button>

        <img
          src={data.image}
          className="w-full h-[238px] object-cover"
        />

        <div className="p-4 text-center">
          <h3 className="text-xl mb-3">{data.title}</h3>
          <p className="text-sm mb-3">{data.subtitle}</p>

          <p className="text-[#666666] font-quattro text-sm leading-[24px] mb-4">
            {data.description}
          </p>

          <p className="font-bold mb-5">{data.price}</p>

          <CommonButton className="mx-auto">
            BOOK NOW
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
