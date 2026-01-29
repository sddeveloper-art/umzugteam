import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RouteMapCalculator from "@/components/RouteMapCalculator";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight } from "lucide-react";

const RouteMap = () => {
  const navigate = useNavigate();

  const handleRouteCalculated = (data: {
    from: { name: string } | null;
    to: { name: string } | null;
    distance: number;
    estimatedPrice: number;
  }) => {
    console.log("Route calculated:", data);
  };

  return (
    <>
      <Helmet>
        <title>Trajet-Rechner | UmzugTeam365</title>
        <meta
          name="description"
          content="Berechnen Sie Ihren Umzugstrajet und erhalten Sie eine Kostenschätzung. Visualisieren Sie die Route auf der Karte."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🗺️ Trajet-Rechner
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Geben Sie Ihren Abholort und Zielort ein, um die Entfernung und
              eine Kostenschätzung für Ihren Umzug zu erhalten.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <RouteMapCalculator onRouteCalculated={handleRouteCalculated} />

            <div className="mt-8 bg-card rounded-xl p-6 border border-border shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Detailliertes Angebot benötigt?
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Unser Preisrechner berücksichtigt Wohnungsgröße, Etage,
                Zusatzleistungen und mehr für eine präzisere Schätzung.
              </p>
              <Button
                variant="accent"
                onClick={() => navigate("/#angebot")}
                className="w-full sm:w-auto"
              >
                <Calculator className="w-4 h-4" />
                Zum Preisrechner
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

export default RouteMap;
