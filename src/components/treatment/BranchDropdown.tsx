import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface BranchDropdownProps {
  value?: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function BranchDropdown({
  value,
  options,
  placeholder = "Select Branches",
  onChange,
}: BranchDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[180px]">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          flex h-10 w-full items-center justify-between
          rounded-full border border-[#E5E7EB]
          bg-white px-4 text-sm text-[#7A7A7A]
        "
      >
        {value || placeholder}
        <ChevronDown size={16} />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute right-0  z-[99999] mt-2 w-full
            rounded-xl bg-white
            border border-[#E5E7EB]
            shadow-[0_8px_24px_rgba(0,0,0,0.12)]
            overflow-hidden
          "
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="
                block w-full px-4 py-2.5
                text-left text-sm text-[#2A2C30]
                hover:bg-gray-100
              "
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
