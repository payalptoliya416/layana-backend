import { ChevronUp } from "lucide-react";

export default function PricingAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 bg-[#F9EEE7] border border-[#d1bebe47]">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 sm:px-5 py-3 sm:py-4  font-semibold tracking-wide text-[16px] leading-[16px] text-[#362a07] lg:text-lg font-muli uppercase"
      >
        <div className="w-full text-center">{title}</div>
        <ChevronUp
         strokeWidth={1}
         size={24}
          className={` transition-transform duration-300 text-[#052c65] ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div className="bg-[#fbf8f3] px-2 sm:px-6 py-2">
          {children}
        </div>
      )}
    </div>
  );
}
