import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { bundeslaenderList } from "@/data/bundeslaender";

const BundeslaenderIndex = () => {
  return (
    <>
      <Helmet>
        <title>Umzugsunternehmen in allen 16 Bundesländern – UmzugTeam365</title>
        <meta name="description" content="UmzugTeam365 ist in allen 16 deutschen Bundesländern aktiv. Finden Sie Ihr lokales Umzugsunternehmen. Festpreise ab 269€!" />
        <link rel="canonical" href="https://umzugteam365.de/bundeslaender" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <section className="hero-section text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Umzüge in allen 16 Bundesländern</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Deutschlandweit für Sie im Einsatz. Wählen Sie Ihr Bundesland für lokale Informationen und Preise.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bundeslaenderList.map((bl, i) => (
                <motion.div
                  key={bl.slug}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link to={`/bundesland/${bl.slug}`}>
                    <Card className="card-elevated h-full hover:border-accent transition-colors group cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg group-hover:text-accent transition-colors">{bl.name}</CardTitle>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground">{bl.capital} · {bl.population}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-sm text-muted-foreground">ab</span>
                          <span className="text-2xl font-bold text-accent">{bl.priceFrom}</span>
                          <span className="text-muted-foreground">€</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bl.cities.slice(0, 3).map((city) => (
                            <Badge key={city} variant="secondary" className="text-xs">
                              <MapPin className="w-2 h-2 mr-0.5" />
                              {city}
                            </Badge>
                          ))}
                          {bl.cities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{bl.cities.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BundeslaenderIndex;
