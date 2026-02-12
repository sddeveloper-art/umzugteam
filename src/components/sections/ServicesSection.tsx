import { 
  Truck, 
  Package, 
  Warehouse, 
  Sparkles, 
  Shield, 
  Clock,
  Building,
  Piano,
  Sofa,
  ShieldCheck,
  Zap,
  CalendarClock,
  WashingMachine,
  PackageCheck
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Privatumzug",
    description: "Komplettservice für Ihren privaten Umzug, vom Studio bis zum großen Haus.",
    features: ["Be- & Entladen", "Sicherer Transport", "Qualifiziertes Team"],
  },
  {
    icon: Building,
    title: "Firmenumzug",
    description: "Maßgeschneiderte Lösungen für Büros, Geschäfte und Unternehmen.",
    features: ["Strategische Planung", "Minimale Unterbrechung", "Wochenende möglich"],
  },
  {
    icon: Package,
    title: "Verpackungsservice",
    description: "Professionelles Verpacken Ihrer Güter mit hochwertigen Materialien.",
    features: ["Verstärkte Kartons", "Luftpolsterschutz", "Organisierte Beschriftung"],
  },
  {
    icon: Warehouse,
    title: "Lagerung & Einlagerung",
    description: "Sichere Lagerräume für Ihre Möbel und persönlichen Gegenstände.",
    features: ["24/7 Sicherheit", "Klimakontrolle", "Flexibler Zugang"],
  },
  {
    icon: Sparkles,
    title: "Reinigung & Renovierung",
    description: "Komplette Reinigung Ihrer alten oder neuen Wohnung.",
    features: ["Grundreinigung", "Umweltfreundliche Produkte", "Übergabeprotokoll"],
  },
  {
    icon: Piano,
    title: "Spezialtransporte",
    description: "Spezialtransport für Klaviere, Kunstwerke und empfindliche Gegenstände.",
    features: ["Spezialausrüstung", "Fachpersonal", "Erweiterte Versicherung"],
  },
  {
    icon: Sofa,
    title: "Möbel Ab- & Aufbau",
    description: "Professionelle Demontage und Montage aller Möbelstücke – Küchen, Schränke, Betten.",
    features: ["Fachgerechter Aufbau", "Werkzeug inklusive", "Küchenmontage"],
  },
  {
    icon: ShieldCheck,
    title: "Premium-Versicherung",
    description: "Erweiterte Transportversicherung für maximalen Schutz Ihrer Wertgegenstände.",
    features: ["Vollkasko-Schutz", "Bis 50.000 € Deckung", "Schadensabwicklung 24h"],
  },
  {
    icon: PackageCheck,
    title: "Empfindliches Verpacken",
    description: "Spezialverpackung für Glas, Porzellan, Elektronik und empfindliche Objekte.",
    features: ["Maßgeschneiderte Polsterung", "Antistatische Folien", "Spezialkisten"],
  },
];

const ServicesSection = () => {
  return (
    <section id="leistungen" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            Unsere Leistungen
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Komplettlösungen Für Ihren Umzug
          </h2>
          <p className="text-lg text-muted-foreground">
            Von der Verpackung bis zur Lagerung begleiten wir Sie bei jedem Schritt mit Professionalität und Effizienz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="bg-card rounded-2xl p-8 card-elevated animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Shield className="w-4 h-4 text-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-20 bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15.000+", label: "Umzüge" },
              { value: "98%", label: "Zufriedene Kunden" },
              { value: "25+", label: "Jahre Erfahrung" },
              { value: "24/7", label: "Kundenservice" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
