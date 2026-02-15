import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowRight, ArrowLeft, Search, Euro, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { routeList } from "@/data/routes";

const RoutenIndex = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return routeList;
    const q = search.toLowerCase();
    return routeList.filter(
      (r) =>
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <Helmet>
        <title>Beliebte Umzugsrouten in Deutschland – UmzugTeam365</title>
        <meta name="description" content="Die beliebtesten Umzugsstrecken Deutschlands mit Festpreisen. Berlin–München, Hamburg–Köln und viele mehr. Jetzt Preis berechnen!" />
        <link rel="canonical" href="https://umzugteam365.de/umzugsrouten" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <section className="hero-section text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Beliebte Umzugsrouten</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              {routeList.length} Strecken mit Festpreisgarantie – transparent und günstig.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Stadt suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        <section className="py-8 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((r, i) => (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Link to={`/umzugsroute/${r.slug}`}>
                    <Card className="card-elevated hover:border-accent transition-colors group cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg group-hover:text-accent transition-colors flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            {r.from} → {r.to}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {r.distance}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {r.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1 text-accent border-accent">
                            <Euro className="w-3 h-3" /> ab {r.priceFrom}€
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Keine Route gefunden. Versuchen Sie einen anderen Suchbegriff.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RoutenIndex;
