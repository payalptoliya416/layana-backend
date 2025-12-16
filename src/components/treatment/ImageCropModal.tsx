// import { useState, useRef } from "react";
// import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
// import { Button } from "@/components/ui/button";

// interface Props {
//   image: string;
//   open: boolean;
//   aspect: number;
//   outputWidth: number;
//   outputHeight: number;
//   onClose: () => void;
//   onComplete: (file: File) => void;
// }

// export function ImageCropModal({
//   image,
//   open,
//   aspect,
//   outputWidth,
//   outputHeight,
//   onClose,
//   onComplete,
// }: Props) {
//   const imgRef = useRef<HTMLImageElement | null>(null);

//  const [crop, setCrop] = useState<Crop>({
//   unit: "px",
//   width: 300,
//   height: 150,
//   x: 50,
//   y: 50,
// });

//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

//   if (!open) return null;

//   const createCroppedImage = async () => {
//     if (!completedCrop || !imgRef.current) return;

//     const image = imgRef.current;
//     const canvas = document.createElement("canvas");

//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;

//     canvas.width = outputWidth;
//     canvas.height = outputHeight;

//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(
//       image,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       outputWidth,
//       outputHeight
//     );

//     const blob = await new Promise<Blob>((resolve) =>
//       canvas.toBlob((b) => resolve(b!), "image/jpeg")
//     );

//     onComplete(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-6 w-[640px] max-w-[640px]">
//         <ReactCrop
//           crop={crop}
//           onChange={(c) => setCrop(c)}
//           onComplete={(c) => setCompletedCrop(c)}
//           aspect={aspect}
//           keepSelection
//         >
//           <img
//             ref={imgRef}
//             src={image}
//             className="max-h-[400px]"
//           />
//         </ReactCrop>

//         <div className="mt-4 flex justify-between">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={createCroppedImage}>
//             Crop & Save
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";

interface Props {
  image: string;
  open: boolean;
  aspect: number;
  outputWidth: number;
  outputHeight: number;
  onClose: () => void;
  onComplete: (file: File) => void;
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
  const imgRef = useRef<HTMLImageElement | null>(null);

 const [crop, setCrop] = useState<Crop>({
  unit: "px",
  width: 300,
  height: 200,
  x: 50,
  y: 50,
});

const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  if (!open) return null;

 const handleCrop = async () => {
  if (!completedCrop || !imgRef.current) return;

  const image = imgRef.current;
  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    completedCrop.x * scaleX,
    completedCrop.y * scaleY,
    completedCrop.width * scaleX,
    completedCrop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    onComplete(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
    onClose();
  }, "image/jpeg");
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl p-5 w-[700px] max-w-[90vw] max-h-[80vh] flex flex-col">
    <div className="flex-1 flex items-center justify-center overflow-hidden">
  <ReactCrop
  crop={crop}
  onChange={(c) => setCrop(c)}
  onComplete={(c) => setCompletedCrop(c)}
  aspect={aspect}
  keepSelection
>
    <img
      ref={imgRef}
      src={image}
    className="max-h-[320px] max-w-[100%] object-contain"
    />
  </ReactCrop>
</div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>
            Crop & Save
          </Button>
        </div>
      </div>
    </div>
  );
}
