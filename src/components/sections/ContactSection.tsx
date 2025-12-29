import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

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
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d310844.2239338461!2d13.144550649999999!3d52.50651305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f035901%3A0x42120465b5e3b70!2sBerlin%2C%20Germany!5e0!3m2!1sen!2s!4v1703865600000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Servicegebiet Berlin & Brandenburg"
            />
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
