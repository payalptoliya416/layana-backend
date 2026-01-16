import { useEffect, useRef, useState } from "react";

export default function PriceTooltip({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<"top" | "bottom">("top");
  const [coords, setCoords] = useState({ left: 0, top: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;

    // Decide top or bottom
    const spaceAbove = trigger.top;
    const spaceBelow = vh - trigger.bottom;
    const newPos = spaceAbove > spaceBelow ? "top" : "bottom";
    setPos(newPos);

    // Calculate top
    const top =
      newPos === "top"
        ? trigger.top - tooltip.height - 12
        : trigger.bottom + 12;

    // Center horizontally
    let left = trigger.left + trigger.width / 2 - tooltip.width / 2;

    // Clamp inside viewport
    if (left < margin) left = margin;
    if (left + tooltip.width > vw - margin)
      left = vw - tooltip.width - margin;

    setCoords({ left, top });
  }, [open]);

  return (
    <div
      ref={triggerRef}
      className="inline-flex items-center gap-1 cursor-pointer select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(v => !v)}
    >
      <span>{label}</span>
      <span className="text-[11px]">ⓘ</span>

      {open && (
        <div
          ref={tipRef}
          style={{ left: coords.left, top: coords.top }}
          className="fixed z-50 w-[260px] bg-white shadow-xl rounded-md p-4 text-left"
        >
          <h4 className="font-medium mb-2">{title}</h4>
          <p className="text-xs leading-5 text-black/70">{text}</p>
        </div>
      )}
    </div>
  );
}
