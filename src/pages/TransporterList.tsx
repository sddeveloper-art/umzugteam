import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { usePublicTransporters, CATEGORY_LABELS, TransportCategory } from "@/hooks/useTransporter";
import { Star, MapPin, Truck, Shield, Award, Search } from "lucide-react";
import { useState } from "react";

const TransporterList = () => {
  const { data: transporters, isLoading } = usePublicTransporters();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<TransportCategory | "all">("all");

  const filtered = transporters?.filter((t) => {
    const matchSearch = !search || 
      t.company_name.toLowerCase().includes(search.toLowerCase()) ||
      t.city?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || t.categories?.includes(filterCategory);
    return matchSearch && matchCategory;
  });

  return (
    <>
      <Helmet>
        <title>Transporteure – Verifizierte Unternehmen | UmzugTeam365</title>
        <meta name="description" content="Finden Sie verifizierte Transporteure für Ihren Umzug. Bewertungen, Profile und Kontaktdaten." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <Truck className="inline-block h-8 w-8 text-accent mr-2 mb-1" />
              Unsere Transporteure
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verifizierte Transportunternehmen mit Bewertungen und nachgewiesener Erfahrung
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Name oder Stadt…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterCategory === "all" ? "accent" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("all")}
              >
                Alle
              </Button>
              {(Object.entries(CATEGORY_LABELS) as [TransportCategory, { de: string; icon: string }][]).map(([key, val]) => (
                <Button
                  key={key}
                  variant={filterCategory === key ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(key)}
                >
                  {val.icon} {val.de}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Laden…</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered?.map((t) => {
                const isTop = t.completed_deliveries >= 50 && t.avg_rating >= 4.5;
                return (
                  <Link key={t.id} to={`/transporteur/${t.id}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-accent">
                              {t.company_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground truncate">{t.company_name}</h3>
                              {t.is_verified && <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{t.contact_name}</p>
                            {t.city && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {t.city}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-sm font-semibold">{t.avg_rating > 0 ? t.avg_rating.toFixed(1) : "–"}</span>
                            <span className="text-xs text-muted-foreground">({t.total_ratings})</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{t.completed_deliveries} Lieferungen</span>
                          {isTop && <Badge className="bg-amber-500/10 text-amber-600 text-xs ml-auto"><Award className="w-3 h-3 mr-1" /> Top</Badge>}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {t.categories?.slice(0, 3).map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {CATEGORY_LABELS[cat as TransportCategory]?.icon} {CATEGORY_LABELS[cat as TransportCategory]?.de}
                            </Badge>
                          ))}
                          {(t.categories?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">+{t.categories!.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
              {filtered?.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Keine Transporteure gefunden.</p>
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

export default TransporterList;
