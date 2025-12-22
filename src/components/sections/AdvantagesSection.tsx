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
    title: "Assurance Complète",
    description: "Tous vos biens sont assurés pendant le transport. Tranquillité d'esprit garantie.",
  },
  {
    icon: Wallet,
    title: "Prix Transparents",
    description: "Devis détaillé sans frais cachés. Vous savez exactement ce que vous payez.",
  },
  {
    icon: Clock,
    title: "Ponctualité",
    description: "Respect strict des horaires convenus. Votre temps est précieux.",
  },
  {
    icon: Users,
    title: "Équipe Expérimentée",
    description: "Personnel formé et qualifié pour manipuler vos biens avec le plus grand soin.",
  },
  {
    icon: HeartHandshake,
    title: "Service Personnalisé",
    description: "Chaque déménagement est unique. Nous adaptons nos services à vos besoins.",
  },
  {
    icon: Award,
    title: "Qualité Certifiée",
    description: "Entreprise certifiée avec plus de 25 ans d'expérience dans le secteur.",
  },
];

const AdvantagesSection = () => {
  return (
    <section id="avantages" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block text-accent font-semibold mb-4">
              Pourquoi Nous Choisir
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              L'Excellence Au Service De Votre Déménagement
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Depuis plus de 25 ans, nous mettons notre expertise au service des particuliers 
              et des entreprises pour des déménagements réussis. Notre engagement : 
              votre satisfaction totale.
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
                  <div className="text-primary-foreground/80">Années d'expérience</div>
                </div>
                <div className="bg-accent rounded-2xl p-8 text-accent-foreground">
                  <Award className="w-10 h-10 mb-4" />
                  <div className="font-semibold">Certifié Qualité</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-secondary rounded-2xl p-8">
                  <HeartHandshake className="w-10 h-10 text-accent mb-4" />
                  <div className="font-semibold text-foreground">Service Client Dédié</div>
                </div>
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-primary-foreground/80">Clients satisfaits</div>
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
