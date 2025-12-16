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
      className="flex items-center justify-between rounded-[10px] border border-[#E7E8E8] px-[15px] py-[11px] bg-white"
    >
      <div className="flex items-center gap-5 text-sm text-[#2A2C30]">
        {/* DRAG HANDLE */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </span>

        <span>{text}</span>
      </div>

      <button
        onClick={onDelete}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E7E8E8] hover:bg-gray-50"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export const BenefitsSection = forwardRef<
  { validate: () => boolean },
  {
    value: {
      slogan: string;
      benifites: string[];
    };
    onChange: (v: any) => void;
  }
>(function BenefitsSection({ value, onChange }, ref) {
  const [input, setInput] = useState("");
const [errors, setErrors] = useState<{
    slogan?: string;
    benifites?: string;
  }>({});
 const addBenefit = () => {
  if (!input.trim()) return;

  onChange({
    ...value,
    benifites: [...value.benifites, input.trim()],
  });

  setInput("");
  setErrors((e) => ({ ...e, benifites: undefined }));
};

  const removeBenefit = (index: number) => {
    onChange({
      ...value,
      benifites: value.benifites.filter((_, i) => i !== index),
    });
  };
useImperativeHandle(ref, () => ({
  validate() {
    const newErrors: {
      slogan?: string;
      benifites?: string;
    } = {};

    if (!value.slogan.trim()) {
      newErrors.slogan = "Slogan is required";
    }

    if (!value.benifites.length) {
      newErrors.benifites = "At least one benefit is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
      <h2 className="text-lg font-semibold text-[#121419]">
        Slogan <sup className="text-red-500">*</sup >
      </h2>
       <div className="rounded-[15px] border border-[#E6EEF0] bg-white p-5 space-y-4">
          <div className="rounded-[10px] border border-[#CDDEE0] px-[15px] py-2">
       <input
  value={value.slogan}
  onChange={(e) =>
    onChange({
      ...value,
      slogan: e.target.value,
    })
  }
  
  placeholder="Enter treatment slogan"
  className="flex-1 w-full text-sm outline-none text-[#2A2C30] py-2"
/>

        </div>
 {errors.slogan && (
          <p className="text-sm text-red-500">{errors.slogan}</p>
        )}
       </div>
      <h2 className="text-lg font-semibold text-[#121419]">
        Benefits <sup className="text-red-500">*</sup >
      </h2>

      <div className="rounded-[15px] border border-[#E6EEF0] bg-white p-5 space-y-4">
        {/* Input */}
        <div className="flex items-center gap-4 rounded-[10px] border border-[#CDDEE0] px-[15px] py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBenefit()}
            placeholder="Enter benefits"
            className="flex-1 text-sm outline-none text-[#2A2C30]"
          />

          <button
            onClick={addBenefit}
            className="flex h-[34px] w-[50px] items-center justify-center rounded-full bg-[#035865] text-white"
          >
            <img src="/send.png" alt="send"/>
          </button>
        </div>
          {errors.benifites && (
            <p className="text-sm text-red-500 m-0">
              {errors.benifites}
            </p>
          )}
  {value.benifites.length !== 0 && <div className="border-t border-[#F3F3F3]" />}
        

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
