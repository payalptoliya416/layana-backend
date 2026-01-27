

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

const promo1Schema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub title is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonLink: z
    .string()
    .min(1, "Button link is required")
    .url("Enter a valid URL (e.g. https://example.com)"),
  bg_color: z.string().min(1, "Background color is required"),
  description: z.string().min(1, "Description is required"),
});

export type HomePromo1Form = z.infer<typeof promo1Schema>;

/* ================= PROPS ================= */

type Props = {
  onChange?: (data: HomePromo1Form) => void;
};

/* ================= COMPONENT ================= */

const HomePromo1 = forwardRef<any, Props>(
  ({ onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      control,
    } = useForm<HomePromo1Form>({
      resolver: zodResolver(promo1Schema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        title: "",
        subTitle: "",
        buttonText: "",
        buttonLink: "",
        bg_color: "", 
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

        const fields: (keyof HomePromo1Form)[] = [
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
                  section: "Promo1",
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
    sub_title: watch("subTitle"),
    btn_text: watch("buttonText"),
    btn_link: watch("buttonLink"),
    description: descriptionField.value,
    bg_color: watch("bg_color"), // or from input later
    }),

      /* ---------- EDIT MODE ---------- */
     setData: (data: {
  title?: string;
  sub_title?: string;
  btn_text?: string;
  btn_link?: string;
  description?: string;
  bg_color?: string;
}) => {
  reset({
    title: data.title ?? "",
    subTitle: data.sub_title ?? "",
    buttonText: data.btn_text ?? "",
    buttonLink: data.btn_link ?? "",
     bg_color: data.bg_color ?? "",
    description: data.description ?? "",
  });
},
    }));

    /* 🔥 LIVE SYNC */
    useEffect(() => {
      if (!onChange) return;
      const sub = watch((v) => onChange(v as HomePromo1Form));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6">
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
<div>
        <label className="text-sm font-medium">
         Bg Color <sup className="text-destructive">*</sup>
        </label>
        <input
          type="color"
          className="h-10 w-16 rounded-md border px-2 bg-card"
          {...register("bg_color")}
        />
      </div>
      <div></div>
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

HomePromo1.displayName = "HomePromo1";
export default HomePromo1;
