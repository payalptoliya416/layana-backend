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
  promo_1_image: {
    label: "Promotion 1 Image",
    size: "600 × 600",
    aspect: 600 / 600,
    width: 600,
    height: 600,
    uploadType: "location",
  },
  promo_2_image: {
    label: "Promotion 2 Image",
    size: "1170 × 406",
    aspect: 1,
    width: 1170,
    height: 406,
    uploadType: "location",
  },
  promo_3_image: {
    label: "Promotion 3 Image",
    size: "1440 × 400",
    aspect: 1,
    width: 1440,
    height: 400,
    uploadType: "location",
  },
} as const;


type ImageKey = keyof typeof IMAGE_CONFIG;

type VisualsData = {
  promo_1_image: string;
  promo_2_image: string;
  promo_3_image: string;
  partner_image: string[];
};

/* ================= PROPS ================= */

type Props = {
  onChange?: (data: VisualsData) => void;
};

/* ================= COMPONENT ================= */

const HomeVisuals = forwardRef<any, Props>(
  ({ onChange }, ref) => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [images, setImages] = useState({
    promo_1_image: "",
    promo_2_image: "",
    promo_3_image: "",
    partner_image: [] as string[],
    });

    const [activeKey, setActiveKey] = useState<ImageKey | null>(null);
    const [cropImage, setCropImage] = useState<string | null>(null);

    /* ---------- expose ---------- */
useImperativeHandle(ref, () => ({
  validate: () => {
  const errors: { section: string; message: string }[] = [];

  // 🔹 Promo images validation
  (Object.keys(IMAGE_CONFIG) as ImageKey[]).forEach((k) => {
    if (!images[k]) {
      errors.push({
        section: "Visuals",
        message: `${IMAGE_CONFIG[k].label} is required`,
      });
    }
  });

  // 🔹 Partner images validation
  if (!images.partner_image || images.partner_image.length === 0) {
    errors.push({
      section: "Visuals",
      message: "At least one Partner Image is required",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
},

  getData: (): VisualsData => ({
    promo_1_image: images.promo_1_image,
    promo_2_image: images.promo_2_image,
    promo_3_image: images.promo_3_image,
    partner_image: images.partner_image,
  }),

  setData: (data: Partial<VisualsData>) => {
    setImages({
      promo_1_image: data.promo_1_image ?? "",
      promo_2_image: data.promo_2_image ?? "",
      promo_3_image: data.promo_3_image ?? "",
      partner_image: data.partner_image ?? [],
    });
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
{/* ========== PARTNER IMAGES ========== */}
<div className="rounded-2xl border border-border p-5">
  <label className="text-sm font-medium mb-3 block">
    Partner Images
  </label>

  <div className="flex flex-wrap gap-4">
    <div
      onClick={() => {
        setActiveKey(null);
        fileRef.current?.click();
      }}
      className="flex h-[90px] sm:h-[110px] w-[90px] sm:w-[110px] cursor-pointer items-center justify-center rounded-xl border border-dashed hover:border-primary transition"
    >
      <Plus className="text-muted-foreground" />
    </div>

    {images.partner_image.map((img, i) => (
      <div key={i} className="relative h-[90px] sm:h-[110px] w-[90px] sm:w-[110px]">
        <img
          src={img}
          className="h-full w-full rounded-xl object-cover"
        />
        <button
          onClick={() =>
            setImages((p) => ({
              ...p,
              partner_image: p.partner_image.filter(
                (_, idx) => idx !== i
              ),
            }))
          }
          className="absolute -right-2 -top-2 rounded-full border shadow p-1 bg-card"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
</div>

        {/* FILE INPUT */}
     <input
      ref={fileRef}
      type="file"
      multiple
      hidden
      accept="image/*"
      onChange={async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // 👉 PARTNER IMAGES (multiple allowed, no crop)
        if (activeKey === null) {
          const uploaded = await uploadImages(files, {
            type: "home_page",
          });

          const urls = uploaded
            .map((i: any) => i?.url)
            .filter(Boolean);

          if (urls.length > 0) {
            setImages((p) => ({
              ...p,
              partner_image: [...p.partner_image, ...urls],
            }));
          }

          e.target.value = "";
          return;
        }

        // 👉 PROMO IMAGE (only first image, crop required)
        const firstFile = files[0];
        setCropImage(URL.createObjectURL(firstFile));
        e.target.value = "";
      }}
    />

        {/* CROP MODAL */}
        {cropImage && (
          <ImageCropGallry
            open
            image={cropImage}
            aspect={activeKey ? IMAGE_CONFIG[activeKey].aspect : 1}
            outputWidth={activeKey ? IMAGE_CONFIG[activeKey].width : 400}
            outputHeight={activeKey ? IMAGE_CONFIG[activeKey].height : 400}
            isLast
            onClose={() => {
              setCropImage(null);
              setActiveKey(null);
            }}
            onNext={async (file: File) => {
            const uploaded = await uploadImages([file], {
                type: "home_page",
            });

            if (uploaded?.[0]?.url) {
                setImages((p) =>
                activeKey
                    ? { ...p, [activeKey]: uploaded[0].url } // promo image
                    : {
                        ...p,
                        partner_image: [...p.partner_image, uploaded[0].url], // 🔥 multiple
                    }
                );
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

HomeVisuals.displayName = "HomeVisuals";
export default HomeVisuals;
