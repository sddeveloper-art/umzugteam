import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const galleryItems = [
  { title: "Privatumzug Berlin", category: "Privatumzug", desc: "Kompletter 3-Zimmer-Umzug in Berlin-Mitte" },
  { title: "Büroumzug München", category: "Firmenumzug", desc: "Büroumzug mit 50 Arbeitsplätzen über das Wochenende" },
  { title: "Seniorenumzug Hamburg", category: "Privatumzug", desc: "Sensibler Umzug mit besonderer Betreuung" },
  { title: "Lagerung & Einlagerung", category: "Lagerung", desc: "Sichere Zwischenlagerung für 3 Monate" },
  { title: "Klaviertransport", category: "Spezialtransport", desc: "Professioneller Transport eines Flügels" },
  { title: "Firmenumzug Frankfurt", category: "Firmenumzug", desc: "IT-Umzug mit empfindlicher Hardware" },
  { title: "Studentenumzug Köln", category: "Privatumzug", desc: "Schneller und günstiger Studentenumzug" },
  { title: "Verpackungsservice", category: "Service", desc: "Professionelles Ein- und Auspacken" },
  { title: "Möbelmontage", category: "Service", desc: "Auf- und Abbau komplexer Schranksysteme" },
];

const categories = ["Alle", ...Array.from(new Set(galleryItems.map(i => i.category)))];

const colors = [
  "from-accent/20 to-primary/20",
  "from-primary/20 to-accent/10",
  "from-accent/10 to-secondary",
  "from-primary/10 to-accent/20",
];

const Gallery = () => {
  const [filter, setFilter] = useState("Alle");
  const [selected, setSelected] = useState<number | null>(null);

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

          {/* Filter */}
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

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelected(i)}
                className="cursor-pointer bg-card rounded-2xl overflow-hidden card-elevated group">
                <div className={`aspect-video bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                  <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform">📦</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-accent">{item.category}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <div className="bg-card rounded-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-accent">{filtered[selected].category}</span>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">{filtered[selected].title}</h3>
              <p className="text-muted-foreground">{filtered[selected].desc}</p>
              <div className={`aspect-video rounded-xl mt-4 bg-gradient-to-br ${colors[selected % colors.length]} flex items-center justify-center`}>
                <span className="text-6xl">📦</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
