import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  variant?: "default" | "mono-dark" | "mono-light";
}

/**
 * PropFirm Knowledge — minimal vector mark.
 * Globe + ascending candle, gold + matte black.
 */
export const Logo = ({ className = "", size = 36, showWordmark = true, variant = "default" }: LogoProps) => {
  const goldA = variant === "mono-dark" ? "currentColor" : "hsl(38 55% 72%)";
  const goldB = variant === "mono-dark" ? "currentColor" : "hsl(32 45% 45%)";
  const ink = variant === "mono-light" ? "currentColor" : "hsl(222 14% 7%)";

  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_hsl(38_55%_65%/0.6)]"
        whileHover={{ rotate: 4 }}
      >
        <defs>
          <linearGradient id="pfk-gold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={goldA} />
            <stop offset="100%" stopColor={goldB} />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="24" cy="24" r="22" stroke="url(#pfk-gold)" strokeWidth="1.5" />
        {/* Globe meridians */}
        <ellipse cx="24" cy="24" rx="22" ry="9" stroke="url(#pfk-gold)" strokeWidth="1" opacity="0.55" />
        <ellipse cx="24" cy="24" rx="9" ry="22" stroke="url(#pfk-gold)" strokeWidth="1" opacity="0.55" />
        <line x1="2" y1="24" x2="46" y2="24" stroke="url(#pfk-gold)" strokeWidth="1" opacity="0.4" />
        {/* Candles */}
        <rect x="17" y="20" width="3" height="14" rx="0.5" fill={ink} />
        <line x1="18.5" y1="16" x2="18.5" y2="38" stroke={ink} strokeWidth="0.8" />
        <rect x="22.5" y="15" width="3" height="20" rx="0.5" fill="url(#pfk-gold)" />
        <line x1="24" y1="11" x2="24" y2="39" stroke="url(#pfk-gold)" strokeWidth="0.8" />
        <rect x="28" y="22" width="3" height="12" rx="0.5" fill={ink} />
        <line x1="29.5" y1="18" x2="29.5" y2="37" stroke={ink} strokeWidth="0.8" />
        {/* Ascending arrow */}
        <path d="M32 18 L38 12 M38 12 L33 12 M38 12 L38 17" stroke="url(#pfk-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-[15px] md:text-[17px] font-bold tracking-tight text-foreground">
            PropFirm <span className="gradient-text-gold">Knowledge</span>
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium mt-0.5">
            Institutional Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
