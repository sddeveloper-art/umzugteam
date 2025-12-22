import { 
  Truck, 
  Package, 
  Warehouse, 
  Sparkles, 
  Shield, 
  Clock,
  Building,
  Piano
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Déménagement Résidentiel",
    description: "Service complet pour votre déménagement privé, du studio à la grande maison.",
    features: ["Chargement & déchargement", "Transport sécurisé", "Équipe qualifiée"],
  },
  {
    icon: Building,
    title: "Déménagement Entreprise",
    description: "Solutions sur mesure pour les bureaux, commerces et entreprises.",
    features: ["Planification stratégique", "Minimum d'interruption", "Week-end possible"],
  },
  {
    icon: Package,
    title: "Service d'Emballage",
    description: "Emballage professionnel de vos biens avec matériaux de qualité.",
    features: ["Cartons renforcés", "Protection bulles", "Étiquetage organisé"],
  },
  {
    icon: Warehouse,
    title: "Stockage & Garde-Meubles",
    description: "Espaces de stockage sécurisés pour vos meubles et effets personnels.",
    features: ["Sécurité 24/7", "Climat contrôlé", "Accès flexible"],
  },
  {
    icon: Sparkles,
    title: "Nettoyage & Remise en État",
    description: "Nettoyage complet de votre ancien ou nouveau logement.",
    features: ["Nettoyage profond", "Produits écologiques", "État des lieux"],
  },
  {
    icon: Piano,
    title: "Objets Spéciaux",
    description: "Transport spécialisé pour pianos, œuvres d'art et objets fragiles.",
    features: ["Équipement adapté", "Équipe spécialisée", "Assurance renforcée"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            Nos Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Des Solutions Complètes Pour Votre Déménagement
          </h2>
          <p className="text-lg text-muted-foreground">
            De l'emballage au stockage, nous vous accompagnons à chaque étape avec professionnalisme et efficacité.
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
              { value: "15 000+", label: "Déménagements" },
              { value: "98%", label: "Clients Satisfaits" },
              { value: "25+", label: "Années d'Expérience" },
              { value: "24/7", label: "Support Client" },
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
