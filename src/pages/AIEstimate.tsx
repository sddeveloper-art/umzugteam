import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Brain, Sparkles, TrendingUp, Lightbulb, ArrowRight, Loader2,
  CheckCircle, AlertTriangle, Info, MapPin, Home, Package,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const apartmentSizes = [
  { value: "1-Zimmer", label: "1-Zimmer Wohnung" },
  { value: "2-Zimmer", label: "2-Zimmer Wohnung" },
  { value: "3-Zimmer", label: "3-Zimmer Wohnung" },
  { value: "4-Zimmer", label: "4-Zimmer Wohnung" },
  { value: "5+-Zimmer", label: "5+ Zimmer Wohnung" },
  { value: "Haus", label: "Einfamilienhaus" },
  { value: "Büro", label: "Büro/Gewerbe" },
];

type BreakdownItem = { item: string; cost: number };
type Estimation = {
  price_min: number;
  price_max: number;
  breakdown: BreakdownItem[];
  tips: string[];
  confidence: string;
  summary: string;
};

const AIEstimate = () => {
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [form, setForm] = useState({
    from_city: "",
    to_city: "",
    apartment_size: "",
    floor: 0,
    volume: 20,
    has_elevator: false,
    needs_packing: false,
    needs_assembly: false,
    needs_fragile_packing: false,
    needs_cleaning: false,
    needs_storage: false,
    needs_premium_insurance: false,
    needs_express: false,
    needs_weekend: false,
    description: "",
  });

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleEstimate = async () => {
    if (!form.from_city || !form.to_city || !form.apartment_size) {
      toast({ title: "Bitte füllen Sie alle Pflichtfelder aus.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setEstimation(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-estimate", { body: form });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEstimation(data.estimation);
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message || "Schätzung fehlgeschlagen.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const confidenceConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    hoch: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200", icon: CheckCircle, label: "Hohe Genauigkeit" },
    mittel: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200", icon: Info, label: "Mittlere Genauigkeit" },
    niedrig: { color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200", icon: AlertTriangle, label: "Grobe Schätzung" },
  };

  const extras = [
    { key: "needs_packing", label: "Verpackungsservice" },
    { key: "needs_assembly", label: "Möbelmontage" },
    { key: "needs_fragile_packing", label: "Empfindliches Verpacken" },
    { key: "needs_cleaning", label: "Endreinigung" },
    { key: "needs_storage", label: "Zwischenlagerung" },
    { key: "needs_premium_insurance", label: "Premium-Versicherung" },
    { key: "needs_express", label: "Express-Service" },
    { key: "needs_weekend", label: "Wochenend-Service" },
  ];

  return (
    <>
      <Helmet>
        <title>KI-Kostenschätzung – UmzugTeam365 | Intelligente Preisberechnung</title>
        <meta name="description" content="Erhalten Sie eine KI-gestützte Kostenschätzung für Ihren Umzug in Sekunden. Intelligent, detailliert und kostenlos." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Brain className="h-4 w-4" />
              KI-gestützt
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Intelligente Kostenschätzung
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Unsere KI analysiert Ihre Umzugsdaten und erstellt in Sekunden eine detaillierte Kostenaufstellung mit Tipps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <MapPin className="h-5 w-5 text-primary" /> Route
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Von (Stadt) *</Label>
                      <Input placeholder="Berlin" value={form.from_city} onChange={(e) => update("from_city", e.target.value)} />
                    </div>
                    <div>
                      <Label>Nach (Stadt) *</Label>
                      <Input placeholder="München" value={form.to_city} onChange={(e) => update("to_city", e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-foreground font-semibold pt-2">
                    <Home className="h-5 w-5 text-primary" /> Wohnung
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Wohnungsgröße *</Label>
                      <Select value={form.apartment_size} onValueChange={(v) => update("apartment_size", v)}>
                        <SelectTrigger><SelectValue placeholder="Auswählen..." /></SelectTrigger>
                        <SelectContent>
                          {apartmentSizes.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Etage</Label>
                        <Input type="number" min={0} max={50} value={form.floor} onChange={(e) => update("floor", +e.target.value)} />
                      </div>
                      <div>
                        <Label>Volumen (m³)</Label>
                        <Input type="number" min={1} max={200} value={form.volume} onChange={(e) => update("volume", +e.target.value)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={form.has_elevator} onCheckedChange={(v) => update("has_elevator", !!v)} id="elevator" />
                      <Label htmlFor="elevator" className="font-normal cursor-pointer">Aufzug vorhanden</Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-foreground font-semibold pt-2">
                    <Package className="h-5 w-5 text-primary" /> Extras
                  </div>
                  <div className="space-y-2">
                    {extras.map((ex) => (
                      <div key={ex.key} className="flex items-center gap-2">
                        <Checkbox
                          checked={(form as any)[ex.key]}
                          onCheckedChange={(v) => update(ex.key, !!v)}
                          id={ex.key}
                        />
                        <Label htmlFor={ex.key} className="font-normal cursor-pointer text-sm">{ex.label}</Label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label>Zusätzliche Infos (optional)</Label>
                    <Textarea
                      placeholder="Klavier, besondere Gegenstände..."
                      rows={2}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  <Button onClick={handleEstimate} disabled={loading} className="w-full" size="lg">
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> KI analysiert...</>
                    ) : (
                      <><Sparkles className="mr-2 h-5 w-5" /> KI-Schätzung starten</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    </div>
                    <p className="text-lg font-medium text-foreground">KI analysiert Ihre Daten...</p>
                    <p className="text-sm text-muted-foreground mt-1">Bitte warten Sie einen Moment</p>
                  </motion.div>
                )}

                {!loading && estimation && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {/* Price */}
                    <Card className="overflow-hidden">
                      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium opacity-90">Geschätzte Kosten</span>
                          {estimation.confidence && confidenceConfig[estimation.confidence] && (
                            <Badge className={cn("text-xs", confidenceConfig[estimation.confidence].color)}>
                              {React.createElement(confidenceConfig[estimation.confidence].icon, { className: "h-3 w-3 mr-1" })}
                              {confidenceConfig[estimation.confidence].label}
                            </Badge>
                          )}
                        </div>
                        <div className="text-4xl font-bold">
                          {estimation.price_min.toLocaleString("de-DE")}€ – {estimation.price_max.toLocaleString("de-DE")}€
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">{estimation.summary}</p>
                      </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 font-semibold text-foreground mb-4">
                          <TrendingUp className="h-5 w-5 text-primary" /> Kostenaufschlüsselung
                        </div>
                        <div className="space-y-3">
                          {estimation.breakdown.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-border">
                              <span className="text-sm text-foreground">{item.item}</span>
                              <span className="text-sm font-semibold text-foreground">{item.cost.toLocaleString("de-DE")}€</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tips */}
                    {estimation.tips?.length > 0 && (
                      <Card>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 font-semibold text-foreground mb-4">
                            <Lightbulb className="h-5 w-5 text-amber-500" /> Spar-Tipps
                          </div>
                          <ul className="space-y-2">
                            {estimation.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* CTA */}
                    <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Diese KI-Schätzung dient als Orientierung. Für ein verbindliches Angebot kontaktieren Sie uns oder nutzen Sie unser Anfragesystem.</p>
                    </div>
                  </motion.div>
                )}

                {!loading && !estimation && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Brain className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Bereit für Ihre Schätzung</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Füllen Sie die Felder links aus und starten Sie die KI-Analyse
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AIEstimate;
