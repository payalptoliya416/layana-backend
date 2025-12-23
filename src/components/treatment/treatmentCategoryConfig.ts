export type CategoryKey = "Facial" | "Massage" | "Hair" | "Body";

export const CATEGORY_CONFIG: Record<CategoryKey, {
  tabs: {
    general?: boolean;
    branches?: boolean;
    visuals?: boolean;
    pricing?: boolean;
    benefits?: boolean;
    seo?: boolean;
  };
  fields: {
    indicativePressure?: boolean;
    skinType?: boolean;
  };
}> = {
  Facial: {
    tabs: {
      general: true,
      branches: true,
      visuals: true,
      pricing: true,
      benefits: true,
      seo: true,
    },
    fields: {
      indicativePressure: false,
      skinType: true,
    },
  },

  Massage: {
    tabs: {
      general: true,
      branches: true,
      visuals: false,
      pricing: true,
      benefits: true,
      seo: false,
    },
    fields: {
      indicativePressure: true,
      skinType: false,
    },
  },

  Hair: {
    tabs: {
      general: true,
      branches: true,
      visuals: true,
      pricing: true,
      benefits: false,
      seo: true,
    },
    fields: {
      indicativePressure: false,
      skinType: false,
    },
  },

  Body: {
    tabs: {
      general: true,
      branches: true,
      visuals: true,
      pricing: true,
      benefits: true,
      seo: false,
    },
    fields: {
      indicativePressure: true,
      skinType: false,
    },
  },
};
