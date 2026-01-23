import CommonButton from "@/websiteComponent/common/home/CommonButton";
import { SpaPackage } from "@/websiteComponent/api/spaPackage.api";

export function PackageModal({
  data,
  onClose,
}: {
  data: SpaPackage;
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[574px] bg-white border-[10px] border-[#F3F3F3] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-[30px] h-[30px] bg-white/80 flex items-center justify-center text-lg font-bold z-10"
        >
          ✕
        </button>

        {/* IMAGE */}
        <img
          src={data.visuals.image}
          className=""
          alt={data.name}
        />

        <div className="p-4 text-center">
          {/* TITLE */}
          <h3 className="text-xl mb-2 font-light">
            {data.name}
          </h3>

          {/* SLOGAN */}
          <p className="italic text-sm mb-3 text-[#444]">
            "{data.slogan}"
          </p>

          {/* PRICING */}
          <div className="mb-4 space-y-1">
            {data.pricing.map((price) => (
              <p
                key={price.id}
                className={`text-base ${
                  price.is_bold ? "font-bold" : "font-normal"
                }`}
              >
                {price.duration} min – £{price.price}
              </p>
            ))}
          </div>

          {/* DESCRIPTION (HTML) */}
          <div
            className="text-[#666666] font-quattro text-sm leading-[24px] mb-5"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* BUTTON */}
          <CommonButton
            className="mx-auto"
            onClick={() =>
              window.open(data.visuals.btn_link, "_blank")
            }
          >
            {data.visuals.btn_text}
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
