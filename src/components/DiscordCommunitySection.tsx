import { motion } from "framer-motion";
import { Radio, MessageSquare, ClipboardList, Trophy } from "lucide-react";
import discordImg from "@/assets/discord-3d-gold.png";

const pills = [
  { icon: Radio, label: "Prop Firm Alerts" },
  { icon: MessageSquare, label: "Community Chat" },
  { icon: ClipboardList, label: "Daily Trade Plans" },
  { icon: Trophy, label: "Payout Proof Drops" },
];

const DiscordIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.073.073 0 0 0-.073-.035 19.736 19.736 0 0 0-3.76 1.369.066.066 0 0 0-.03.027C2.62 8.045 1.97 11.6 2.29 15.112a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.073.073 0 0 0 .079-.027 14.2 14.2 0 0 0 1.226-1.994.072.072 0 0 0-.04-.1 13.1 13.1 0 0 1-1.872-.892.073.073 0 0 1-.007-.121c.126-.094.252-.192.371-.291a.07.07 0 0 1 .074-.01c3.927 1.793 8.18 1.793 12.061 0a.07.07 0 0 1 .075.009c.12.099.245.198.372.292a.073.073 0 0 1-.006.121 12.3 12.3 0 0 1-1.873.891.073.073 0 0 0-.039.101c.36.698.772 1.363 1.225 1.993a.072.072 0 0 0 .079.028 19.84 19.84 0 0 0 6.002-3.03.073.073 0 0 0 .031-.055c.5-4.063-.838-7.585-3.548-10.717a.058.058 0 0 0-.03-.028zM8.02 13.001c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const DiscordCommunitySection = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0a0f1e" }}
    >
      {/* Subtle gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0) 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 items-center">
          {/* Image — first on mobile, right on desktop */}
          <div className="order-1 md:order-2 md:col-span-2 relative flex justify-center md:justify-end">
            <div className="relative">
              <div
                className="absolute inset-0 m-auto rounded-full blur-3xl opacity-30 bg-yellow-400"
                style={{ width: 380, height: 380 }}
                aria-hidden
              />
              <motion.img
                src={discordImg}
                alt="Discord community"
                loading="lazy"
                initial={{ rotate: -5, y: 10, opacity: 0 }}
                whileInView={{ rotate: -5, y: 0, opacity: 1 }}
                whileHover={{ rotate: 2, scale: 1.03 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[480px] h-auto drop-shadow-[0_25px_60px_rgba(245,158,11,0.35)]"
              />
            </div>
          </div>

          {/* Text — second on mobile, left on desktop */}
          <div className="order-2 md:order-1 md:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: "#c4b5fd" }}>
              Community
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#ffffff" }}>
              <span style={{ color: "#ffffff" }}>Join Our Traders Community on</span>{" "}
              <span style={{ color: "#f59e0b" }}>Discord</span>
            </h2>
            <p className="mt-5 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
              Get real-time prop firm alerts, payout proof, hidden rule warnings,
              and trader support — all in one place.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {pills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm font-medium"
                  style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "#f59e0b" }} />
                  <span style={{ color: "#ffffff" }}>{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <motion.a
                href="https://discord.com/invite/7MRsuqqT3n"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-bold text-[15px] shadow-[0_10px_30px_-8px_rgba(245,158,11,0.6)]"
                style={{ backgroundColor: "#f59e0b", color: "#1a1208" }}
              >
                <DiscordIcon className="h-5 w-5" />
                Join the Community
              </motion.a>
              <p className="mt-3 text-xs text-white/50">
                Free to join · 5,000+ traders
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscordCommunitySection;
