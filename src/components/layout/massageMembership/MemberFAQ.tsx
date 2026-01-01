"use client";

import { ChevronDown, GripVertical } from "lucide-react";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

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
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="flex gap-4 items-start">

        <div className="flex-1 space-y-3">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-2 text-sm font-medium">
              <span className="font-semibold">Q.{index + 1}</span>
              {faq.question}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronDown
                size={18}
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
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
     loading?: boolean;
    onChange: (v: FAQItem[]) => void;
  }
>(function MemberFAQ({ value,loading }, ref) {
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">FAQ’s</h2>

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
          />
        ))}
      </div>
    )}

    </div>
  );
});

MemberFAQ.displayName = "MemberFAQ";
export default MemberFAQ;
