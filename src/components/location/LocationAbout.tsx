"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, useController } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DescriptionEditor from "../treatment/DescriptionEditor";

/* ================= SCHEMA ================= */

const locationAboutSchema = z.object({
  subTitle: z.string().min(1, "Sub title is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonLink: z.string().url("Enter a valid URL"),
  description: z.string().min(1, "Description is required"),
});

export type LocationAboutForm = z.infer<typeof locationAboutSchema>;

type Props = {
  initialData?: Partial<LocationAboutForm>;
  onChange?: (data: LocationAboutForm) => void;
};

/* ================= COMPONENT ================= */

const LocationAbout = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      control,
    } = useForm<LocationAboutForm>({
      resolver: zodResolver(locationAboutSchema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        subTitle: "",
        buttonText: "",
        buttonLink: "",
        description: "",
        ...initialData,
      },
    });

    /* 🔥 Controller for Description */
    const { field: descriptionField } = useController({
      name: "description",
      control,
    });

    /* ---------- expose methods ---------- */
    useImperativeHandle(ref, () => ({
      /* ---------- VALIDATE ---------- */
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof LocationAboutForm)[] = [
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
                  section: "About",
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
        sub_title: watch("subTitle"),
        about_btn_text: watch("buttonText"),
        about_btn_link: watch("buttonLink"),
        about_description: descriptionField.value,
      }),

      /* ---------- SET DATA ---------- */
      setData: (data: any) => {
        reset({
          subTitle: data.sub_title ?? "",
          buttonText: data.about_btn_text ?? "",
          buttonLink: data.about_btn_link ?? "",
          description: data.about_description ?? "",
        });
      },
    }));

    /* propagate changes */
    useEffect(() => {
      const sub = watch((v) => onChange?.(v as LocationAboutForm));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sub Title */}
          <div>
            <label className="text-sm font-medium">
              Sub Title <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter sub title"
              {...register("subTitle")}
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="text-sm font-medium">
              Button Text <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter button text"
              {...register("buttonText")}
            />
          </div>

          {/* Button Link */}
          <div>
            <label className="text-sm font-medium">
              Button Link <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="https://example.com"
              {...register("buttonLink")}
            />
          </div>

          {/* Description */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium">
              Content <sup className="text-destructive">*</sup>
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

LocationAbout.displayName = "LocationAbout";
export default LocationAbout;
