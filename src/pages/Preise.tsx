import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Truck, Package, Home, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCompetitors, calculateCompetitorPrices, getAverageSavings } from "@/hooks/useCompetitors";
import { useI18n } from "@/hooks/useI18n";

const apartmentSizes = [
  { label: "Studio / 1 Zimmer", volume: 15, basePrice: 299, icon: "🏠" },
  { label: "2 Zimmer (ca. 50m²)", volume: 25, basePrice: 449, icon: "🏡" },
  { label: "3 Zimmer (ca. 75m²)", volume: 35, basePrice: 599, icon: "🏘️" },
  { label: "4 Zimmer (ca. 100m²)", volume: 50, basePrice: 799, icon: "🏢" },
  { label: "5+ Zimmer (ca. 120m²+)", volume: 70, basePrice: 999, icon: "🏰" },
  { label: "Einfamilienhaus", volume: 100, basePrice: 1499, icon: "🏠" },
];

const extras = [
  { labelKey: "calc.packing", price: "8 €/m³", icon: Package },
  { labelKey: "calc.assembly", price: "150 €", icon: Building2 },
  { labelKey: "calc.floorSurcharge", price: "30 €", icon: Home },
  { labelKey: "calc.fragile", price: "120 €", icon: Package },
  { labelKey: "calc.premiumInsurance", price: "89 €", icon: Home },
  { labelKey: "calc.express", price: "199 €", icon: Truck },
  { labelKey: "calc.weekend", price: "149 €", icon: MapPin },
  { labelKey: "calc.cleaning", price: "180 €", icon: Building2 },
  { labelKey: "calc.storage", price: "99 €", icon: Home },
];

const Preise = () => {
  const { t } = useI18n();
  const { data: competitors = [] } = useCompetitors();

  const distanceKeys = [
    { key: "prices.withinCity", km: 15 },
    { key: "prices.shortDistance", km: 50 },
    { key: "prices.mediumDistance", km: 100 },
    { key: "prices.longDistance", km: 275 },
    { key: "prices.veryLongDistance", km: 500 },
  ];

  return (
    <>
      <Helmet>
        <title>{t("prices.title")} - UmzugTeam365</title>
        <meta name="description" content={t("prices.subtitle")} />
        <link rel="canonical" href="https://umzugteam365.de/preise" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <section className="hero-section text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t("prices.back")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("prices.title")}</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">{t("prices.subtitle")}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">{t("prices.basePrices")}</h2>
              <p className="text-muted-foreground">{t("prices.basePricesDesc")}</p>
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
                          ~{avgSave.toFixed(0)}€ {t("prices.cheaper")}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="text-3xl mb-2">{size.icon}</div>
                      <CardTitle className="text-lg">{size.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">ca. {size.volume} m³ {t("prices.volume")}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-sm text-muted-foreground">{t("prices.from")}</span>
                        <span className="text-3xl font-bold text-accent">{size.basePrice}</span>
                        <span className="text-muted-foreground">€</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t("prices.plusExtras")} • {t("prices.inclVat")}: {totalWithTax.toFixed(0)} €</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">{t("prices.distanceTitle")}</h2>
              <p className="text-muted-foreground">{t("prices.distanceDesc")}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl overflow-hidden card-elevated">
                {distanceKeys.map((d, i) => (
                  <div key={d.key} className={`flex items-center justify-between px-6 py-4 ${i < distanceKeys.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">{t(d.key)}</p>
                        <p className="text-xs text-muted-foreground">~{d.km} km</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{(d.km * 1.5).toFixed(0)} €</p>
                      <p className="text-xs text-muted-foreground">{t("prices.distanceSurcharge")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">{t("prices.extrasTitle")}</h2>
              <p className="text-muted-foreground">{t("prices.extrasDesc")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {extras.map((extra) => {
                const Icon = extra.icon;
                return (
                  <Card key={extra.labelKey} className="card-elevated text-center p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{t(extra.labelKey)}</h3>
                    <p className="text-accent font-bold">{extra.price}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 card-elevated text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">{t("prices.paymentTitle")}</h3>
              <p className="text-muted-foreground mb-4">{t("prices.paymentDesc")}</p>
              <div className="bg-muted rounded-xl p-4 inline-block">
                <p className="text-sm text-muted-foreground mb-1">IBAN</p>
                <p className="text-lg font-bold text-accent tracking-wider">BE54 6500 7175 7997</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">{t("prices.paymentNote")}</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("prices.ctaTitle")}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("prices.ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg">
                <Link to="/angebot-erstellen">
                  {t("prices.openCalculator")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/preisvergleich">{t("prices.viewComparison")}</Link>
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
