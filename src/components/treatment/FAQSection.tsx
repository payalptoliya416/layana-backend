import {
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import AddFaqModal from "./AddFaqModal";

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
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
interface FAQItem {
  question: string;
  answer: string;
}

interface UIFaq extends FAQItem {
  id: string;
}

/* ================= SORTABLE ITEM ================= */
function SortableFAQ({
  faq,
  isOpen,
  onToggle,
  onDelete,
  onEdit,
}: {
  faq: UIFaq;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
   <div
  ref={setNodeRef}
  style={style}
  className="
    rounded-xl
    border border-border
    bg-card
    px-4 py-4
    transition
  "
>
  <div className="flex gap-4 items-start">
    {/* DRAG HANDLE */}
    <span
      {...attributes}
      {...listeners}
      className="
        mt-1
        cursor-grab
        active:cursor-grabbing
        text-muted-foreground
        hover:text-foreground
        transition
      "
    >
      <GripVertical size={18} />
    </span>

    <div className="flex-1 space-y-3">
      <div className="flex items-center justify-between gap-4">
        {/* QUESTION */}
        <div className="flex gap-2 text-sm font-medium text-foreground">
          <span className="font-semibold">Q.</span>
          {faq.question}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <ChevronDown
              size={18}
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </button>

          <button
            onClick={onEdit}
            className="
              w-7 h-7 rounded-full
              border border-border
              bg-card
              flex items-center justify-center
              text-muted-foreground
              hover:text-foreground hover:bg-muted
              transition
            "
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={onDelete}
            className="
              w-7 h-7 rounded-full
              border border-border
              bg-card
              flex items-center justify-center
              text-destructive
              hover:bg-muted
              transition
            "
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ANSWER */}
      {faq.answer && isOpen && (
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Ans.</span>
          {faq.answer}
        </div>
      )}
    </div>
  </div>
</div>

  );
}

/* ================= MAIN COMPONENT ================= */
export const FAQSection = forwardRef<
  { validate: () => boolean },
  {
    value: FAQItem[];
    onChange: (v: FAQItem[]) => void;
  }
>(function FAQSection({ value, onChange }, ref) {
const [errors, setErrors] = useState<{
  faqs?: string;
}>({})
  const [openId, setOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // UI list with ids
  const uiFaqs: UIFaq[] = value.map((f, i) => ({
    ...f,
    id: String(i),
  }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onChange(arrayMove(value, Number(active.id), Number(over.id)));
  };
useImperativeHandle(ref, () => ({
  validate() {
    if (!value || value.length === 0) {
      setErrors({ faqs: "Please add at least one FAQ" });
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!value[i].question?.trim()) {
        setErrors({
          faqs: `FAQ ${i + 1}: Question is required`,
        });
        return false;
      }

      if (!value[i].answer?.trim()) {
        setErrors({
          faqs: `FAQ ${i + 1}: Answer is required`,
        });
        return false;
      }
    }

    setErrors({});
    return true;
  },
}));

  return (
    <>
      <div className="space-y-4">
  {/* HEADER */}
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-medium text-foreground">
      FAQ’s <sup className="text-destructive">*</sup>
    </h2>

    <button
      onClick={() => {
        setEditingIndex(null);
        setIsModalOpen(true);
      }}
      className="
        flex items-center gap-2
        rounded-full
        bg-primary
        px-5 py-3
        text-sm leading-[14px]
        text-primary-foreground
        shadow-button
        hover:opacity-90
        transition
      "
    >
      <Plus size={18} /> Add FAQ’s
    </button>
  </div>

  {/* LIST */}
  {uiFaqs.length !== 0 && (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={uiFaqs.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {uiFaqs.map((faq, index) => (
            <SortableFAQ
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() =>
                setOpenId(openId === faq.id ? null : faq.id)
              }
              onDelete={() =>
                onChange(value.filter((_, i) => i !== index))
              }
              onEdit={() => {
                setEditingIndex(index);
                setIsModalOpen(true);
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )}
      </div>

      <AddFaqModal
        open={isModalOpen}
        onClose={() => {
          setEditingIndex(null);
          setIsModalOpen(false);
        }}
        defaultQ={editingIndex !== null ? value[editingIndex].question : ""}
        defaultA={editingIndex !== null ? value[editingIndex].answer : ""}
        onSave={(q, a) => {
          if (editingIndex !== null) {
            onChange(
              value.map((f, i) =>
                i === editingIndex
                  ? { question: q, answer: a }
                  : f
              )
            );
          } else {
            onChange([...value, { question: q, answer: a }]);
          }

          setEditingIndex(null);
          setIsModalOpen(false);
        }}
      />
      {errors.faqs && (
  <p className="text-sm text-red-500 mt-0">
    {errors.faqs}
  </p>
)}
    </>
  );
})
