import { Link } from "react-router-dom";
import { TrendingDown, Award, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompetitors, calculateCompetitorPrices, getMaxSavings, getAverageSavings } from "@/hooks/useCompetitors";

// Representative example for display
const SAMPLE_BASE = 449;
const SAMPLE_DIST = 120;
const SAMPLE_FLOOR = 60;
const SAMPLE_OUR = (SAMPLE_BASE + SAMPLE_DIST + SAMPLE_FLOOR) * 1.19;

const PriceComparisonSection = () => {
  const { data: competitors = [] } = useCompetitors();

  const comparisons = calculateCompetitorPrices(competitors, SAMPLE_OUR, SAMPLE_BASE, SAMPLE_DIST, SAMPLE_FLOOR);
  const maxSaving = getMaxSavings(comparisons);
  const avgSaving = getAverageSavings(comparisons);

  if (comparisons.length === 0) return null;

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
            <Award className="w-3 h-3 mr-1" />
            Preisgarantie
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Günstigster Umzugsservice – Garantiert
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vergleichen Sie unsere Preise in Echtzeit mit der Konkurrenz. Wir sind im Durchschnitt{" "}
            <span className="font-bold text-accent">{avgSaving.toFixed(0)} € günstiger</span>.
          </p>
        </div>

        {/* Live comparison cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {comparisons.slice(0, 3).map((comp, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 card-elevated relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-bl-full" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{comp.competitorName}</p>
                  <p className="text-xs text-muted-foreground">Marktpreis</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground line-through opacity-60">
                    {comp.price.toFixed(0)} €
                  </p>
                  <p className="text-sm text-muted-foreground">inkl. MwSt.</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="mb-1">
                    <TrendingDown className="w-3 h-3 mr-1 rotate-180" />
                    +{comp.savingsPercent.toFixed(0)}% teurer
                  </Badge>
                  <p className="text-xs text-destructive font-medium">
                    +{comp.savings.toFixed(0)} € Mehrkosten
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Our price highlight */}
        <div className="bg-card rounded-2xl p-8 border-2 border-accent card-elevated max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Unser Preis</span>
          </div>
          <p className="text-4xl font-bold text-accent mb-2">{SAMPLE_OUR.toFixed(0)} €</p>
          <p className="text-muted-foreground mb-4">
            für einen 2-Zimmer-Umzug über 80 km
          </p>
          {maxSaving && (
            <p className="text-sm text-foreground mb-6">
              Sparen Sie bis zu <span className="font-bold text-accent">{maxSaving.savings.toFixed(0)} €</span>{" "}
              gegenüber {maxSaving.competitorName}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="accent" size="lg">
              <Link to="/#kostenrechner">
                Jetzt Preis berechnen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/preisvergleich">
                Vollständiger Vergleich
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparisonSection;
