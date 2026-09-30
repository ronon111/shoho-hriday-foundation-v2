import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol-only' | 'light';
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  className?: string;
  symbolSize?: number;
}

/**
 * Shoho Riday Foundation Brand Logo
 * Features the signature deep burgundy/maroon heart-shaped human/community symbol
 * paired with dignified Bengali and English typography.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  light = false,
  className = '',
  symbolSize,
}) => {
  const isLight = light || variant === 'light';
  const computedSymbolSize = symbolSize || (size === 'sm' ? 32 : size === 'lg' ? 52 : 42);

  // SVG Symbol: Heart-shaped embracing human/community silhouette
  const Symbol = (
    <svg
      width={computedSymbolSize}
      height={computedSymbolSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="সহৃদয় ফাউন্ডেশন প্রতীক"
    >
      {/* Outer Heart Contour in Deep Burgundy/Maroon */}
      <path
        d="M50 90C47.8 87.8 14 59.2 14 34.2C14 20.8 24.8 10 38.2 10C44.6 10 50.8 12.8 55 17.6C59.2 12.8 65.4 10 71.8 10C85.2 10 96 20.8 96 34.2C96 59.2 62.2 87.8 50 90Z"
        fill={isLight ? '#FFFFFF' : '#8F1537'}
      />

      {/* Human Figures Head 1 & Head 2 (Forming the two lobes of the heart) */}
      <circle
        cx="39"
        cy="33"
        r="5.5"
        fill={isLight ? '#8F1537' : '#FAF8F3'}
      />
      <circle
        cx="61"
        cy="33"
        r="5.5"
        fill={isLight ? '#8F1537' : '#FAF8F3'}
      />

      {/* Embracing human bodies connecting at the center to form inner heart */}
      <path
        d="M32 54C32 43.5 39 42 45 46.5C48 48.8 50 50.5 50 50.5C50 50.5 52 48.8 55 46.5C61 42 68 43.5 68 54C68 62 57 71 50 76C43 71 32 62 32 54Z"
        fill={isLight ? '#8F1537' : '#FAF8F3'}
      />

      {/* Subtle warm center core accent */}
      <circle
        cx="50"
        cy="58"
        r="3"
        fill={isLight ? '#FAF8F3' : '#8F1537'}
      />
    </svg>
  );

  if (variant === 'symbol-only') {
    return <div className={`inline-flex items-center ${className}`}>{Symbol}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Symbol}
      <div className="flex flex-col text-left">
        <span
          className={`font-semibold tracking-tight leading-tight transition-colors ${
            variant === 'compact' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
          } ${isLight ? 'text-white' : 'text-[#24252A]'}`}
          style={{ letterSpacing: '-0.01em' }}
        >
          সহৃদয় ফাউন্ডেশন
        </span>
        <span
          className={`font-english font-medium tracking-wider uppercase leading-none mt-0.5 ${
            variant === 'compact' ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'
          } ${isLight ? 'text-white/80' : 'text-[#8F1537]'}`}
          style={{ letterSpacing: '0.12em' }}
        >
          SHOHO RIDAY FOUNDATION
        </span>
      </div>
    </div>
  );
};
