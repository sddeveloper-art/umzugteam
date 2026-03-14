import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardList, Users, CheckCircle, ArrowRight, Shield, Clock, Euro } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const steps = [
  {
    icon: ClipboardList,
    titleDe: "1. Anfrage veröffentlichen",
    titleFr: "1. Publiez votre demande",
    descDe: "Beschreiben Sie Ihren Umzug: Abholort, Zielort, Wohnungsgröße und gewünschtes Datum. In weniger als 2 Minuten ist Ihre Anfrage online.",
    descFr: "Décrivez votre déménagement : lieu de départ, destination, taille du logement et date souhaitée. En moins de 2 minutes, votre demande est en ligne.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    titleDe: "2. Angebote erhalten",
    titleFr: "2. Recevez des offres",
    descDe: "Geprüfte Umzugsunternehmen sehen Ihre Anfrage und senden Ihnen konkurrenzfähige Preisangebote. Sie werden in Echtzeit benachrichtigt.",
    descFr: "Des entreprises de déménagement vérifiées voient votre demande et vous envoient des offres compétitives. Vous êtes notifié en temps réel.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: CheckCircle,
    titleDe: "3. Angebot auswählen",
    titleFr: "3. Choisissez votre offre",
    descDe: "Vergleichen Sie die Angebote, prüfen Sie die Bewertungen der Unternehmen und wählen Sie das beste Angebot. Sie behalten die volle Kontrolle.",
    descFr: "Comparez les offres, consultez les avis des entreprises et choisissez la meilleure offre. Vous gardez le contrôle total.",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
];

const benefits = [
  { icon: Shield, de: "100% kostenlos & unverbindlich", fr: "100% gratuit & sans engagement" },
  { icon: Clock, de: "Antwort in wenigen Stunden", fr: "Réponse en quelques heures" },
  { icon: Euro, de: "Bis zu 40% sparen", fr: "Économisez jusqu'à 40%" },
  { icon: Users, de: "Geprüfte Unternehmen", fr: "Entreprises vérifiées" },
];

const HowItWorks = () => {
  const { t, language } = useI18n();
  const de = language === "de";

  return (
    <>
      <Helmet>
        <title>{de ? "So funktioniert's – UmzugTeam365" : "Comment ça marche – UmzugTeam365"}</title>
        <meta name="description" content={de ? "Erfahren Sie, wie einfach es ist, mit UmzugTeam365 den besten Umzugsservice zu finden." : "Découvrez comme il est simple de trouver le meilleur service de déménagement avec UmzugTeam365."} />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {de ? "So funktioniert's" : "Comment ça marche"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {de ? "In 3 einfachen Schritten zum perfekten Umzugsangebot" : "En 3 étapes simples vers l'offre de déménagement parfaite"}
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8 mb-20">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col md:flex-row items-center gap-6 bg-card rounded-2xl p-8 card-elevated"
              >
                <div className={`shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center ${step.color}`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{de ? step.titleDe : step.titleFr}</h2>
                  <p className="text-muted-foreground">{de ? step.descDe : step.descFr}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connector arrows between steps - visual */}
          
          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {de ? "Ihre Vorteile" : "Vos avantages"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-card rounded-xl p-4 card-elevated">
                  <b.icon className="w-6 h-6 text-accent shrink-0" />
                  <span className="text-sm font-medium text-foreground">{de ? b.de : b.fr}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
            <Link to="/anfragen">
              <Button variant="accent" size="xl" className="group">
                {de ? "Jetzt kostenlos anfragen" : "Demander gratuitement"}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HowItWorks;
