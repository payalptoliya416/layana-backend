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

  useEffect(() => {
    if (open) {
      setQuestion(defaultQ || "");
      setAnswer(defaultA || "");
    }
  }, [defaultQ, defaultA, open]);

  if (!open) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm !m-0">
  <div className="relative w-full max-w-[720px] rounded-[18px] bg-card px-[30px] pt-[40px] pb-[30px] border border-border shadow-dropdown">
    
    {/* Close button */}
    <button
      onClick={onClose}
      className="
        absolute right-[10px] top-[10px]
        flex h-8 w-8 items-center justify-center
        rounded-full border border-border
        text-muted-foreground
        hover:bg-muted hover:text-foreground
        transition
      "
    >
      <X size={14} />
    </button>

    {/* Title */}
    <h2 className="mb-6 text-center text-lg font-semibold text-foreground">
      {defaultQ ? "Edit FAQ’s" : "Add FAQ’s"}
    </h2>

    {/* Question */}
    <div className="mb-[15px]">
      <label className="mb-[10px] block text-sm font-medium text-foreground">
        Questions
      </label>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="
          w-full rounded-[10px]
          border border-input
          bg-card
          px-[15px] py-4
          text-sm text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50
          transition
        "
        placeholder="Enter Questions"
      />
    </div>

    {/* Answer */}
    <div className="mb-[25px]">
      <label className="mb-[10px] block text-sm font-medium text-foreground">
        Answer
      </label>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        className="
          w-full rounded-[10px]
          border border-input
          bg-card
          px-[15px] py-4
          text-sm text-foreground
          resize-none
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50
          transition
        "
        placeholder="Enter Answer"
      />
    </div>

    {/* Save */}
    <div className="flex justify-center">
      <button
        onClick={() => onSave(question, answer)}
        className="
          rounded-[30px]
          bg-primary
          px-5 py-2
          text-primary-foreground
          shadow-button
          hover:opacity-90
          transition
        "
      >
        Save
      </button>
    </div>
  </div>
</div>

  );
}
