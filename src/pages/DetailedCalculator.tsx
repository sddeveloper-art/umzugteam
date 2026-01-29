import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DetailedPriceCalculator from "@/components/DetailedPriceCalculator";
import { Button } from "@/components/ui/button";
import { Map, ArrowRight } from "lucide-react";

const DetailedCalculator = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Detaillierter Preisrechner | UmzugTeam365</title>
        <meta
          name="description"
          content="Berechnen Sie Ihren Umzugspreis basierend auf Ihren Räumen und deren Fläche. Detaillierte Kostenschätzung für Ihren Umzug."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              📦 Detaillierter Preisrechner
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Geben Sie Ihre Räume einzeln ein und erhalten Sie eine präzise
              Kostenschätzung basierend auf der Fläche jedes Raums.
            </p>
          </div>

          <DetailedPriceCalculator />

          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Entfernung visualisieren?
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Nutzen Sie unseren Trajet-Rechner, um die Route auf der Karte zu
                sehen und die geschätzte Fahrtzeit zu erfahren.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/trajet")}
                className="w-full sm:w-auto"
              >
                <Map className="w-4 h-4" />
                Zum Trajet-Rechner
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DetailedCalculator;
