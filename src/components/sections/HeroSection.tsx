import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import heroImage from "@/assets/hero-moving.jpg";

const HeroSection = () => {
  return (
    <section id="startseite" className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professionelles Umzugsteam"
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
              <span className="text-sm font-medium">Über 15.000 erfolgreiche Umzüge</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Ihr Umzug
              <span className="block text-accent">Ohne Stress</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg">
              Engagierte Experten für einen sorglosen Umzug. Komplettservice, transparente Preise, garantierte Zufriedenheit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="hero" size="xl" className="group">
                Kostenloses Angebot anfordern
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Unsere Leistungen
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                "Kostenlose Beratung",
                "Transparente Preise",
                "Versicherung inklusive",
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
                Schnelles & Kostenloses Angebot
              </h2>
              <p className="text-muted-foreground mb-6">
                Erhalten Sie Ihre Schätzung in weniger als 2 Minuten
              </p>

              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Abholort *
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Berlin"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Zielort *
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. München"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Wohnungstyp *
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Bitte wählen...</option>
                    <option value="studio">1-Zimmer-Wohnung</option>
                    <option value="t2">2-Zimmer-Wohnung</option>
                    <option value="t3">3-Zimmer-Wohnung</option>
                    <option value="t4">4-Zimmer-Wohnung</option>
                    <option value="maison">Haus</option>
                    <option value="bureau">Büro / Gewerbe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Wunschtermin
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ihr Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Vollständiger Name"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="01XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    placeholder="ihre@email.de"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <Button variant="accent" size="xl" className="w-full">
                  Kostenloses Angebot erhalten
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Mit dem Absenden dieses Formulars stimmen Sie zu, für Ihr Angebot kontaktiert zu werden.
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
