"use client";

import { useEffect, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= SCHEMA ================= */

const sliderModalSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    btn_text: z.string().min(1, "Button text is required"),
    btn_link: z.string().min(1, "Button link is required").url("Enter valid URL"),
    image: z.string().min(1, "Slider image is required"),
    uploadType: z.enum(["home_page", "location"]),
    index: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.uploadType === "home_page" && !data.description?.trim()) {
      ctx.addIssue({
        path: ["description"],
        message: "Description is required for Home Slider",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type SliderItem = z.infer<typeof sliderModalSchema>;

type Props = {
  initialData?: Partial<SliderItem>;
  onSave: (data: SliderItem) => void;
  onClose: () => void;
  uploadType: "home_page" | "location";
};

export default function SliderModal({ initialData, onSave, onClose, uploadType }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SliderItem>({
    resolver: zodResolver(sliderModalSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      btn_text: initialData?.btn_text || "",
      btn_link: initialData?.btn_link || "",
      image: initialData?.image || "",
      uploadType: uploadType,
      index: initialData?.index ?? 0,
    },
  });

  const { field: descriptionField } = useController({
    name: "description",
    control,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = (data: SliderItem) => {
    // Ensure uploadType is always set
    const finalData = {
      ...data,
      uploadType: uploadType,
      index: initialData?.index ?? data.index ?? 0,
    };
    onSave(finalData);
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full rounded-[10px] border px-[15px] py-4 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition",
      hasError
        ? "border-red-500 focus:ring-red-500/30"
        : "border-border focus:ring-ring/20"
    );

  // Debug: log errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-2 !mt-0 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-[720px] rounded-[18px] bg-card px-[30px] pt-[40px] pb-[30px] border border-border shadow-lg space-y-5"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X size={14} />
        </button>

        {/* TITLE */}
        <h2 className="mb-2 text-center text-lg font-semibold">
          {initialData?.title ? "Edit Slider" : "Add Slider"}
        </h2>

        {/* TITLE INPUT */}
        <div>
          <label className="mb-[6px] block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            placeholder="Enter slider title"
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* BUTTON TEXT */}
        <div>
          <label className="mb-[6px] block text-sm font-medium">
            Button Text <span className="text-red-500">*</span>
          </label>
          <input
            {...register("btn_text")}
            placeholder="Enter button text"
            className={inputClass(!!errors.btn_text)}
          />
          {errors.btn_text && (
            <p className="mt-1 text-xs text-red-500">
              {errors.btn_text.message}
            </p>
          )}
        </div>

        {/* BUTTON LINK */}
        <div>
          <label className="mb-[6px] block text-sm font-medium">
            Button Link <span className="text-red-500">*</span>
          </label>
          <input
            {...register("btn_link")}
            placeholder="https://example.com"
            className={inputClass(!!errors.btn_link)}
          />
          {errors.btn_link && (
            <p className="mt-1 text-xs text-red-500">
              {errors.btn_link.message}
            </p>
          )}
        </div>

        {/* IMAGE */}
        <div>
          <label className="mb-[6px] block text-sm font-medium">
            Slider Image (1440 × 800) <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3 mt-2 items-center">
            {/* Upload box */}
            <div
              onClick={() => !isUploading && fileRef.current?.click()}
              className={cn(
                "h-[90px] w-[90px] border border-dashed rounded-xl flex items-center justify-center cursor-pointer transition",
                isUploading && "opacity-50 cursor-not-allowed",
                errors.image
                  ? "border-red-500 text-red-500"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {isUploading ? "..." : "+"}
            </div>

            {/* Image Preview */}
            {watch("image") && (
              <div className="relative h-[90px] w-[90px]">
                <img
                  src={watch("image")}
                  className="h-full w-full rounded-xl object-cover border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue("image", "", { shouldValidate: true });
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-xs shadow hover:scale-105 transition"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {errors.image && (
            <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
          )}

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // For now, use object URL as placeholder
              // Replace this with your actual upload logic
              setIsUploading(true);
              try {
                // Simulating upload - replace with your actual uploadImages call
                const objectUrl = URL.createObjectURL(file);
                setValue("image", objectUrl, { shouldValidate: true });
              } catch (error) {
                console.error("Upload failed:", error);
              } finally {
                setIsUploading(false);
                if (fileRef.current) fileRef.current.value = "";
              }
            }}
          />
        </div>

        {/* DESCRIPTION - Only for home_page */}
        {uploadType === "home_page" && (
          <div>
            <label className="mb-[6px] block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={descriptionField.value || ""}
              onChange={(e) => descriptionField.onChange(e.target.value)}
              rows={3}
              placeholder="Enter slider description"
              className={cn(
                "w-full rounded-[10px] border px-[15px] py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition resize-none",
                errors.description
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-border focus:ring-ring/20"
              )}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-6 py-2 border hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={cn(
              "rounded-full bg-primary px-6 py-2 text-primary-foreground shadow hover:opacity-90 transition",
              (isSubmitting || isUploading) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
