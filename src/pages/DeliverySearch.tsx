import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicAnnouncements, formatTimeRemaining } from "@/hooks/useAnnouncements";
import { CATEGORY_LABELS, TransportCategory } from "@/hooks/useTransporter";
import { Search, MapPin, Clock, Package, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const DeliverySearch = () => {
  const { data: announcements, isLoading } = usePublicAnnouncements();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<TransportCategory | "all">("all");

  const filtered = announcements?.filter((a) => {
    const ann = a as any;
    const matchSearch = !search ||
      a.from_city?.toLowerCase().includes(search.toLowerCase()) ||
      a.to_city?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || ann.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <Helmet>
        <title>Lieferungen suchen – Transportaufträge | UmzugTeam365</title>
        <meta name="description" content="Finden Sie Transportaufträge in ganz Deutschland. Durchsuchen Sie aktive Anfragen und geben Sie Ihr Angebot ab." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <Search className="inline-block h-8 w-8 text-accent mr-2 mb-1" />
              Lieferungen suchen
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Durchsuchen Sie aktive Transportanfragen und finden Sie Aufträge auf Ihrer Route
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Stadt (z.B. Berlin, München)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={filterCategory === "all" ? "accent" : "outline"} size="sm" onClick={() => setFilterCategory("all")}>
                <Filter className="w-3.5 h-3.5 mr-1" /> Alle
              </Button>
              {(Object.entries(CATEGORY_LABELS) as [TransportCategory, { de: string; icon: string }][]).map(([key, val]) => (
                <Button key={key} variant={filterCategory === key ? "accent" : "outline"} size="sm" onClick={() => setFilterCategory(key)}>
                  {val.icon} {val.de}
                </Button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {filtered && (
            <p className="text-sm text-muted-foreground mb-4 text-center">{filtered.length} aktive Anfragen</p>
          )}

          {isLoading ? (
            <p className="text-center text-muted-foreground">Laden…</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered?.map((a) => {
                const ann = a as any;
                return (
                  <Card key={a.id} className="hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">
                          {CATEGORY_LABELS[ann.category as TransportCategory]?.icon}{" "}
                          {CATEGORY_LABELS[ann.category as TransportCategory]?.de || "Umzüge"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTimeRemaining(a.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Von</p>
                          <p className="font-semibold text-foreground">{a.from_city}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
                        <div className="flex-1 text-right">
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" /> Nach</p>
                          <p className="font-semibold text-foreground">{a.to_city}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {a.volume} m³</span>
                        <span>• {a.apartment_size}</span>
                        <span>• {a.floor}. OG</span>
                        {a.has_elevator && <span>• Aufzug</span>}
                      </div>

                      {a.preferred_date && (
                        <p className="text-xs text-muted-foreground mb-3">
                          📅 {new Date(a.preferred_date).toLocaleDateString("de-DE")}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Link to="/anfragen" className="flex-1">
                          <Button variant="accent" size="sm" className="w-full">Angebot abgeben</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filtered?.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Keine Ergebnisse</h3>
                    <p className="text-muted-foreground">Versuchen Sie eine andere Suche oder Kategorie.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DeliverySearch;
