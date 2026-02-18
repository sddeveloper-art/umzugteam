import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "", lastName: "", email: "", phone: "", subject: "", message: "",
  });

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({ title: t("hero.fillRequired"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone, subject: formData.subject, message: formData.message },
      });
      if (error) throw error;
      toast({ title: t("contactForm.sentSuccess"), description: t("contactForm.sentDesc") });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast({ title: t("common.error"), description: t("hero.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">{t("contactForm.successTitle")}</h3>
        <p className="text-muted-foreground mb-6">{t("contactForm.successDesc")}</p>
        <Button variant="accent" onClick={() => { setIsSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }}>
          {t("contactForm.newMessage")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-foreground mb-6">{t("contactForm.title")}</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.firstName")} *</label>
            <input type="text" placeholder="Max" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.lastName")} *</label>
            <input type="text" placeholder="Mustermann" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.email")} *</label>
          <input type="email" placeholder="max.mustermann@email.de" value={formData.email} onChange={(e) => updateField("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.phone")}</label>
          <input type="tel" placeholder="01XX XXX XXXX" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.subject")} *</label>
          <select value={formData.subject} onChange={(e) => updateField("subject", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent" required>
            <option value="">{t("contactForm.subjectSelect")}</option>
            <option value="devis">{t("contactForm.subjectQuote")}</option>
            <option value="info">{t("contactForm.subjectInfo")}</option>
            <option value="reclamation">{t("contactForm.subjectComplaint")}</option>
            <option value="partenariat">{t("contactForm.subjectPartnership")}</option>
            <option value="autre">{t("contactForm.subjectOther")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("contactForm.message")} *</label>
          <textarea rows={4} placeholder={t("contactForm.messagePlaceholder")} value={formData.message} onChange={(e) => updateField("message", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" required />
        </div>
        <Button type="submit" variant="accent" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />{t("contactForm.sending")}</>) : (<><Send className="w-5 h-5" />{t("contactForm.send")}</>)}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
