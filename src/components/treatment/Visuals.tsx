import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ImageCropModal } from "./ImageCropModal";
import { uploadImages } from "@/services/uploadService";
interface VisualsFormProps {
  initialData?: {
    banner_image?: string;
    thumbnail_image?: string;
    gallery_image?: string[];
    btn_1?: string;
    btn_1_link?: string;
    btn_2?: string;
    btn_2_link?: string;
  };
  onChange: (visuals: any) => void;
}

export const VisualsForm = forwardRef<
  { validate: () => boolean },
  VisualsFormProps
>(function VisualsForm({ onChange, initialData }, ref) {
      const bannerRef = useRef<HTMLInputElement>(null);
      const isInitializingRef = useRef(true);

  const thumbRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
const [cropImage, setCropImage] = useState<string | null>(null);
const [cropConfig, setCropConfig] = useState<any>(null);
const [btn1, setBtn1] = useState("");
const [btn1Link, setBtn1Link] = useState("");
const [btn2, setBtn2] = useState("");
const [btn2Link, setBtn2Link] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

const handleBannerSelect = (file: File) => {
  setCropImage(URL.createObjectURL(file));
  setCropConfig({
    aspect: 1440 / 400,
    width: 1440,
    height: 400,
    type: "banner",
  });
};

const handleThumbnailSelect = (file: File) => {
  setCropImage(URL.createObjectURL(file));
  setCropConfig({
    aspect: 1,
    width: 358,
    height: 358,
    type: "thumbnail",
  });
};

const handleGallerySelect = (file: File) => {
  setCropImage(URL.createObjectURL(file));
  setCropConfig({
    aspect: 565 / 575,
    width: 565,
    height: 575,
    type: "gallery",
  });
};
useEffect(() => {
  if (!initialData) return;

  isInitializingRef.current = true;

  setBanner(initialData.banner_image || null);
  setThumbnail(initialData.thumbnail_image || null);
  setGallery(initialData.gallery_image || []);

  setBtn1(initialData.btn_1 || "");
  setBtn1Link(initialData.btn_1_link || "");
  setBtn2(initialData.btn_2 || "");
  setBtn2Link(initialData.btn_2_link || "");

  // 🔓 allow onChange AFTER initial set
  setTimeout(() => {
    isInitializingRef.current = false;
  }, 0);
}, [initialData]);
 useImperativeHandle(ref, () => ({
    validate() {
      const newErrors: Record<string, string> = {};

      if (!btn1) newErrors.btn1 = "Button 1 text is required";
      if (!btn1Link) newErrors.btn1Link = "Button 1 link is required";
      if (!btn2) newErrors.btn2 = "Button 2 text is required";
      if (!btn2Link) newErrors.btn2Link = "Button 2 link is required";
      if (!banner) newErrors.banner = "Banner image is required";
      if (!thumbnail)
        newErrors.thumbnail = "Thumbnail image is required";
      if (gallery.length === 0)
      newErrors.gallery = "At least one gallery image is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
  }));

useEffect(() => {
  if (isInitializingRef.current) return;

  onChange({
    btn_1: btn1,
    btn_1_link: btn1Link,
    btn_2: btn2,
    btn_2_link: btn2Link,
    banner_image: banner,
    thumbnail_image: thumbnail,
    gallery_image: gallery,
  });
}, [btn1, btn1Link, btn2, btn2Link, banner, thumbnail, gallery, onChange]);

  return (
    <div className="space-y-6">
      {/* Buttons Section */}
        <form className="rounded-[15px] border border-border bg-white px-5 py-5">
    {/* Heading */}
    <h3 className="mb-6 text-lg font-semibold text-foreground">
        Buttons
    </h3>
    {/* Fields */}
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* Button 1 */}
        <div className="space-y-2">
        <label
            htmlFor="button1"
            className="block text-sm font-medium text-foreground"
        >
            Button 1 <sup className="text-red-500">*</sup >
        </label>
        <input
            id="button1"
            type="text"
            placeholder="Enter button 1 caption"
            className="form-input"
            value={btn1} onChange={(e) => setBtn1(e.target.value)}
        />
            {errors.btn1 && (
              <p className="text-sm text-destructive">{errors.btn1}</p>
            )}
        </div>

        {/* Button 1 Link */}
        <div className="space-y-2">
        <label
            htmlFor="button1Link"
            className="block text-sm font-medium text-foreground"
        >
            Button 1 Link <sup className="text-red-500">*</sup >
        </label>
        <input
            value={btn1Link} onChange={(e) => setBtn1Link(e.target.value)}
            id="button1Link"
            type="text"
            placeholder="Enter button 1 link"
            className="form-input"
        />
         {errors.btn1Link && (
              <p className="text-sm text-destructive">{errors.btn1Link}</p>
            )}
        </div>

        {/* Button 2 */}
        <div className="space-y-2">
        <label
            htmlFor="button2"
            className="block text-sm font-medium text-foreground"
        >
            Button 2 <sup className="text-red-500">*</sup >
        </label>
        <input
            id="button2"
            type="text"
            placeholder="Enter button 2 caption"
            className="form-input"
            value={btn2} onChange={(e) => setBtn2(e.target.value)}
        />
          {errors.btn2 && (
              <p className="text-sm text-destructive">{errors.btn2}</p>
            )}
        </div>

        {/* Button 2 Link */}
        <div className="space-y-2">
        <label
            htmlFor="button2Link"
            className="block text-sm font-medium text-foreground"
        >
            Button 2 Link <sup className="text-red-500">*</sup >
        </label>
        <input
            id="button2Link"
            type="text"
            placeholder="Enter button 2 link"
            className="form-input"
            value={btn2Link} onChange={(e) => setBtn2Link(e.target.value)}
        />
          {errors.btn2Link && (
              <p className="text-sm text-destructive">{errors.btn2Link}</p>
            )}
        </div>
    </div>
        </form>

      {/* Images Section */}
    <div className="space-y-6">
      {/* IMAGES SECTION */}
      <div className="rounded-[24px] border border-border p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Images
        </h3>

        {/* Banner + Thumbnail */}
        <div className="grid grid-cols-2 gap-5">
          {/* BANNER */}
        <div>
  <p className="mb-2 text-sm font-medium">
    Banner <sup className="text-red-500">*</sup > <span className="text-muted-foreground">(1440 × 400)</span> 
  </p>

  <div
    className="
      group relative flex h-[140px]
      flex-col items-center justify-center
      rounded-xl border-2 border-dashed border-border
      bg-muted/40 cursor-pointer overflow-hidden
    "
    onClick={() => bannerRef.current?.click()}
  >
    {banner ? (
      <>
        <img
          src={banner}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setBanner(null);
          }}
          className="absolute right-2 top-2 z-20 rounded-full bg-white p-1 shadow"
        >
          <X className="h-4 w-4" />
        </button>
      </>
    ) : (
      <>
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop your files here, or{" "}
          <span className="underline">Browse</span>
        </p>
      </>
    )}

    {/* HOVER CHOOSE FILE */}
    { banner &&  
    <div
      className="
        absolute inset-0
        flex items-center justify-center
        opacity-0 group-hover:opacity-100
        transition-opacity
        z-10
      "
    >
      <Button
        variant="outline"
        className="rounded-full border-[#035865] bg-white text-[#035865]"
        onClick={(e) => {
          e.stopPropagation();
          bannerRef.current?.click();
        }}
      >
        Choose File
      </Button>
    </div>
    }

    <input
      ref={bannerRef}
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleBannerSelect(e.target.files[0]);
        }
      }}
    />
  </div>

  {errors.banner && (
    <p className="text-sm text-destructive">{errors.banner}</p>
  )}
