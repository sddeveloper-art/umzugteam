import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Truck, Package, Home, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCompetitors, calculateCompetitorPrices, getAverageSavings } from "@/hooks/useCompetitors";

const apartmentSizes = [
  { label: "Studio / 1 Zimmer", volume: 15, basePrice: 299, icon: "🏠" },
  { label: "2 Zimmer (ca. 50m²)", volume: 25, basePrice: 449, icon: "🏡" },
  { label: "3 Zimmer (ca. 75m²)", volume: 35, basePrice: 599, icon: "🏘️" },
  { label: "4 Zimmer (ca. 100m²)", volume: 50, basePrice: 799, icon: "🏢" },
  { label: "5+ Zimmer (ca. 120m²+)", volume: 70, basePrice: 999, icon: "🏰" },
  { label: "Einfamilienhaus", volume: 100, basePrice: 1499, icon: "🏠" },
];

const distances = [
  { label: "Innerhalb der Stadt", km: 15 },
  { label: "Kurzstrecke (bis 50 km)", km: 50 },
  { label: "Mittelstrecke (50-150 km)", km: 100 },
  { label: "Langstrecke (150-400 km)", km: 275 },
  { label: "Fernumzug (400+ km)", km: 500 },
];

const extras = [
  { label: "Ein- und Auspacken", price: "8 €/m³", icon: Package },
  { label: "Möbelmontage", price: "150 € pauschal", icon: Building2 },
  { label: "Stockwerk-Zuschlag (ohne Aufzug)", price: "30 €/Etage", icon: Home },
  { label: "Empfindliches Verpacken", price: "120 € pauschal", icon: Package },
  { label: "Premium-Versicherung", price: "89 € pauschal", icon: Home },
  { label: "Express-Service", price: "199 € pauschal", icon: Truck },
  { label: "Wochenend-Service", price: "149 € pauschal", icon: MapPin },
  { label: "Endreinigung", price: "180 € pauschal", icon: Building2 },
  { label: "Zwischenlagerung (1 Monat)", price: "99 € pauschal", icon: Home },
];

const Preise = () => {
  const { data: competitors = [] } = useCompetitors();

  return (
    <>
      <Helmet>
        <title>Preise & Tarife - UmzugTeam365 | Transparente Umzugspreise</title>
        <meta name="description" content="Unsere transparenten Umzugspreise: Ab 299€ für ein Studio. Festpreisgarantie, keine versteckten Kosten. Jetzt Tarife vergleichen!" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="hero-section text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Unsere Preise & Tarife</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Transparente Festpreise für jeden Umzug. Keine versteckten Gebühren – was Sie sehen, ist was Sie zahlen.
            </p>
          </div>
        </section>

        {/* Base prices grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Grundpreise nach Wohnungsgröße</h2>
              <p className="text-muted-foreground">Startpreise inkl. Transport, Verladen und Entladen</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartmentSizes.map((size) => {
                const totalWithTax = size.basePrice * 1.19;
                const comps = competitors.length > 0
                  ? calculateCompetitorPrices(competitors, totalWithTax, size.basePrice, 0, 0)
                  : [];
                const avgSave = getAverageSavings(comps);

                return (
                  <Card key={size.label} className="card-elevated relative overflow-hidden group">
                    {avgSave > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          ~{avgSave.toFixed(0)}€ günstiger
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="text-3xl mb-2">{size.icon}</div>
                      <CardTitle className="text-lg">{size.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">ca. {size.volume} m³ Volumen</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-sm text-muted-foreground">ab</span>
                        <span className="text-3xl font-bold text-accent">{size.basePrice}</span>
                        <span className="text-muted-foreground">€</span>
                      </div>
                      <p className="text-xs text-muted-foreground">zzgl. Entfernung & Extras • inkl. MwSt.: {totalWithTax.toFixed(0)} €</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Distance pricing */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Entfernungskosten</h2>
              <p className="text-muted-foreground">1,50 € pro Kilometer – fair und transparent</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl overflow-hidden card-elevated">
                {distances.map((d, i) => (
                  <div
                    key={d.label}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i < distances.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">{d.label}</p>
                        <p className="text-xs text-muted-foreground">~{d.km} km</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{(d.km * 1.5).toFixed(0)} €</p>
                      <p className="text-xs text-muted-foreground">Entfernungszuschlag</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Extras */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Zusatzleistungen</h2>
              <p className="text-muted-foreground">Optionale Services für Ihren Komfort</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {extras.map((extra) => {
                const Icon = extra.icon;
                return (
                  <Card key={extra.label} className="card-elevated text-center p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{extra.label}</h3>
                    <p className="text-accent font-bold">{extra.price}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Payment info */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 card-elevated text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Zahlungsinformationen</h3>
              <p className="text-muted-foreground mb-4">Bequem per Banküberweisung bezahlen</p>
              <div className="bg-muted rounded-xl p-4 inline-block">
                <p className="text-sm text-muted-foreground mb-1">IBAN</p>
                <p className="text-lg font-bold text-accent tracking-wider">BE54 6500 7175 7997</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Bitte geben Sie Ihre Angebotsnummer als Verwendungszweck an.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ihren persönlichen Preis berechnen</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Nutzen Sie unseren Kostenrechner für eine sofortige, unverbindliche Preisschätzung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg">
                <Link to="/#kostenrechner">
                  Kostenrechner öffnen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/preisvergleich">Preisvergleich ansehen</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Preise;
