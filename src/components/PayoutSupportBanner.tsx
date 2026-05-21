import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

const PayoutSupportBanner = () => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="w-full bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <span className="font-semibold tracking-wide">Trade With Confidence.</span>
                  <span className="opacity-80 ml-1.5 hidden sm:inline">Institutional-grade payout protection from our Payout Cases team.</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/Payout_cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary-glow font-semibold tracking-wide transition-colors"
                >
                  Follow Payout Cases
                  <span aria-hidden>→</span>
                </a>
                <button
                  aria-label="Close banner"
                  onClick={() => setVisible(false)}
                  className="p-1 rounded hover:bg-background/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PayoutSupportBanner;
