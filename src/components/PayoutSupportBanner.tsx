import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare } from 'lucide-react';

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
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-semibold tracking-wide text-xs sm:text-sm">
                    Trade With Confidence!
                  </span>
                  <span className="opacity-80 text-[11px] sm:text-[13px] leading-snug">
                    If your payout ever gets rejected, we've got your back. Buy accounts using our code &amp; get support from the Payout Cases team.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://x.com/Payout_cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-background/40 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold tracking-wide hover:bg-background/10 transition-colors whitespace-nowrap"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden xs:inline sm:inline">Follow Payout Cases</span>
                  <span className="xs:hidden sm:hidden">Follow</span>
                </a>
                <button
                  aria-label="Close banner"
                  onClick={() => setVisible(false)}
                  className="p-1 rounded hover:bg-background/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5 opacity-70" />
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
