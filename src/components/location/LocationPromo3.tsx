"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useForm, useController } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DescriptionEditor from "../treatment/DescriptionEditor";

/* ================= SCHEMA ================= */

const promo3Schema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub title is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonLink: z
    .string()
    .min(1, "Button link is required")
    .url("Enter a valid URL (e.g. https://example.com)"),
  description: z.string().min(1, "Description is required"),
});

export type LocationPromo3Form = z.infer<typeof promo3Schema>;

/* ================= PROPS ================= */

type Props = {
  onChange?: (data: LocationPromo3Form) => void;
};

/* ================= COMPONENT ================= */

const LocationPromo3 = forwardRef<any, Props>(
  ({ onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      control,
    } = useForm<LocationPromo3Form>({
      resolver: zodResolver(promo3Schema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        title: "",
        subTitle: "",
        buttonText: "",
        buttonLink: "",
        description: "",
      },
    });

    /* 🔥 Controller for Description */
    const { field: descriptionField } = useController({
      name: "description",
      control,
    });

    /* ---------- expose ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof LocationPromo3Form)[] = [
          "title",
          "subTitle",
          "buttonText",
          "buttonLink",
          "description",
        ];

        const errors = fields
          .map((field) => {
            const state = getFieldState(field);
            return state.error
              ? {
                  section: "Promo3",
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

      /* ---------- BACKEND PAYLOAD ---------- */
      getData: () => ({
        title: watch("title"),
        subtitle: watch("subTitle"),
        promo_3_btn_text: watch("buttonText"),
        promo_3_btn_link: watch("buttonLink"),
        promo_3_description: descriptionField.value,
      }),

      /* ---------- EDIT MODE ---------- */
      setData: (data: {
        title?: string;
        subtitle?: string;
        promo_3_btn_text?: string;
        promo_3_btn_link?: string;
        promo_3_description?: string;
      }) => {
        reset({
          title: data.title ?? "",
          subTitle: data.subtitle ?? "",
          buttonText: data.promo_3_btn_text ?? "",
          buttonLink: data.promo_3_btn_link ?? "",
          description: data.promo_3_description ?? "",
        });
      },
    }));

    /* 🔥 LIVE SYNC */
    useEffect(() => {
      if (!onChange) return;
      const sub = watch((v) => onChange(v as LocationPromo3Form));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              Title <sup className="text-destructive">*</sup>
            </label>
            <input
              placeholder="Enter promotion title"
              className="form-input"
              {...register("title")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Sub Title <sup className="text-destructive">*</sup>
            </label>
            <input
              placeholder="Enter promotion subtitle"
              className="form-input"
              {...register("subTitle")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Button Text <sup className="text-destructive">*</sup>
            </label>
            <input
              placeholder="e.g. Book Now"
              className="form-input"
              {...register("buttonText")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Button Link <sup className="text-destructive">*</sup>
            </label>
            <input
              placeholder="https://example.com"
              className="form-input"
              {...register("buttonLink")}
            />
          </div>

          <div className="xl:col-span-2">
            <label className="text-sm font-medium">
              Description <sup className="text-destructive">*</sup>
            </label>

            <DescriptionEditor
              value={descriptionField.value || ""}
              onChange={descriptionField.onChange}
            />
          </div>
        </div>
      </div>
    );
  }
);

LocationPromo3.displayName = "LocationPromo3";
export default LocationPromo3;
