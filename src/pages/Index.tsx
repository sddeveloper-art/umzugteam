import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AdvantagesSection from "@/components/sections/AdvantagesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>DéménagementPro - Service de Déménagement Professionnel | Devis Gratuit</title>
        <meta 
          name="description" 
          content="DéménagementPro : votre expert en déménagement résidentiel et professionnel. Plus de 25 ans d'expérience, devis gratuit, assurance complète. Demandez votre estimation en 2 minutes." 
        />
        <meta name="keywords" content="déménagement, déménageur, déménagement professionnel, garde-meubles, emballage, transport meubles" />
        <link rel="canonical" href="https://demenagement-pro.fr" />
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <ServicesSection />
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
