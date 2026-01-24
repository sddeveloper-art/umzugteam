import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Suspense, lazy, useState, useCallback } from "react";
import RouteCalculator from "@/components/RouteCalculator";
import ContactForm from "@/components/ContactForm";

const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));

interface UserLocation {
  lat: number;
  lng: number;
}

const ContactSection = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const handleRouteCalculated = useCallback((route: { userLocation: UserLocation }) => {
    setUserLocation(route.userLocation);
  }, []);

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
              <ServiceAreaMap userLocation={userLocation} />
            </Suspense>
          </div>

          {/* Legend and Route Calculator */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
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
              {userLocation && (
                <div className="flex items-center gap-2 text-primary-foreground">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                  <span className="text-sm">Ihr Standort</span>
                </div>
              )}
            </div>
            <RouteCalculator onRouteCalculated={handleRouteCalculated} />
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
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
