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
            "absolute h-[22px] w-[22px] rounded-full bg-card transition-all duration-300 ease-in-out",
            value
              ? "right-[5px]"
              : "left-[5px] shadow-[0_0_0_2.5px_hsl(var(--ring)/0.45)]"
          )}
        />
      </div>
    </button>
  );
}

export default SwitchToggle;
