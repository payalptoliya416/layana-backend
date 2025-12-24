import Cropper from "react-easy-crop";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  image: string;
  open: boolean;
  aspect: number;
  outputWidth: number;
  outputHeight: number;
  onClose: () => void;
  onComplete: (file: File) => void; // 🔥 FILE
}

export function ImageCropModal({
  image,
  open,
  aspect,
  outputWidth,
  outputHeight,
  onClose,
  onComplete,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  if (!open) return null;

  const onCropComplete = (_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

  const createCroppedImage = async () => {
    const img = new Image();
    img.src = image;
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg")
    );

    const file = new File([blob], "cropped.jpg", {
      type: "image/jpeg",
    });

    onComplete(file); // ✅ FILE
    onClose();
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm !mt-0">
  <div className="bg-card rounded-xl p-5 w-[90vw] max-w-[600px] border border-border shadow-dropdown">
    
    {/* Crop Area */}
    <div className="relative h-[350px] bg-muted rounded-lg overflow-hidden">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>

    {/* Actions */}
    <div className="mt-4 flex justify-between">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={createCroppedImage}>
        Crop & Save
      </Button>
    </div>
  </div>
</div>
  );
}
