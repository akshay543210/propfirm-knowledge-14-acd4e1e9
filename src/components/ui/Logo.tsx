import { motion } from "framer-motion";
import logoImg from "@/assets/propfirm-knowledge-logo.jpg";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  variant?: "default" | "mono-dark" | "mono-light";
}

/**
 * PropFirm Knowledge — official brand logo.
 */
export const Logo = ({ className = "", size = 36, showWordmark = true }: LogoProps) => {
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <motion.img
        src={logoImg}
        alt="PropFirm Knowledge"
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        className="shrink-0 rounded-full object-cover transition-all duration-500 group-hover:drop-shadow-[0_0_12px_hsl(38_55%_65%/0.6)]"
        style={{ width: size, height: size }}
        whileHover={{ rotate: 4 }}
      />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-[15px] md:text-[17px] font-bold tracking-tight text-foreground">
            PropFirm <span className="gradient-text-gold">Knowledge</span>
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium mt-0.5">
            Forex Trading Community
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
