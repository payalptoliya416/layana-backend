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

const TeamVisuals = forwardRef<any, Props>(
  ({ initialImages = [], onChange }, ref) => {
    const galleryRef = useRef<HTMLInputElement | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [cropConfig, setCropConfig] = useState<any>(null);
    const [cropQueue, setCropQueue] = useState<string[]>([]);
const [currentCropIndex, setCurrentCropIndex] = useState(0);

    /* expose validate */
    useImperativeHandle(ref, () => ({
      validate(): ValidationResult {
        if (!gallery.length) {
          return {
            valid: false,
            errors: [
              {
                section: "Visuals",
                field: "images",
                message: "At least one image is required",
              },
            ],
          };
        }
        return { valid: true, errors: [] };
      },

    }));
useEffect(() => {
  setGallery(initialImages || []);
}, [initialImages]);

    const handleGallerySelect = (file: File) => {
      setCropImage(URL.createObjectURL(file));
      setCropConfig({
        aspect: 565 / 575,
        width: 565,
        height: 575,
      });
    };

    return (
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium">
          Gallery Images <sup className="text-destructive">*</sup>
        </p>

        <div className="flex gap-3 flex-wrap">
          <div
            onClick={() => galleryRef.current?.click()}
            className="flex h-[90px] w-[90px] cursor-pointer items-center justify-center rounded-xl border"
          >
            <Plus />
           <input
                    ref={galleryRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (!files?.length) return;

                        const previews = Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                        );

                        setCropQueue(previews);
                        setCurrentCropIndex(0);
                        setCropImage(previews[0]);

                        setCropConfig({
                        aspect: 565 / 575,
                        width: 565,
                        height: 575,
                        });

                        e.target.value = "";
                    }}
                    />

          </div>

          {gallery.map((img, i) => (
            <div key={i} className="relative h-[90px] w-[90px]">
              <img src={img} className="h-full w-full object-cover rounded-xl" />
              <button
                 onClick={() =>
                setGallery((prev) => {
                const next = prev.filter((_, idx) => idx !== i);
                onChange?.(next); 
                return next;
                })
            }
                  className="absolute right-2 top-2 z-20 rounded-full bg-card p-1 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

       <ImageCropGallry
  open={!!cropImage}
  image={cropQueue[currentCropIndex]}
  aspect={cropConfig?.aspect}
  outputWidth={cropConfig?.width}
  outputHeight={cropConfig?.height}
  isLast={currentCropIndex === cropQueue.length - 1}
  onClose={() => {
    setCropQueue([]);
    setCurrentCropIndex(0);
    setCropImage(null);
  }}
  onNext={async (file: File) => {
    const uploaded = await uploadImages([file], {
      type: "team",
    });

    if (uploaded?.[0]?.url) {
      setGallery((prev) => {
        const next = [...prev, uploaded[0].url];
        onChange?.(next);
        return next;
      });
    }

    // 🔁 move to next image OR finish
    if (currentCropIndex < cropQueue.length - 1) {
      setCurrentCropIndex((i) => i + 1);
      setCropImage(cropQueue[currentCropIndex + 1]);
    } else {
      setCropQueue([]);
      setCurrentCropIndex(0);
      setCropImage(null);
    }
  }}
/>

      </div>
    );
  }
);

export default TeamVisuals;
