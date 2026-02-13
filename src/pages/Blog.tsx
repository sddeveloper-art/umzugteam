import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const articles = [
  {
    slug: "umzug-planen-tipps",
    title: "10 Tipps für einen stressfreien Umzug",
    excerpt: "Von der Planung bis zum Einzug: So meistern Sie Ihren Umzug ohne Stress. Unsere Experten teilen ihre besten Ratschläge.",
    category: "Ratgeber",
    readTime: "5 Min.",
    date: "12. Feb. 2026",
  },
  {
    slug: "umzugskosten-sparen",
    title: "Umzugskosten sparen: So geht's",
    excerpt: "Erfahren Sie, wie Sie bei Ihrem nächsten Umzug bares Geld sparen können – ohne auf Qualität zu verzichten.",
    category: "Finanzen",
    readTime: "4 Min.",
    date: "8. Feb. 2026",
  },
  {
    slug: "adresse-aendern-checkliste",
    title: "Adressänderung: Wo Sie sich überall ummelden müssen",
    excerpt: "Bank, Versicherung, Arbeitgeber – diese komplette Liste hilft Ihnen, keine Ummeldung zu vergessen.",
    category: "Checkliste",
    readTime: "6 Min.",
    date: "3. Feb. 2026",
  },
  {
    slug: "umzug-mit-kindern",
    title: "Umzug mit Kindern: Tipps für Familien",
    excerpt: "Wie Sie den Umzug für Ihre Kinder stressfrei gestalten und die ganze Familie einbeziehen.",
    category: "Familie",
    readTime: "5 Min.",
    date: "28. Jan. 2026",
  },
  {
    slug: "erste-eigene-wohnung",
    title: "Erste eigene Wohnung: Was Sie beachten sollten",
    excerpt: "Von der Budgetplanung bis zur Einrichtung – der ultimative Guide für Ihren ersten Umzug.",
    category: "Ratgeber",
    readTime: "7 Min.",
    date: "22. Jan. 2026",
  },
  {
    slug: "nachhaltig-umziehen",
    title: "Nachhaltig umziehen: Öko-Tipps für den Umzug",
    excerpt: "Wie Sie Ihren Umzug umweltfreundlich gestalten: von wiederverwendbaren Kartons bis zur grünen Entsorgung.",
    category: "Nachhaltigkeit",
    readTime: "4 Min.",
    date: "15. Jan. 2026",
  },
];

const colors = [
  "from-accent/20 to-primary/10",
  "from-primary/15 to-accent/10",
  "from-accent/10 to-secondary",
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog & Ratgeber – UmzugTeam365 | Umzugstipps & Tricks</title>
        <meta name="description" content="Umzugs-Ratgeber von UmzugTeam365: Tipps zum Planen, Sparen und Organisieren. Alles rund um Ihren perfekten Umzug." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">Blog & Ratgeber</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Umzugstipps & Ratgeber</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expertenwissen rund ums Umziehen – von der Planung bis zum Einzug.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.map((article, i) => (
              <motion.article key={article.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl overflow-hidden card-elevated group">
                <div className={`aspect-[2/1] bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                  <span className="text-4xl opacity-60">📝</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">{article.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{article.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <span className="text-sm text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lesen <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
