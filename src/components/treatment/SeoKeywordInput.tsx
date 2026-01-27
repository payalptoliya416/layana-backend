import { useState, KeyboardEvent } from "react";

interface SeoKeywordInputProps {
  value: any;
  onChange: (keywords: string[]) => void;
}

export function SeoKeywordInput({ value, onChange }: SeoKeywordInputProps) {
  const [input, setInput] = useState("");

  // ✅ ALWAYS normalize to string[]
  const keywords: string[] = Array.isArray(value)
    ? value.map((v) => (typeof v === "string" ? v : v?.name)).filter(Boolean)
    : [];

const addKeyword = () => {
  const keyword = input.trim();

  // ✅ Only letters & spaces allowed
  if (!/^[a-zA-Z\s]+$/.test(keyword)) return;

  if (!keyword) return;

  if (!keywords.includes(keyword)) {
    onChange([...keywords, keyword]);
  }

  setInput("");
};

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addKeyword();
    }

    if (e.key === "Backspace" && !input && keywords.length) {
      onChange(keywords.slice(0, -1));
    }
  };

  return (
  <div className="rounded-xl border border-border p-3 bg-card focus-within:ring-2 focus-within:ring-ring/20 overflow-x-hidden">
  <div className="flex flex-wrap lg:gap-2 items-center w-full min-w-0">
    {keywords.map((keyword, index) => (
      <span
        key={index}
        className="
          rounded-[7px]
          bg-muted
          px-[10px] py-2
          text-sm leading-[14px]
          text-foreground
        "
      >
        {keyword}
      </span>
    ))}

    <input
      value={input}
      onChange={(e) => {
  const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  setInput(onlyText);
}}
      onKeyDown={handleKeyDown}
      placeholder="Type and press comma or tab"
      className="
         flex-1 min-w-0 w-full
           xl:min-w-[160px]
        border-none outline-none
        bg-transparent
        text-sm text-foreground
        placeholder:text-muted-foreground
        py-1
      "
    />
  </div>
</div>  
  );
}
