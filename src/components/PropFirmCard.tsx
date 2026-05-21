import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";
import { useImageLazyLoad } from "@/hooks/useImageLazyLoad";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { Star, ArrowUpRight } from "lucide-react";
import { memo } from "react";

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = memo(({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();
  const { imgRef, imageSrc, isLoading } = useImageLazyLoad(firm.logo_url || '');

  const discount = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);
  const n = {
    review_score: firm.review_score || 0,
    trust_rating: firm.trust_rating || 0,
    platform: firm.platform || '—',
    features: firm.features?.slice(0, 3) || [],
    coupon_code: firm.coupon_code || '',
  };

  const handleBuyNow = () => firm.affiliate_url && window.open(firm.affiliate_url, '_blank');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <div className="h-full flex flex-col luxury-card light-sweep rounded-2xl overflow-hidden">
        {/* Top gold hairline */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              {firm.logo_url && (
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={`${firm.name} logo`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                  />
                  {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-bold text-foreground line-clamp-1 font-heading tracking-tight">{firm.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground tabular-nums">{n.review_score.toFixed(1)} · {firm.user_review_count || 0} reviews</span>
                </div>
              </div>
            </div>
            {n.trust_rating >= 8 && <VerifiedBadge />}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-foreground tabular-nums font-heading">${firm.price}</span>
            <span className="text-sm text-muted-foreground line-through tabular-nums">${firm.original_price}</span>
            {discount > 0 && (
              <Badge className="bg-primary/15 text-primary-deep border-primary/30 text-[10px] font-semibold tracking-wide">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Coupon */}
          {n.coupon_code && (
            <div className="rounded-lg border border-primary/25 bg-gradient-to-r from-primary/5 to-transparent p-2.5">
              <div className="text-[9px] uppercase tracking-[0.16em] text-primary-deep font-semibold">Coupon</div>
              <div className="text-sm font-bold text-foreground tabular-nums">{n.coupon_code}</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-5 flex-1">
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-border">
            {[
              { label: "Funding", value: firm.funding_amount },
              { label: "Profit Split", value: `${firm.profit_split}%` },
              { label: "Payout", value: `${firm.payout_rate}%` },
              { label: "Trust", value: `${n.trust_rating}/10` },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-0.5">{stat.label}</div>
                <div className="text-sm font-bold text-foreground tabular-nums">{stat.value}</div>
              </div>
            ))}
          </div>

          {n.features.length > 0 && (
            <ul className="py-4 space-y-1.5">
              {n.features.map((f, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">◆</span>
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-3 mt-auto space-y-2">
          <Button
            size="sm"
            className="w-full btn-gold text-[13px] font-semibold rounded-lg h-10"
            onClick={handleBuyNow}
          >
            Buy Now
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted hover:border-primary/40 text-[13px] rounded-lg h-9"
            onClick={() => navigate(`/${firm.slug}/reviews`)}
          >
            Full Review
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

PropFirmCard.displayName = 'PropFirmCard';

export default PropFirmCard;
