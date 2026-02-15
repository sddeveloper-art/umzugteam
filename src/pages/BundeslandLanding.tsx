import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, ArrowRight, ArrowLeft, Building2, Users, Ruler } from "lucide-react";
import { bundeslaender, bundeslaenderList } from "@/data/bundeslaender";

const BundeslandLanding = () => {
  const { land } = useParams<{ land: string }>();
  const data = land ? bundeslaender[land] : null;

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Bundesland nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Bitte wählen Sie ein Bundesland aus unserer Liste.</p>
          <Link to="/bundeslaender" className="text-accent hover:underline">Alle Bundesländer anzeigen</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.seoTitle}</title>
        <meta name="description" content={data.seoDescription} />
        <link rel="canonical" href={`https://umzugteam365.de/bundesland/${data.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            name: "UmzugTeam365",
            description: data.seoDescription,
            areaServed: {
              "@type": "State",
              name: data.name,
              containedInPlace: { "@type": "Country", name: "Germany" },
            },
            priceRange: `ab ${data.priceFrom}€`,
            telephone: "+4915166532563",
            url: `https://umzugteam365.de/bundesland/${data.slug}`,
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="hero-section text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/bundeslaender" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Alle Bundesländer
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{data.capital} · Landeshauptstadt</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Umzugsunternehmen in {data.name}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mb-8">
                {data.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/#kostenrechner">
                    Kostenloses Angebot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="tel:+4915166532563">
                    Jetzt anrufen
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Users, label: "Einwohner", value: data.population },
                { icon: Ruler, label: "Fläche", value: data.area },
                { icon: Building2, label: "Hauptstadt", value: data.capital },
                { icon: MapPin, label: "Ab Preis", value: `${data.priceFrom} €` },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Vorteile */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Warum UmzugTeam365 in {data.name}?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Unsere Vorteile für Ihren Umzug in {data.name}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {data.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <Card className="card-elevated h-full">
                    <CardContent className="flex items-start gap-3 p-5">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities / Städte */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Unsere Standorte in {data.name}
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              {data.cities.length} Städte und Regionen – und viele mehr
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {data.cities.map((city) => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="text-sm py-2 px-4 cursor-default"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {city}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Umzug in {data.name} planen
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Erhalten Sie jetzt ein kostenloses, unverbindliches Angebot für Ihren Umzug in {data.name}. Festpreisgarantie – keine versteckten Kosten.
            </p>
            <Button asChild variant="accent" size="lg">
              <Link to="/#kostenrechner">
                Jetzt Preis berechnen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Other Bundesländer */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Weitere Bundesländer</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {bundeslaenderList
                .filter((bl) => bl.slug !== land)
                .map((bl) => (
                  <Link
                    key={bl.slug}
                    to={`/bundesland/${bl.slug}`}
                    className="px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors card-elevated text-sm font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {bl.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BundeslandLanding;
