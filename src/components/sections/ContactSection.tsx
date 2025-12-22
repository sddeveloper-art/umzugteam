import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact info */}
          <div className="text-primary-foreground">
            <span className="inline-block text-accent font-semibold mb-4">
              Contact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Parlons De Votre Projet
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10">
              Vous avez des questions ou souhaitez discuter de votre déménagement ? 
              Notre équipe est à votre écoute pour vous accompagner.
            </p>

            <div className="space-y-6">
              <a 
                href="tel:+33123456789"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Téléphone</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">
                    01 23 45 67 89
                  </div>
                </div>
              </a>

              <a 
                href="mailto:contact@demenagement-pro.fr"
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Email</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">
                    contact@demenagement-pro.fr
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Adresse</div>
                  <div className="text-lg font-semibold">
                    123 Avenue du Déménagement, 75001 Paris
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60">Horaires</div>
                  <div className="text-lg font-semibold">
                    Lun-Sam : 8h00 - 19h00
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact form */}
          <div className="bg-card rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Envoyez-nous un Message
            </h3>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    placeholder="Jean"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="jean.dupont@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="06 XX XX XX XX"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sujet *
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Sélectionnez un sujet</option>
                  <option value="devis">Demande de devis</option>
                  <option value="info">Information générale</option>
                  <option value="reclamation">Réclamation</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre projet ou posez vos questions..."
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <Button variant="accent" size="xl" className="w-full">
                <Send className="w-5 h-5" />
                Envoyer le Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
