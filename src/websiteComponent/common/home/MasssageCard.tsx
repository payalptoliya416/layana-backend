type Props = {
  title: string;
  image: string;
  bgColor: string;
};

export default function MassageCard({ title, image, bgColor }: Props) {
  return (
    <div
      className="relative group overflow-hidden h-[358px] cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hover Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 opacity-0
        group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="absolute inset-0 group-hover:opacity-60 transition duration-700"
        style={{ backgroundColor: bgColor }}
      />

      {/* Title */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <h3 className="font-mulish text-[28px] leading-[32px] font-normal">
          {title}
        </h3>
      </div>
    </div>
  );
}
