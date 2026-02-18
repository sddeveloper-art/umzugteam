import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Suspense, lazy, useState, useCallback } from "react";
import RouteCalculator from "@/components/RouteCalculator";
import ContactForm from "@/components/ContactForm";
import { useI18n } from "@/hooks/useI18n";

const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));

interface UserLocation { lat: number; lng: number }

const ContactSection = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const { t } = useI18n();

  const handleRouteCalculated = useCallback((route: { userLocation: UserLocation }) => {
    setUserLocation(route.userLocation);
  }, []);

  return (
    <section id="kontakt" className="py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="text-center text-primary-foreground mb-8">
            <span className="inline-block text-accent font-semibold mb-4">{t("contact.serviceBadge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold">{t("contact.serviceTitle")}</h2>
            <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">{t("contact.serviceSubtitle")}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[450px]">
            <Suspense fallback={<div className="w-full h-full bg-muted flex items-center justify-center"><div className="animate-pulse text-muted-foreground">{t("contact.mapLoading")}</div></div>}>
              <ServiceAreaMap userLocation={userLocation} />
            </Suspense>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 text-primary-foreground"><div className="w-4 h-4 rounded-full bg-accent" /><span className="text-sm">{t("contact.mainLocation")}</span></div>
              <div className="flex items-center gap-2 text-primary-foreground"><div className="w-4 h-4 rounded-full bg-primary-foreground" /><span className="text-sm">{t("contact.serviceAreas")}</span></div>
              <div className="flex items-center gap-2 text-primary-foreground"><div className="w-4 h-4 rounded-full border-2 border-accent bg-accent/20" /><span className="text-sm">{t("contact.extendedArea")}</span></div>
              {userLocation && (<div className="flex items-center gap-2 text-primary-foreground"><div className="w-4 h-4 rounded-full bg-accent" /><span className="text-sm">{t("contact.yourLocation")}</span></div>)}
            </div>
            <RouteCalculator onRouteCalculated={handleRouteCalculated} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="text-primary-foreground">
            <span className="inline-block text-accent font-semibold mb-4">{t("contact.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("contact.title")}</h2>
            <p className="text-lg text-primary-foreground/80 mb-10">{t("contact.subtitle")}</p>
            <div className="space-y-6">
              <a href="tel:+4915166532563" className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors"><Phone className="w-6 h-6" /></div>
                <div><div className="text-sm text-primary-foreground/60">{t("contact.phone")}</div><div className="text-lg font-semibold group-hover:text-accent transition-colors">+49 151 66532563</div></div>
              </a>
              <a href="mailto:office@umzugteam365.de" className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors"><Mail className="w-6 h-6" /></div>
                <div><div className="text-sm text-primary-foreground/60">{t("contact.emailLabel")}</div><div className="text-lg font-semibold group-hover:text-accent transition-colors">office@umzugteam365.de</div></div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
                <div><div className="text-sm text-primary-foreground/60">{t("contact.address")}</div><div className="text-lg font-semibold">Musterstraße 123, 10115 Berlin</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
                <div><div className="text-sm text-primary-foreground/60">{t("contact.hours")}</div><div className="text-lg font-semibold">{t("contact.hoursValue")}</div></div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
