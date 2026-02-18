import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/hooks/useI18n";

const Reviews = () => {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews = [], refetch } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews_public" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Array<{ id: string; client_name: string; rating: number; comment: string | null; city: string | null; created_at: string; is_approved: boolean }>;
    },
  });

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({ client_name: name, client_email: email, rating, comment, city });
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else {
      toast({ title: t("reviews.thankYou"), description: t("reviews.thankYouDesc") });
      setName(""); setEmail(""); setRating(5); setComment(""); setCity("");
      refetch();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "–";

  return (
    <>
      <Helmet>
        <title>{t("reviews.title")} – UmzugTeam365</title>
        <link rel="canonical" href="https://umzugteam365.de/bewertungen" />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">{t("reviews.badge")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("reviews.title")}</h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-6 h-6 ${Number(avgRating) >= s ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">{avgRating}</span>
              <span className="text-muted-foreground">({reviews.length} {t("reviews.reviewsCount")})</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t("reviews.noReviews")}</p>
              ) : (
                reviews.map((r, i) => (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl p-5 card-elevated">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-foreground">{r.client_name}</span>
                        {r.city && <span className="text-xs text-muted-foreground ml-2">· {r.city}</span>}
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${r.rating >= s ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString("de-DE")}</p>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 card-elevated h-fit sticky top-32">
              <h2 className="text-lg font-bold text-foreground mb-4">{t("reviews.submitTitle")}</h2>
              <form onSubmit={submitReview} className="space-y-3">
                <div><Label>{t("reviews.name")} *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div><Label>{t("reviews.email")} *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div><Label>{t("reviews.city")}</Label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("common.egBerlin")} /></div>
                <div>
                  <Label>{t("reviews.rating")} *</Label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
                        <Star className={`w-7 h-7 transition-colors ${(hoverRating || rating) >= s ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div><Label>{t("reviews.comment")}</Label><Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} /></div>
                <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
                  {submitting ? t("reviews.submitting") : t("reviews.submit")}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Reviews;
