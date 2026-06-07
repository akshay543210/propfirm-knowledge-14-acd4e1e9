import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Star, ArrowLeft, User, Calendar, ShieldCheck, AlertTriangle,
  CheckCircle2, XCircle, Info, Newspaper, Bot, Copy, Layers,
  TrendingUp, DollarSign, Timer, Award, Sparkles, BadgeCheck,
  Wallet, ClipboardCheck, AlertOctagon, Flame
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropFirm } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteReviewForm from "@/components/WriteReviewForm";
import { useReviews } from "@/hooks/useSupabaseData";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StatusTone = "ok" | "warn" | "bad";
const toneClasses: Record<StatusTone, string> = {
  ok: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-700 border-amber-500/40",
  bad: "bg-red-500/10 text-red-700 border-red-500/30",
};
const toneDot: Record<StatusTone, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
};

const FirmReviewDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const { reviews, loading: reviewsLoading } = useReviews(firm?.id);

  useEffect(() => {
    const fetchFirm = async () => {
      if (!slug) return;
      if (UUID_REGEX.test(slug)) {
        const { data } = await supabase.from('prop_firms').select('slug').eq('id', slug).single();
        if (data?.slug) { navigate(`/${data.slug}/reviews`, { replace: true }); return; }
      }
      try {
        const { data, error } = await supabase.from('prop_firms').select('*').eq('slug', slug).single();
        if (error) throw error;
        setFirm(data as any);
        document.title = `${data.name} Review — Rules, Payouts & Trader Reports | PropFirm Knowledge`;
      } catch (error) {
        console.error('Error fetching firm:', error);
      } finally { setLoading(false); }
    };
    fetchFirm();
  }, [slug, navigate]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return Number(firm?.review_score ?? 0);
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  }, [reviews, firm?.review_score]);

  const renderStars = (rating: number, size = "h-4 w-4") => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`${size} ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`} />
  ));

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen luxury-bg">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <div className="container mx-auto px-4 pt-56 sm:pt-36 pb-12 max-w-6xl">{children}</div>
      <Footer />
    </div>
  );

  if (loading || reviewsLoading) return <Shell><div className="text-center text-muted-foreground py-20">Loading...</div></Shell>;
  if (!firm) return <Shell><div className="text-center text-destructive py-20">Firm not found</div></Shell>;

  const discountPct = firm.original_price && firm.starting_fee && firm.original_price > firm.starting_fee
    ? Math.round((1 - firm.starting_fee / firm.original_price) * 100)
    : null;

  return (
    <Shell>
      <Link to="/reviews" className="inline-flex items-center text-primary-deep hover:text-primary mb-6 transition-colors font-medium text-sm">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reviews
      </Link>

      {/* ========== FIRM HEADER ========== */}
      <div className="luxury-card rounded-2xl overflow-hidden mb-6">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="p-5 md:p-7">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-muted border-2 border-primary/30 flex items-center justify-center flex-shrink-0 shadow-md">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-2" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (<div className="w-12 h-12 rounded-lg bg-muted-foreground/20" />)}
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight mb-2">{firm.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="flex">{renderStars(avgRating)}</div>
                    <span className="text-foreground font-bold tabular-nums">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">· {reviews.length} reviews</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="bg-emerald-500/15 text-emerald-700 border border-emerald-500/40 text-xs"><span className={`w-1.5 h-1.5 rounded-full ${toneDot.ok} mr-1.5`} />Active</Badge>
                    {firm.regulation && <Badge className="bg-primary/15 text-primary-deep border border-primary/40 text-xs"><ShieldCheck className="h-3 w-3 mr-1" />{firm.regulation}</Badge>}
                    {firm.year_established && <Badge variant="outline" className="text-xs border-border text-muted-foreground">Founded {firm.year_established}</Badge>}
                    <Badge className="bg-primary/15 text-primary-deep border border-primary/40 text-xs"><Award className="h-3 w-3 mr-1" />{firm.trust_rating}/10 Trust</Badge>
                  </div>
                </div>
                {/* Price */}
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-heading font-bold text-primary tabular-nums">
                    ${firm.starting_fee ?? firm.price}
                  </div>
                  {firm.original_price && firm.starting_fee && firm.original_price > firm.starting_fee && (
                    <div className="text-sm text-muted-foreground line-through tabular-nums">${firm.original_price}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">starting fee</div>
                </div>
              </div>

              {/* Meta line */}
              <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5">
                {firm.platform && <div><span className="text-foreground/60">Platforms:</span> <span className="text-foreground font-medium">{firm.platform}</span></div>}
                {firm.evaluation_model && <div><span className="text-foreground/60">Evaluation:</span> <span className="text-foreground font-medium">{firm.evaluation_model}</span></div>}
                {firm.brand && <div><span className="text-foreground/60">Broker partner:</span> <span className="text-foreground font-medium">{firm.brand}</span></div>}
              </div>
            </div>
          </div>

          {/* Coupon */}
          {firm.coupon_code && (
            <div className="mt-5 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Coupon Code</div>
                <div className="font-mono text-lg font-bold text-primary-deep tracking-wider">{firm.coupon_code}</div>
              </div>
              {discountPct && (
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold text-emerald-600">{discountPct}% off</div>
                  <div className="text-xs text-muted-foreground">Apply at checkout</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========== STAT CARDS ========== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { icon: DollarSign, label: "Funding Range", value: firm.funding_amount, sub: firm.max_funding ? `up to ${firm.max_funding}` : null },
          { icon: TrendingUp, label: "Profit Split", value: `${firm.profit_split}%`, sub: "to trader" },
          { icon: Sparkles, label: "Payout Rate", value: `${firm.payout_rate}%`, sub: "first payout" },
          { icon: Timer, label: "Payout Cycle", value: "14 days", sub: "after first trade" },
        ].map((s, i) => (
          <div key={i} className="luxury-card rounded-xl p-4 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{s.label}</span>
            </div>
            <div className="text-foreground font-heading font-bold text-xl md:text-2xl tabular-nums">{s.value}</div>
            {s.sub && <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* ========== TABS ========== */}
      <Tabs defaultValue="evaluation" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-card border border-border p-1 rounded-xl mb-6 h-auto flex-wrap">
          <TabsTrigger value="evaluation" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-deep data-[state=active]:shadow-none rounded-lg px-4 py-2 text-sm font-semibold">Evaluation rules</TabsTrigger>
          <TabsTrigger value="funded" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-deep data-[state=active]:shadow-none rounded-lg px-4 py-2 text-sm font-semibold">Funded stage</TabsTrigger>
          <TabsTrigger value="payout" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-deep data-[state=active]:shadow-none rounded-lg px-4 py-2 text-sm font-semibold">Payout rules</TabsTrigger>
          <TabsTrigger value="hidden" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-deep data-[state=active]:shadow-none rounded-lg px-4 py-2 text-sm font-semibold">Hidden rules</TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary-deep data-[state=active]:shadow-none rounded-lg px-4 py-2 text-sm font-semibold">Reviews</TabsTrigger>
        </TabsList>

        {/* ----- Tab 1: Evaluation rules ----- */}
        <TabsContent value="evaluation" className="space-y-5 mt-0">
          <div className="grid md:grid-cols-2 gap-5">
            <SectionCard title="Phase targets" icon={TrendingUp}>
              <RuleRow label="Profit target" value="10%" sub="$5k-$200k accounts" />
              <RuleRow label="Max daily loss" value="5%" sub="from starting balance" />
              <RuleRow label="Max total drawdown" value="10%" sub="trailing or static" />
              <RuleRow label="Min trading days" value="5 days" />
              <RuleRow label="Time limit" value="Unlimited" sub="to complete challenge" />
            </SectionCard>

            <SectionCard title="Restrictions" icon={ShieldCheck}>
              <RestrictionRow icon={Newspaper} label="News trading" tone="bad" status="Restricted" sub="±2 min before/after" />
              <RestrictionRow icon={Calendar} label="Weekend holds" tone="ok" status="Allowed" sub="with caution" />
              <RestrictionRow icon={Bot} label="EAs / bots" tone="ok" status="Allowed" />
              <RestrictionRow icon={Copy} label="Copy trading" tone="warn" status="Only prop copy allowed" />
              <RestrictionRow icon={Layers} label="Hedging" tone="bad" status="Internal only" />
            </SectionCard>
          </div>

          <SectionCard title="Step-by-step process" icon={ClipboardCheck}>
            <ol className="space-y-3">
              {[
                "Buy a challenge — choose account size (5k-200k) and one-step or two-step evaluation.",
                "Trade the evaluation — hit profit target without breaching daily (5%) or total (10%) drawdown.",
                "Pass the evaluation — usually 5-10% profit target with same risk rules.",
                "Identity verification — submit ID documents via KYC portal.",
                "Receive funded account credentials on official or broker scale.",
                "Trade the funded account; first payout after 14 days of activity.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 text-primary-deep font-bold text-sm flex items-center justify-center border border-primary/40">{i + 1}</span>
                  <span className="text-sm text-foreground/85 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <InfoBanner>One-step plan is available on select account sizes only. Check the pricing page for which sizes qualify.</InfoBanner>
        </TabsContent>

        {/* ----- Tab 2: Funded stage ----- */}
        <TabsContent value="funded" className="space-y-5 mt-0">
          <div className="grid md:grid-cols-2 gap-5">
            <SectionCard title="Risk rules (funded)" icon={AlertOctagon}>
              <RuleRow label="Daily loss limit" value="5%" sub="from end-of-day balance" />
              <RuleRow label="Max drawdown" value="10%" sub="from scaling balance" />
              <RuleRow label="Lot size cap" value="No cap" sub="risk-based limits apply" />
              <RuleRow label="Banned instruments" value="None listed" />
              <RuleRow label="Min active days" value="5 days" />
            </SectionCard>

            <SectionCard title="Scaling plan" icon={TrendingUp}>
              <RuleRow label="Scaling available" value="Yes" tone="ok" />
              <RuleRow label="Max account size" value="$2M" sub="after 4 successful payouts" />
              <RuleRow label="Scale trigger" value="10% profit" sub="over 3 months" />
              <RuleRow label="Scale increment" value="+25% balance" sub="each scale" />
            </SectionCard>
          </div>

          <SectionCard title="Monitored behaviors" icon={Flame}>
            <div className="space-y-3">
              <Alert tone="bad" title="Account-flagging behaviors">
                Inconsistent trading patterns, strategy changes between phases, or exploiting pricing errors may be reviewed and closed without payout.
              </Alert>
              <Alert tone="warn" title="Caution items">
                Using the same strategy on another trader on the same drawdown arc (potentially copy trading) may trigger a group ban for coordinated trading.
              </Alert>
              <Alert tone="ok" title="What's allowed">
                EAs and automated strategies are allowed as long as you are the sole operator. No third-party signal subscriptions.
              </Alert>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ----- Tab 3: Payout rules ----- */}
        <TabsContent value="payout" className="space-y-5 mt-0">
          <SectionCard title="Payout requirements" icon={Wallet}>
            <div className="divide-y divide-border">
              <PayoutRow label="First payout eligibility" value="14 days after first trade" />
              <PayoutRow label="Subsequent payouts" value="Every 14 days" />
              <PayoutRow label="Min payout amount" value="$50" />
              <PayoutRow label="Profit split" value={`${firm.profit_split}% Trader / ${100 - firm.profit_split}% Firm`} />
              <PayoutRow label="Payout methods" value="Crypto (USDT, USDC), Wire, Rise" />
              <PayoutRow label="Processing time" value="1-3 business days" />
              <PayoutRow label="Consistency rule" value="Soft — best day ≤ 40-50% of total profit" />
            </div>
          </SectionCard>

          <div className="grid md:grid-cols-2 gap-5">
            <SectionCard title="Payout checklist" icon={ClipboardCheck}>
              <ul className="space-y-2.5">
                {[
                  "14-day exposure met after first trade",
                  "No open drawdown breaches",
                  "Account not under review",
                  "KYC documents verified",
                  "Payout method properly set up",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Payout flags" icon={AlertTriangle}>
              <div className="space-y-3">
                <Alert tone="bad" title="Payout denial: single-day trading">
                  Payouts denied if best single day exceeds 40-50% of total profits (consistency rule).
                </Alert>
                <Alert tone="warn" title="Withdrawals may be delayed">
                  KYC mismatch or unusual win-rate trends may trigger an internal review.
                </Alert>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* ----- Tab 4: Hidden rules ----- */}
        <TabsContent value="hidden" className="space-y-4 mt-0">
          {[
            { title: "Consistency rule (soft)", body: "Your single best trading day should not represent more than ~40-50% of your total withdrawal amount. SuperFunded doesn't always state this clearly — but accounts with one huge day and little else have historically had payouts delayed or reduced for 'review'." },
            { title: "Strategy must match between phases", body: "Traders who use one strategy during the challenge and switch to a completely different approach on the funded account have been flagged. Practice consistent style across both phases." },
            { title: "News trading window", body: "Trading during the ±2 minute window before/after major scheduled news (NFP, FOMC, CPI) is restricted. Violations can void trades or close accounts. Stay clear of the group's published events." },
            { title: "Group / coordinated trading ban", body: "If multiple flagged accounts are running identical trades on identical times (suspected copy/EA scheme), all accounts in the 'group' can be terminated. This affects traders using popular signal channels." },
            { title: "Trailing drawdown on some plans", body: "The 10% drawdown is not always static — on some account types it trails your peak balance. This means if you drop ~10% from your highest balance, you breach. Check the plan terms carefully." },
          ].map((rule, i) => (
            <div key={i} className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4 md:p-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1.5">{rule.title}</h4>
                  <p className="text-sm text-foreground/75 leading-relaxed">{rule.body}</p>
                </div>
              </div>
            </div>
          ))}
          <InfoBanner>These rules are sourced from trader reports, ToS deep-reads, and community feedback — not always documented on the main marketing page. Always read the full ToS before trading.</InfoBanner>
        </TabsContent>

        {/* ----- Tab 5: Reviews ----- */}
        <TabsContent value="reviews" className="space-y-4 mt-0">
          {reviews.length === 0 ? (
            <div className="luxury-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-5">No reviews yet. Be the first to share your experience with {firm.name}.</p>
              <Button onClick={() => setShowWriteReview(true)} className="btn-gold rounded-xl h-11 px-6 font-semibold">
                <Star className="h-4 w-4 mr-2" /> Write a Review
              </Button>
            </div>
          ) : (
            <>
              {reviews.map((review) => {
                const initials = (review.reviewer_name || "??").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <div key={review.id} className="luxury-card rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-primary-foreground shadow-md" style={{ background: 'var(--gradient-gold)' }}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <div>
                            <div className="font-bold text-foreground">{review.reviewer_name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(review.created_at!).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                              {review.is_verified && <><span>·</span><BadgeCheck className="h-3 w-3 text-primary" />Verified</>}
                            </div>
                          </div>
                          <div className="flex">{renderStars(review.rating, "h-3.5 w-3.5")}</div>
                        </div>
                        {review.title && <h4 className="text-primary-deep font-semibold text-sm mt-2">{review.title}</h4>}
                        <p className="text-sm text-foreground/80 leading-relaxed mt-2">{review.content}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-3">
                            {review.images.map((url, idx) => (
                              <img key={idx} src={url} alt={`Review ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all shadow-sm border border-border" onClick={() => window.open(url, '_blank')} loading="lazy" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="text-center pt-4">
                <Button onClick={() => setShowWriteReview(true)} className="btn-gold rounded-xl h-11 px-6 font-semibold">
                  <Star className="h-4 w-4 mr-2" /> Write a Review
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <WriteReviewForm firmId={firm.id} firmName={firm.name} onClose={() => setShowWriteReview(false)} />
          </div>
        </div>
      )}
    </Shell>
  );
};

/* ============ helpers ============ */

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="luxury-card rounded-2xl overflow-hidden">
    <div className="px-5 py-3.5 border-b border-border flex items-center gap-2 bg-muted/30">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const RuleRow = ({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: StatusTone }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="text-right">
      <div className={`font-bold tabular-nums text-sm ${tone === "ok" ? "text-emerald-600" : "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground/70">{sub}</div>}
    </div>
  </div>
);

const RestrictionRow = ({ icon: Icon, label, status, tone, sub }: { icon: any; label: string; status: string; tone: StatusTone; sub?: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </div>
    <div className="text-right">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${toneClasses[tone]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${toneDot[tone]}`} />
        {status}
      </span>
      {sub && <div className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</div>}
    </div>
  </div>
);

const PayoutRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-foreground text-right">{value}</span>
  </div>
);

const Alert = ({ tone, title, children }: { tone: StatusTone; title: string; children: React.ReactNode }) => {
  const Icon = tone === "ok" ? CheckCircle2 : tone === "warn" ? AlertTriangle : XCircle;
  return (
    <div className={`rounded-lg border-2 p-3.5 ${toneClasses[tone]}`}>
      <div className="flex gap-2.5">
        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm mb-1">{title}</div>
          <div className="text-xs leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
};

const InfoBanner = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-3 flex gap-2.5 text-sm text-foreground/80">
    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
    <span>{children}</span>
  </div>
);

export default FirmReviewDetail;
