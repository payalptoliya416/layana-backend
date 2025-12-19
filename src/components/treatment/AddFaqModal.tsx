import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface AddFaqModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (q: string, a: string) => void;
  defaultQ?: string;
  defaultA?: string;
}

export default function AddFaqModal({
  open,
  onClose,
  onSave,
  defaultQ,
  defaultA,
}: AddFaqModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState<{
    question?: string;
    answer?: string;
  }>({});
  
  useEffect(() => {
    if (open) {
      setQuestion(defaultQ || "");
      setAnswer(defaultA || "");
    }
  }, [defaultQ, defaultA, open]);

  if (!open) return null;
  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // ❌ stop save
    }

    onSave(question.trim(), answer.trim());
  };
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-2">
      <div className="relative w-full max-w-[720px] rounded-[18px] bg-card px-[30px] pt-[40px] pb-[30px] border border-border shadow-dropdown">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X size={14} />
        </button>

        {/* Title */}
        <h2 className="mb-6 text-center text-lg font-semibold">
          {defaultQ ? "Edit FAQ’s" : "Add FAQ’s"}
        </h2>

        {/* Question */}
        <div className="mb-[15px]">
          <label className="mb-[6px] block text-sm font-medium">
            Question <span className="text-red-500">*</span>
          </label>

          <input
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question)
                setErrors((p) => ({ ...p, question: undefined }));
            }}
            className={`
              w-full rounded-[10px] border px-[15px] py-4 text-sm
              focus:outline-none focus:ring-2 focus:ring-ring/20 transition
              ${errors.question ? "border-red-500" : "border-input"}
            `}
            placeholder="Enter Question"
          />

          {errors.question && (
            <p className="mt-1 text-xs text-red-500">
              {errors.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div className="mb-[25px]">
          <label className="mb-[6px] block text-sm font-medium">
            Answer <span className="text-red-500">*</span>
          </label>

          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (errors.answer)
                setErrors((p) => ({ ...p, answer: undefined }));
            }}
            rows={5}
            className={`
              w-full rounded-[10px] border px-[15px] py-4 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-ring/20 transition
              ${errors.answer ? "border-red-500" : "border-input"}
            `}
            placeholder="Enter Answer"
          />

          {errors.answer && (
            <p className="mt-1 text-xs text-red-500">
              {errors.answer}
            </p>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="rounded-[30px] bg-primary px-6 py-2 text-primary-foreground shadow-button hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>

  );
}
