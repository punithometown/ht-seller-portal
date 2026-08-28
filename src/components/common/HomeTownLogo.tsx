import React from 'react';

interface HomeTownLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export const HomeTownLogo: React.FC<HomeTownLogoProps> = ({
  size = 'md',
  showText = false,
  textClassName = '',
  theme = 'light',
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 rounded-sm',
    sm: 'w-7 h-7 rounded',
    md: 'w-8 h-8 rounded-md',
    lg: 'w-10 h-10 rounded-lg',
    xl: 'w-12 h-12 rounded-xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Wood Grain & HT Mark */}
      <div 
        className={`relative shrink-0 overflow-hidden shadow-xs border border-[#D5A764]/40 select-none ${sizeMap[size]}`}
        style={{
          background: 'linear-gradient(135deg, #F5D090 0%, #E3AC5D 35%, #F4CD88 65%, #DA9F46 100%)',
        }}
      >
        {/* Subtle Wood Texture Fiber Lines */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(115, 68, 16, 0.4) 4px,
              transparent 5px
            )`
          }}
        />

        {/* HT Vector Mark */}
        <svg 
          viewBox="0 0 512 512" 
          className="w-full h-full relative z-10 block"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* The "H" in Dark Walnut Brown */}
          <g fill="#24150E">
            <rect x="0" y="124" width="75" height="264" />
            <rect x="169" y="124" width="75" height="264" />
            <rect x="74" y="217" width="96" height="66" />
          </g>

          {/* The "T" in Terracotta / Burnt Orange */}
          <g fill="#D84C1C">
            <rect x="264" y="124" width="248" height="66" />
            <rect x="350" y="189" width="76" height="199" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-[#24150E]'} ${textClassName || 'text-base'}`}>
              Home
            </span>
            <span className={`font-black text-[#D84C1C] ${textClassName || 'text-base'}`}>
              Town
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#9C7550] mt-0.5">
            Seller Central
          </span>
        </div>
      )}
    </div>
  );
};