</div>


          {/* THUMBNAIL */}
        <div>
  <p className="mb-2 text-sm font-medium">
    Thumbnail <sup className="text-red-500">*</sup > <span className="text-muted-foreground">(358 × 358)</span>
  </p>

  <div
    className="
      group relative flex h-[140px]
      flex-col items-center justify-center
      rounded-xl border-2 border-dashed border-border
      bg-muted/40 cursor-pointer overflow-hidden
    "
    onClick={() => thumbRef.current?.click()}
  >
    {thumbnail ? (
      <>
        <img
          src={thumbnail}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setThumbnail(null);
          }}
          className="absolute right-2 top-2 z-20 rounded-full bg-white p-1 shadow"
        >
          <X className="h-4 w-4" />
        </button>
      </>
    ) : (
      <>
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop your files here, or{" "}
          <span className="underline">Browse</span>
        </p>
      </>
    )}

    {/* HOVER CHOOSE FILE */}
    {thumbnail && 
    <div
      className="
        absolute inset-0
        flex items-center justify-center
        opacity-0 group-hover:opacity-100
        transition-opacity
        z-10
      "
    >
      <Button
        variant="outline"
        className="rounded-full border-[#035865] bg-white text-[#035865]"
        onClick={(e) => {
          e.stopPropagation();
          thumbRef.current?.click();
        }}
      >
        Choose File
      </Button>
    </div>
    }

    <input
      ref={thumbRef}
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleThumbnailSelect(e.target.files[0]);
        }
      }}
    />
  </div>

  {errors.thumbnail && (
    <p className="text-sm text-destructive">{errors.thumbnail}</p>
  )}
</div>

        </div>

        {/* GALLERY */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">
            Gallery Images <sup className="text-red-500">*</sup >
            <span className="text-muted-foreground">(565 × 575)</span>
          </p>

          <div className="flex gap-3 flex-wrap">
            {/* ADD */}
            <div
              onClick={() => galleryRef.current?.click()}
              className="flex h-[90px] w-[90px] cursor-pointer items-center justify-center rounded-xl border border-border bg-muted/30"
            >
              <Plus className="h-6 w-6 text-muted-foreground" />
              <input
  ref={galleryRef}
  type="file"
  hidden
  multiple
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      handleGallerySelect(e.target.files[0]);
    }
  }}
/>

            </div>

            {/* PREVIEW */}
            {gallery.map((img, i) => (
              <div
                key={i}
                className="relative h-[90px] w-[90px] overflow-hidden rounded-xl border"
              >
                <img src={img} className="h-full w-full object-cover" />
                <button
                  onClick={() =>
                    setGallery((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute right-1 top-1 rounded-full bg-white p-1 shadow"
                >
                  <X className="h-3 w-3" />
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
          onClose={() => {
            setCropImage(null);
            setCropConfig(null);
          }}
          onComplete={async (file: File) => {
            const uploaded = await uploadImages([file]);
            const imageUrl = uploaded[0].url;

            if (cropConfig?.type === "banner") {
              setBanner(imageUrl);
            }

            if (cropConfig?.type === "thumbnail") {
              setThumbnail(imageUrl);
            }

            if (cropConfig?.type === "gallery") {
              setGallery((prev) => [...prev, imageUrl]);
            }

            setCropImage(null);
            setCropConfig(null);
          }}
        />
        </div>
            {errors.gallery && (
            <p className="text-sm text-destructive">{errors.gallery}</p>
          )}
      </div>
    </div>
    </div>
  );
})
