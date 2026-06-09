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
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-start sm:items-center gap-2 min-w-0">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                  <span className="font-semibold tracking-wide text-xs sm:text-sm whitespace-nowrap">
                    Trade With Confidence!
                  </span>
                  <span className="opacity-80 text-[11px] sm:text-sm leading-snug sm:truncate">
                    If your payout ever gets rejected, we've got your back. Buy accounts using our code & get support from the Payout Cases team.
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <a
                  href="https://x.com/Payout_cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-glow font-semibold tracking-wide transition-colors text-xs sm:text-sm"
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
