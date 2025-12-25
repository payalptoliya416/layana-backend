import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    {...props}
    className={cn(
      "group peer relative h-4 w-4 shrink-0 rounded-[4px] border border-muted-foreground/40",
      "bg-background transition-all duration-200 ease-out",
      "hover:border-primary hover:bg-primary/5",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-white",
        "transition-all duration-200 ease-out",
        "data-[state=checked]:scale-100 data-[state=unchecked]:scale-75 data-[state=unchecked]:opacity-0"
      )}
    >
      <Check className="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
