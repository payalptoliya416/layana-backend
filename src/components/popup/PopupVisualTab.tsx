"use client";

import { Plus, X } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { uploadImages } from "@/services/uploadService";
import { ImageCropGallry } from "../treatment/ImageCropGallry";

type Props = {
  initialImages?: string[];
  onChange?: (images: string[]) => void;
};

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

const PopupVisualTab = forwardRef<any, Props>(
  ({ initialImages = [], onChange }, ref) => {
    const galleryRef = useRef<HTMLInputElement | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [cropConfig, setCropConfig] = useState<any>(null);

    /* ---------- VALIDATION ---------- */
    useImperativeHandle(ref, () => ({
      validate(): ValidationResult {
        if (!gallery || gallery.length === 0) {
          return {
            valid: false,
            errors: [
              {
                section: "Visual",
                field: "images",
                message: "Banner image is required",
              },
            ],
          };
        }

        return { valid: true, errors: [] };
      },
    }));

    /* ---------- INIT ---------- */
    useEffect(() => {
      if (Array.isArray(initialImages)) {
        setGallery(initialImages.slice(0, 1)); // ✅ only 1
      } else {
        setGallery([]);
      }
    }, [initialImages]);

    /* ================= UI ================= */

    return (
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium">
          Banner Image {" "}
          <span className="text-muted-foreground">(1600 × 800)</span>{" "}
          <sup className="text-destructive">*</sup>
        </p>

        <div className="flex gap-3 flex-wrap">
          {/* ADD / REPLACE IMAGE */}
          <div
            onClick={() => galleryRef.current?.click()}
            className="flex h-[90px] w-[90px] cursor-pointer items-center justify-center rounded-xl border"
          >
            <Plus />

            <input
              ref={galleryRef}
              type="file"
              hidden
              accept="image/*"   // ✅ multiple REMOVED
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const preview = URL.createObjectURL(file);

                setCropImage(preview);
                setCropConfig({
                  aspect: 1600 / 800,
                  width: 1600,
                  height: 800,
                });

                e.target.value = "";
              }}
            />
          </div>

          {/* PREVIEW IMAGE */}
          {gallery.map((img, i) => (
            <div key={i} className="relative h-[90px] w-[90px] bg-card">
              <img
                src={img}
                className="h-full w-full object-cover rounded-xl"
              />

              <button
                onClick={() => {
                  setGallery([]);
                  onChange?.([]);
                }}
                className="absolute right-2 top-2 z-20 rounded-full bg-card p-1 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* CROP MODAL */}
        <ImageCropGallry
          open={!!cropImage}
          image={cropImage!}
          aspect={cropConfig?.aspect}
          outputWidth={cropConfig?.width}
          outputHeight={cropConfig?.height}
           isLast={true} 
          onClose={() => {
            setCropImage(null);
            setCropConfig(null);
          }}
          onNext={async (file: File) => {
            const uploaded = await uploadImages([file], {
              type: "popup",
            });

            if (uploaded?.[0]?.url) {
              const next = [uploaded[0].url]; 
              setGallery(next);
              onChange?.(next);
            }

            setCropImage(null);
            setCropConfig(null);
          }}
        />
      </div>
    );
  }
);

PopupVisualTab.displayName = "PopupVisualTab";
export default PopupVisualTab;
