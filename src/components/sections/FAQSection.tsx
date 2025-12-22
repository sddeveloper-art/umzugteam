import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment obtenir un devis pour mon déménagement ?",
    answer: "Vous pouvez obtenir un devis gratuit en remplissant notre formulaire en ligne en haut de cette page, ou en nous appelant directement au 01 23 45 67 89. Un conseiller vous rappellera sous 2 heures pour affiner l'estimation selon vos besoins spécifiques.",
  },
  {
    question: "Mes biens sont-ils assurés pendant le déménagement ?",
    answer: "Oui, tous vos biens sont couverts par notre assurance professionnelle pendant le transport. Pour les objets de valeur exceptionnelle (œuvres d'art, antiquités), nous proposons une assurance complémentaire ad valorem. Le détail des garanties est inclus dans votre devis.",
  },
  {
    question: "Proposez-vous un service d'emballage ?",
    answer: "Absolument ! Nous offrons un service d'emballage complet : fourniture des cartons et matériaux, emballage professionnel de vos affaires, protection spéciale pour objets fragiles, et étiquetage organisé. Ce service peut être partiel ou total selon vos préférences.",
  },
  {
    question: "Quels sont vos délais de préavis ?",
    answer: "Pour un déménagement standard, nous recommandons de réserver 2 à 3 semaines à l'avance. Pour les périodes chargées (fin de mois, été), prévoyez 4 à 6 semaines. En cas d'urgence, nous faisons notre maximum pour vous accommoder.",
  },
  {
    question: "Proposez-vous des déménagements le week-end ?",
    answer: "Oui, nous proposons des créneaux le samedi et, sur demande, le dimanche. Cette flexibilité est particulièrement appréciée par les entreprises souhaitant minimiser l'impact sur leur activité. Des frais supplémentaires peuvent s'appliquer.",
  },
  {
    question: "Que se passe-t-il en cas de retard ou de problème ?",
    answer: "Nous nous engageons sur la ponctualité. En cas de retard exceptionnel (trafic, météo), vous êtes immédiatement prévenu. Si un dommage survient, notre procédure de réclamation est simple et rapide : déclaration sous 48h, expertise et indemnisation selon les garanties.",
  },
  {
    question: "Effectuez-vous des déménagements internationaux ?",
    answer: "Oui, nous réalisons des déménagements dans toute l'Europe et à l'international. Nous gérons les formalités douanières, le transport maritime ou aérien selon la destination, et vous accompagnons dans toutes les démarches administratives.",
  },
  {
    question: "Comment fonctionne le stockage de meubles ?",
    answer: "Nos garde-meubles sont sécurisés 24/7, climatisés et accessibles sur rendez-vous. Vous pouvez stocker vos biens pour une durée minimale d'un mois, renouvelable. Un inventaire détaillé est établi à l'entrée pour garantir la traçabilité.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Trouvez rapidement les réponses à vos questions. 
            Notre équipe reste disponible pour toute précision.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border-none shadow-sm px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
