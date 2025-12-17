import { cn } from "@/lib/utils";

function SwitchToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative h-[32px] w-[68px] rounded-full p-[2px] transition-colors",
        value
          ? "bg-primary" // YES bg
          : "bg-gradient-to-r from-[#C77DFF] to-[#4D9FFF]" // NO border
      )}
    >
      {/* INNER */}
      <div
        className={cn(
          "relative h-full w-full rounded-full flex items-center px-[6px]",
          value ? "bg-transparent" : "bg-card"
        )}
      >
        {/* TEXT */}
        <span
          className={cn(
            "text-xs font-medium select-none transition-colors",
            value
              ? "text-card ml-1"
              : "text-foreground mr-1 ml-auto"
          )}
        >
          {value ? "Yes" : "No"}
        </span>

        {/* KNOB */}
      <span
  className={cn(
    "absolute h-[22px] w-[22px] rounded-full p-[1px]",
    "bg-gradient-to-br from-[rgba(121,199,255,1)] to-[rgba(227,156,255,1)]",
    "shadow-[0_6px_10px_0_rgba(0,0,0,0.1)]",
    value ? "right-[5px]" : "left-[5px]"
  )}
>
  <span className="block h-full w-full rounded-full bg-card" />
</span>
      </div>
    </button>
  );
}

export default SwitchToggle;
