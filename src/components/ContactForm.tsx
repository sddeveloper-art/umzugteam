import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate sending - in production, this would call an edge function
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Nachricht erfolgreich gesendet!",
        description: "Wir werden uns so schnell wie möglich bei Ihnen melden.",
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
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
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Vielen Dank für Ihre Nachricht!
        </h3>
        <p className="text-muted-foreground mb-6">
          Wir haben Ihre Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
        </p>
        <Button
          variant="accent"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              subject: "",
              message: "",
            });
          }}
        >
          Neue Nachricht senden
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Senden Sie Uns Eine Nachricht
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Vorname *
            </label>
            <input
              type="text"
              placeholder="Max"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nachname *
            </label>
            <input
              type="text"
              placeholder="Mustermann"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            E-Mail *
          </label>
          <input
            type="email"
            placeholder="max.mustermann@email.de"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Telefon
          </label>
          <input
            type="tel"
            placeholder="01XX XXX XXXX"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Betreff *
          </label>
          <select
            value={formData.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Bitte wählen</option>
            <option value="devis">Angebotsanfrage</option>
            <option value="info">Allgemeine Information</option>
            <option value="reclamation">Beschwerde</option>
            <option value="partenariat">Partnerschaft</option>
            <option value="autre">Sonstiges</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nachricht *
          </label>
          <textarea
            rows={4}
            placeholder="Beschreiben Sie Ihr Projekt oder stellen Sie Ihre Fragen..."
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          variant="accent"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Nachricht Senden
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
