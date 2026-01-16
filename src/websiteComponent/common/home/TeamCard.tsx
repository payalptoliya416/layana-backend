type Props = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export default function TeamCard({ name, role, bio, image }: Props) {
  return (
    <div className="bg-[#F7EFEC] p-[15px] text-center">
      <div className="w-[165px] h-[165px] mx-auto mb-[15px] rounded-full overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-mulish text-[18px] font-semibold mb-[15px] tracking-[0.15em] uppercase">
        {name}
      </h3>
      <p className="font-quattro text-sm leading-[14px] mb-[15px]">{role}</p>
      <p className="font-quattro text-[#666666] text-[14px] leading-[22px]">{bio}</p>
    </div>
  );
}
