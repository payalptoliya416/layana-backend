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

  // ✅ PREFILL ON EDIT
  useEffect(() => {
    if (open) {
      setQuestion(defaultQ || "");
      setAnswer(defaultA || "");
    }
  }, [defaultQ, defaultA, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-[720px] rounded-[18px] bg-white px-[30px] pt-[40px] pb-[30px]">
        <button
          onClick={onClose}
          className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full border"
        >
          <X size={14} />
        </button>

        <h2 className="mb-6 text-center text-lg font-semibold">
          {defaultQ ? "Edit FAQ’s" : "Add FAQ’s"}
        </h2>

        <div className="mb-[15px]">
          <label className="mb-[10px] block text-sm font-medium">
            Questions
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-[10px] border px-[15px] py-4 text-sm leading-[14px]"
          />
        </div>

        <div className="mb-[25px]">
          <label className="mb-[10px] block text-sm font-medium">
            Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className="w-full rounded-[10px] border px-[15px] py-4 text-sm resize-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onSave(question, answer)}
            className="rounded-[30px] bg-[#035865] px-5 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
