import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    async writeBundle() {
      // Dynamic import to use TS data files
      const { cities } = await import("./src/data/cities");
      const { routes } = await import("./src/data/routes");
      const { bundeslaender } = await import("./src/data/bundeslaender");

      const BASE_URL = "https://umzugteam365.de";
      const entries: Array<{ loc: string; changefreq: string; priority: string }> = [];

      // Core pages
      entries.push(
        { loc: "/", changefreq: "weekly", priority: "1.0" },
        { loc: "/ueber-uns", changefreq: "monthly", priority: "0.7" },
        { loc: "/preise", changefreq: "weekly", priority: "0.9" },
        { loc: "/preisrechner", changefreq: "monthly", priority: "0.8" },
        { loc: "/preisvergleich", changefreq: "weekly", priority: "0.8" },
        { loc: "/bewertungen", changefreq: "weekly", priority: "0.7" },
        { loc: "/blog", changefreq: "weekly", priority: "0.7" },
        { loc: "/galerie", changefreq: "monthly", priority: "0.5" },
        { loc: "/checkliste", changefreq: "monthly", priority: "0.6" },
        { loc: "/anfragen", changefreq: "daily", priority: "0.7" },
        { loc: "/trajet", changefreq: "monthly", priority: "0.6" },
        { loc: "/staedte", changefreq: "monthly", priority: "0.8" },
        { loc: "/bundeslaender", changefreq: "monthly", priority: "0.8" },
        { loc: "/umzugsrouten", changefreq: "monthly", priority: "0.8" },
      );

      // Bundesländer
      for (const bl of Object.values(bundeslaender)) {
        entries.push({ loc: `/bundesland/${bl.slug}`, changefreq: "monthly", priority: "0.7" });
      }

      // Cities
      for (const city of Object.values(cities)) {
        const isTop = ["berlin", "hamburg", "muenchen", "koeln", "frankfurt"].includes(city.slug);
        entries.push({ loc: `/umzug/${city.slug}`, changefreq: "monthly", priority: isTop ? "0.8" : "0.6" });
      }

      // Routes
      for (const route of Object.values(routes)) {
        entries.push({ loc: `/umzugsroute/${route.slug}`, changefreq: "monthly", priority: "0.7" });
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${BASE_URL}${e.loc}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n")}
</urlset>`;

      fs.writeFileSync("dist/sitemap.xml", xml);
      console.log(`✅ Sitemap generated with ${entries.length} URLs`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger(), sitemapPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
