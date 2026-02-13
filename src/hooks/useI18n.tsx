import { createContext, useContext, useState, ReactNode } from "react";

type Language = "de" | "fr" | "en";

interface Translations {
  [key: string]: { de: string; fr: string; en: string };
}

const translations: Translations = {
  // Navigation
  "nav.home": { de: "Startseite", fr: "Accueil", en: "Home" },
  "nav.services": { de: "Leistungen", fr: "Services", en: "Services" },
  "nav.about": { de: "Über uns", fr: "À propos", en: "About" },
  "nav.gallery": { de: "Galerie", fr: "Galerie", en: "Gallery" },
  "nav.prices": { de: "Preise", fr: "Tarifs", en: "Prices" },
  "nav.calculator": { de: "Preisrechner", fr: "Calculateur", en: "Calculator" },
  "nav.reviews": { de: "Bewertungen", fr: "Avis", en: "Reviews" },
  "nav.blog": { de: "Blog", fr: "Blog", en: "Blog" },
  "nav.checklist": { de: "Checkliste", fr: "Checklist", en: "Checklist" },
  "nav.requests": { de: "Anfragen", fr: "Demandes", en: "Requests" },
  "nav.myArea": { de: "Mein Bereich", fr: "Mon espace", en: "My Area" },
  "nav.freeQuote": { de: "Kostenloses Angebot", fr: "Devis gratuit", en: "Free Quote" },

  // Common
  "common.learnMore": { de: "Mehr erfahren", fr: "En savoir plus", en: "Learn more" },
  "common.contact": { de: "Kontakt", fr: "Contact", en: "Contact" },
  "common.submit": { de: "Absenden", fr: "Envoyer", en: "Submit" },
  "common.save": { de: "Speichern", fr: "Sauvegarder", en: "Save" },
  "common.loading": { de: "Laden...", fr: "Chargement...", en: "Loading..." },

  // Hero
  "hero.title": { de: "Ihr professioneller Umzugspartner", fr: "Votre partenaire de déménagement professionnel", en: "Your Professional Moving Partner" },
  "hero.subtitle": { de: "Über 25 Jahre Erfahrung, 50.000+ zufriedene Kunden", fr: "Plus de 25 ans d'expérience, 50 000+ clients satisfaits", en: "Over 25 years of experience, 50,000+ satisfied customers" },

  // Footer
  "footer.rights": { de: "Alle Rechte vorbehalten.", fr: "Tous droits réservés.", en: "All rights reserved." },
  "footer.imprint": { de: "Impressum", fr: "Mentions légales", en: "Imprint" },
  "footer.privacy": { de: "Datenschutz", fr: "Confidentialité", en: "Privacy" },
  "footer.terms": { de: "AGB", fr: "CGV", en: "Terms" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("lang") as Language) || "de";
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];
