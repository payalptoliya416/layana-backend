"use client";

import { forwardRef, useImperativeHandle } from "react";

type ValidationError = {
  section: string;
  field: string;
  message: string;
};

type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const MemberShipSlogan = forwardRef<
  { validate: () => Promise<ValidationResult> },
  Props
>(function MemberShipSlogan({ value, onChange }, ref) {
  /* ---------- VALIDATION ---------- */
  useImperativeHandle(ref, () => ({
    async validate(): Promise<ValidationResult> {
      const errors: ValidationError[] = [];

      if (!value?.trim()) {
        errors.push({
          section: "Slogan",
          field: "slogan",
          message: "Slogan is required",
        });
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    },
  }));

  /* ================= UI ================= */

  return (
    <div className="space-y-6 mb-4">
      <h2 className="text-lg font-semibold text-foreground">
        Slogan <sup className="text-destructive">*</sup>
      </h2>

      <div className="rounded-[15px] border border-border bg-card p-3 lg:p-5">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter slogan"
          className="
            w-full text-sm
            text-foreground
            placeholder:text-muted-foreground
            bg-transparent
            py-4 px-[15px]
            border border-input
            rounded-[10px]
            focus:outline-none
            focus:ring-2 focus:ring-ring/20
          "
        />
      </div>
    </div>
  );
});

MemberShipSlogan.displayName = "MemberShipSlogan";
