"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { uploadImages } from "@/services/uploadService";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

interface PackageVisualsProps {
     status: "draft" | "live";
  initialData?: {
    btn_text?: string;
    btn_link?: string;
    image?: string;
  };
  onChange: (data: any) => void;
}

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

/* ================= COMPONENT ================= */

const PackageVisuals = forwardRef<
  { validate: () => Promise<ValidationResult> },
  PackageVisualsProps
>(function PackageVisuals({ initialData, onChange ,status }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isInit = useRef(true);

  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
  /* ---------- INIT (EDIT MODE) ---------- */
useEffect(() => {
  if (!initialData) return;

  isInit.current = true;

  setBtnText(initialData.btn_text || "");
  setBtnLink(initialData.btn_link || "");
  setImage(initialData.image || null);

  queueMicrotask(() => {
    isInit.current = false;
  });
}, [initialData]);

  /* ---------- VALIDATION ---------- */
useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    const errors = [];

    if (status === "draft") {
      return { valid: true, errors: [] };
    }

    if (!btnText.trim()) {
      errors.push({
        section: "Visuals",
        field: "btn_text",
        message: "Button text is required",
      });
    }

    if (!btnLink.trim()) {
      errors.push({
        section: "Visuals",
        field: "btn_link",
        message: "Button link is required",
      });
    } else if (!isValidUrl(btnLink)) {
      errors.push({
        section: "Visuals",
        field: "btn_link",
        message: "Please enter a valid URL (https://...)",
      });
    }

    if (!image) {
      errors.push({
        section: "Visuals",
        field: "image",
        message: "Image is required",
      });
    }

    return { valid: errors.length === 0, errors };
  },
}));

  /* ---------- LIVE UPDATE ---------- */
useEffect(() => {
  if (isInit.current) return;

  onChange({
    btn_text: btnText,
    btn_link: btnLink,
    image,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [btnText, btnLink, image]);

  /* ---------- IMAGE UPLOAD ---------- */
  const handleSelect = async (file: File) => {
    try {
      setUploading(true);
     const uploaded = await uploadImages([file], {
  type: "spa_packages",
});
      if (uploaded?.[0]?.url) {
        setImage(uploaded[0].url);
      }
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* BUTTONS */}
      <div className="rounded-[15px] border border-border bg-card px-5 py-5">
        <h3 className="mb-5 text-lg font-semibold">Button</h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              Button Text <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Book Now"
              value={btnText}
              onChange={(e) => setBtnText(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Button Link <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="https://"
              value={btnLink}
              onChange={(e) => setBtnLink(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* IMAGE */}
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="rounded-[15px] border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">
          Image <sup className="text-destructive">*</sup>
        </h3>

        <div
          className={cn(
            "group relative flex h-[180px] cursor-pointer items-center justify-center rounded-[15px] border-2 border-dashed border-border bg-muted/40 overflow-hidden",
            uploading && "opacity-60 pointer-events-none"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {image ? (
            <>
              <img
                src={image}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-card p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Upload className="mb-2 h-6 w-6" />
              <p className="text-sm">
                Click to upload image
              </p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleSelect(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
       </div>

    </div>
  );
});

PackageVisuals.displayName = "PackageVisuals";
export default PackageVisuals;
