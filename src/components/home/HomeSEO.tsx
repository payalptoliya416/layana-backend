"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import DescriptionEditor from "../treatment/DescriptionEditor";
import { SeoKeywordInput } from "../treatment/SeoKeywordInput";

/* ================= TYPES ================= */

export type HomeSEOData = {
  analytics: string;
  seo_title: string;
  meta_description: string;
  seo_keyword: string[];
};

type Props = {
  value?: HomeSEOData;
  onChange?: (v: HomeSEOData) => void;
};

/* ================= COMPONENT ================= */

const HomeSEO = forwardRef<any, Props>(({ value, onChange }, ref) => {
  const [form, setForm] = useState<HomeSEOData>({
    analytics: "",
    seo_title: "",
    meta_description: "",
    seo_keyword: [],
  });

  const isInitializedRef = useRef(false);

  /* ---------- EDIT MODE ---------- */
  useEffect(() => {
    if (!value) return;
    if (isInitializedRef.current) return;

    setForm(value);
    isInitializedRef.current = true;
  }, [value]);

  /* ---------- update helper ---------- */
  const update = <K extends keyof HomeSEOData>(
    key: K,
    val: HomeSEOData[K]
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: val };
      onChange?.(updated);
      return updated;
    });
  };

  /* ---------- expose ---------- */
  useImperativeHandle(ref, () => ({
    validate: () => ({
      valid: true, // SEO optional
      errors: [],
    }),

    getData: (): HomeSEOData => form,

    setData: (data: Partial<HomeSEOData>) => {
      isInitializedRef.current = true;
      setForm({
        analytics: data.analytics ?? "",
        seo_title: data.seo_title ?? "",
        meta_description: data.meta_description ?? "",
        seo_keyword: data.seo_keyword ?? [],
      });
    },
  }));

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Home SEO
      </h2>

      {/* ANALYTICS */}
      <div>
        <label className="text-sm font-medium text-foreground">
          Analytics (optional)
        </label>
        <DescriptionEditor
          value={form.analytics}
          onChange={(v) => update("analytics", v)}
        />
      </div>

      {/* SEO TITLE */}
      <div>
        <label className="text-sm font-medium text-foreground">
          SEO Title
        </label>
        <input
          value={form.seo_title}
          onChange={(e) => update("seo_title", e.target.value)}
          className="form-input"
          placeholder="Enter title"
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
          placeholder="Enter description"
          className="
            w-full rounded-lg
            border border-input
            bg-card px-4 py-3 text-sm
            text-foreground resize-none
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring/20
            focus:border-primary/50
            transition
          "
          rows={4}
        />
      </div>

      {/* SEO KEYWORDS */}
      <div>
        <label className="text-sm font-medium text-foreground">
          SEO Keywords
        </label>
        <SeoKeywordInput
          value={form.seo_keyword}
          onChange={(v) => update("seo_keyword", v)}
        />
      </div>
    </div>
  );
});

HomeSEO.displayName = "HomeSEO";
export default HomeSEO;
