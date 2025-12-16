import { useEffect, useState } from "react";
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
const [selectedSeoBranch, setSelectedSeoBranch] =
  useState<number | null>(null);

  useEffect(() => {
    if (value) setForm(value);
  }, [value]);

const update = <K extends keyof typeof form>(
  key: K,
  val: typeof form[K]
) => {
  const updated = { ...form, [key]: val };
  setForm(updated);
  onChange(updated);
};


  return (
    <div className="rounded-2xl border bg-white p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Branch SEO
      </h2>

      {/* ANALYTICS */}
      <div>
        <label className="text-sm font-medium">
          Analytics (optional)
        </label>
        <DescriptionEditor
          value={form.analitycs}
          onChange={(v) => update("analitycs", v)}
        />
      </div>

      {/* SEO TITLE */}
      <div>
        <label className="text-sm font-medium">
          SEO Title
        </label>
        <input
          value={form.seo_title}
          onChange={(e) =>
            update("seo_title", e.target.value)
          }
           placeholder="Enter SEO title (e.g. Best Spa in Ahmedabad)"
          className="w-full h-11 rounded-lg border px-4 text-sm"
        />
      </div>

      {/* META DESCRIPTION */}
      <div>
        <label className="text-sm font-medium">
          Meta Description
        </label>
        <textarea
          value={form.meta_description}
          onChange={(e) =>
            update("meta_description", e.target.value)
          }
           placeholder="Write a short description for search engines"
          rows={4}
          className="w-full rounded-lg border px-4 py-3 text-sm resize-none"
        />
      </div>

      {/* SEO KEYWORDS */}
      <div>
        <label className="text-sm font-medium">
          SEO Keywords (comma separated)
        </label>
        {/* <input
          value={form.seo_keyword}
          onChange={(e) =>
            update("seo_keyword", e.target.value)
          }
           placeholder="spa, massage, wellness, therapy"
          className="w-full h-11 rounded-lg border px-4 text-sm"
        /> */}
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
