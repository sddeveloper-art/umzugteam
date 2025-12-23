import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Wie erhalte ich ein Angebot für meinen Umzug?",
    answer: "Sie können ein kostenloses Angebot erhalten, indem Sie unser Online-Formular oben auf dieser Seite ausfüllen oder uns direkt unter +49 151 66532563 anrufen. Ein Berater wird Sie innerhalb von 2 Stunden zurückrufen, um die Schätzung nach Ihren spezifischen Bedürfnissen zu verfeinern.",
  },
  {
    question: "Sind meine Güter während des Umzugs versichert?",
    answer: "Ja, alle Ihre Güter sind während des Transports durch unsere Berufsversicherung abgedeckt. Für Gegenstände von außergewöhnlichem Wert (Kunstwerke, Antiquitäten) bieten wir eine zusätzliche Wertversicherung an. Die Garantiedetails sind in Ihrem Angebot enthalten.",
  },
  {
    question: "Bieten Sie einen Verpackungsservice an?",
    answer: "Absolut! Wir bieten einen kompletten Verpackungsservice: Lieferung von Kartons und Materialien, professionelles Verpacken Ihrer Sachen, Spezialschutz für zerbrechliche Gegenstände und organisierte Beschriftung. Dieser Service kann je nach Ihren Wünschen teil- oder vollständig sein.",
  },
  {
    question: "Wie lange im Voraus sollte ich buchen?",
    answer: "Für einen Standardumzug empfehlen wir eine Reservierung 2 bis 3 Wochen im Voraus. In Stoßzeiten (Monatsende, Sommer) planen Sie 4 bis 6 Wochen ein. Bei Eilaufträgen tun wir unser Bestes, um Ihnen entgegenzukommen.",
  },
  {
    question: "Bieten Sie Wochenendumzüge an?",
    answer: "Ja, wir bieten Termine am Samstag und auf Anfrage auch am Sonntag an. Diese Flexibilität wird besonders von Unternehmen geschätzt, die die Auswirkungen auf ihren Betrieb minimieren möchten. Es können zusätzliche Gebühren anfallen.",
  },
  {
    question: "Was passiert bei Verspätung oder Problemen?",
    answer: "Wir verpflichten uns zur Pünktlichkeit. Bei ausnahmsweisen Verspätungen (Verkehr, Wetter) werden Sie sofort informiert. Bei Schäden ist unser Reklamationsverfahren einfach und schnell: Meldung innerhalb von 48 Stunden, Begutachtung und Entschädigung gemäß den Garantien.",
  },
  {
    question: "Führen Sie internationale Umzüge durch?",
    answer: "Ja, wir führen Umzüge in ganz Europa und international durch. Wir kümmern uns um Zollformalitäten, See- oder Lufttransport je nach Zielort und begleiten Sie bei allen administrativen Schritten.",
  },
  {
    question: "Wie funktioniert die Möbellagerung?",
    answer: "Unsere Lagerräume sind 24/7 gesichert, klimatisiert und nach Terminvereinbarung zugänglich. Sie können Ihre Güter für eine Mindestdauer von einem Monat lagern, verlängerbar. Bei der Einlagerung wird ein detailliertes Inventar erstellt, um die Rückverfolgbarkeit zu gewährleisten.",
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
            Häufig Gestellte Fragen
          </h2>
          <p className="text-lg text-muted-foreground">
            Finden Sie schnell Antworten auf Ihre Fragen. 
            Unser Team steht für weitere Auskünfte zur Verfügung.
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
