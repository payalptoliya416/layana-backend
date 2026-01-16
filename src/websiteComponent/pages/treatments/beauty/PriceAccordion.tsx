import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PriceGroup } from "./massageBeautyData";

export default function PriceAccordion({
  data,
}: {
  data: PriceGroup[];
}) {
  const [openGroup, setOpenGroup] = useState<number | null>(0);
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <>
      {data.map((group, i) => (
        <div key={i}>
          {/* Main Header (same as Nails UI) */}
          <button
            onClick={() => setOpenGroup(i === openGroup ? null : i)}
            className="w-full flex justify-between items-center py-5 text-left border-b border-[#66666633] cursor-pointer"
          >
            <span className="text-lg">{group.title}</span>
            <ChevronDown
              className={`transition ${
                openGroup === i ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Content */}
          {openGroup === i && (
            <div className="py-4 space-y-4 px-4">

              {/* Waxing-style nested sections */}
              {group.sections?.map((sec, j) => (
                <div key={j}>
                  <button
                    onClick={() =>
                      setOpenSection(j === openSection ? null : j)
                    }
                    className="w-full flex justify-between items-center py-3 text-left border-b border-[#66666633] cursor-pointer"
                  >
                    <span className="text-base">• {sec.title}</span>
                    <ChevronDown
                      className={`transition ${
                        openSection === j ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === j && (
                    <div className="py-4 space-y-4 px-4">
                      {sec.rows.map((r, k) => (
                        <div
                          key={k}
                          className="flex justify-between border-b border-[#66666633] pb-[15px] items-center"
                        >
                          <p className="text-base text-[#666666] font-quattro">
                            {r.label}
                          </p>
                          <b className="text-[#282828] text-sm">
                            £{r.price}
                          </b>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Nails-style rows */}
              {group.rows?.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-[#66666633] pb-[15px]"
                >
                  <p className="text-base leading-[14px] mb-[15px] text-[#666666] font-quattro">
                    {item.name}
                  </p>

                  {item.prices.Single ? (
                    <b className="text-[#282828] text-sm">
                      £{item.prices.Single}
                    </b>
                  ) : (
                    <p className="text-sm text-[#282828]">
                      Express: <b>£{item.prices.Express}</b> &nbsp;|&nbsp;
                      Classic: <b>£{item.prices.Classic}</b> &nbsp;|&nbsp;
                      Deluxe: <b>£{item.prices.Deluxe}</b>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
