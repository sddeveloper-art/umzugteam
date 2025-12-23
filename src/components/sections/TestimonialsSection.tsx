import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Schmidt",
    location: "Berlin → München",
    rating: 5,
    text: "Außergewöhnliches Team! Sie haben unseren Familienumzug mit bemerkenswerter Professionalität abgewickelt. Alles war perfekt verpackt und nichts wurde beschädigt. Ich empfehle sie wärmstens!",
    date: "November 2024",
  },
  {
    name: "Hans-Peter Müller",
    location: "Hamburg → Frankfurt",
    rating: 5,
    text: "Firmenumzug an einem Wochenende durchgeführt. Pünktliches, effizientes und sehr organisiertes Team. Das Büro war am Montagmorgen betriebsbereit. Tadelloser Service!",
    date: "Oktober 2024",
  },
  {
    name: "Sophie Weber",
    location: "Köln → Stuttgart",
    rating: 5,
    text: "Erster Umzug und wirklich eine ausgezeichnete Erfahrung. Das Team hat mich bei jedem Schritt begleitet, das Angebot war präzise und ohne Überraschungen. Danke für diesen Qualitätsservice!",
    date: "September 2024",
  },
  {
    name: "Thomas Fischer",
    location: "Düsseldorf → Dresden",
    rating: 5,
    text: "Transport meines Flügels mit seltener Fachkenntnis durchgeführt. Spezialverpackung, engagiertes Team und Klavier in perfektem Zustand angekommen. Profis bis ins Detail!",
    date: "Dezember 2024",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="bewertungen" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            Kundenbewertungen
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Was Unsere Kunden Sagen
          </h2>
          <p className="text-lg text-muted-foreground">
            Die Zufriedenheit unserer Kunden ist unsere größte Auszeichnung. 
            Entdecken Sie ihre Erfahrungen mit unserem Team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="bg-card rounded-2xl p-8 card-elevated relative animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.date}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-center px-6">
            <div className="text-2xl font-bold text-foreground">Google</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5</span>
            </div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center px-6">
            <div className="text-2xl font-bold text-foreground">Trustpilot</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
