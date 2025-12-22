import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold">
                Déménagement<span className="text-accent">Pro</span>
              </span>
            </div>
            <p className="text-background/70 mb-6">
              Votre partenaire de confiance pour tous vos déménagements depuis plus de 25 ans. 
              Qualité, fiabilité et satisfaction garanties.
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
            <h4 className="text-lg font-semibold mb-6">Nos Services</h4>
            <ul className="space-y-3">
              {[
                "Déménagement résidentiel",
                "Déménagement entreprise",
                "Service d'emballage",
                "Stockage & garde-meubles",
                "Nettoyage",
                "Objets spéciaux",
              ].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-background/70 hover:text-accent transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liens Utiles</h4>
            <ul className="space-y-3">
              {[
                { label: "À propos", href: "#avantages" },
                { label: "Nos garanties", href: "#avantages" },
                { label: "Témoignages", href: "#temoignages" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
                { label: "Devis gratuit", href: "#accueil" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+33123456789" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Phone className="w-5 h-5 text-accent" />
                  01 23 45 67 89
                </a>
              </li>
              <li>
                <a href="mailto:contact@demenagement-pro.fr" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Mail className="w-5 h-5 text-accent" />
                  contact@demenagement-pro.fr
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                123 Avenue du Déménagement<br />
                75001 Paris, France
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <div>
              © {currentYear} DéménagementPro. Tous droits réservés.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-accent transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-accent transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
