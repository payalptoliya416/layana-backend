"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================= SCHEMA ================= */

const teamSchema = z.object({
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),
});

export type PricesGeneralForm = z.infer<typeof teamSchema>;

type Props = {
  initialData?: Partial<PricesGeneralForm>;
  onChange?: (data: Partial<PricesGeneralForm>) => void;
};

/* ================= CATEGORY MAP ================= */

const CATEGORY_MAP: Record<string, string[]> = {
  "Laser Skin": ["Rejuvenation", "Hair Removal", "Pigmentation"],
  Facial: ["Hydrafacial", "Anti Aging", "Acne"],
  Body: ["Fat Reduction", "Skin Tightening"],
};

/* ================= COMPONENT ================= */

const PricesGeneral = forwardRef<any, Props>(({ initialData, onChange }, ref) => {
  const {
    register,
    watch,
    trigger,
    reset,
    getFieldState,
  } = useForm<PricesGeneralForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      category: "",
      subCategory: "",
      ...initialData,
    },
  });

  const category = watch("category");

  /* ---------- expose validate ---------- */
  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await trigger(undefined, { shouldFocus: false });

      const fields: (keyof PricesGeneralForm)[] = ["category", "subCategory"];

      const errors = fields
        .map((field) => {
          const state = getFieldState(field);
          return state.error
            ? {
                section: "General",
                message: state.error.message || "Invalid value",
              }
            : null;
        })
        .filter(Boolean);

      return {
        valid: isValid && errors.length === 0,
        errors,
      };
    },

    setData: (data: Partial<PricesGeneralForm>) => {
      reset({
        category: data.category ?? "",
        subCategory: data.subCategory ?? "",
      });
    },
  }));

  useEffect(() => {
    const sub = watch((v) => onChange?.(v));
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* CATEGORY */}
      <div>
        <label className="text-sm font-medium">
          Category <sup className="text-destructive">*</sup>
        </label>
        <select {...register("category")} className="form-input">
          <option value="">Select Category</option>
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* SUB CATEGORY */}
      <div>
        <label className="text-sm font-medium">
          Sub Category <sup className="text-destructive">*</sup>
        </label>
        <select
          {...register("subCategory")}
          className="form-input"
          disabled={!category}
        >
          <option value="">Select Sub Category</option>
          {category &&
            CATEGORY_MAP[category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
});

PricesGeneral.displayName = "PricesGeneral";
export default PricesGeneral;