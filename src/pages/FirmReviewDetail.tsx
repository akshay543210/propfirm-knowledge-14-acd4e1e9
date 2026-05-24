import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, User, Calendar, DollarSign, TrendingUp, Award, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PropFirm } from "@/types/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WriteReviewForm from "@/components/WriteReviewForm";
import { useReviews } from "@/hooks/useSupabaseData";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
        document.title = `${data.name} Reviews | PropFirm Knowledge`;
      } catch (error) {
        console.error('Error fetching firm:', error);
      } finally { setLoading(false); }
    };
    fetchFirm();
  }, [slug, navigate]);

  useEffect(() => {
    if (!firm?.id) return;
    const channel = supabase.channel('firm-reviews').on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'reviews', filter: `firm_id=eq.${firm.id}` },
      () => window.location.reload()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [firm?.id]);

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`} />
  ));

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen luxury-bg">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <div className="container mx-auto px-4 pt-56 sm:pt-36 pb-6 md:pb-12 max-w-7xl">{children}</div>
      <Footer />
    </div>
  );

  if (loading || reviewsLoading) return <Shell><div className="text-center text-muted-foreground py-20">Loading...</div></Shell>;
  if (!firm) return <Shell><div className="text-center text-destructive py-20">Firm not found</div></Shell>;

  const stats = [
    { icon: DollarSign, label: 'Funding', value: firm.funding_amount, sub: firm.max_funding ? `Max: ${firm.max_funding}` : null },
    { icon: TrendingUp, label: 'Profit Split', value: `${firm.profit_split}%`, sub: null },
    { icon: Zap, label: 'Payout Rate', value: `${firm.payout_rate}%`, sub: null },
    { icon: DollarSign, label: 'Starting Fee', value: `$${firm.starting_fee}`, sub: firm.coupon_code ? `Code: ${firm.coupon_code}` : null },
  ];

  return (
    <Shell>
      <Link to="/reviews" className="inline-flex items-center text-primary-deep hover:text-primary mb-6 transition-colors font-medium">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reviews
      </Link>

      {/* Firm Header */}
      <div className="luxury-card rounded-2xl overflow-hidden mb-8">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-muted border-2 border-primary/30 flex items-center justify-center flex-shrink-0 shadow-md">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-2" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (<div className="w-12 h-12 rounded-lg bg-muted-foreground/20" />)}
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">{firm.name}</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(Number(calculateAverageRating()))}</div>
                  <span className="text-foreground font-bold text-lg md:text-xl tabular-nums">{calculateAverageRating()}</span>
                  <span className="text-muted-foreground text-sm md:text-base">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                </div>
                <Badge className="bg-primary/15 text-primary-deep border border-primary/40 text-sm font-semibold">
                  <Award className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {firm.trust_rating}/10 Trust Score
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border-2 border-border hover:border-primary/50 transition-all hover:shadow-[var(--shadow-luxury)]">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">{s.label}</span>
                </div>
                <div className="text-foreground font-bold text-lg md:text-xl font-heading tabular-nums">{s.value}</div>
                {s.sub && <div className="text-primary-deep text-xs mt-1 font-medium">{s.sub}</div>}
              </div>
            ))}
          </div>

          {(firm.platform || firm.evaluation_model || firm.regulation) && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {firm.platform && (<div><span className="text-muted-foreground">Platform:</span> <span className="text-foreground ml-2 font-semibold">{firm.platform}</span></div>)}
                {firm.evaluation_model && (<div><span className="text-muted-foreground">Evaluation:</span> <span className="text-foreground ml-2 font-semibold">{firm.evaluation_model}</span></div>)}
                {firm.regulation && (<div><span className="text-muted-foreground">Regulation:</span> <span className="text-foreground ml-2 font-semibold">{firm.regulation}</span></div>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-8">
        <Button onClick={() => setShowWriteReview(true)} className="btn-gold px-8 py-3 text-base font-semibold rounded-xl h-12">
          <Star className="h-4 w-4 mr-2" /> Write a Review
        </Button>
      </div>

      {/* Reviews */}
      <div className="luxury-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> User Reviews ({reviews.length})
          </h2>
        </div>
        <div className="p-6">
          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'var(--gradient-gold)' }}>
                        <User className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground font-bold text-base md:text-lg">{review.reviewer_name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        {review.title && <h4 className="text-primary-deep font-semibold text-sm md:text-base mt-1">{review.title}</h4>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm sm:ml-auto flex-shrink-0">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-sm md:text-base mb-4 ml-0 sm:ml-14">{review.content}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-3 flex-wrap mt-4 ml-0 sm:ml-14">
                      {review.images.map((url, idx) => (
                        <img key={idx} src={url} alt={`Review ${idx + 1}`} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-md border border-border" onClick={() => window.open(url, '_blank')} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                <Star className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-base md:text-lg">No reviews yet. Be the first to review {firm.name}!</p>
            </div>
          )}
        </div>
      </div>

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

export default FirmReviewDetail;
