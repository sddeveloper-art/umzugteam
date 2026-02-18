import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TestimonialsSection = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["reviews_public_homepage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews_public")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

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
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 card-elevated relative animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.client_name}
                  </div>
                  {testimonial.city && (
                    <div className="text-sm text-muted-foreground">
                      {testimonial.city}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.created_at && new Date(testimonial.created_at).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
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
