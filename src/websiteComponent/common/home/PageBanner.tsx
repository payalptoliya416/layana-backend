import React from "react";

type PageBannerProps = {
  title: string;
  subtitle?: string;
  backgroundImage: string;
};

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <section
      className="relative w-full py-[84px] md:py-[150px] bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto text-center px-4">
        <h1 className="font-muli text-white text-[38px] md:text-[65px] leading-[42px] sm:leading-[1.1]">
          {title}
          {subtitle && (
            <>
                <br className="hidden sm:block" /> {subtitle}
            </>
          )}
        </h1>
      </div>
    </section>
  );
};

export default PageBanner;
