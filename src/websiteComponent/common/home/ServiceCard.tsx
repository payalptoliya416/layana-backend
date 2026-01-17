import { withBase } from "../Header";
import CommonButton from "./CommonButton";

type Props = {
  title: string;
  image: string;
  link?: string; // ✅ ADD
   id?: number; 
};

export default function ServiceCard({ title, image, link,id }: Props) {
  return (
    <div className="relative group overflow-hidden h-[420px] bg-[#f7efe8] mb-10 lg:mb-0">
      <div className="absolute inset-0 bg-cover bg-center scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[#f7efe8]/80 group-hover:bg-[#f7efe8]/60 transition duration-700" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 cursor-pointer">
        <h3 className="font-mulish text-2xl lg:text-[28px] lg:leading-[28px] mb-5 font-normal">
          {title}
        </h3>
        <CommonButton  to={withBase(link)} state={{ treatmentId: id }} className="px-10 py-3 text-[10px]">
          Read More
        </CommonButton>
      </div>
    </div>
  );
}
