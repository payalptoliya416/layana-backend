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
  import { createMembershipFaq, deleteMembershipFaq, updateMembershipFaq } from "@/services/membershipFaqService";

  /* ================= TYPES ================= */

  type ValidationResult = {
    valid: boolean;
    errors: { section: string; field: string; message: string }[];
  };

  export interface FAQItem {
    id?: number;
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
    <div className="rounded-xl border border-border bg-card">
      <div className="flex gap-4 items-start  px-4 py-4">
        <div className="flex-1 space-y-3">
          <div
             className="flex justify-between gap-4 flex-wrap cursor-pointer  flex-col lg:flex-row"
            onClick={onToggle}
          >
            <div className="flex gap-2 text-sm font-medium">
              <span className="font-semibold shrink-0">
                Q.
              </span>

              <div
                className={cn(
                  "text-sm font-medium",
                )}
              >
                {faq.question}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
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

        </div>
      </div>
          {isOpen && faq.answer && (
            <div className="flex gap-2 text-sm text-muted-foreground  border-t  px-4 py-4">
              {/* <span className="font-semibold text-foreground">
                Ans.
              </span> */}
              {faq.answer}
            </div>
          )}
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
         onReload: () => Promise<void>;
      }
  >(function MemberFAQ({ value,loading,onChange,onReload }, ref) {
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
const [editingId, setEditingId] = useState<number | null>(null);
const editingFaq = editingId
  ? value.find((f) => f.id === editingId)
  : null;

const handleDelete = async (index: number) => {
  try {

    if (!index) return;

    await deleteMembershipFaq(index);

await onReload();
  } catch {
    // toast.error("Failed to delete FAQ");
  }
};

const handleEdit = (id: number) => {
    setEditingId(id);
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
               key={faq.id}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              onEdit={() => handleEdit(faq.id)}
                onDelete={() => handleDelete(faq.id)}
            />
          ))}

        </div>
      )}
  <AddFaqModal
            open={isModalOpen}
  onClose={() => {
    setEditingId(null);
    setIsModalOpen(false);
  }}
          defaultQ={editingFaq?.question || ""}
  defaultA={editingFaq?.answer || ""}
    onSave={async (q, a) => {
  try {
    // 🔁 UPDATE
    if (editingId !== null) {
      await updateMembershipFaq({
        id: editingId,      // ✅ direct id
        question: q,
        answer: a,
      });

      await onReload();
    }
    // ➕ CREATE
    else {
      await createMembershipFaq({
        question: q,
        answer: a,
      });

      await onReload();
    }

    setEditingId(null);
    setIsModalOpen(false);
  } catch {
  }
}}

        />
      </div>
    );
  });

  MemberFAQ.displayName = "MemberFAQ";
  export default MemberFAQ;
