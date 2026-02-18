import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";

const colors = [
  "from-accent/20 to-primary/10",
  "from-primary/15 to-accent/10",
  "from-accent/10 to-secondary",
];

const Blog = () => {
  const { t, language } = useI18n();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["blog_articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>{t("blog.title")} – UmzugTeam365</title>
        <meta name="description" content={t("blog.subtitle")} />
        <link rel="canonical" href="https://umzugteam365.de/blog" />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">{t("blog.badge")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("blog.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("blog.subtitle")}</p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[2/1] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {articles.map((article, i) => (
                <motion.article key={article.id}
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
                        <Clock className="w-3 h-3" /> {article.read_time}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{article.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "de-DE", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-sm text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t("blog.read")} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
