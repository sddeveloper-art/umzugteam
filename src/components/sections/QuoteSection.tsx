import QuoteCalculator from "@/components/QuoteCalculator";
import { Calculator, Clock, Shield, ThumbsUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const QuoteSection = () => {
  const { t } = useI18n();

  return (
    <section id="kostenrechner" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block text-accent font-semibold mb-4">{t("quote.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t("quote.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("quote.subtitle")}</p>
            <div className="space-y-6">
              {[
                { icon: Calculator, title: t("quote.instant"), desc: t("quote.instantDesc") },
                { icon: Shield, title: t("quote.fixed"), desc: t("quote.fixedDesc") },
                { icon: ThumbsUp, title: t("quote.noObligation"), desc: t("quote.noObligationDesc") },
                { icon: Clock, title: t("quote.fastResponse"), desc: t("quote.fastResponseDesc") },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><item.icon className="w-6 h-6 text-accent" /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">{item.title}</h3><p className="text-muted-foreground text-sm">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div><QuoteCalculator /></div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
