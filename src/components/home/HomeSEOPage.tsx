"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import HomeSEO, { HomeSEOData } from "./HomeSEO";

const HomeSEOPage = forwardRef<any>((_, ref) => {
  const seoRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    validate: () => ({
      valid: true,
      errors: [],
    }),

    getData: () => seoRef.current?.getData(),

    setData: (data: Partial<HomeSEOData>) => {
      seoRef.current?.setData(data);
    },
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <HomeSEO ref={seoRef} />
    </div>
  );
});

HomeSEOPage.displayName = "HomeSEOPage";
export default HomeSEOPage;
