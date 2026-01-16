import { Link } from "react-router-dom";

const socials = [
  {
    label: "JOIN ON",
    name: "Facebook",
    url: "https://www.facebook.com/layanauk",
  },
  {
    label: "FOLLOW",
    name: "Instagram",
    url: "https://www.instagram.com/layana.uk/",
  },
  {
    label: "Write to us",
    name: "E-mail",
    url: "mailto:info@layana.co.uk",
  },
  {
    label: "CONNECT US",
    name: "WhatsApp",
    url: "https://wa.me/message/QZVCD34TB4OKC1", // replace with real number
  },
];

export default function SocialStrip() {
  return (
    <section className="pt-12 lg:pt-[110px] pb-[30px] lg:pb-[50px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 text-center">

          {socials.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              target="_blank"
            >
              <p className="font-mulish text-[10px] md:text-xs leading-[12px] tracking-[0.2em] uppercase mb-[6px]">
                {item.label}
              </p>

              <h3 className="font-mulish text-[22px] md:text-4xl leading-[24px] md:leading-[35px]">
                {item.name}
              </h3>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
