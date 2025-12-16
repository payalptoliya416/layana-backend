import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionsDropdown({
  onEdit,
  onDelete,
}: ActionsDropdownProps) {
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
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          flex items-center gap-2
          rounded-full border border-[#E5E7EB]
          px-4 py-2 text-sm
        "
      >
        Actions <ChevronDown size={14} />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-40
            rounded-[10px] bg-white
            border border-[#E5E7EB]
            shadow-[0_8px_24px_rgba(0,0,0,0.12)]
            overflow-hidden p-[5px] z-[99999]
          "
        >
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
          >
            Edit Details
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
