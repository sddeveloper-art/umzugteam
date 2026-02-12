import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PackageItem {
  name: string;
  icon: React.ElementType;
  price: string;
  priceNote: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  excluded?: string[];
}

const packages: PackageItem[] = [
  {
    name: "Basique",
    icon: Zap,
    price: "Ab 299 €",
    priceNote: "Für Studio / 1-Zimmer",
    features: [
      "Be- und Entladen",
      "Sicherer Transport",
      "Grundversicherung",
      "Qualifiziertes 2-Mann-Team",
    ],
    excluded: [
      "Verpackungsservice",
      "Möbelmontage",
      "Reinigung",
      "Premium-Versicherung",
    ],
  },
  {
    name: "Komfort",
    icon: Star,
    price: "Ab 549 €",
    priceNote: "Für Studio / 1-Zimmer",
    badge: "Beliebt",
    highlighted: true,
    features: [
      "Alles aus Basique",
      "Ein- und Auspacken",
      "Möbel Ab- & Aufbau",
      "Verpackungsmaterial inklusive",
      "3-Mann-Team",
    ],
    excluded: [
      "Reinigung",
      "Premium-Versicherung",
    ],
  },
  {
    name: "Premium",
    icon: Crown,
    price: "Ab 899 €",
    priceNote: "Für Studio / 1-Zimmer",
    features: [
      "Alles aus Komfort",
      "Grundreinigung alte Wohnung",
      "Empfindliches Verpacken",
      "Premium-Versicherung (50.000 €)",
      "Express-Service (Priorität)",
      "4-Mann-Team",
      "Persönlicher Ansprechpartner",
    ],
  },
];

const PackagesSection = () => {
  return (
    <section id="pakete" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            Unsere Pakete
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das passende Paket für jeden Umzug
          </h2>
          <p className="text-lg text-muted-foreground">
            Wählen Sie das Servicelevel, das zu Ihnen passt – von der einfachen Grundleistung bis zum Rundum-Sorglos-Paket.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.name}
                className={`relative bg-card rounded-2xl p-8 flex flex-col transition-all ${
                  pkg.highlighted
                    ? "ring-2 ring-accent shadow-xl scale-[1.02]"
                    : "card-elevated"
                }`}
              >
                {pkg.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1">
                    {pkg.badge}
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pkg.highlighted ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                  <p className="text-sm text-muted-foreground mt-1">{pkg.priceNote}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {pkg.excluded?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground mt-0.5 flex-shrink-0">—</span>
                      <span className="text-muted-foreground line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.highlighted ? "accent" : "outline"}
                  className="w-full"
                  onClick={() => {
                    const el = document.getElementById("kostenrechner");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Angebot anfordern
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
