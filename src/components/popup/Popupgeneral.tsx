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
import { Switch } from "@/components/ui/switch";
import SwitchToggle from "../treatment/Toggle";

/* ================= SCHEMA ================= */

const popupGeneralSchema = z.object({
  status: z.enum(["active", "inactive"]),
  cta_enabled: z.boolean(),
  cta_text: z.string().min(1, "CTA button text is required"),
  cta_link: z.string().url("Enter a valid URL"),
  cta_color: z.string().min(1, "CTA button color is required"),
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
          
          {/* CTA Text */}
          <div>
            <label className="text-sm font-medium">
              CTA Button Text <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter CTA button text"
              {...register("cta_text")}
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

          

          {/* CTA Link */}
          <div>
            <label className="text-sm font-medium">
              CTA Button Link <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="https://example.com"
              {...register("cta_link")}
            />
          </div>

          {/* CTA Color */}
          <div>
            <label className="text-sm font-medium">
              CTA Button Color <sup className="text-destructive">*</sup>
            </label>
            <input
              type="color"
              className="h-10 w-full rounded-md border px-2"
              {...register("cta_color")}
            />
          </div>

        </div>
      </div>
    );
  }
);

PopupGeneral.displayName = "PopupGeneral";
export default PopupGeneral;
