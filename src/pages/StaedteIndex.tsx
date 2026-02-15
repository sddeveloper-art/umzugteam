import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { cityList } from "@/data/cities";

const StaedteIndex = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return cityList;
    const q = search.toLowerCase();
    return cityList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.bundesland.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof cityList> = {};
    filtered.forEach((c) => {
      if (!groups[c.bundesland]) groups[c.bundesland] = [];
      groups[c.bundesland].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <>
      <Helmet>
        <title>Umzugsunternehmen in 80+ Städten – UmzugTeam365</title>
        <meta name="description" content="UmzugTeam365 ist in über 80 deutschen Städten aktiv. Finden Sie Ihr lokales Umzugsunternehmen. Festpreise, keine versteckten Kosten!" />
        <link rel="canonical" href="https://umzugteam365.de/staedte" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <section className="hero-section text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Umzüge in {cityList.length}+ Städten</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Deutschlandweit für Sie im Einsatz. Finden Sie Ihren Standort.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Stadt oder Bundesland suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        <section className="py-8 pb-16">
          <div className="container mx-auto px-4">
            {grouped.map(([bundesland, groupCities]) => (
              <div key={bundesland} className="mb-10">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  {bundesland}
                  <Badge variant="secondary" className="text-xs">{groupCities.length}</Badge>
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupCities.map((c, i) => (
                    <motion.div
                      key={c.slug}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                    >
                      <Link to={`/umzug/${c.slug}`}>
                        <Card className="card-elevated hover:border-accent transition-colors group cursor-pointer h-full">
                          <CardHeader className="pb-1 pt-4 px-4">
                            <CardTitle className="text-base group-hover:text-accent transition-colors flex items-center justify-between">
                              {c.name}
                              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-accent" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 pt-0">
                            <p className="text-xs text-muted-foreground">{c.population} Einwohner</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Keine Stadt gefunden. Versuchen Sie einen anderen Suchbegriff.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StaedteIndex;
