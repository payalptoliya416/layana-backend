import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title?: string;
  items: FaqItem[];
};

export default function Faq({
  title = "Frequently Asked Questions",
  items,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <>
      {/* Title */}
      <h2 className="text-center font-muli font-light text-[26px] sm:text-3xl md:text-[36px] mb-5">
        {title}
      </h2>

      {/* FAQ List */}
      <div className="divide-y divide-gray-300 font-muli">
        {items.map((item, index) => {
          const open = index === openIndex;

          return (
            <div key={index} className="py-5">
              {/* Question */}
              <button
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h4 className="font-bold text-base sm:text-lg text-[#282828]">
                  {item.question}
                </h4>
               <div>
                {open ? (
                  <Minus className="w-4 sm:w-7 h-4 sm:h-8 text-black cursor-pointer" />
                ) : (
                  <Plus className="w-4 sm:w-7 h-4 sm:h-8 text-black cursor-pointer" />
                )}
               </div>
              </button>

              {/* Answer */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  open ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="font-muli text-sm sm:text-lg leading-[24px] text-[#666666] max-w-[750px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
