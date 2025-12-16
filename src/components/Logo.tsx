import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Layana Logo - Stylized L with spa leaf accent */}
      <div className={`${sizeClasses[size]} aspect-square relative`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle */}
          <circle cx="24" cy="24" r="22" fill="hsl(var(--primary))" />
          {/* Stylized L */}
          <path 
            d="M16 12V36H32" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Leaf accent */}
          <path 
            d="M28 16C32 16 36 20 36 24C32 24 28 20 28 16Z" 
            fill="white" 
            opacity="0.9"
          />
        </svg>
      </div>
      <span className={`font-semibold tracking-wide ${
        size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
      } text-foreground`}>
        Layana
      </span>
    </div>
  );
};

export default Logo;
