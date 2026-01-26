import { useLocation, useNavigate } from "react-router-dom";
import { withBase } from "../Header";
import CommonButton from "./CommonButton";
import { saveTreatmentId } from "./SaveTretmentId";

type Props = {
  title: string;
  image: string;
  link?: string;
  id?: number;
  heightClass?: string;
    locationId?: number; 
  index?: number;
};

const CARD_COLORS = ["#FDF8F4", "#FBF3EC", "#FFF6F0", "#FFF4E9"];

export default function ServiceCard({
  title,
  image,
  link,
  id = 0,
  index,
  heightClass = "h-[420px] md:h-[482px]",
  locationId
}: Props) {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  const saveTreatmentIdData = (id: number) => {
   saveTreatmentId(id);
  };

  const location = useLocation();

  // current path: /websiteurl/finchley-central
  const pathParts = location.pathname.split("/").filter(Boolean);

  // last known location slug (finchley-central)
  const currentLocationSlug = pathParts[pathParts.length - 1];

  const finalLink = link?.startsWith("/")
    ? link
    : `/${currentLocationSlug}/treatments/${link}`;

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
        style={{ backgroundColor: `${bgColor}CC` }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h3 className="font-muli text-2xl lg:text-[28px] lg:leading-[28px] mb-5 font-normal">
          {title}
        </h3>

        <CommonButton
          to={withBase(finalLink)}
          onClickCapture={() => {
            saveTreatmentIdData(id);
          }}
          state={{ treatmentId: id , locationId: locationId,  }}
          className="!tracking-0"
        >
          Read More
        </CommonButton>
      </div>
    </div>
  );
}
