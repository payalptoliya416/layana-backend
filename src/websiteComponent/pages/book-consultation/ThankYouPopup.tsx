import { IoCloseSharp } from "react-icons/io5";
import thanks from "@/assets/thanks.png";
import chemark from "@/assets/chemark.png";
import bg_pop from "@/assets/bg-pop.png";
import CommonButton from "@/websiteComponent/common/home/CommonButton";

type Props = {
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
};

export default function ThankYouPopup({ open, onClose, onFinish }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex justify-center items-center px-4">
      {/* Popup Box */}
      <div className="bg-white w-full max-w-[694px] flex relative shadow-lg">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-xl bg-[#f0f0f0] w-[24px] h-[26px] flex justify-center items-center"
        >
          <IoCloseSharp size={20} />
        </button>

        {/* Left Image */}
        <div className="w-[40%] hidden sm:block">
          <img
            src={thanks}
            alt="popup"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="w-full sm:max-w-[392px] py-10 px-5 text-center m-[15px] border border-[#B58D6F] bg-cover bg-no-repeat bg-center"   style={{ backgroundImage: `url(${bg_pop})`,}}>
          {/* Icon */}
          <div className="flex justify-center mb-[36px]">
              <img src={chemark} alt="chemark" />
          </div>

          <h2 className="font-quattro text-[#B58D6F] font-bold text-3xl sm:text-[50px] mb-[30px]">
            THANK YOU !
          </h2>

          <p className="font-quattro max-w-[350px] mx-auto text-base mb-[30px] w-full text-[#212529]">
            Thanks for your time! Your request has been received and will be
            processed shortly.
          </p>

          {/* Finish Button */}
          <div className="flex justify-center">
          <CommonButton  onClick={onFinish} >
            FINISH
          </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
}
