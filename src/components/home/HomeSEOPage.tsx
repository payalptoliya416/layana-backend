

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
    <div className="">
      <HomeSEO ref={seoRef} />
    </div>
  );
});

HomeSEOPage.displayName = "HomeSEOPage";
export default HomeSEOPage;
