import { useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

/* ============================
   FONT SETUP (Same as Terms)
============================ */

const Font = Quill.import("formats/font") as any;

const fontWhitelist = [
  "inter",
  "roboto",
  "arial",
  "times-new-roman",
  "georgia",
  "courier-new",
  "verdana",
  "open-sans",
  "lato",
  "montserrat",
  "poppins",
  "playfair-display",

  "mulish",
  "quattrocento",
  "muli",
];


Font.whitelist = fontWhitelist;
Quill.register(Font, true);

/* ============================
   Inject Font Styles
============================ */

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');

  .ql-font-inter { font-family: "Inter", sans-serif; }
  .ql-font-roboto { font-family: "Roboto", sans-serif; }
  .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
  .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
  .ql-font-georgia { font-family: Georgia, serif; }
  .ql-font-courier-new { font-family: "Courier New", Courier, monospace; }
  .ql-font-verdana { font-family: Verdana, Geneva, sans-serif; }
  .ql-font-open-sans { font-family: "Open Sans", sans-serif; }
  .ql-font-lato { font-family: "Lato", sans-serif; }
  .ql-font-montserrat { font-family: "Montserrat", sans-serif; }
  .ql-font-poppins { font-family: "Poppins", sans-serif; }
  .ql-font-playfair-display { font-family: "Playfair Display", serif; }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="inter"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="inter"]::before { content: "Inter"; font-family: "Inter", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: "Roboto"; font-family: "Roboto", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before { content: "Arial"; font-family: Arial, sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: "Times New Roman"; font-family: "Times New Roman", serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: "Georgia"; font-family: Georgia, serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before { content: "Courier New"; font-family: "Courier New", monospace; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before { content: "Verdana"; font-family: Verdana, sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="open-sans"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="open-sans"]::before { content: "Open Sans"; font-family: "Open Sans", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="lato"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lato"]::before { content: "Lato"; font-family: "Lato", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before { content: "Montserrat"; font-family: "Montserrat", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="poppins"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="poppins"]::before { content: "Poppins"; font-family: "Poppins", sans-serif; }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="playfair-display"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair-display"]::before { content: "Playfair Display"; font-family: "Playfair Display", serif; }
.ql-font-mulish { font-family: "Mulish", sans-serif; }
.ql-font-quattrocento { font-family: "Quattrocento", serif; }
.ql-font-muli { font-family: "Muli"; }
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Mulish:wght@400;500;600;700&family=Quattrocento:wght@400;700&display=swap");

.ql-font-mulish { font-family: "Mulish", sans-serif; }
.ql-font-quattrocento { font-family: "Quattrocento", serif; }

    .ql-snow .ql-picker.ql-font .ql-picker-options {
    max-height: 180px !important;
    overflow-y: auto !important;
  }
`;

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

  /* ✅ Inject Styles Once */
  useEffect(() => {
    const styleId = "quill-font-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = fontStyles;
      document.head.appendChild(style);
    }
  }, []);

  /* ============================
     Toolbar Modules
  ============================ */

  const modules = {
    toolbar: [
      [{ font: fontWhitelist }], // ✅ Font Dropdown Added
      [{ size: [] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div
      className="
        rounded-[10px]
        border border-border
        bg-card
        overflow-hidden
        focus-within:ring-2
        focus-within:ring-ring/20
        focus-within:border-ring
      "
      style={{ height }}
    >
      {/* ✅ Quill Editor */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Enter Description..."
        className="h-full"
      />

      {/* ✅ Auto Scroll Fix */}
      <style>
        {`
          .ql-container {
            height: calc(${height} - 42px) !important;
            overflow-y: auto !important;
          }

          .ql-editor {
            min-height: 100px;
            padding-bottom: 70px;
          }
        `}
      </style>
    </div>
  );
}
