import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefObject } from "react";

interface ImageUploadCardProps {
  value: string | null;
  inputRef: RefObject<HTMLInputElement>;
  onRemove: () => void;
  onSelect: (file: File) => void;
}

export function ImageUploadCard({
  value,
  inputRef,
  onRemove,
  onSelect,
}: ImageUploadCardProps) {
  return (
    <div
      className="
        group relative h-[140px] w-full
        rounded-xl
        border-2 border-dashed border-border
        overflow-hidden
        cursor-pointer
        bg-muted/40
      "
      onClick={() => inputRef.current?.click()}
    >
      {/* IMAGE PREVIEW */}
      {value ? (
        <>
          <img
            src={value}
            className="h-full w-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* REMOVE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute right-2 top-2 z-20 rounded-full bg-white p-1 shadow"
          >
            <X className="h-4 w-4" />
          </button>

          {/* HOVER CHOOSE BUTTON */}
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              opacity-0
              group-hover:opacity-100
              transition-opacity
              z-10
            "
          >
           <Button
  type="button"
  variant="outline"
  className="rounded-full border-[#035865] bg-white text-[#035865]"
  onClick={(e) => {
    e.stopPropagation();
    inputRef.current?.click();
  }}
>
  Choose File
</Button>
          </div>
        </>
      ) : (
        /* EMPTY STATE (Screenshot-1) */
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Upload className="mb-2 h-7 w-7 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop your files here, or{" "}
            <span className="underline">Browse</span>
          </p>
        </div>
      )}

      {/* FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onSelect(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
