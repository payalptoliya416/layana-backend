
import { SpaPackage } from "@/websiteComponent/api/spaPackage.api";
import CommonButton from "@/websiteComponent/common/home/CommonButton";

export default function PackageCard({
  item,
  onReadMore,
}: {
  item: SpaPackage;
  onReadMore: () => void;
}) {
function decodeAndStripHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value.replace(/<[^>]*>/g, "");
}

const MAX_CHARS = 100;
const plainText = decodeAndStripHTML(item.description);

  return (
    <div className="bg-[#F5EEE9] h-full flex flex-col">
      {/* IMAGE */}
      <img
        src={item.visuals.image}
        className="w-full h-[235px] object-cover"
        alt={item.name}
      />

      {/* CONTENT WRAPPER */}
      <div className="px-5 py-[35px] text-center flex flex-col flex-grow">
        {/* TITLE */}
        <h3 className="text-xl leading-[20px] mb-[15px] font-light">
          {item.name}
        </h3>

        {/* QUOTE */}
        {/* <p className="italic text-sm mb-[15px] text-[#444]">
          "{item.slogan}"
        </p> */}

        {/* PRICING */}
      <div className="mb-5 text-lg text-[#282828]">
        {item.pricing.map((price, index) => (
          <span
            key={price.id}
            className={price.is_bold ? "font-bold" : "font-normal"}
          >
            {price.duration} min: £{price.price}
            {index !== item.pricing.length - 1 && " | "}
          </span>
        ))}
      </div>

        {/* DESCRIPTION */}
        {/* <p className="mb-[15px] text-base text-[#666666] font-quattro">
          <span
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />
          <span
            onClick={onReadMore}
            className="text-base cursor-pointer text-black ml-1 font-bold"
          >
            Read More
          </span>
        </p> */}

<p className="mb-[15px] text-base text-[#666666] font-quattro">
  <span className="inline">
   <p className="mb-[15px] text-base text-[#666666] font-quattro">
  <span className="inline">
    {plainText.slice(0, MAX_CHARS)}...
    <span
      onClick={onReadMore}
      className="ml-1 cursor-pointer text-black font-bold whitespace-nowrap inline"
    >
      Read More
    </span>
  </span>
</p>
  </span>
</p>

        {/* BUTTON – ALWAYS AT BOTTOM */}
        <div className="mt-auto">
          <CommonButton
            className="mx-auto"
            onClick={() => window.open(item.visuals.btn_link, "_blank")}
          >
            {item.visuals.btn_text}
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
