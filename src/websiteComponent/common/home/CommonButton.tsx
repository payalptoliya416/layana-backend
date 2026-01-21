import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  className?: string;
  to?: string;           // for routing
  href?: string;    
  onClickCapture?: () => void;     // for external links
  onClick?: () => void;  // normal click
    state?: any;   
};

export default function CommonButton({
  children,
  className = "",
  to,
  href,
  onClick,
  onClickCapture,
  state
  
}: Props) {
  //  md:w-[260px]
  const baseClass = `
    border border-black px-[50px] py-[23px]
    flex items-center justify-center
    font-muli text-[12px] leading-[12px]
    tracking-[2px] uppercase
    transition
    hover:bg-black hover:text-white cursor-pointer
    ${className}
  `;

  // React Router navigation
  if (to) {
    return (
      <Link to={to} state={state} onClick={onClick} onClickCapture={onClickCapture} className={baseClass} >
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
    <button onClick={onClick} className={baseClass}  onClickCapture={onClickCapture}>
      {children}
    </button>
  );
}
