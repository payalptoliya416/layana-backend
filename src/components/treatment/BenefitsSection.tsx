import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GripVertical, Send, Trash2 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
type ValidationError = {
  section: string;
  field: string;
  message: string;
};

type ValidationResult = {
  valid: boolean;
   errors: { section: string; field: string; message: string }[];
};

/* ---------------- Sortable Item ---------------- */
function SortableItem({
  id,
  text,
  onDelete,
}: {
  id: number;
  text: string;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
 
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
  <div
  ref={setNodeRef}
  style={style}
  className="
    flex items-center justify-between
    rounded-[10px]
    border border-border
    px-[15px] py-[11px]
    bg-card
    transition
  "
>
  <div className="flex items-center gap-5 text-sm text-foreground">
    {/* DRAG HANDLE */}
    <span
      {...attributes}
      {...listeners}
      className="
        cursor-grab
        active:cursor-grabbing
        text-muted-foreground
        hover:text-foreground
        transition
      "
    >
      <GripVertical size={18} />
    </span>

    <span>{text}</span>
  </div>

  <button
    onClick={onDelete}
    className="
      flex h-7 w-7 items-center justify-center
      rounded-full
      border border-border
      bg-card
      text-destructive
      hover:bg-muted
      transition
    "
  >
    <Trash2 size={14} />
  </button>
</div>

  );
}

/* ---------------- Main Component ---------------- */
export const BenefitsSection = forwardRef<
  { validate: () => Promise<ValidationResult> },
  {
    value: {
      slogan: string;
      benifites: string[];
    };
    onChange: (v: any) => void;
     category: string;
  }
>(function BenefitsSection({ value, onChange, category  }, ref) {
  const [input, setInput] = useState("");
const isFacial = category === "Facial";
 const addBenefit = () => {
  if (!input.trim()) return;

  onChange({
    ...value,
    benifites: [...value.benifites, input.trim()],
  });

  setInput("");
};

  const removeBenefit = (index: number) => {
    onChange({
      ...value,
      benifites: value.benifites.filter((_, i) => i !== index),
    });
  };

  useImperativeHandle(ref, () => ({
    async validate(): Promise<ValidationResult> {
      const errors: ValidationError[] = [];

      // 🔴 Slogan required
      if (!value?.slogan?.trim()) {
        errors.push({
          section: "Benefits",
          field: "slogan",
          message: "Slogan is required",
        });
      }

      // 🔴 At least one benefit required
     if (!isFacial && (!Array.isArray(value?.benifites) || value.benifites.length === 0)){
        errors.push({
          section: "Benefits",
          field: "benifites",
          message: "At least one benefit is required",
        });
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    },
  }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const items = [...value.benifites];
    const oldIndex = active.id;
    const newIndex = over.id;
    onChange({
      ...value,
      benifites: arrayMove(items, oldIndex, newIndex),
    });
  };

  return (

<div className="space-y-6">
  {/* Slogan */}
  <h2 className="text-lg font-semibold text-foreground">
    Slogan<sup className="text-destructive">*</sup>
  </h2>

  <div className="rounded-[15px] border border-border bg-card p-3 lg:p-5 space-y-4">
    <div className=" ">
      <input
        value={value.slogan}
        onChange={(e) =>
          onChange({
            ...value,
            slogan: e.target.value,
          })
        }
        placeholder="Enter treatment slogan"
        className="
          w-full text-sm outline-none
          text-foreground
          placeholder:text-muted-foreground
          bg-transparent py-4
          focus:outline-none focus:ring-2 focus:ring-ring/20  px-[15px] border border-input rounded-[10px] 
        "
      />
    </div>
  </div>

  {/* Benefits */}
  <h2 className="text-lg font-semibold text-foreground">
    Benefits{!isFacial && (<sup className="text-destructive">*</sup>)}
  </h2>

  <div className="rounded-[15px] border border-border bg-card p-3 lg:p-5 space-y-4">
    {/* Input */}
    <div className="flex items-center gap-4 flex-wrap">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addBenefit()}
        placeholder="Enter benefits"
        className="
          flex-1 text-sm outline-none
          text-foreground
          placeholder:text-muted-foreground
         bg-transparent py-4
          focus:outline-none focus:ring-2 focus:ring-ring/20  px-[15px] border border-input rounded-[10px] 
        "
      />

      <button
        onClick={addBenefit}
        className="
          flex h-[34px] w-[50px] items-center justify-center
          rounded-full
          bg-primary
          text-primary-foreground
          shadow-button
          hover:opacity-90
          transition
        "
      >
        <img src="/send.svg" alt="send" className="h-4 w-4" />
      </button>
    </div>

    {value.benifites.length !== 0 && (
      <div className="border-t border-border" />
    )}

    {/* DRAG & DROP LIST */}
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={value.benifites.map((_, i) => i)}
        strategy={verticalListSortingStrategy}
      >
        {value.benifites.map((text, i) => (
          <SortableItem
            key={i}
            id={i}
            text={text}
            onDelete={() => removeBenefit(i)}
          />
        ))}
      </SortableContext>
    </DndContext>
  </div>
</div>

  );
})
