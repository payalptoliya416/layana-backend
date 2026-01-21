import { useLocation, useNavigate } from "react-router-dom";
import { saveTreatmentId } from "./SaveTretmentId";

type Props = {
  title: string;
  image: string;
  bgColor: string;
  slug: string;
  id?: number;
};

export default function MassageCard({
  title,
  image,
  bgColor,
  slug,
  id,
}: Props) {
   const navigate = useNavigate();
  const location = useLocation();

const handleClick = () => {
  const currentPath = location.pathname;

  // const newPath = `${currentPath.replace(/\/$/, "")}/${slug}`;
const basePath = currentPath.split("/treatments")[0] + "/treatments";

  const newPath = `${basePath}/${slug}`;
  if (id) {
    saveTreatmentId(id);
  }
  navigate(newPath, {
    state: { treatmentId: id },
  });
};

  return (
    <div
      onClick={handleClick}
      className="relative group overflow-hidden h-[300px] sm:h-[350px] cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hover Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 opacity-0
        group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div
        className="absolute inset-0 group-hover:opacity-60 transition duration-700"
        style={{ backgroundColor: bgColor }}
      />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <h3 className="font-muli text-xl md:text-[28px] md:leading-[32px] font-normal text-[#282828">
          {title}
        </h3>
      </div>
    </div>
  );
}
