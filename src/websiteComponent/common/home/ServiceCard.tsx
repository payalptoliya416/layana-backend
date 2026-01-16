import CommonButton from "./CommonButton";

type Props = {
  title: string;
  image: string;
};

export default function ServiceCard({ title, image }: Props) {
  return (
    <div className="relative group overflow-hidden h-[420px] bg-[#f7efe8]">
      <div className="absolute inset-0 bg-cover bg-center scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[#f7efe8]/80 group-hover:bg-[#f7efe8]/60 transition duration-700" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h3 className="font-mulish text-[28px] leading-[28px] mb-5 font-normal">
          {title}
        </h3>
        <CommonButton className="px-10 py-3 text-[10px]">
          Read More
        </CommonButton>
      </div>
    </div>
  );
}
