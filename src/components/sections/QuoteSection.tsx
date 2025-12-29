import QuoteCalculator from "@/components/QuoteCalculator";
import { Calculator, Clock, Shield, ThumbsUp } from "lucide-react";

const QuoteSection = () => {
  return (
    <section id="kostenrechner" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info */}
          <div>
            <span className="inline-block text-accent font-semibold mb-4">
              Kostenrechner
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Berechnen Sie Ihren Umzug In Wenigen Minuten
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nutzen Sie unseren intelligenten Kostenrechner für eine sofortige 
              Preisschätzung. Transparent, unverbindlich und kostenlos.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sofortige Berechnung</h3>
                  <p className="text-muted-foreground text-sm">
                    Erhalten Sie in Sekundenschnelle eine realistische Preisschätzung
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Festpreisgarantie</h3>
                  <p className="text-muted-foreground text-sm">
                    Keine versteckten Kosten - der vereinbarte Preis ist der Endpreis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">100% Unverbindlich</h3>
                  <p className="text-muted-foreground text-sm">
                    Kostenlose Anfrage ohne jegliche Verpflichtung
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Schnelle Rückmeldung</h3>
                  <p className="text-muted-foreground text-sm">
                    Wir melden uns innerhalb von 24 Stunden mit Ihrem persönlichen Angebot
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Calculator */}
          <div>
            <QuoteCalculator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
