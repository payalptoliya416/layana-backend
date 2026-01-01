import { ChevronDown, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function FAQItem({ faq, isOpen, onToggle, onDelete, onEdit }: FAQItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: faq.id,
      transition: {
        duration: 200,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-border bg-card transition-shadow duration-200",
        isDragging && "shadow-elevated z-10 opacity-90",
        !isDragging && "hover:shadow-card"
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-muted-foreground hover:text-foreground transition-colors touch-none"
        >
          <GripVertical size={18} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div 
            className="flex items-center justify-between gap-4 cursor-pointer"
            onClick={onToggle}
          >
            <div className="flex gap-2 text-sm font-medium min-w-0">
              <span className="text-primary font-semibold shrink-0">Q.</span>
              <span className="truncate">{faq.question}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 w-8 rounded-full border border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Answer - Collapsible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {faq.answer && (
          <div className="flex gap-2 text-sm text-muted-foreground border-t border-border px-4 py-3 ml-9">
            <span className="text-foreground font-semibold shrink-0">Ans.</span>
            <span>{faq.answer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
