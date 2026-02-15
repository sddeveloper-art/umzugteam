import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import QuoteSection from "@/components/sections/QuoteSection";
import PriceComparisonSection from "@/components/sections/PriceComparisonSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>UmzugTeam365 - Professioneller Umzugsservice | Kostenloses Angebot</title>
        <meta 
          name="description" 
          content="UmzugTeam365: Ihr Experte für Privat- und Firmenumzüge. Über 25 Jahre Erfahrung, kostenloses Angebot, Vollversicherung. Fordern Sie Ihre Schätzung in 2 Minuten an." 
        />
        <meta name="keywords" content="Umzug, Umzugsunternehmen, professioneller Umzug, Möbellagerung, Verpackung, Möbeltransport, Berlin, Deutschland" />
        <link rel="canonical" href="https://umzugteam365.de" />
        <html lang="de" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            name: "UmzugTeam365",
            url: "https://umzugteam365.de",
            logo: "https://umzugteam365.de/favicon.ico",
            description: "Professioneller Umzugsservice in ganz Deutschland. Privat- und Firmenumzüge, Verpackungsservice, Möbellagerung.",
            telephone: "+4915166532563",
            priceRange: "ab 299€",
            address: { "@type": "PostalAddress", addressCountry: "DE" },
            areaServed: { "@type": "Country", name: "Deutschland" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "2847", bestRating: "5" },
            sameAs: [],
            foundingDate: "1998",
            numberOfEmployees: { "@type": "QuantitativeValue", value: "120" },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Wie erhalte ich ein Angebot für meinen Umzug?", acceptedAnswer: { "@type": "Answer", text: "Sie können ein kostenloses Angebot erhalten, indem Sie unser Online-Formular ausfüllen oder uns unter +49 151 66532563 anrufen." }},
              { "@type": "Question", name: "Sind meine Güter während des Umzugs versichert?", acceptedAnswer: { "@type": "Answer", text: "Ja, alle Güter sind durch unsere Berufsversicherung abgedeckt. Für Gegenstände von außergewöhnlichem Wert bieten wir zusätzliche Wertversicherung." }},
              { "@type": "Question", name: "Bieten Sie einen Verpackungsservice an?", acceptedAnswer: { "@type": "Answer", text: "Ja, wir bieten kompletten Verpackungsservice: Lieferung von Kartons, professionelles Verpacken, Spezialschutz für zerbrechliche Gegenstände." }},
              { "@type": "Question", name: "Wie lange im Voraus sollte ich buchen?", acceptedAnswer: { "@type": "Answer", text: "Für Standardumzüge empfehlen wir 2-3 Wochen Vorlauf, in Stoßzeiten 4-6 Wochen." }},
              { "@type": "Question", name: "Führen Sie internationale Umzüge durch?", acceptedAnswer: { "@type": "Answer", text: "Ja, wir führen Umzüge in ganz Europa und international durch, inklusive Zollformalitäten." }},
            ],
          })}
        </script>
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <ServicesSection />
        <PackagesSection />
        <QuoteSection />
        <PriceComparisonSection />
        <AdvantagesSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
};

export default Index;
