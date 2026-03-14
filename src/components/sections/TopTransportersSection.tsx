import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopTransporter {
  id: string;
  company_name: string;
  city: string | null;
  is_verified: boolean;
  completed_deliveries: number;
  logo_url: string | null;
  avg_rating: number | null;
  total_ratings: number | null;
  categories: string[];
}

const TopTransportersSection = () => {
  const { language } = useI18n();
  const de = language === "de";
  const [transporters, setTransporters] = useState<TopTransporter[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("transporters_public")
        .select("*")
        .order("completed_deliveries", { ascending: false })
        .limit(6);
      if (data) setTransporters(data as unknown as TopTransporter[]);
    };
    fetch();
  }, []);

  if (transporters.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {de ? "Top Transporteure" : "Top Transporteurs"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {de ? "Unsere bestbewerteten und aktivsten Umzugspartner" : "Nos partenaires de déménagement les mieux notés et les plus actifs"}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {transporters.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/transporteur/${t.id}`} className="block bg-card rounded-2xl p-6 card-elevated hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {t.logo_url ? (
                      <img src={t.logo_url} alt={t.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Truck className="w-7 h-7 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">{t.company_name}</h3>
                      {t.is_verified && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                    </div>
                    {t.city && <p className="text-sm text-muted-foreground">{t.city}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{t.avg_rating ? Number(t.avg_rating).toFixed(1) : "–"}</span>
                    <span className="text-muted-foreground">({t.total_ratings || 0})</span>
                  </div>
                  <span className="text-muted-foreground">
                    {t.completed_deliveries} {de ? "Aufträge" : "missions"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/transporteure">
            <Button variant="outline" className="group">
              {de ? "Alle Transporteure anzeigen" : "Voir tous les transporteurs"}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopTransportersSection;
