import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Startseite", href: "#startseite", isRoute: false },
    { label: "Leistungen", href: "#leistungen", isRoute: false },
    { label: "Vorteile", href: "#vorteile", isRoute: false },
    { label: "Preisvergleich", href: "/preisvergleich", isRoute: true },
    { label: "Bewertungen", href: "#bewertungen", isRoute: false },
    { label: "FAQ", href: "#faq", isRoute: false },
    { label: "Kontakt", href: "#kontakt", isRoute: false },
  ];

  const handleNavClick = (href: string, isRoute: boolean) => {
    if (!isRoute && location.pathname !== "/") {
      window.location.href = "/" + href;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+4915166532563" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              <span>+49 151 66532563</span>
            </a>
            <a href="mailto:office@umzugteam365.de" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="w-4 h-4" />
              <span>office@umzugteam365.de</span>
            </a>
          </div>
          <div className="text-primary-foreground/80">
            Kostenloses Angebot in 2 Minuten
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">U</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Umzug<span className="text-accent">Team365</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => 
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground/80 hover:text-accent font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={location.pathname === "/" ? link.href : "/" + link.href}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="text-foreground/80 hover:text-accent font-medium transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="hidden lg:block">
            <Button variant="accent" size="lg">
              Kostenloses Angebot
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Menü umschalten"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => 
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground/80 hover:text-accent font-medium transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={location.pathname === "/" ? link.href : "/" + link.href}
                    onClick={() => {
                      handleNavClick(link.href, link.isRoute);
                      setIsMenuOpen(false);
                    }}
                    className="text-foreground/80 hover:text-accent font-medium transition-colors py-2"
                  >
                    {link.label}
                  </a>
                )
              )}
              <Button variant="accent" className="mt-2">
                Kostenloses Angebot
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
