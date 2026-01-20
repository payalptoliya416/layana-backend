import { withBase } from "../Header";
import CommonButton from "./CommonButton";

type Props = {
  title: string;
  image: string;
  link?: string; // ✅ ADD
  id?: number;
  heightClass?: string;
  index? : number
};

const CARD_COLORS = [
  "#FDF8F4",
  "#FBF3EC",
  "#FFF6F0",
  "#FFF4E9",
];

export default function ServiceCard({
  title,
  image,
  link,
  id = 0,
  index,
  heightClass = "h-[420px] md:h-[482px]",
}: Props) {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <div
      className={`relative group overflow-hidden ${heightClass} mb-10 lg:mb-0`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Background image hover */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 transition duration-700"
        style={{ backgroundColor: `${bgColor}CC` }} // opacity effect
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 cursor-pointer">
        <h3 className="font-muli text-2xl lg:text-[28px] lg:leading-[28px] mb-5 font-normal">
          {title}
        </h3>

        <CommonButton
          to={withBase("/#")}
          // to={withBase(link)}
          state={{ treatmentId: id }}
          className="px-10 py-3 !tracking-0"
        >
          Read More
        </CommonButton>
      </div>
    </div>
  );
}
