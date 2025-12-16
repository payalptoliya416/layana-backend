import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Subscript,
  Superscript,
  Heading1,
  Heading2,
  Quote,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  Indent,
  Link,
  Image,
  Video,
  Table,
  FileCode,
  RemoveFormatting,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarGroups = [
  [
    { icon: Type, label: "Sans Serif", type: "dropdown" },
    { icon: Type, label: "Normal", type: "dropdown" },
  ],
  [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { icon: Strikethrough, label: "Strikethrough" },
  ],
  [
    { icon: Type, label: "Text Color" },
    { icon: Type, label: "Background Color" },
  ],
  [
    { icon: Superscript, label: "Superscript" },
    { icon: Subscript, label: "Subscript" },
  ],
  [
    { icon: Heading1, label: "Heading 1" },
    { icon: Heading2, label: "Heading 2" },
    { icon: Quote, label: "Blockquote" },
    { icon: Code, label: "Code" },
  ],
  [
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
  ],
  [
    { icon: Indent, label: "Indent" },
  ],
  [
    { icon: Link, label: "Link" },
    { icon: Image, label: "Image" },
    { icon: Video, label: "Video" },
    { icon: Table, label: "Table" },
  ],
  [
    { icon: FileCode, label: "Code Block" },
    { icon: RemoveFormatting, label: "Clear Formatting" },
  ],
];

export function RichTextEditor({ value, onChange, placeholder = "Enter description" }: RichTextEditorProps) {
  return (
    <div className="border border-input rounded-xl overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="editor-toolbar flex-wrap">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center">
            {group.map((tool, toolIndex) => (
              <button
                key={toolIndex}
                type="button"
                className="editor-button"
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </button>
            ))}
            {groupIndex < toolbarGroups.length - 1 && <div className="editor-divider" />}
          </div>
        ))}
      </div>

      {/* Editor Content */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-4 bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
