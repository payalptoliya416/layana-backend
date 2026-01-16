import { ChevronUp } from "lucide-react";
import { useState } from "react";

export default function PricingAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-2 bg-[#F9EEE7]">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-4 font-semibold tracking-wide text-base lg:text-lg font-muli uppercase"
      >
       <div className="w-full text-center">
        {title}
        </div> 
        <ChevronUp
          className={`transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {/* Body */}
      {open && <div className="bg-[#fbf8f3] px-2 sm:px-4 py-2">{children}</div>}
    </div>
  );
}
