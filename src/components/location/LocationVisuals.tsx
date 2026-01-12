"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Plus, X } from "lucide-react";
import { uploadImages } from "@/services/uploadService";
import { ImageCropGallry } from "../treatment/ImageCropGallry";

/* ================= CONFIG ================= */

const IMAGE_CONFIG = {
  about_image: {
    label: "About Image",
    size: "565 × 520",
    aspect: 565 / 520,
    width: 565,
    height: 520,
    uploadType: "location",
  },

  promo_1_image: {
    label: "Promotion 1 Image",
    size: "1440 × 400",
    aspect: 1440 / 400,
    width: 1440,
    height: 400,
    uploadType: "location",
  },
  promo_2_image: {
    label: "Promotion 2 Offer Image",
    size: "600 × 600",
    aspect: 1,
    width: 600,
    height: 600,
    uploadType: "location",
  },
    promo_3_image: {
    label: "Promotion 3 Image",
    size: "600 × 600",
    aspect: 1,
    width: 600,
    height: 600,
    uploadType: "location",
  },
} as const;

type ImageKey = keyof typeof IMAGE_CONFIG;
type VisualsData = Record<ImageKey, string>;

/* ================= PROPS ================= */

type Props = {
  onChange?: (data: VisualsData) => void;
};

/* ================= COMPONENT ================= */

const LocationVisuals = forwardRef<any, Props>(
  ({ onChange }, ref) => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [images, setImages] = useState<VisualsData>({
      about_image: "",
      promo_3_image: "",
      promo_1_image: "",
      promo_2_image: "",
    });

    const [activeKey, setActiveKey] = useState<ImageKey | null>(null);
    const [cropImage, setCropImage] = useState<string | null>(null);

    /* ---------- expose ---------- */
    useImperativeHandle(ref, () => ({
      validate: () => {
        const errors = Object.entries(images)
          .filter(([_, v]) => !v)
          .map(([k]) => ({
            section: "Visuals",
            message: `${IMAGE_CONFIG[k as ImageKey].label} is required`,
          }));

        return {
          valid: errors.length === 0,
          errors,
        };
      },

      /* BACKEND PAYLOAD */
      getData: () => ({
        about_image: images.about_image,
        promo_1_image: images.promo_1_image,
        promo_2_image: images.promo_2_image,
        promo_3_image: images.promo_3_image,
      }),

      /* EDIT MODE */
      setData: (data: Partial<VisualsData>) => {
        setImages((prev) => ({
          ...prev,
          about_image: data.about_image ?? "",
          promo_1_image: data.promo_1_image ?? "",
          promo_2_image: data.promo_2_image ?? "",
          promo_3_image: data.promo_3_image ?? "",
        }));
      },
    }));

    /* 🔥 LIVE SYNC (same behaviour as General/About) */
    useEffect(() => {
      if (!onChange) return;
      onChange(images);
    }, [images, onChange]);

    /* ================= UI ================= */

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {(Object.keys(IMAGE_CONFIG) as ImageKey[]).map((key) => {
          const cfg = IMAGE_CONFIG[key];

          return (
            <div key={key} className="rounded-2xl border border-border p-5">
              <label className="text-sm font-medium mb-3 block">
                {cfg.label} ({cfg.size})
                <sup className="text-destructive">*</sup>
              </label>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    setActiveKey(key);
                    fileRef.current?.click();
                  }}
                  className="flex h-[90px] sm:h-[110px] w-[90px] sm:w-[110px] cursor-pointer items-center justify-center rounded-xl border border-dashed hover:border-primary transition"
                >
                  <Plus className="text-muted-foreground" />
                </div>

                {images[key] && (
                  <div className="relative h-[90px] sm:h-[110px] w-[90px] sm:w-[110px]">
                    <img
                      src={images[key]}
                      className="h-full w-full rounded-xl object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages((p) => ({ ...p, [key]: "" }))
                      }
                      className="absolute -right-2 -top-2 rounded-full border shadow p-1 bg-card"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* FILE INPUT */}
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file || !activeKey) return;
            setCropImage(URL.createObjectURL(file));
            e.target.value = "";
          }}
        />

        {/* CROP MODAL */}
        {activeKey && cropImage && (
          <ImageCropGallry
            open
            image={cropImage}
            aspect={IMAGE_CONFIG[activeKey].aspect}
            outputWidth={IMAGE_CONFIG[activeKey].width}
            outputHeight={IMAGE_CONFIG[activeKey].height}
            isLast
            onClose={() => {
              setCropImage(null);
              setActiveKey(null);
            }}
            onNext={async (file: File) => {
              const uploaded = await uploadImages([file], {
                type: IMAGE_CONFIG[activeKey].uploadType,
              });

              if (uploaded?.[0]?.url) {
                setImages((p) => ({
                  ...p,
                  [activeKey]: uploaded[0].url,
                }));
              }

              setCropImage(null);
              setActiveKey(null);
            }}
          />
        )}
      </div>
    );
  }
);

LocationVisuals.displayName = "LocationVisuals";
export default LocationVisuals;
