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
      rounded-full border border-border
      px-4 py-2 text-sm
      bg-card text-foreground
      hover:bg-muted
      transition
    "
  >
    Actions <ChevronDown size={14} className="text-muted-foreground" />
  </button>

  {/* Menu */}
  {open && (
    <div
      className="
         absolute right-0 top-full mt-2 w-40
        rounded-[10px] bg-card
        border border-border
        shadow-dropdown
        overflow-hidden p-[5px]
        z-[99999]
      "
    >
      <button
        onClick={() => {
          onEdit();
          setOpen(false);
        }}
        className="
          block w-full px-4 py-2.5 text-left text-sm
          text-foreground
          rounded-md
          hover:bg-muted
          transition
        "
      >
        Edit Details
      </button>

      <button
        onClick={() => {
          onDelete();
          setOpen(false);
        }}
        className="
          block w-full px-4 py-2.5 text-left text-sm
          text-destructive
          rounded-md
          hover:bg-muted
          transition
        "
      >
        Delete
      </button>
    </div>
  )}
</div>

  );
}
