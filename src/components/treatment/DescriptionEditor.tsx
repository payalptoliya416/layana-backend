import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
    height?: string;
}

export default function DescriptionEditor({
  value,
  onChange,
    height = "260px",
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
 <div className="space-y-3">
 <div
    className="
      rounded-[10px]
      border border-border
      bg-card
      overflow-hidden
      transition
      focus-within:ring-2
      focus-within:ring-ring/20
      focus-within:border-ring
    " 
     style={{ height }}
  >
    <div className="">
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder="Enter Description"
      className="h-[260px] text-foreground"
    />
    </div>
  </div>
</div>
  );
}
