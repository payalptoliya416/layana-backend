export type MassageTreatment = {
  title: string;
  image: string;
};

export type MassageBeautyTabs =
  | "Skin"
  | "Massage"
  // | "Laser Hair Removal"
  | "Beauty";

// Beauty images
import beauty1 from "@/assets/beauty1.png";
import beauty2 from "@/assets/beauty2.png";
import beauty3 from "@/assets/beauty3.png";
import beauty4 from "@/assets/beauty4.png";
import beauty5 from "@/assets/beauty5.png";
import beauty6 from "@/assets/beauty6.png";
import beauty7 from "@/assets/beauty7.png";

export const massageBeautyData: Record<
  MassageBeautyTabs,
  MassageTreatment[]
> = {
  Skin: [
    { title: "Hydra Facial", image: beauty1 },
    { title: "Anti Aging", image: beauty2 },
    { title: "Acne Treatment", image: beauty3 },
  ],

  Massage: [
    { title: "Thai Oil Massage", image: beauty4 },
    { title: "Deep Tissue Massage", image: beauty5 },
    { title: "Swedish Massage", image: beauty6 },
    { title: "Hot Stone Massage", image: beauty7 },
  ],

  // "Laser Hair Removal": [
  //   { title: "Full Body Laser", image: beauty7 },
  //   { title: "Face Laser", image: beauty6 },
  //   { title: "Underarm Laser", image: beauty1 },
  // ],

  Beauty: [
    { title: "Nails", image: beauty1 },
    { title: "Waxing", image: beauty2 },
    { title: "Tinting, Brows & Threading", image: beauty3 },
    { title: "Environ Professional electro-sonic", image: beauty4 },
    { title: "Spa Image Facial", image: beauty5 },
    { title: "I Peel Image Skincare - Enzyme & Chemical Peel", image: beauty6 },
    { title: "3D - HydrO2 Facial", image: beauty7 },
  ],
};


export const nailsPriceData = [
  {
    title: "Shellac / Gel",
    items: [
      {
        name: "Shellac Manicure",
        prices: { Express: 25, Classic: 30, Deluxe: 40 },
      },
      {
        name: "Shellac Pedicure",
        prices: { Express: 30, Classic: 35, Deluxe: 45 },
      },
      {
        name: "Soak off & Shellac Manicure",
        prices: { Express: 30, Classic: 35, Deluxe: 45 },
      },
      {
        name: "Soak off & Shellac Pedicure",
        prices: { Express: 35, Classic: 40, Deluxe: 50 },
      },
      {
        name: "Sock Off",
        prices: { Single: 10 },
      },
      {
        name: "Acrylic or Nail Extension Removal",
        prices: { Single: 15 },
      },
      {
        name: "French Add-on",
        prices: { Single: 10 },
      },
    ],
  },
  {
    title: "Manicure & Pedicure",
    items: [],
  },
  {
    title: "Male Manicure & Pedicure",
    items: [],
  },
];

export const pricingTooltips = {
  Express: {
    title: "Manicure",
    text: "An express manicure is a quick, pampering nail treatment that includes shaping, cutting, buffing, and polish—ideal for those on the go who still crave that fresh, flawless, and confident look in just minutes.",
  },
  Classic: {
    title: "Pedicure",
    text: "Our express pedicure is a quick, refreshing treatment that includes expert nail shaping, cutting, buffing, finished with a polish of your choice. While it doesn’t include soak in water or hard skin removal, it’s perfect for those who want healthy-looking nails and a polished look in minimal time.",
  },
  Deluxe: {
    title: "Deluxe",
    text: "A luxurious experience including soak, exfoliation, cuticle care, massage and deep hydration for the ultimate pampering.",
  },
};

export type PriceRow = {
  label: string;
  price: number;
};

export type NailRow = {
  name: string;
  prices: {
    Express?: number;
    Classic?: number;
    Deluxe?: number;
    Single?: number;
  };
};

export type PriceSection = {
  title: string;
  rows: PriceRow[];
};

export type PriceGroup = {
  title: string;
  sections?: PriceSection[]; // Waxing style
  rows?: NailRow[]; // Nails style
};

export const nailsData: PriceGroup[] = [
  {
    title: "Shellac / Gel",
    rows: [
      {
        name: "Shellac Manicure",
        prices: { Express: 25, Classic: 30, Deluxe: 40 },
      },
      {
        name: "Shellac Pedicure",
        prices: { Express: 30, Classic: 35, Deluxe: 45 },
      },
      {
        name: "Soak off & Shellac Manicure",
        prices: { Express: 30, Classic: 35, Deluxe: 45 },
      },
      {
        name: "Soak off & Shellac Pedicure",
        prices: { Express: 35, Classic: 40, Deluxe: 50 },
      },
      { name: "Sock Off", prices: { Single: 10 } },
      { name: "Acrylic or Nail Extension Removal", prices: { Single: 15 } },
      { name: "French Add-on", prices: { Single: 10 } },
    ],
  },
  {
    title: "Manicure & Pedicure",
    rows: [],
  },
  {
    title: "Male Manicure & Pedicure",
    rows: [],
  },
];
export const waxingData: PriceGroup[] = [
  {
    title: "For Her",
    sections: [
      {
        title: "Face",
        rows: [
          { label: "Upper Lip", price: 30 },
          { label: "Lower Lip", price: 32 },
          { label: "Chin", price: 35 },
          { label: "Sides", price: 50 },
          { label: "Eyebrow", price: 12 },
          { label: "Forehead", price: 14 },
          { label: "Neck", price: 19 },
          { label: "Full Face excl. Eyebrows", price: 35 },
          { label: "Full Face incl. Eyebrows", price: 50 },
        ],
      },
      { title: "Upper Body", rows: [] },
      { title: "Lower Body", rows: [] },
      { title: "Intimate area", rows: [] },
    ],
  },
  {
    title: "For Him",
    sections: [],
  },
];