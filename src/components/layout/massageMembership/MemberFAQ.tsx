  "use client";

  import { ChevronDown, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
  import {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useState,
  } from "react";
  import { cn } from "@/lib/utils";
  import AddFaqModal from "@/components/treatment/AddFaqModal";
  import { createMembershipFaq, updateMembershipFaq } from "@/services/membershipFaqService";
  import { MembershipFaq } from "@/services/getMemberShip";
  import { toast } from "sonner";

  /* ================= TYPES ================= */

  type ValidationResult = {
    valid: boolean;
    errors: { section: string; field: string; message: string }[];
  };

  export interface FAQItem {
    question: string;
    answer: string;
  }

  /* ================= FAQ CARD ================= */

 function FAQCard({
  faq,
  index,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="flex gap-4 items-start">
        <div className="flex-1 space-y-3">
          <div
            className="flex justify-between gap-4 flex-nowrap cursor-pointer"
            onClick={onToggle}
          >
            <div className="flex gap-2 text-sm font-medium">
              <span className="font-semibold shrink-0">
                Q.{index + 1}
              </span>

              <div
                className={cn(
                  "text-sm font-medium",
                  !isOpen && "line-clamp-1"
                )}
              >
                {faq.question}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ChevronDown
                size={18}
                className={cn(
                  "transition-transform",
                  isOpen && "rotate-180"
                )}
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-7 w-7 rounded-full border flex items-center justify-center"
              >
                <Pencil size={14} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-7 w-7 rounded-full border flex items-center justify-center text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {isOpen && faq.answer && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Ans.
              </span>
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
      loading?: boolean;
       onChange: (v: FAQItem[]) => void;
    }
  >(function MemberFAQ({ value,loading,onChange }, ref) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    /* ---------- expose validation ---------- */
    useImperativeHandle(ref, () => ({
      async validate() {
        return { valid: true, errors: [] };
      },
    }));

    /* ---------- reset open state when data changes ---------- */
    useEffect(() => {
      setOpenIndex(null);
    }, [value]);

    /* ================= UI ================= */
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
const handleDelete = (index: number) => {
  const updated = value.filter((_, i) => i !== index);
  onChange(updated);
  toast.success("FAQ deleted");
};

const handleEdit = (index: number) => {
  setEditingIndex(index);
  setIsModalOpen(true);
};

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg font-medium">FAQ’s</h2>
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
        {loading ? (
        <div className="rounded-2xl border p-6 flex justify-center items-center">
          <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : !value || value.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No FAQs added yet
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          {value.map((faq, index) => (
  <FAQCard
    key={`${faq.question}-${index}`}
    faq={faq}
    index={index}
    isOpen={openIndex === index}
    onToggle={() =>
      setOpenIndex(openIndex === index ? null : index)
    }
    onEdit={() => handleEdit(index)}
    onDelete={() => handleDelete(index)}
  />
))}

        </div>
      )}
  <AddFaqModal
          open={isModalOpen}
          onClose={() => {
            setEditingIndex(null);
            setIsModalOpen(false);
          }}
          defaultQ={editingIndex !== null ? value[editingIndex].question : ""}
          defaultA={editingIndex !== null ? value[editingIndex].answer : ""}
        onSave={async (q, a) => {
  try {
    if (editingIndex !== null) {
      const updated = value.map((f, i) =>
        i === editingIndex
          ? { ...f, question: q, answer: a }
          : f
      );

      onChange(updated);
      toast.success("FAQ updated successfully");
    } else {
      onChange([...value, { question: q, answer: a }]);
      toast.success("FAQ added successfully");
    }

    setEditingIndex(null);
    setIsModalOpen(false);
  } catch {
    toast.error("Save failed");
  }
}}
        />
      </div>
    );
  });

  MemberFAQ.displayName = "MemberFAQ";
  export default MemberFAQ;
