import React from "react";

type ActionButton = {
  label: string;
  onClick?: () => void;
  link?: string; // ✅ add this
  variant?: "primary" | "secondary";
};

type SplitContentSectionProps = {
  tag: string;
  title: string;
 description: React.ReactNode;
  image: string;
  buttons?: ActionButton[]; 
    bgColor?: string; 
  onButtonClick?: () => void;
  reverse?: boolean; // image left, text right karva
};

const SplitContentSection: React.FC<SplitContentSectionProps> = ({
  tag,
  title,
  description,
  image,
  bgColor,
  buttons = [],
  reverse = false,
}) => {
  return (
    <section className="relative w-full pt-16 lg:py-32 overflow-hidden">
      {/* Beige background */}
      <div
        className={`absolute inset-y-0 ${
          reverse ? "right-0" : "left-0"
        } w-full lg:w-[57%] `}
         style={{ backgroundColor: bgColor || "#f6eee9" }}
      />

      <div className="relative container mx-auto !px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          
          {/* TEXT */}
          <div className="lg:col-span-6 relative z-10 text-center px-6 lg:px-0 lg:pr-[84px]">
            <p className="font-muli text-xs tracking-[0.2em] uppercase mb-3 font-muli">
              {tag}
            </p>

            <h2 className="font-mulish text-2xl md:text-[36px] sm:leading-[55px] mb-[25px]">
              {title}
            </h2>

            <div className="font-quattro text-[#666666] text-sm sm:text-base leading-[26px] mb-[35px] max-w-[480px] mx-auto">
              {description}
            </div>

            {/* BUTTONS */}
            {buttons.length > 0 && (
              <div className="flex justify-center gap-5 sm:gap-6 flex-wrap">
              {buttons.map((btn, i) =>
  btn.link ? (
    <a
      key={i}
      href={btn.link}
      target="_blank"
      rel="noopener noreferrer"
      className="border-black text-black bg-transparent hover:bg-black hover:text-white border px-2 md:w-[186px] h-[42px] md:h-[62px] flex items-center justify-center font-muli text-xs tracking-[0.25em] uppercase transition"
    >
      {btn.label}
    </a>
  ) : (
    <button
      key={i}
      onClick={btn.onClick}
      className="border-black text-black bg-transparent hover:bg-black hover:text-white border px-2 md:w-[186px] h-[42px] md:h-[62px] flex items-center justify-center font-muli text-xs tracking-[0.25em] uppercase transition"
    >
      {btn.label}
    </button>
  )
)}

              </div>
            )}
          </div>

          {/* IMAGE */}
          <div className={`lg:col-span-6 relative z-10 mx-auto ${reverse ? "lg:order-first" : ""}`}>
            <img src={image} alt={title} className="!max-w-none lg:-ml-[54px] " />
          </div>

        </div>
      </div>
    </section>
  );
};

export default SplitContentSection;
