

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
    title: z.string().min(1, "Title is required"),

    status: z.enum(["active", "inactive"]),

    cross_color: z.string().min(1, "Cross color is required"),

    treatment_ids: z.array(z.number()).optional(),

    cta_enabled: z.boolean(),

    cta_text: z.string().optional(),
    cta_link: z.string().optional(),
    cta_color: z.string().optional(),
    cta_text_color: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cta_enabled) {
      if (!data.cta_text) {
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
          message: "CTA button color is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.cta_text_color) {
        ctx.addIssue({
          path: ["cta_text_color"],
          message: "CTA text color is required",
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
      title: "",
      status: "active",
      cross_color: "",
      treatment_ids: [],
      cta_enabled: false,
      cta_text: "",
      cta_link: "",
      cta_color: "",
      cta_text_color: "",
      ...initialData,
    }
    });

    const isInitializing = useRef(true);
   const ctaEnabled = watch("cta_enabled");
    /* ---------- reset on initialData ---------- */
   useEffect(() => {
  if (!initialData) return;

  reset({
    title: initialData.title ?? "",
    status: initialData.status ?? "active",
    cross_color: initialData.cross_color ?? "",

    cta_enabled: initialData.cta_enabled ?? false,
    cta_text: initialData.cta_text ?? "",
    cta_link: initialData.cta_link ?? "",
    cta_color: initialData.cta_color ?? "",
    cta_text_color: initialData.cta_text_color ?? "",
  });
}, [initialData, reset]);

    /* ---------- expose validate ---------- */
 useImperativeHandle(ref, () => ({
  validate: async () => {
    const isValid = await trigger(undefined, { shouldFocus: false });

    const fields: (keyof PopupGeneralForm)[] = [
      "title",
      "status",
      "cross_color",

      "cta_enabled",
      "cta_text",
      "cta_link",
      "cta_color",
      "cta_text_color",
    ];

    const errors = fields
      .map((field) => {
        const state = getFieldState(field);
        return state.error
          ? {
              section: "General",
              field,
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
        <div>
          <label className="text-sm font-medium">
            Popup Title <sup className="text-destructive">*</sup>
          </label>
          <input
            className="form-input"
            placeholder="Enter popup title"
            {...register("title")}
          />
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

        <div>
        <label className="text-sm font-medium">
          Close Icon Color <sup className="text-destructive">*</sup>
        </label>
        <input
          type="color"
          className="h-10 w-16 rounded-md border px-2 bg-card"
          {...register("cross_color")}
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

         {ctaEnabled && (
          <div>
            <label className="text-sm font-medium">
              CTA Text Color <sup className="text-destructive">*</sup>
            </label>
            <input
              type="color"
                className="h-10 w-16 rounded-md border px-2 bg-card"
              {...register("cta_text_color")}
            />
          </div>
        )}

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
