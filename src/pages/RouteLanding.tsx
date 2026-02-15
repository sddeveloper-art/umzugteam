import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, ArrowLeft, Truck, Clock, Euro, Lightbulb, ArrowLeftRight } from "lucide-react";
import { routes, routeList } from "@/data/routes";

const RouteLanding = () => {
  const { route } = useParams<{ route: string }>();
  const data = route ? routes[route] : null;

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Strecke nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Wählen Sie eine Strecke aus unserer Liste.</p>
          <Link to="/umzugsrouten" className="text-accent hover:underline">Alle Routen anzeigen</Link>
        </main>
        <Footer />
      </>
    );
  }

  const reverseSlug = `${data.toSlug}-${data.fromSlug}`;
  const hasReverse = !!routes[reverseSlug];

  return (
    <>
      <Helmet>
        <title>Umzug {data.from} → {data.to} – Ab {data.priceFrom}€ | UmzugTeam365</title>
        <meta name="description" content={`Umzug von ${data.from} nach ${data.to}: ${data.distance}, ${data.duration}. Festpreise ab ${data.priceFrom}€. Professionell & günstig!`} />
        <link rel="canonical" href={`https://umzugteam365.de/umzugsroute/${route}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Umzug ${data.from} nach ${data.to}`,
            provider: {
              "@type": "MovingCompany",
              name: "UmzugTeam365",
              telephone: "+4915166532563",
              url: "https://umzugteam365.de",
            },
            areaServed: [
              { "@type": "City", name: data.from },
              { "@type": "City", name: data.to },
            ],
            description: data.description,
            offers: {
              "@type": "Offer",
              price: data.priceFrom,
              priceCurrency: "EUR",
              priceValidUntil: "2026-12-31",
            },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="hero-section text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/umzugsrouten" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Alle Routen
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{data.from} → {data.to}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Umzug {data.from} → {data.to}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mb-6">{data.description}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="secondary" className="text-sm py-2 px-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> {data.distance}
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {data.duration}
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4 flex items-center gap-2">
                  <Euro className="w-4 h-4" /> Ab {data.priceFrom}€
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/#kostenrechner">
                    Angebot für {data.from} → {data.to}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="tel:+4915166532563">Jetzt anrufen</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              {[
                { icon: Truck, label: "Entfernung", value: data.distance },
                { icon: Clock, label: "Fahrzeit", value: data.duration },
                { icon: Euro, label: "Festpreis ab", value: `${data.priceFrom}€` },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="card-elevated">
                    <CardContent className="p-6 flex flex-col items-center gap-3">
                      <stat.icon className="w-8 h-8 text-accent" />
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Tipps für Ihren Umzug {data.from} → {data.to}
            </h2>
            <p className="text-center text-muted-foreground mb-12">So sparen Sie Zeit und Geld</p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {data.tips.map((tip, i) => (
                <motion.div key={tip} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <Card className="card-elevated h-full">
                    <CardContent className="flex items-start gap-3 p-5">
                      <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{tip}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reverse route */}
        {hasReverse && (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <Link to={`/umzugsroute/${reverseSlug}`}>
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  Gegenrichtung: {data.to} → {data.from}
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Jetzt Umzug planen</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Festpreisgarantie für {data.from} → {data.to}. Keine versteckten Kosten.
            </p>
            <Button asChild variant="accent" size="lg">
              <Link to="/#kostenrechner">
                Jetzt Preis berechnen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Other routes */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Weitere beliebte Strecken</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {routeList
                .filter((r) => r.slug !== route)
                .slice(0, 12)
                .map((r) => (
                  <Link key={r.slug} to={`/umzugsroute/${r.slug}`}
                    className="px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors card-elevated text-sm font-medium flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {r.from} → {r.to}
                  </Link>
                ))}
              <Link to="/umzugsrouten"
                className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center gap-1">
                Alle Routen <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RouteLanding;
