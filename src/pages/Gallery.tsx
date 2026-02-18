import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const colors = [
  "from-accent/20 to-primary/20",
  "from-primary/20 to-accent/10",
  "from-accent/10 to-secondary",
  "from-primary/10 to-accent/20",
];

const Gallery = () => {
  const [filter, setFilter] = useState("Alle");
  const [selected, setSelected] = useState<number | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_approved", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["Alle", ...Array.from(new Set(galleryItems.map(i => i.category)))];
  const filtered = filter === "Alle" ? galleryItems : galleryItems.filter(i => i.category === filter);

  return (
    <>
      <Helmet>
        <title>Galerie – UmzugTeam365 | Unsere Umzugsprojekte</title>
        <meta name="description" content="Entdecken Sie unsere erfolgreich durchgeführten Umzugsprojekte. Privat-, Firmen- und Spezialtransporte in ganz Deutschland." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">Galerie</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Unsere Projekte</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ein Blick hinter die Kulissen unserer Umzüge – von kleinen Wohnungen bis zu großen Bürokomplexen.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-accent/10"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelected(i)}
                  className="cursor-pointer bg-card rounded-2xl overflow-hidden card-elevated group">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="aspect-video object-cover w-full" />
                  ) : (
                    <div className={`aspect-video bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                      <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform">📦</span>
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-medium text-accent">{item.category}</span>
                    <h3 className="text-lg font-bold text-foreground mt-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {selected !== null && filtered[selected] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <div className="bg-card rounded-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-accent">{filtered[selected].category}</span>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">{filtered[selected].title}</h3>
              <p className="text-muted-foreground">{filtered[selected].description}</p>
              {filtered[selected].image_url ? (
                <img src={filtered[selected].image_url} alt={filtered[selected].title} className="aspect-video rounded-xl mt-4 object-cover w-full" />
              ) : (
                <div className={`aspect-video rounded-xl mt-4 bg-gradient-to-br ${colors[selected % colors.length]} flex items-center justify-center`}>
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
