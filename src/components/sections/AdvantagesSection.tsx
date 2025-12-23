import { 
  ShieldCheck, 
  Wallet, 
  Clock, 
  Users, 
  HeartHandshake,
  Award 
} from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Vollversicherung",
    description: "Alle Ihre Güter sind während des Transports versichert. Garantierte Sicherheit.",
  },
  {
    icon: Wallet,
    title: "Transparente Preise",
    description: "Detailliertes Angebot ohne versteckte Kosten. Sie wissen genau, was Sie bezahlen.",
  },
  {
    icon: Clock,
    title: "Pünktlichkeit",
    description: "Strikte Einhaltung der vereinbarten Zeiten. Ihre Zeit ist wertvoll.",
  },
  {
    icon: Users,
    title: "Erfahrenes Team",
    description: "Geschultes und qualifiziertes Personal für sorgfältigen Umgang mit Ihren Gütern.",
  },
  {
    icon: HeartHandshake,
    title: "Persönlicher Service",
    description: "Jeder Umzug ist einzigartig. Wir passen unsere Leistungen an Ihre Bedürfnisse an.",
  },
  {
    icon: Award,
    title: "Zertifizierte Qualität",
    description: "Zertifiziertes Unternehmen mit über 25 Jahren Erfahrung in der Branche.",
  },
];

const AdvantagesSection = () => {
  return (
    <section id="vorteile" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block text-accent font-semibold mb-4">
              Warum Uns Wählen
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Exzellenz Im Dienste Ihres Umzugs
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Seit über 25 Jahren stellen wir unsere Expertise in den Dienst von Privatkunden 
              und Unternehmen für erfolgreiche Umzüge. Unser Versprechen: 
              Ihre vollständige Zufriedenheit.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {advantages.slice(0, 4).map((advantage, index) => (
                <div 
                  key={advantage.title} 
                  className="flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <advantage.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {advantage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">25+</div>
                  <div className="text-primary-foreground/80">Jahre Erfahrung</div>
                </div>
                <div className="bg-accent rounded-2xl p-8 text-accent-foreground">
                  <Award className="w-10 h-10 mb-4" />
                  <div className="font-semibold">Qualitätszertifiziert</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-secondary rounded-2xl p-8">
                  <HeartHandshake className="w-10 h-10 text-accent mb-4" />
                  <div className="font-semibold text-foreground">Persönlicher Kundenservice</div>
                </div>
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-primary-foreground/80">Zufriedene Kunden</div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Bottom advantages */}
        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {advantages.slice(4).map((advantage, index) => (
            <div 
              key={advantage.title}
              className="flex gap-4 bg-card rounded-xl p-6 card-elevated"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <advantage.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {advantage.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
