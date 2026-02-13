import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">U</span>
              </div>
              <span className="text-xl font-bold">
                Umzug<span className="text-accent">Team365</span>
              </span>
            </div>
            <p className="text-background/70 mb-6">
              Ihr vertrauenswürdiger Partner für alle Umzüge seit über 25 Jahren. 
              Qualität, Zuverlässigkeit und garantierte Zufriedenheit.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Unsere Leistungen</h4>
            <ul className="space-y-3">
              {[
                "Privatumzug",
                "Firmenumzug",
                "Verpackungsservice",
                "Lagerung & Einlagerung",
                "Reinigung",
                "Spezialtransporte",
              ].map((service) => (
                <li key={service}>
                  <a href="#leistungen" className="text-background/70 hover:text-accent transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nützliche Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Über uns", href: "/ueber-uns" },
                { label: "Galerie", href: "/galerie" },
                { label: "Blog & Ratgeber", href: "/blog" },
                { label: "Checkliste", href: "/checkliste" },
                { label: "Preisvergleich", href: "/preisvergleich" },
                { label: "Umzugsanfragen", href: "/anfragen" },
                { label: "FAQ", href: "/#faq" },
                { label: "Kontakt", href: "/#kontakt" },
                { label: "Kostenloses Angebot", href: "/#kostenrechner" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+4915166532563" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Phone className="w-5 h-5 text-accent" />
                  +49 151 66532563
                </a>
              </li>
              <li>
                <a href="mailto:office@umzugteam365.de" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Mail className="w-5 h-5 text-accent" />
                  office@umzugteam365.de
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                Musterstraße 123<br />
                10115 Berlin, Deutschland
              </li>
            </ul>
            <div className="mt-6 p-4 bg-background/5 rounded-xl border border-background/10">
              <h5 className="text-sm font-semibold mb-2 text-accent">Bankverbindung</h5>
              <p className="text-xs text-background/70 leading-relaxed">
                IBAN: BE54 6500 7175 7997<br />
                Zahlung per Überweisung
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <div>
              © {currentYear} UmzugTeam365. Alle Rechte vorbehalten.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Impressum</a>
              <a href="#" className="hover:text-accent transition-colors">Datenschutz</a>
              <a href="#" className="hover:text-accent transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
