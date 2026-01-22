import package1 from "@/assets/package1.png";
import package2 from "@/assets/package2.jpg";
import package3 from "@/assets/package3.jpg";
import package4 from "@/assets/package4.jpg";
import package5 from "@/assets/package5.jpg";
import package6 from "@/assets/package6.jpg";
import CommonButton from "@/websiteComponent/common/home/CommonButton";


type SinglePrice = {
  type: "single";
  label: string;
  price: string;
};

type MultiPrice = {
  type: "multi";
  options: {
    label: string;
    price: string;
  }[];
};

export type Pricing = SinglePrice | MultiPrice;

export type PackageItem = {
  title: string;
  image: string;
  pricing: Pricing;
  shortDescription: string;
  quote?: string;

  // Optional popup
  popup?: {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    price: string;
  };
};

export const spaPackages: PackageItem[] = [
  {
    title: "Deluxe Pamper Package",
    image: package1,
    pricing: {
      type: "single",
      label: "115 min",
      price: "£129",
    },
    shortDescription:
      "Balancing Aromatherapy massage - 60 min & I SPA Image Skincare",
    quote: "Spoil yourself today",
    popup: {
      image: package1,
      title: "Deluxe Pamper Package ®",
      subtitle: "Balancing Aromatherapy massage - 60 min &",
      description: "I SPA Image Skincare - Ormedic Restoring Facial - 55 min",
      price: "115 min £149",
    },
  },

  {
    title: "De -Stress",
    image: package2,
    pricing: {
      type: "single",
      label: "60 min",
      price: "£75",
    },
    shortDescription:
      "Back and Shoulder -45 min & Signature scalp massage 15 min...",
    quote: "Spoil yourself today",
    popup: {
      image: package2,
      title: "De -Stress ®",
      subtitle: "Back and Shoulder -45 min & Signature scalp massage 15 min",
      description: "Focus on Back ,Neck & Shoulder...",
      price: "60 min £75",
    },
  },

  {
    title: "Renew & Refresh ( Body Exfoliation)",
    image: package3,
    pricing: {
      type: "single",
      label: "90 min",
      price: "£125",
    },
    shortDescription:
      "Relaxing Swedish massage - 60 min & Body exfoliation - 20 min Promoting tranquility and calm the skin renew",
    quote: "Spoil yourself today",

    popup: {
      image: package3,
      title: "Renew & Refresh ( Body Exfoliation) ®",
      subtitle: "Relaxing Swedish massage - 60 min & Body exfoliation - 20 min",
      description:
        "Promoting tranquility and calm the skin renewing scrub followed by a massage enables the clearing of the mind whist muscle tension melts away. Leaving the feeling revived and refreshed.",
      price: "90 min £125",
    },
  },

  {
    title: "Focus On - Back & Toe",
    image: package4,
    pricing: {
      type: "multi",
      options: [
        { label: "60 min", price: "£85" },
        { label: "90 min", price: "£115" },
      ],
    },
    shortDescription:
      "30 or 60 min Back, Neck, Shoulder massage & Thai Foot massage Focus on back , neck & shoulder to reliev",
    quote: "Spoil yourself today",

    popup: {
      image: package4,
      title: "Focus On - Back & Toe ®",
      subtitle: "30 or 60 min Back, Neck, Shoulder massage & Thai Foot massage",
      description:
        "Focus on back , neck & shoulder to relieve tension with our own specialised massage techniques follow by Thai Foot massage.",
      price: "60 min £85",
    },
  },

  
  {
    title: "Heavenly Body & Feet",
    image: package5,
    pricing: {
      type: "single",
      label: "90 min",
      price: "£115",
    },
    shortDescription:
      "Layana specialised full body massage - 60 min & Thai foot massage -30 min incorporating Thai technique a truly co",
    quote: "Spoil yourself today",

    popup: {
      image: package5,
      title: "Heavenly Body & Feet ®",
      subtitle: "",
      description:
        "Layana specialised full body massage - 60 min & Thai foot massage -30 min incorporating Thai technique a truly complete relaxing experience.",
      price: "90 min £115",
    },
  },
  {
    title: "Pamper Mum-to-be",
    image: package6,
    pricing: {
      type: "single",
      label: "60 min",
      price: "£99",
    },
    shortDescription:
      "Pregnancy back massage - 30 min & Relaxing facial - 30min Helping to relieve tension in the back while easi",
    quote: "Spoil yourself today",

    popup: {
      image: package6,
      title: "Heavenly Body & Feet ®",
      subtitle: "Pregnancy back massage - 30 min & Relaxing facial - 30min",
      description:
        "Helping to relieve tension in the back while easing the mind and uplifting the spirit. It's the ultimate in pampering and is suitable for all mum.",
      price: "60 min £99",
    },
  },
];

export default function PackageCard({
  item,
  onReadMore,
}: {
  item: PackageItem;
  onReadMore: () => void;
}) {
  return (
    <div className="bg-[#F5EEE9]">
      <img src={item.image} className="w-full h-[228px] object-cover" />

      <div className="px-[15px] py-[35px] text-center">
        <h3 className="text-xl leading-[20px] mb-[15px] font-light">
          {item.title}
        </h3>
        <p className="text-[#282828] text-lg leading-[18px] font-bold mb-[15px]">
          {item.pricing.type === "single" ? (
            <>
              {item.pricing.label} – {item.pricing.price}
            </>
          ) : (
            item.pricing.options.map((opt, i) => (
              <span key={i}>
                {opt.label} {opt.price}
              </span>
            ))
          )}
        </p>

        <p className="mb-[15px] text-base text-[#666666] font-quattro">
          {item.shortDescription}{" "}
          {item.popup && (
            <span
              onClick={onReadMore}
              className="underline cursor-pointer font-medium text-black"
            >
              Read More
            </span>
          )}
        </p>

        {item.quote && (
          <p className="italic text-base leading-[16px] mb-5">"{item.quote}"</p>
        )}

        <CommonButton className="mx-auto">
          BOOK NOW
        </CommonButton>
      </div>
    </div>
  );
}
