"use client";

import { Plus, X } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImageCropModal } from "../treatment/ImageCropModal";
import { uploadImages } from "@/services/uploadService";

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
    console.log("initialImages",initialImages)
    const isInitializingRef = useRef(true);
    const galleryRef = useRef<HTMLInputElement | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [cropConfig, setCropConfig] = useState<any>(null);

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
          Gallery Images<sup className="text-destructive">*</sup>
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
              accept="image/*"
               onChange={(e) => {
                const files = e.target.files;
                if (!files?.length) return;

                handleGallerySelect(files[0]);

                // ✅ reset input so same image can be selected again
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
                onChange?.(next); // ✅ VERY IMPORTANT
                return next;
                })
            }
                className="absolute top-1 right-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <ImageCropModal
          open={!!cropImage}
          image={cropImage!}
          aspect={cropConfig?.aspect}
          outputWidth={cropConfig?.width}
          outputHeight={cropConfig?.height}
          onClose={() => setCropImage(null)}
         onComplete={async (file: File) => {
        const uploaded = await uploadImages([file], {
            type: "team", // ✅ ONLY HERE
            });

        if (uploaded?.[0]?.url) {
            setGallery((prev) => {
            const next = [...prev, uploaded[0].url];
            onChange?.(next); // ✅ notify parent HERE
            return next;
            });
        }

        setCropImage(null);
        }}
        />
      </div>
    );
  }
);

export default TeamVisuals;
