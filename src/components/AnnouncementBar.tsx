const items = [
  "🔥 SuperFunded — Use code PKOFF for 21% off",
  "✅ Quant Tekel — Use code PKOFF for 50% off",
  "⚡ The5ers — No coupon available · Check latest deals",
  "🏆 New firm review added: Aquorex — Read now",
  "⚠️ Hidden rule alert: FTMO trailing drawdown update",
  "💰 Payout proof: Trader received $4,200 from SuperFunded",
];

const AnnouncementBar = () => {
  const loop = [...items, ...items];
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{
        height: 36,
        background:
          "linear-gradient(90deg, #92400e, #b45309, #d97706, #b45309, #92400e)",
      }}
      role="region"
      aria-label="Site announcements"
    >
      <style>{`
        @keyframes pk-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .pk-marquee-track {
          display: flex;
          width: max-content;
          animation: pk-marquee 45s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="pk-marquee-track h-full items-center">
        {loop.map((text, i) => (
          <div key={i} className="flex items-center shrink-0 px-5 h-full">
            <span className="text-white font-medium text-[11px] sm:text-[12px] whitespace-nowrap">
              {text}
            </span>
            <span className="ml-5 text-[#fcd34d] font-bold">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
