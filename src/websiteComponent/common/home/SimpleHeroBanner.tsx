"use client";

type Props = {
  background: string;
  title: string;
  subtitle?: string;
  breadcrumb?: React.ReactNode;
  height?: string;
};

export default function SimpleHeroBanner({
  background,
  title,
  subtitle,
  breadcrumb,
  height = "h-[500px]",
}: Props) {
  return (
    <section
      className={`relative w-full ${height} bg-cover bg-center flex items-center justify-center`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-[28px] sm:text-[48px] lg:text-[65px] font-light leading-tight">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-[5px] text-2xl">{subtitle}</p>
        ) : breadcrumb ? (
          breadcrumb
        ) : null}
      </div>
    </section>
  );
}
