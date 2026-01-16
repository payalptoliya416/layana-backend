import { Plus } from "lucide-react";

type Props = {
  name: string;
  role: string;
  image: string;
  index: number;
};

export default function TeamCard({ name, role, image, index }: Props) {
  return (
    <div
      className={`
        text-center
        ${index % 2 === 1 ? "md:translate-y-16" : ""}
      `}
    >
      {/* Image */}
      <div className="relative w-[200px] h-[200px] mx-auto mb-6">
        {/* ring */}
        <div className="absolute inset-0 rounded-full border border-[#9A563A]" />

        {/* image */}
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* plus */}
        <div className="absolute left-[-8%] top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow">
          <span className="text-[#9A563A]">
            <Plus size={20} />
          </span>
        </div>
      </div>

      {/* role */}
      <p className="text-[12px] tracking-[0.25em] text-[#9A563A] mb-2 uppercase">
        {role}
      </p>

      {/* name */}
      <h3 className="font-quattro text-[22px] text-[#1e2b3a]">
        {name}
      </h3>
    </div>
  );
}
