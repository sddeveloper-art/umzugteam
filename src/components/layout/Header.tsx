import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavGroup {
  label: string;
  items: { label: string; href: string; isRoute: boolean }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Leistungen",
    items: [
      { label: "Startseite", href: "#startseite", isRoute: false },
      { label: "Unsere Leistungen", href: "#leistungen", isRoute: false },
      { label: "Preise", href: "/preise", isRoute: true },
      { label: "Preisrechner", href: "/preisrechner", isRoute: true },
    ],
  },
  {
    label: "Entdecken",
    items: [
      { label: "Über uns", href: "/ueber-uns", isRoute: true },
      { label: "Galerie", href: "/galerie", isRoute: true },
      { label: "Blog", href: "/blog", isRoute: true },
      { label: "Bewertungen", href: "/bewertungen", isRoute: true },
    ],
  },
  {
    label: "Standorte",
    items: [
      { label: "Städte", href: "/staedte", isRoute: true },
      { label: "Bundesländer", href: "/bundeslaender", isRoute: true },
      { label: "Umzugsrouten", href: "/umzugsrouten", isRoute: true },
    ],
  },
];

const directLinks = [
  { label: "Checkliste", href: "/checkliste", isRoute: true },
  { label: "Anfragen", href: "/anfragen", isRoute: true },
];

const DropdownMenu = ({ group, location }: { group: NavGroup; location: ReturnType<typeof useLocation> }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-foreground/70 hover:text-foreground font-medium transition-colors text-sm"
      >
        {group.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-3 w-52 bg-card rounded-xl shadow-xl border border-border p-2 animate-fade-in z-50">
          {group.items.map((item) =>
            item.isRoute ? (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-foreground/80 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={location.pathname === "/" ? item.href : "/" + item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-foreground/80 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+4915166532563" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+49 151 66532563</span>
            </a>
            <a href="mailto:office@umzugteam365.de" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>office@umzugteam365.de</span>
            </a>
          </div>
          <div className="text-primary-foreground/70 hidden sm:block">
            ★ Kostenloses Angebot in 2 Minuten
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-card/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-accent-foreground font-bold text-lg">U</span>
              </div>
              <span className="text-lg font-display font-bold text-foreground">
                Umzug<span className="text-accent">Team365</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navGroups.map((group) => (
                <DropdownMenu key={group.label} group={group} location={location} />
              ))}
              {directLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground/70 hover:text-foreground font-medium transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link to="/dashboard" className="text-sm text-foreground/70 hover:text-foreground font-medium transition-colors px-3">
                Mein Bereich
              </Link>
              <a href={location.pathname === "/" ? "#kostenrechner" : "/#kostenrechner"}>
                <Button variant="accent" size="default" className="shadow-md">
                  Kostenloses Angebot
                </Button>
              </a>
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
            <div className="lg:hidden mt-3 pb-4 border-t border-border pt-4 animate-fade-in">
              <div className="flex flex-col gap-1">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                      className="flex items-center justify-between w-full py-2.5 px-2 text-foreground font-medium text-sm rounded-lg hover:bg-secondary transition-colors"
                    >
                      {group.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === group.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === group.label && (
                      <div className="pl-4 pb-2 space-y-1">
                        {group.items.map((item) =>
                          item.isRoute ? (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 px-2 text-sm text-foreground/70 hover:text-accent rounded-lg transition-colors"
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <a
                              key={item.href}
                              href={location.pathname === "/" ? item.href : "/" + item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 px-2 text-sm text-foreground/70 hover:text-accent rounded-lg transition-colors"
                            >
                              {item.label}
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {directLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 px-2 text-foreground/80 font-medium text-sm rounded-lg hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 px-2 text-foreground/80 font-medium text-sm rounded-lg hover:bg-secondary transition-colors"
                >
                  Mein Bereich
                </Link>
                <a href={location.pathname === "/" ? "#kostenrechner" : "/#kostenrechner"}>
                  <Button variant="accent" className="mt-3 w-full">
                    Kostenloses Angebot
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
