import { motion } from 'framer-motion';
import { useMarket, MARKET_OPTIONS, MarketType } from '@/contexts/MarketContext';
import { toast } from 'sonner';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface MarketToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MarketToggle = ({ className = '', size = 'md' }: MarketToggleProps) => {
  const { market, setMarket } = useMarket();

  const handleChange = (m: MarketType) => {
    if (m === market) return;
    setMarket(m);
    const label = MARKET_OPTIONS.find(o => o.value === m)?.label;
    toast.success(`Switched to ${label} Firms`, { duration: 1800 });
  };

  const sizes = {
    sm: { btn: 'px-4 py-2 text-xs', icon: 'w-3.5 h-3.5' },
    md: { btn: 'px-6 py-2.5 text-sm', icon: 'w-4 h-4' },
    lg: { btn: 'px-8 py-3 text-base', icon: 'w-5 h-5' },
  };

  const active = MARKET_OPTIONS.filter(o => o.value === 'forex' || o.value === 'futures');

  return (
    <div className={`inline-flex p-1 rounded-full bg-card border border-border shadow-[var(--shadow-luxury)] ${className}`}>
      {active.map((opt) => {
        const isOn = market === opt.value;
        const Icon = opt.value === 'forex' ? TrendingUp : BarChart3;
        return (
          <button
            key={opt.value}
            onClick={() => handleChange(opt.value)}
            className={`relative ${sizes[size].btn} font-semibold rounded-full flex items-center gap-2 transition-colors duration-200 tracking-wide`}
            aria-pressed={isOn}
            role="switch"
          >
            {isOn && (
              <motion.div
                layoutId="market-toggle-indicator"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'var(--gradient-gold)',
                  boxShadow: '0 4px 12px -2px hsl(38 42% 50% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.35)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-2 transition-colors ${isOn ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              <Icon className={sizes[size].icon} />
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MarketToggle;
