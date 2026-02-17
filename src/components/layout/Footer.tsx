import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    "Privatumzug", "Firmenumzug", "Verpackungsservice",
    "Lagerung & Einlagerung", "Reinigung", "Spezialtransporte",
  ];

  const quickLinks = [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Galerie", href: "/galerie" },
    { label: "Blog & Ratgeber", href: "/blog" },
    { label: "Checkliste", href: "/checkliste" },
    { label: "Preisvergleich", href: "/preisvergleich" },
    { label: "Umzugsanfragen", href: "/anfragen" },
    { label: "Städte", href: "/staedte" },
    { label: "Bundesländer", href: "/bundeslaender" },
    { label: "Umzugsrouten", href: "/umzugsrouten" },
    { label: "FAQ", href: "/#faq" },
    { label: "Kontakt", href: "/#kontakt" },
    { label: "Kostenloses Angebot", href: "/#kostenrechner" },
  ];

  return (
    <footer ref={ref} className="bg-primary text-primary-foreground">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">U</span>
              </div>
              <span className="text-lg font-display font-bold">
                Umzug<span className="text-accent">Team365</span>
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Ihr vertrauenswürdiger Partner für alle Umzüge seit über 25 Jahren.
              Qualität, Zuverlässigkeit und garantierte Zufriedenheit.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-primary-foreground/8 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wider text-accent mb-6">
              Leistungen
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a href="#leistungen" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wider text-accent mb-6">
              Nützliche Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-display font-semibold uppercase tracking-wider text-accent mb-6">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+4915166532563" className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                  +49 151 66532563
                </a>
              </li>
              <li>
                <a href="mailto:office@umzugteam365.de" className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                  office@umzugteam365.de
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                Musterstraße 123<br />10115 Berlin, Deutschland
              </li>
            </ul>
            <div className="mt-6 p-4 bg-primary-foreground/5 rounded-xl border border-primary-foreground/10">
              <h5 className="text-xs font-semibold mb-2 text-accent">Bankverbindung</h5>
              <p className="text-xs text-primary-foreground/50 leading-relaxed">
                IBAN: BE54 6500 7175 7997<br />
                Zahlung per Überweisung
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/40">
            <div>© {currentYear} UmzugTeam365. Alle Rechte vorbehalten.</div>
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
