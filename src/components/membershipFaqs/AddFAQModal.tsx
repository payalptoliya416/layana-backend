import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddFAQModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: string, answer: string) => Promise<void>;
  defaultQuestion?: string;
  defaultAnswer?: string;
  isEditing?: boolean;
}

export function AddFAQModal({
  open,
  onClose,
  onSave,
  defaultQuestion = "",
  defaultAnswer = "",
  isEditing = false,
}: AddFAQModalProps) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState(defaultAnswer);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setQuestion(defaultQuestion);
      setAnswer(defaultAnswer);
    }
  }, [open, defaultQuestion, defaultAnswer]);

  const handleSave = async () => {
    if (!question.trim()) return;
    
    try {
      setIsSaving(true);
      await onSave(question.trim(), answer.trim());
      onClose();
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question..."
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer..."
              className="rounded-lg min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !question.trim()}
            className="rounded-lg"
          >
            {isSaving ? "Saving..." : isEditing ? "Update" : "Add FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
