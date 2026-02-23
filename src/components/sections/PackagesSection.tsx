import { Link } from "react-router-dom";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import { loc, locArray } from "@/lib/localized";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Zap, Star, Crown };

const PackagesSection = () => {
  const { t, language } = useI18n();
  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="pakete" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">{t("packages.badge")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("packages.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("packages.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const Icon = iconMap[pkg.icon_name] || Zap;
            const features = locArray(pkg, "features", language) as string[];
            const excludedFeatures = locArray(pkg, "excluded_features", language) as string[];
            return (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }} whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`relative bg-card rounded-2xl p-8 flex flex-col transition-shadow ${pkg.is_highlighted ? "ring-2 ring-accent shadow-xl" : "card-elevated"}`}>
                {loc(pkg, "badge", language) && (<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1">{loc(pkg, "badge", language)}</Badge>)}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pkg.is_highlighted ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"}`}><Icon className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-bold text-foreground">{loc(pkg, "name", language)}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                  <p className="text-sm text-muted-foreground mt-1">{loc(pkg, "price_note", language)}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((f: string) => (<li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span className="text-foreground">{f}</span></li>))}
                  {excludedFeatures.map((f: string) => (<li key={f} className="flex items-start gap-2 text-sm opacity-40"><span className="w-4 h-4 flex items-center justify-center text-muted-foreground mt-0.5 flex-shrink-0">—</span><span className="text-muted-foreground line-through">{f}</span></li>))}
                </ul>
                <Button variant={pkg.is_highlighted ? "accent" : "outline"} className="w-full" asChild>
                  <Link to="/angebot-erstellen">{t("packages.cta")}</Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
