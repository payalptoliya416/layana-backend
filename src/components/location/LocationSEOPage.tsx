"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import LocationSEO, { LocationSEOData } from "./LocationSEO";

const LocationSEOPage = forwardRef<any>((_, ref) => {
  const seoRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    validate: () => ({
      valid: true,
      errors: [],
    }),

    getData: () => seoRef.current?.getData(),

    setData: (data: Partial<LocationSEOData>) => {
      seoRef.current?.setData(data);
    },
  }));

  return (
    <div className="">
      <LocationSEO ref={seoRef} />
    </div>
  );
});

LocationSEOPage.displayName = "LocationSEOPage";
export default LocationSEOPage;
