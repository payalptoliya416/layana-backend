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

export type AboutVisualsData = {
  gallery_image: string;
};

type Props = {
  initialData?: string;
  onChange?: (url: string) => void;
};

const AboutVisuals = forwardRef<any, Props>(
  ({ onChange, initialData }, ref) => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [image, setImage] = useState("");
    const [cropImage, setCropImage] = useState<string | null>(null);

    /* ✅ ONLY SET IMAGE ON FIRST LOAD */
    useEffect(() => {
      if (initialData) {
        setImage(initialData);
      }
    }, [initialData]);

    /* ✅ EXPOSE METHODS */
    useImperativeHandle(ref, () => ({
      validate: () => {
        const errors: { section: string; message: string }[] = [];

        if (!image) {
          errors.push({
            section: "Visuals",
            message: "Gallery Image is required",
          });
        }

        return {
          valid: errors.length === 0,
          errors,
        };
      },

      getData: () => ({
        gallery_image: image,
      }),
    }));

    /* ================= UI ================= */

    return (
      <div className="rounded-2xl border border-border p-5 max-w-md">
        <label className="text-sm font-medium mb-3 block">
          Gallery Image (548 × 558)
          <sup className="text-destructive">*</sup>
        </label>

        <div className="flex items-center gap-4">
          {/* Upload Box */}
          <div
            onClick={() => fileRef.current?.click()}
            className="flex h-[110px] w-[110px] cursor-pointer items-center justify-center rounded-xl border border-dashed hover:border-primary transition"
          >
            <Plus className="text-muted-foreground" />
          </div>

          {/* Preview */}
          {image && (
            <div className="relative h-[110px] w-[110px]">
              <img
                src={image}
                className="h-full w-full rounded-xl object-cover"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => {
                  setImage("");
                  onChange?.(""); // ✅ Only when user removes
                }}
                className="absolute -right-2 -top-2 rounded-full border shadow p-1 bg-card"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* FILE INPUT */}
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setCropImage(URL.createObjectURL(file));
            e.target.value = "";
          }}
        />

        {/* CROP MODAL */}
        {cropImage && (
          <ImageCropGallry
            open
            image={cropImage}
            aspect={548 / 558}
            outputWidth={548}
            outputHeight={558}
            isLast
            onClose={() => setCropImage(null)}
            onNext={async (file: File) => {
              const uploaded = await uploadImages([file], {
                type: "spa_packages",
              });

              if (uploaded?.[0]?.url) {
                setImage(uploaded[0].url);

                // ✅ Only when user uploads
                onChange?.(uploaded[0].url);
              }

              setCropImage(null);
            }}
          />
        )}
      </div>
    );
  }
);

AboutVisuals.displayName = "AboutVisuals";
export default AboutVisuals;
