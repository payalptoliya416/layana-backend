import { X } from "lucide-react";
import banner_home from "@/assets/banner_home.jpg";
import CommonButton from "@/websiteComponent/common/home/CommonButton";

type Props = {
  onClose: () => void;
};

export default function HomeOfferModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="
        relative 
        bg-white 
        w-full 
        max-w-[800px] 
        max-h-[90vh] 
        overflow-hidden 
        shadow-xl
      ">
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute 
            top-2 
            right-2 
            z-10 
            rounded-full 
            p-1 
            shadow
          "
        >
          <X size={22} />
        </button>

        {/* Image */}
        <div className="w-full max-h-[70vh] overflow-hidden">
          <img
            src={banner_home}
            alt="Offer"
            className="w-full h-full object-contain"
          />
        </div>

        {/* CTA */}
        <div className="flex justify-center py-4 px-4 uppercase">
          <CommonButton>
            BUY NOW
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
