"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { uploadImages } from "@/services/uploadService";
import { ImageCropGallry } from "../treatment/ImageCropGallry";

/* ================= SCHEMA ================= */

const sliderModalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  btn_text: z.string().min(1, "Button text is required"),
  btn_link: z.string().min(1, "Button link is required").url("Enter valid URL"),
  image: z.string().min(1, "Slider image is required"),
});

export type SliderItem = z.infer<typeof sliderModalSchema>;

type Props = {
  initialData?: SliderItem;
  isEdit?: boolean; // 👈 add this
  onSave: (data: SliderItem) => void;
  onClose: () => void;
   uploadType: "home_page" | "location"; 
};

export default function SliderModal({ initialData, onSave, onClose,uploadType }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SliderItem>({
    resolver: zodResolver(sliderModalSchema),
    defaultValues: {
      title: "",
      btn_text: "",
      btn_link: "",
      image: "",
    },
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);

  /* 🔥 IMPORTANT: edit mode fix */
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-2 !mt-0">
    <form
      onSubmit={handleSubmit(onSave)}
      className="relative w-full max-w-[720px] rounded-[18px] bg-card px-[30px] pt-[40px] pb-[30px] border border-border shadow-dropdown space-y-5"
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
        {initialData ? "Edit Slider" : "Add Slider"}
      </h2>

      {/* TITLE INPUT */}
      <div>
        <label className="mb-[6px] block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          placeholder="Enter slider title"
          className="w-full rounded-[10px] border px-[15px] py-4 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
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
          className="w-full rounded-[10px] border px-[15px] py-4 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
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
          className="w-full rounded-[10px] border px-[15px] py-4 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
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
            onClick={() => fileRef.current?.click()}
            className="h-[90px] w-[90px] border border-dashed rounded-xl flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition"
        >
            +
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCropImage(URL.createObjectURL(file));
          }}
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-6 py-2 border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-primary-foreground shadow-button hover:opacity-90 transition"
        >
          Save
        </button>
      </div>

      {/* CROP MODAL */}
      {cropImage && (
        <ImageCropGallry
          open
          image={cropImage}
          aspect={1440 / 800}
          outputWidth={1440}
          outputHeight={800}
          isLast
          onClose={() => setCropImage(null)}
          onNext={async (file: File) => {
            const uploaded = await uploadImages([file], {
              type: uploadType,
            });

            if (uploaded?.[0]?.url) {
              setValue("image", uploaded[0].url, {
                shouldValidate: true,
              });
            }
            setCropImage(null);
          }}
        />
      )}
    </form>
  </div>
);

}
