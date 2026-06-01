import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import MarketToggle from "./MarketToggle";
import { PropFirm } from "../types/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";
import { AnimatedCounter } from "./ui/animated-counter";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms, onSearchResults }: HeroProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-44 sm:pt-32 pb-20 overflow-hidden luxury-bg">
      {/* Soft gold radial */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,hsl(38_60%_82%/0.5),transparent_60%)] blur-3xl animate-float-orb" />
        <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,hsl(38_55%_75%/0.3),transparent_70%)] blur-3xl animate-glow-pulse" />
      </div>

      {/* Subtle institutional grid */}
      <div className="absolute inset-0 luxury-grid-bg opacity-[0.25] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full border border-primary/30 bg-card/60 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80">
            Institutional Prop Firm Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold mb-7 leading-[1.02] tracking-[-0.025em] font-heading"
          variants={itemVariants}
        >
          <span className="text-foreground">Find the Perfect</span>
          <br />
          <span className="gradient-text-animated">Prop Trading Firm</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 font-body"
          variants={itemVariants}
        >
          Trade only with trusted payout firms. Verified reviews, payout transparency,
          and institutional-grade prop firm analysis.
        </motion.p>

        {/* Market Toggle */}
        <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
          <MarketToggle size="md" />
        </motion.div>

        {/* Search */}
        <motion.div className="mb-10 max-w-2xl mx-auto" variants={itemVariants}>
          <SearchBar
            propFirms={propFirms || []}
            onFilteredResults={(r) => onSearchResults?.(r)}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div className="flex flex-wrap gap-3 justify-center mb-20" variants={itemVariants}>
          <MagneticButton
            onClick={() => navigate("/propfirms", { state: { propFirms } })}
            size="lg"
            className="btn-gold rounded-xl text-sm px-7 py-3 font-semibold tracking-wide"
          >
            Explore All Firms
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate("/compare")}
            size="lg"
            variant="outline"
            className="border-foreground/15 hover:border-primary hover:bg-muted text-foreground rounded-xl text-sm px-7 py-3 font-medium"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
            Compare Firms
          </MagneticButton>
        </motion.div>

        {/* Stats — institutional */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {[
            { end: 20000, suffix: "+", label: "Active Traders", sub: "Funded worldwide" },
            { end: 2.5, suffix: "B", prefix: "$", decimals: 1, label: "Capital Deployed", sub: "Total funding allocated" },
            { end: 87, suffix: "%", label: "Success Rate", sub: "Traders reaching payout" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="luxury-card rounded-2xl p-6 text-left"
              variants={itemVariants}
              whileHover={{ y: -3 }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {stat.label}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-1 font-heading tabular-nums">
                <AnimatedCounter
                  end={stat.end}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-sm text-muted-foreground">{stat.sub}</div>
              <div className="mt-4 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ChevronDown className="h-5 w-5" style={{ animation: "scroll-hint 2s ease-in-out infinite" }} />
      </motion.div>
    </section>
  );
};

export default Hero;
