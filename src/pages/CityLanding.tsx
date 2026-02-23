import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, ArrowRight, ArrowLeft, Users } from "lucide-react";
import { cities, cityList } from "@/data/cities";
import { routeList } from "@/data/routes";
import { bundeslaender } from "@/data/bundeslaender";
import { Truck } from "lucide-react";

const CityLanding = () => {
  const { city } = useParams<{ city: string }>();
  const data = city ? cities[city] : null;

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Stadt nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Wählen Sie eine Stadt aus unserer Liste.</p>
          <Link to="/staedte" className="text-accent hover:underline">Alle Städte anzeigen</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Umzugsunternehmen {data.name} – UmzugTeam365 | Professioneller Umzug</title>
        <meta name="description" content={`Professionelles Umzugsunternehmen in ${data.name}. Privat- und Firmenumzüge, Verpackungsservice und mehr. Festpreise ab 299€. Jetzt Angebot anfordern!`} />
        <link rel="canonical" href={`https://umzugteam365.de/umzug/${city}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            name: "UmzugTeam365",
            description: `Professionelles Umzugsunternehmen in ${data.name}`,
            areaServed: { "@type": "City", name: data.name },
            address: {
              "@type": "PostalAddress",
              addressLocality: data.name,
              addressCountry: "DE",
            },
            priceRange: "ab 299€",
            telephone: "+4915166532563",
            url: `https://umzugteam365.de/umzug/${city}`,
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="hero-section text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/staedte" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Alle Städte
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{data.name} · {data.bundesland}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Umzugsunternehmen in {data.name}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mb-4">{data.description}</p>
              <div className="flex items-center gap-2 mb-8">
                <Users className="w-4 h-4 text-primary-foreground/70" />
                <span className="text-primary-foreground/70">{data.population} Einwohner</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/angebot-erstellen">
                    Kostenloses Angebot für {data.name}
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

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Warum UmzugTeam365 in {data.name}?
            </h2>
            <p className="text-center text-muted-foreground mb-12">Unsere Vorteile für Ihren Umzug</p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {data.features.map((f, i) => (
                <motion.div key={f}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="card-elevated h-full">
                    <CardContent className="flex items-start gap-3 p-5">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Districts */}
        {data.districts.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Stadtteile in {data.name}</h2>
              <p className="text-muted-foreground mb-8">Wir sind in allen Stadtteilen aktiv</p>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {data.districts.map((d) => (
                  <Badge key={d} variant="secondary" className="text-sm py-2 px-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bundesland link */}
        {(() => {
          const bl = Object.values(bundeslaender).find((b) => b.name === data.bundesland);
          return bl ? (
            <section className="py-8">
              <div className="container mx-auto px-4 text-center">
                <Link to={`/bundesland/${bl.slug}`} className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                  <MapPin className="w-4 h-4" />
                  Mehr Umzüge in {bl.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          ) : null;
        })()}

        {/* Related routes */}
        {(() => {
          const related = routeList.filter(
            (r) => r.fromSlug === city || r.toSlug === city
          );
          return related.length > 0 ? (
            <section className="py-16 bg-muted/50">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-8">Beliebte Routen ab {data.name}</h2>
                <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                  {related.slice(0, 8).map((r) => (
                    <Link key={r.slug} to={`/umzugsroute/${r.slug}`}
                      className="px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors card-elevated text-sm font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3" /> {r.from} → {r.to}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null;
        })()}

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Umzug in {data.name} planen</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Erhalten Sie jetzt ein kostenloses, unverbindliches Angebot. Festpreisgarantie – keine versteckten Kosten.
            </p>
            <Button asChild variant="accent" size="lg">
              <Link to="/angebot-erstellen">
                Jetzt Preis berechnen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Other cities */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Weitere Standorte</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {cityList
                .filter((c) => c.slug !== city)
                .slice(0, 20)
                .map((c) => (
                  <Link key={c.slug} to={`/umzug/${c.slug}`}
                    className="px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors card-elevated text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {c.name}
                  </Link>
                ))}
              <Link to="/staedte"
                className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center gap-1">
                Alle Städte <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CityLanding;
