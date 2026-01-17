import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  className?: string;
  to?: string;           // for routing
  href?: string;         // for external links
  onClick?: () => void;  // normal click
    state?: any;   
};

export default function CommonButton({
  children,
  className = "",
  to,
  href,
  onClick,
  state
  
}: Props) {
  const baseClass = `
    border border-black px-2
    md:w-[260px] h-[50px] md:h-[70px]
    flex items-center justify-center
    font-mulish text-[12px]
    tracking-[0.25em] uppercase
    transition
    hover:bg-black hover:text-white cursor-pointer
    ${className}
  `;

  // React Router navigation
  if (to) {
    return (
      <Link to={to} state={state} className={baseClass} >
        {children}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    );
  }

  // Normal button
  return (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}
