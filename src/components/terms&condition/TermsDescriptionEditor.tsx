import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const Font = Quill.import("formats/font");
Font.whitelist = [
  "inter",
  "arial",
  "roboto",
  "times-new-roman",
  "georgia",
  "courier-new",
  "monospace",
];
Quill.register(Font, true);

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
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: 1 }, { header: 2 }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className={`flex flex-col ${fullHeight ? "h-full" : ""}`}>
      <div
        className="
          flex-1
          rounded-[10px]
          border border-border
          bg-card
          overflow-hidden
          focus-within:ring-2
          focus-within:ring-ring/20
          focus-within:border-ring
        "
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder="Enter Description"
          className="h-full"
        />
      </div>
    </div>
  );
}
