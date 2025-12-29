import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Suspense, lazy } from "react";

const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));

const ContactSection = () => {
  return (
    <section id="kontakt" className="py-24 bg-primary">
      <div className="container mx-auto px-4">
        {/* Map Section */}
        <div className="mb-16">
          <div className="text-center text-primary-foreground mb-8">
            <span className="inline-block text-accent font-semibold mb-4">
              Unser Servicegebiet
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Wir Sind In Ganz Berlin & Brandenburg Für Sie Da
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">
              Klicken Sie auf die Markierungen, um mehr über unsere Servicebereiche zu erfahren
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[450px]">
            <Suspense fallback={
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Karte wird geladen...</div>
              </div>
            }>
              <ServiceAreaMap />
            </Suspense>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-primary-foreground">
              <div className="w-4 h-4 rounded-full bg-accent" />
              <span className="text-sm">Hauptstandort</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <div className="w-4 h-4 rounded-full bg-primary-foreground" />
              <span className="text-sm">Servicebereiche</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-accent bg-accent/20" />
              <span className="text-sm">Erweitertes Gebiet (25km)</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact info */}
          <div className="text-primary-foreground">
            <span className="inline-block text-accent font-semibold mb-4">
              Kontakt
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sprechen Wir Über Ihr Projekt
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10">
              Haben Sie Fragen oder möchten Sie Ihren Umzug besprechen? 
              Unser Team steht Ihnen zur Seite.
            </p>

            <div className="space-y-6">
              <a 
                href="tel:+4915166532563"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Telefon</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">
                    +49 151 66532563
                  </div>
                </div>
              </a>

              <a 
                href="mailto:office@umzugteam365.de"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">E-Mail</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">
                    office@umzugteam365.de
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Adresse</div>
                  <div className="text-lg font-semibold">
                    Musterstraße 123, 10115 Berlin
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Öffnungszeiten</div>
                  <div className="text-lg font-semibold">
                    Mo-Sa: 08:00 - 19:00 Uhr
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact form */}
          <div className="bg-card rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Senden Sie Uns Eine Nachricht
            </h3>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    placeholder="Max"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    placeholder="Mustermann"
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
                  placeholder="max.mustermann@email.de"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  placeholder="01XX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Betreff *
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Bitte wählen</option>
                  <option value="devis">Angebotsanfrage</option>
                  <option value="info">Allgemeine Information</option>
                  <option value="reclamation">Beschwerde</option>
                  <option value="partenariat">Partnerschaft</option>
                  <option value="autre">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nachricht *
                </label>
                <textarea
                  rows={4}
                  placeholder="Beschreiben Sie Ihr Projekt oder stellen Sie Ihre Fragen..."
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <Button variant="accent" size="xl" className="w-full">
                <Send className="w-5 h-5" />
                Nachricht Senden
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
