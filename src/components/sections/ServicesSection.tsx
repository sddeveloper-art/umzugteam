import {
  Truck, Package, Warehouse, Sparkles, Shield,
  Building, Piano, Sofa, ShieldCheck, PackageCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Truck, Package, Warehouse, Sparkles, Shield,
  Building, Piano, Sofa, ShieldCheck, PackageCheck,
};

const ServicesSection = () => {
  const { t } = useI18n();
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="leistungen" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">{t("services.badge")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("services.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Truck;
            const features = (service.features as string[] | null) || [];
            return (
              <article key={service.id} className="bg-card rounded-2xl p-8 card-elevated animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6"><Icon className="w-7 h-7 text-accent" /></div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {features.map((feature: string) => (<li key={feature} className="flex items-center gap-2 text-sm text-foreground/80"><Shield className="w-4 h-4 text-accent flex-shrink-0" />{feature}</li>))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-20 bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15.000+", label: t("services.stat1") },
              { value: "98%", label: t("services.stat2") },
              { value: "25+", label: t("services.stat3") },
              { value: "24/7", label: t("services.stat4") },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
