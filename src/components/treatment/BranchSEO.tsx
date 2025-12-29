import { useEffect, useRef, useState } from "react";
import DescriptionEditor from "./DescriptionEditor";
import { SeoKeywordInput } from "./SeoKeywordInput";

interface BranchSEOProps {
  branchId: number;
  value?: {
    analitycs: string;
    seo_title: string;
    meta_description: string;
    seo_keyword: string[];
  };
  onChange: (v: {
    analitycs: string;
    seo_title: string;
    meta_description: string;
    seo_keyword: string[];
  }) => void;
}

export function BranchSEO({
  branchId,
  value,
  onChange,
}: BranchSEOProps) {
  const [form, setForm] = useState({
    analitycs: "",
    seo_title: "",
    meta_description: "",
    seo_keyword: [],
  });
  
const isInitializedRef = useRef<number | null>(null);

useEffect(() => {
  if (!value) return;

  if (isInitializedRef.current === branchId) return;

  setForm(value);
  isInitializedRef.current = branchId;
}, [value, branchId]);

const update = <K extends keyof typeof form>(
  key: K,
  val: typeof form[K]
) => {
  setForm((prev) => {
    const updated = { ...prev, [key]: val };
    onChange(updated);

    return updated;
  });
};

  return (
   <div className="space-y-4">
  <h2 className="text-lg font-semibold text-foreground">
    Branch SEO
  </h2>

  {/* ANALYTICS */}
  <div>
    <label className="text-sm font-medium text-foreground">
      Analytics (optional)
    </label>
    {/* <DescriptionEditor
      value={form.analitycs}
      onChange={(v) => update("analitycs", v)}
    /> */}
  </div>

  {/* SEO TITLE */}
  <div>
    <label className="text-sm font-medium text-foreground">
      SEO Title
    </label>
    <input
      value={form.seo_title}
      onChange={(e) =>
        update("seo_title", e.target.value)
      }
      placeholder="Enter SEO title (e.g. Best Spa in Ahmedabad)"
      className="
        w-full h-11 rounded-lg min-w-0
        border border-input
        bg-card 
        px-4 text-sm
        text-foreground
        placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50
        transition
      "
    />
  </div>

  {/* META DESCRIPTION */}
  <div>
    <label className="text-sm font-medium text-foreground">
      Meta Description
    </label>
    <textarea
      value={form.meta_description}
      onChange={(e) =>
        update("meta_description", e.target.value)
      }
      placeholder="Write a short description for search engines"
      rows={4}
      className="
        w-full rounded-lg min-w-0
        border border-input
        bg-card 
        px-4 py-3 text-sm
        text-foreground
        resize-none
        placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/50
        transition
      "
    />
  </div>

  {/* SEO KEYWORDS */}
  <div>
    <label className="text-sm font-medium text-foreground">
      SEO Keywords (comma separated)
    </label>

    <SeoKeywordInput
      value={form.seo_keyword}
      onChange={(keywords) =>
        update("seo_keyword", keywords)
      }
    />
  </div>
</div>
  );
}
