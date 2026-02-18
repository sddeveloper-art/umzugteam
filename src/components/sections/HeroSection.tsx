import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/useI18n";
import heroImage from "@/assets/hero-moving.jpg";

interface QuickQuoteForm {
  fromCity: string; toCity: string; apartmentType: string;
  preferredDate: string; name: string; phone: string; email: string;
}

const HeroSection = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuickQuoteForm>({
    fromCity: "", toCity: "", apartmentType: "", preferredDate: "", name: "", phone: "", email: "",
  });

  const updateField = (field: keyof QuickQuoteForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fromCity || !formData.toCity || !formData.name || !formData.phone || !formData.email) {
      toast({ title: t("hero.fillRequired"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: formData.name, email: formData.email, phone: formData.phone,
          fromCity: formData.fromCity, toCity: formData.toCity,
          apartmentSize: formData.apartmentType || "Nicht angegeben",
          floor: 0, hasElevator: false, needsPacking: false, needsAssembly: false,
          preferredDate: formData.preferredDate, estimatedPrice: 0, distance: 0, volume: 0,
          message: "Schnellanfrage vom Hero-Formular",
        },
      });
      if (error) throw error;
      toast({ title: t("hero.successTitle"), description: t("hero.successDesc") });
      setFormData({ fromCity: "", toCity: "", apartmentType: "", preferredDate: "", name: "", phone: "", email: "" });
    } catch (err) {
      console.error("Error submitting quick quote:", err);
      toast({ title: t("hero.errorTitle"), description: t("hero.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="startseite" className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Professionelles Umzugsteam" className="w-full h-full object-cover" width={1920} height={1080} loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 hero-section opacity-90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium">{t("hero.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("hero.titleLine1")}<span className="block text-accent">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="hero" size="xl" className="group" onClick={() => scrollToSection("kostenrechner")}>
                {t("hero.ctaPrimary")}<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => scrollToSection("leistungen")}>{t("hero.ctaSecondary")}</Button>
            </div>
            <div className="flex flex-wrap gap-6">
              {[t("hero.check1"), t("hero.check2"), t("hero.check3")].map((item) => (
                <div key={item} className="flex items-center gap-2 text-primary-foreground/90"><Check className="w-5 h-5 text-accent" /><span>{item}</span></div>
              ))}
            </div>
          </div>

          <div className="animate-slide-up delay-200">
            <div className="bg-card rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("hero.formTitle")}</h2>
              <p className="text-muted-foreground mb-6">{t("hero.formSubtitle")}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("hero.from")} *</label>
                    <input type="text" placeholder={t("common.egBerlin")} value={formData.fromCity} onChange={(e) => updateField("fromCity", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("hero.to")} *</label>
                    <input type="text" placeholder={t("common.egMunich")} value={formData.toCity} onChange={(e) => updateField("toCity", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("hero.apartmentType")} *</label>
                  <select value={formData.apartmentType} onChange={(e) => updateField("apartmentType", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="">{t("hero.selectPlease")}</option>
                    <option value="studio">{t("hero.studio")}</option>
                    <option value="t2">{t("hero.2rooms")}</option>
                    <option value="t3">{t("hero.3rooms")}</option>
                    <option value="t4">{t("hero.4rooms")}</option>
                    <option value="maison">{t("hero.house")}</option>
                    <option value="bureau">{t("hero.office")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("hero.preferredDate")}</label>
                  <input type="date" value={formData.preferredDate} onChange={(e) => updateField("preferredDate", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("hero.yourName")} *</label>
                    <input type="text" placeholder={t("hero.fullName")} value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("hero.phone")} *</label>
                    <input type="tel" placeholder="01XX XXX XXXX" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("hero.email")} *</label>
                  <input type="email" placeholder="ihre@email.de" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <Button type="submit" variant="accent" size="xl" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />{t("hero.sending")}</>) : t("hero.getQuote")}
                </Button>
                <p className="text-xs text-muted-foreground text-center">{t("hero.formConsent")}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
