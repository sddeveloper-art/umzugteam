import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import QuoteSection from "@/components/sections/QuoteSection";

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
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <ServicesSection />
        <QuoteSection />
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
