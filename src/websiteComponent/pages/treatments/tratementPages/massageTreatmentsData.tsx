export type MassageTreatment = {
  title: string;
  image: string;
};

export type MassageTreatmentTabs =
  | "Skin"
  | "Massage"
  // | "Laser Hair Removal"
  | "Beauty";

import m1 from "@/assets/m1.png";
import m2 from "@/assets/m2.png";
import m3 from "@/assets/m3.png";
import m4 from "@/assets/m4.png";
import m5 from "@/assets/m5.png";
import m6 from "@/assets/m6.png";
import m7 from "@/assets/m7.png";
import m8 from "@/assets/m8.png";
import m9 from "@/assets/m9.png";
import m10 from "@/assets/m10.png";
import m11 from "@/assets/m11.png";
import m12 from "@/assets/m12.png";

export const massageTreatmentsData: Record<
  MassageTreatmentTabs,
  MassageTreatment[]
> = {
  Skin: [
    { title: "Hydra Facial", image: m1 },
    { title: "Anti Aging", image: m2 },
    { title: "Acne Treatment", image: m3 },
  ],

  Massage: [
    { title: "Thai Oil Massage", image: m1 },
    { title: "Deep Tissue Massage", image: m2 },
    { title: "Swedish Massage", image: m3 },
    { title: "Hot Stone Massage", image: m4 },
    { title: "Traditional Thai Massage", image: m5 },
    { title: "Aromatherapy Massage", image: m6 },
    { title: "Pregnancy Massage", image: m7 },
    { title: "Body Scrub", image: m8 },
    { title: "Head Massage", image: m9 },
    { title: "Thai Foot Reflexology", image: m10 },
    { title: "Back, Neck & Shoulder", image: m11 },
    { title: "Sports Massage", image: m12 },
  ],

  // "Laser Hair Removal": [
  //   { title: "Full Body Laser", image: m4 },
  //   { title: "Face Laser", image: m5 },
  //   { title: "Underarm Laser", image: m6 },
  // ],

  Beauty: [
    { title: "Manicure", image: m7 },
    { title: "Pedicure", image: m8 },
    { title: "Bridal Makeup", image: m9 },
  ],
};
