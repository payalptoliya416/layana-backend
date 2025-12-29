"use client";

import {
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import AddFaqModal from "@/components/treatment/AddFaqModal";

/* ================= TYPES ================= */

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

export interface FAQItem {
  question: string;
  answer: string;
}

interface UIFaq extends FAQItem {
  id: string;
}

/* ================= SORTABLE ITEM ================= */

function SortableFAQ({
  faq,
   index,
  isOpen,
  onToggle,
  onDelete,
  onEdit,
}: {
  faq: UIFaq; index: number; 
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: faq.id ,transition: {
    duration: 250,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)", 
  }, });

  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-border bg-card px-4 py-4"
    >
      <div className="flex gap-4 items-start">
        {/* DRAG */}
        <span
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
        >
          <GripVertical size={18} />
        </span>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-2 text-sm font-medium">
              <span className="font-semibold">Q.{index + 1}</span>
              {faq.question}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <button
                onClick={onEdit}
                className="h-7 w-7 rounded-full border flex items-center justify-center"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={onDelete}
                className="h-7 w-7 rounded-full border flex items-center justify-center text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {isOpen && faq.answer && (
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

const MemberFAQ = forwardRef<
  { validate: () => Promise<ValidationResult> },
  {
    value: FAQItem[];
    onChange: (v: FAQItem[]) => void;
  }
>(function MemberFAQ({ value, onChange }, ref) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const uiFaqs: UIFaq[] = value.map((f, i) => ({
    ...f,
    id: String(i),
  }));

  /* ---------- REORDER ---------- */

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onChange(arrayMove(value, Number(active.id), Number(over.id)));
  };

  /* ---------- VALIDATION ---------- */
  useImperativeHandle(ref, () => ({
    async validate(): Promise<ValidationResult> {
      const errors: ValidationResult["errors"] = [];

      if (!value || value.length === 0) {
        errors.push({
          section: "FAQ",
          field: "faq",
          message: "Please add at least one FAQ",
        });
      }

      value.forEach((faq, index) => {
        if (!faq.question?.trim()) {
          errors.push({
            section: "FAQ",
            field: `faq_${index}_question`,
            message: `FAQ ${index + 1}: Question is required`,
          });
        }

        if (!faq.answer?.trim()) {
          errors.push({
            section: "FAQ",
            field: `faq_${index}_answer`,
            message: `FAQ ${index + 1}: Answer is required`,
          });
        }
      });

      return {
        valid: errors.length === 0,
        errors,
      };
    },
  }));

  /* ================= UI ================= */

  return (
    <>
      <div className="space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-lg font-medium">
            FAQ’s <sup className="text-destructive">*</sup>
          </h2>

          <button
            onClick={() => {
              setEditingIndex(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground"
          >
            <Plus size={18} /> Add FAQ
          </button>
        </div>

        {/* LIST */}
        {uiFaqs.length > 0 && (
          <div className="rounded-2xl border bg-card p-4 space-y-3">
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
                    index={index}
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

      {/* MODAL */}
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
                i === editingIndex ? { question: q, answer: a } : f
              )
            );
          } else {
            onChange([...value, { question: q, answer: a }]);
          }

          setEditingIndex(null);
          setIsModalOpen(false);
        }}
      />
    </>
  );
});

MemberFAQ.displayName = "MemberFAQ";
export default MemberFAQ;
