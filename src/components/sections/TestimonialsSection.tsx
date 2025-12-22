import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie Dupont",
    location: "Paris → Lyon",
    rating: 5,
    text: "Équipe exceptionnelle ! Ils ont géré notre déménagement familial avec un professionnalisme remarquable. Tout était parfaitement emballé et rien n'a été endommagé. Je recommande vivement !",
    date: "Novembre 2024",
  },
  {
    name: "Jean-Pierre Martin",
    location: "Marseille → Bordeaux",
    rating: 5,
    text: "Déménagement d'entreprise réalisé un week-end. Équipe ponctuelle, efficace et très organisée. Le bureau était opérationnel dès le lundi matin. Service impeccable !",
    date: "Octobre 2024",
  },
  {
    name: "Sophie Bernard",
    location: "Toulouse → Nice",
    rating: 5,
    text: "Premier déménagement et vraiment une excellente expérience. L'équipe m'a guidée à chaque étape, le devis était précis et sans surprise. Merci pour ce service de qualité !",
    date: "Septembre 2024",
  },
  {
    name: "Thomas Lefebvre",
    location: "Lille → Strasbourg",
    rating: 5,
    text: "Transport de mon piano à queue effectué avec une expertise rare. Emballage spécialisé, équipe dédiée et piano arrivé en parfait état. Professionnels jusqu'au bout !",
    date: "Décembre 2024",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="temoignages" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold mb-4">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-lg text-muted-foreground">
            La satisfaction de nos clients est notre plus belle récompense. 
            Découvrez leurs expériences avec notre équipe.
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
