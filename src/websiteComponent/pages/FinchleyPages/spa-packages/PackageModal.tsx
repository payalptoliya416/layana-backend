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
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto scrollbar-thin"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[574px] bg-white border-[10px] border-[#F3F3F3] max-h-[90vh] overflow-y-auto p-1 sm:p-3"
        onClick={(e) => e.stopPropagation()}>
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-1 sm:top-3 right-1 sm:right-3 w-[30px] h-[30px] bg-white/80 flex items-center justify-center text-lg font-bold z-10"
        >
          ✕
        </button>

        {/* IMAGE */}
        <img
          src={data.visuals.image}
          className="w-full max-h-[350px] object-cover"
          alt={data.name}
        />

        <div className="py-5 px-[10px] text-center">
          {/* TITLE */}
          <h3 className="text-lg sm:text-xl mb-3 font-light">
            {data.name}
          </h3>

          {/* SLOGAN */}
          {/* <p className="italic text-sm mb-3 text-[#444]">
            "{data.slogan}"
          </p> */}
      {/* DESCRIPTION (HTML) */}
                <div
                  className="text-[#666666] font-quattro text-sm leading-[24px] mb-[10px]"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
          {/* PRICING */}
          <div className="mb-4 text-base text-[#212529]">
              {data.pricing.map((price, index) => (
                <span
                  key={price.id}
                  className={price.is_bold ? "font-bold" : "font-normal"}
                >
                  {price.duration} min: £{price.price}
                  {index !== data.pricing.length - 1 && " | "}
                </span>
              ))}
            </div>

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
