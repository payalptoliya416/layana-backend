import React from "react";

type ActionButton = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

type SplitContentSectionProps = {
  tag: string;
  title: string;
  description: string;
  image: string;
  buttons?: ActionButton[]; 
  onButtonClick?: () => void;
  reverse?: boolean; // image left, text right karva
};

const SplitContentSection: React.FC<SplitContentSectionProps> = ({
  tag,
  title,
  description,
  image,
  buttons = [],
  reverse = false,
}) => {
  return (
    <section className="relative w-full pt-16 lg:py-32 overflow-hidden">
      {/* Beige background */}
      <div
        className={`absolute inset-y-0 ${
          reverse ? "right-0" : "left-0"
        } w-full lg:w-[55%] bg-[#f6eee9]`}
      />

      <div className="relative container mx-auto !px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          
          {/* TEXT */}
          <div className="lg:col-span-6 relative z-10 text-center px-6">
            <p className="font-mulish text-[12px] tracking-[0.2em] uppercase mb-3">
              {tag}
            </p>

            <h2 className="font-mulish text-2xl md:text-[28px] sm:text-4xl sm:leading-[55px] mb-[25px]">
              {title}
            </h2>

            <p className="font-quattro text-[#666666] text-base leading-[26px] mb-[35px] max-w-[498px] mx-auto">
              {description}
            </p>

            {/* BUTTONS */}
            {buttons.length > 0 && (
              <div className="flex justify-center gap-5 sm:gap-6 flex-wrap">
                {buttons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.onClick}
                    className="border-black text-black bg-transparent hover:bg-black hover:text-white border px-2 md:w-[174px] h-[42px] md:h-[70px] flex items-center justify-center font-mulish text-[12px] tracking-[0.25em] uppercase transition"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* IMAGE */}
          <div className={`lg:col-span-6 relative z-10 ${reverse ? "lg:order-first" : ""}`}>
            <img src={image} alt={title} className="w-full h-auto object-cover" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default SplitContentSection;
