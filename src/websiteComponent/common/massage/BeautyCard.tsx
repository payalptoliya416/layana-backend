import CommonButton from "../home/CommonButton";
type Props = {
  title: string;
  image: string;
  description: string;
  duration60: number;
  duration90: number;
};

export default function BeautyCard({
  title,
  image,
  description,
  duration60,
  duration90,
}: Props) {
  return (
    <div className="border-[5px] border-[#F6F6F6] bg-white h-full flex flex-col">
      
      {/* Image (fixed height, never shrinks) */}
      <div className="relative h-[172px] flex-none overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content (takes remaining space) */}
      <div className="p-5 text-center flex flex-col flex-1 items-center">
        
        {/* Text grows */}
        <div className="flex-1">
          <h3 className="text-lg mb-[15px]">{title}</h3>

          <p className="text-sm leading-[24px] mb-5 font-quattro text-para">
            {description}
          </p>

          <p className="text-sm font-bold mb-5 text-[#282828]">
            60 min £ {duration60} | 90 min £ {duration90}
          </p>
        </div>

        {/* Button always bottom */}
        <div className="pt-4">
          <CommonButton>Book Now</CommonButton>
        </div>
      </div>
    </div>
  );
}