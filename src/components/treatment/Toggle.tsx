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
          ? "bg-[#035865]" // YES bg
          : "bg-gradient-to-r from-[#C77DFF] to-[#4D9FFF]" // NO border
      )}
    >
      {/* INNER */}
      <div
        className={cn(
          "relative h-full w-full rounded-full flex items-center px-[6px]",
          value ? "bg-transparent" : "bg-white"
        )}
      >
        {/* TEXT */}
        <span
          className={cn(
            "text-xs font-medium select-none transition-colors",
            value
              ? "text-white ml-1"
              : "text-[#2A2C30] mr-1 ml-auto"
          )}
        >
          {value ? "Yes" : "No"}
        </span>

        {/* KNOB */}
        <span
          className={cn(
            "absolute h-[22px] w-[22px] rounded-full bg-white transition-all duration-300 ease-in-out",
            value
              ? "right-[5px]"
              : "left-[5px] shadow-[0_0_0_2.5px_rgba(121,199,255,0.45)]"
          )}
        />
      </div>
    </button>
  );
}

export default SwitchToggle;
