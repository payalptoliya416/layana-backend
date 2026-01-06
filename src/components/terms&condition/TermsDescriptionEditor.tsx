import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  fullHeight?: boolean;
}

export default function TermsDescriptionEditor({
  value,
  onChange,
  fullHeight = false,
}: DescriptionEditorProps) {
  return (
    <div className={`flex flex-col ${fullHeight ? "h-full" : ""}`}>
      <div
        className="
          flex-1
          rounded-[10px]
          border border-border
          bg-card
          overflow-hidden
        "
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder="Enter Description"
          className="h-full text-foreground"
        />
      </div>
    </div>
  );
}
