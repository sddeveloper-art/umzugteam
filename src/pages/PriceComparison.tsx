import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, TrendingDown, Check, X, Percent, Euro, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompetitors, calculateCompetitorPrices, PriceComparison as PriceComparisonType } from "@/hooks/useCompetitors";

// Sample calculation values for display purposes
const SAMPLE_BASE_PRICE = 350;
const SAMPLE_DISTANCE_COST = 180;
const SAMPLE_FLOOR_COST = 80;
const SAMPLE_OUR_PRICE = (SAMPLE_BASE_PRICE + SAMPLE_DISTANCE_COST + SAMPLE_FLOOR_COST) * 1.19;

const PriceComparison = () => {
  const { data: competitors, isLoading } = useCompetitors();

  const comparisons: PriceComparisonType[] = competitors
    ? calculateCompetitorPrices(competitors, SAMPLE_OUR_PRICE, SAMPLE_BASE_PRICE, SAMPLE_DISTANCE_COST, SAMPLE_FLOOR_COST)
    : [];

  const maxSavingsCompetitor = comparisons.reduce(
    (max, c) => (c.savings > (max?.savings ?? 0) ? c : max),
    null as PriceComparisonType | null
  );

  const avgSavings = comparisons.length > 0
    ? comparisons.reduce((sum, c) => sum + c.savings, 0) / comparisons.length
    : 0;

  return (
    <>
      <Helmet>
        <title>Preisvergleich - UmzugTeam | Die besten Preise für Ihren Umzug</title>
        <meta name="description" content="Vergleichen Sie unsere Umzugspreise mit anderen Anbietern. Sparen Sie bis zu 25% mit UmzugTeam - transparente Preise, keine versteckten Kosten." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="hero-section text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
            
            <div className="max-w-3xl">
              <Badge className="bg-accent text-accent-foreground mb-4">
                <Award className="w-3 h-3 mr-1" />
                Bester Preis garantiert
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Preisvergleich mit der Konkurrenz
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Transparenz ist uns wichtig. Vergleichen Sie unsere Preise mit anderen großen Umzugsunternehmen und überzeugen Sie sich selbst.
              </p>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{avgSavings.toFixed(0)} €</div>
                  <div className="text-sm text-primary-foreground/80">Durchschnittl. Ersparnis</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{maxSavingsCompetitor?.savingsPercent.toFixed(0) ?? 0}%</div>
                  <div className="text-sm text-primary-foreground/80">Max. Ersparnis</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{competitors?.length ?? 0}</div>
                  <div className="text-sm text-primary-foreground/80">Anbieter verglichen</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Comparison Table */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Detaillierter Preisvergleich</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Basierend auf einem Beispielumzug: 40m³ Volumen, 50km Entfernung, 2. Stock mit Aufzug
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Our Price Card - Featured */}
                <Card className="border-2 border-accent card-elevated overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">UmzugTeam</CardTitle>
                          <p className="text-sm text-muted-foreground">Ihr vertrauenswürdiger Partner</p>
                        </div>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        Empfohlen
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-4xl font-bold text-foreground">{SAMPLE_OUR_PRICE.toFixed(2)} €</div>
                        <p className="text-sm text-muted-foreground mt-1">inkl. MwSt.</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Keine versteckten Kosten</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 mt-1">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Kostenlose Stornierung</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitor Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparisons.map((comparison, index) => (
                    <Card key={index} className="card-elevated relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <CardTitle className="text-lg">{comparison.competitorName}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-2xl font-bold text-foreground">{comparison.price.toFixed(2)} €</div>
                            <p className="text-sm text-muted-foreground">inkl. MwSt.</p>
                          </div>
                          
                          <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Mehrkosten:</span>
                              <span className="font-bold text-destructive">+{comparison.savings.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Teurer um:</span>
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 rotate-180" />
                                {comparison.savingsPercent.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>

                          <div className="bg-destructive/10 rounded-lg p-3 mt-4">
                            <div className="flex items-center gap-2 text-destructive text-sm">
                              <X className="w-4 h-4" />
                              <span>Teurer als UmzugTeam</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Warum UmzugTeam wählen?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Transparente Preise</h3>
                <p className="text-muted-foreground text-sm">
                  Keine versteckten Gebühren oder Überraschungen. Der Preis, den Sie sehen, ist der Preis, den Sie zahlen.
                </p>
              </Card>
              
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Beste Preisgarantie</h3>
                <p className="text-muted-foreground text-sm">
                  Finden Sie ein günstigeres Angebot? Wir unterbieten es oder erstatten die Differenz.
                </p>
              </Card>
              
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Qualitätsservice</h3>
                <p className="text-muted-foreground text-sm">
                  Professionelles Team, versicherte Transporte und Kundenzufriedenheitsgarantie.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bereit für Ihren Umzug?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Berechnen Sie jetzt Ihren persönlichen Umzugspreis und überzeugen Sie sich selbst von unseren günstigen Preisen.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/#quote">
                Jetzt Preis berechnen
                <TrendingDown className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default PriceComparison;
