"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SwitchToggle from "../treatment/Toggle";

/* ================= SCHEMA ================= */

const popupGeneralSchema = z
  .object({
    status: z.enum(["active", "inactive"]),
    cta_enabled: z.boolean(),

    cta_text: z.string().optional(),
    cta_link: z.string().optional(),
    cta_color: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cta_enabled) {
      if (!data.cta_text || data.cta_text.trim() === "") {
        ctx.addIssue({
          path: ["cta_text"],
          message: "CTA button text is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.cta_link) {
        ctx.addIssue({
          path: ["cta_link"],
          message: "CTA link is required",
          code: z.ZodIssueCode.custom,
        });
      } else {
        try {
          new URL(data.cta_link);
        } catch {
          ctx.addIssue({
            path: ["cta_link"],
            message: "Enter a valid URL",
            code: z.ZodIssueCode.custom,
          });
        }
      }

      if (!data.cta_color) {
        ctx.addIssue({
          path: ["cta_color"],
          message: "CTA color is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type PopupGeneralForm = z.infer<typeof popupGeneralSchema>;

type Props = {
  initialData?: Partial<PopupGeneralForm>;
  onChange?: (data: Partial<PopupGeneralForm>) => void;
};

/* ================= COMPONENT ================= */

const PopupGeneral = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      setValue,
    } = useForm<PopupGeneralForm>({
      resolver: zodResolver(popupGeneralSchema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        status: "active",
        cta_enabled: false,
        cta_text: "",
        cta_link: "",
        cta_color: "",
        ...initialData,
      },
    });

    const isInitializing = useRef(true);
   const ctaEnabled = watch("cta_enabled");
    /* ---------- reset on initialData ---------- */
    useEffect(() => {
      if (!initialData) return;

      reset({
        status: initialData.status ?? "active",
        cta_enabled: initialData.cta_enabled ?? false,
        cta_text: initialData.cta_text ?? "",
        cta_link: initialData.cta_link ?? "",
        cta_color: initialData.cta_color ?? "",
      });
    }, [initialData, reset]);

    /* ---------- expose validate ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof PopupGeneralForm)[] = [
          "status",
          "cta_enabled",
          "cta_text",
          "cta_link",
          "cta_color",
        ];

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

      setData: (data: Partial<PopupGeneralForm>) => {
        reset({
          status: data.status ?? "active",
          cta_enabled: data.cta_enabled ?? false,
          cta_text: data.cta_text ?? "",
          cta_link: data.cta_link ?? "",
          cta_color: data.cta_color ?? "",
        });
      },
    }));

    useEffect(() => {
      isInitializing.current = false;
    }, []);

    useEffect(() => {
      const sub = watch((v) => onChange?.(v));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    useEffect(() => {
    if (!ctaEnabled) {
      setValue("cta_text", "");
      setValue("cta_link", "");
      setValue("cta_color", "");
    }
  }, [ctaEnabled, setValue]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Status */}
          <div>
            <label className="text-sm font-medium">
              Status <sup className="text-destructive">*</sup>
            </label>

            <Select
              value={watch("status")}
              onValueChange={(v) =>
                setValue("status", v as "active" | "inactive", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {/* CTA Enable */}
          <div className="">
            <label className="text-sm font-medium">
              Enable CTA Button <sup className="text-destructive">*</sup>
            </label>
            
            <SwitchToggle
                value={watch("cta_enabled")}
                onChange={() =>
                setValue("cta_enabled", !watch("cta_enabled"), {
                    shouldDirty: true,
                    shouldValidate: true,
                })
                }
            />
          </div>

          {/* CTA Text */}
          {ctaEnabled && (
          <div>
            <label className="text-sm font-medium">
              CTA Button Text <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter CTA button text"
              {...register("cta_text")}
            />
          </div> )}

         

          {/* CTA Link */}
          {ctaEnabled && (
          <div>
            <label className="text-sm font-medium">
              CTA Button Link <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="https://example.com"
              {...register("cta_link")}
            />
          </div> )}

          {/* CTA Color */}
          {ctaEnabled && (
          <div>
            <label className="text-sm font-medium">
              CTA Button Color <sup className="text-destructive">*</sup>
            </label>
            <input
              type="color"
              className="h-10 w-16 rounded-md border px-2 bg-card"
              {...register("cta_color")}
            />
          </div>)}

        </div>
      </div>
    );
  }
);

PopupGeneral.displayName = "PopupGeneral";
export default PopupGeneral;
