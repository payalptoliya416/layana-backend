import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionEditor({
  value,
  onChange,
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
      <div className="rounded-[10px] border border-[#E5E7EB] overflow-hidden bg-white">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder="Enter analytics / description"
          className="h-[260px]"
        />
      </div>
    </div>
  );
}
