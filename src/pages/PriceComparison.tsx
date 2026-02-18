import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, TrendingDown, Check, X, Percent, Euro, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompetitors, calculateCompetitorPrices, PriceComparison as PriceComparisonType } from "@/hooks/useCompetitors";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/hooks/useI18n";

const SAMPLE_BASE_PRICE = 350;
const SAMPLE_DISTANCE_COST = 180;
const SAMPLE_FLOOR_COST = 80;
const SAMPLE_OUR_PRICE = (SAMPLE_BASE_PRICE + SAMPLE_DISTANCE_COST + SAMPLE_FLOOR_COST) * 1.19;

const PriceComparison = () => {
  const { t } = useI18n();
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
        <title>{t("priceCompPage.title")} - UmzugTeam365</title>
        <meta name="description" content={t("priceCompPage.subtitle")} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-background pt-24">
        <section className="hero-section text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t("priceCompPage.back")}
            </Link>
            <div className="max-w-3xl">
              <Badge className="bg-accent text-accent-foreground mb-4">
                <Award className="w-3 h-3 mr-1" />
                {t("priceCompPage.badge")}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("priceCompPage.title")}</h1>
              <p className="text-xl text-primary-foreground/80 mb-8">{t("priceCompPage.subtitle")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{avgSavings.toFixed(0)} €</div>
                  <div className="text-sm text-primary-foreground/80">{t("priceCompPage.avgSavings")}</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{maxSavingsCompetitor?.savingsPercent.toFixed(0) ?? 0}%</div>
                  <div className="text-sm text-primary-foreground/80">{t("priceCompPage.maxSavings")}</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{competitors?.length ?? 0}</div>
                  <div className="text-sm text-primary-foreground/80">{t("priceCompPage.providersCompared")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t("priceCompPage.detailedTitle")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t("priceCompPage.detailedDesc")}</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-6">
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
                          <p className="text-sm text-muted-foreground">{t("priceCompPage.yourPartner")}</p>
                        </div>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        {t("priceCompPage.recommended")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-4xl font-bold text-foreground">{SAMPLE_OUR_PRICE.toFixed(2)} €</div>
                        <p className="text-sm text-muted-foreground mt-1">{t("prices.inclVat")}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">{t("priceCompPage.noHiddenCosts")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 mt-1">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">{t("priceCompPage.freeCancellation")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            <p className="text-sm text-muted-foreground">{t("prices.inclVat")}</p>
                          </div>
                          <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">{t("priceCompPage.additionalCosts")}</span>
                              <span className="font-bold text-destructive">+{comparison.savings.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{t("priceCompPage.moreExpensive")}</span>
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 rotate-180" />
                                {comparison.savingsPercent.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-destructive/10 rounded-lg p-3 mt-4">
                            <div className="flex items-center gap-2 text-destructive text-sm">
                              <X className="w-4 h-4" />
                              <span>{t("priceCompPage.moreExpensiveThan")}</span>
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

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("priceCompPage.whyChoose")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t("priceCompPage.transparentPrices")}</h3>
                <p className="text-muted-foreground text-sm">{t("priceCompPage.transparentDesc")}</p>
              </Card>
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t("priceCompPage.bestPrice")}</h3>
                <p className="text-muted-foreground text-sm">{t("priceCompPage.bestPriceDesc")}</p>
              </Card>
              <Card className="card-elevated text-center p-6">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t("priceCompPage.qualityService")}</h3>
                <p className="text-muted-foreground text-sm">{t("priceCompPage.qualityDesc")}</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("priceCompPage.readyTitle")}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("priceCompPage.readyDesc")}</p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/#quote">
                {t("priceCompPage.calculateNow")}
                <TrendingDown className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PriceComparison;
