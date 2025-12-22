import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import heroImage from "@/assets/hero-moving.jpg";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Équipe de déménagement professionnelle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-section opacity-90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-primary-foreground animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium">Plus de 15 000 déménagements réussis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Votre Déménagement
              <span className="block text-accent">Sans Stress</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg">
              Des experts dévoués pour un déménagement serein. Service complet, tarifs transparents, satisfaction garantie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="hero" size="xl" className="group">
                Demander un Devis Gratuit
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Nos Services
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                "Devis gratuit",
                "Prix transparent",
                "Assurance incluse",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-primary-foreground/90">
                  <Check className="w-5 h-5 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Quote form */}
          <div className="animate-slide-up delay-200">
            <div className="bg-card rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Devis Rapide & Gratuit
              </h2>
              <p className="text-muted-foreground mb-6">
                Recevez votre estimation en moins de 2 minutes
              </p>

              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ville de départ *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Paris"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ville d'arrivée *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Lyon"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type de logement *
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Sélectionnez...</option>
                    <option value="studio">Studio</option>
                    <option value="t2">T2 (2 pièces)</option>
                    <option value="t3">T3 (3 pièces)</option>
                    <option value="t4">T4 (4 pièces)</option>
                    <option value="maison">Maison</option>
                    <option value="bureau">Bureau / Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      placeholder="06 XX XX XX XX"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <Button variant="accent" size="xl" className="w-full">
                  Recevoir Mon Devis Gratuit
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  En soumettant ce formulaire, vous acceptez d'être contacté pour votre devis.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
