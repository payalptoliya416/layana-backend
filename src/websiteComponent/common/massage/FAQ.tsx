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
      <h2 className="text-center font-mulish font-light text-3xl md:text-[36px] mb-8 md:mb-[50px]">
        {title}
      </h2>

      {/* FAQ List */}
      <div className="divide-y divide-gray-300">
        {items.map((item, index) => {
          const open = index === openIndex;

          return (
            <div key={index} className="py-6">
              {/* Question */}
              <button
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h4 className="font-quattro text-[18px] text-black">
                  {item.question}
                </h4>
               <div>
                {open ? (
                  <Minus className="w-4 sm:w-5 h-4 sm:h-5 text-black cursor-pointer" />
                ) : (
                  <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-black cursor-pointer" />
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
                  <p className="font-muli text-[14px] leading-[24px] text-[#777] max-w-[750px]">
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
