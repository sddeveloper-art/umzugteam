// This script generates sitemap.xml from the data files
// It's called as a Vite plugin at build time and can be run standalone

import { cities } from "../src/data/cities";
import { routes } from "../src/data/routes";
import { bundeslaender } from "../src/data/bundeslaender";

const BASE_URL = "https://umzugteam365.de";

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

function generateSitemap(): string {
  const entries: SitemapEntry[] = [];

  // Core pages
  const corePages: SitemapEntry[] = [
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
  ];
  entries.push(...corePages);

  // Index pages
  entries.push(
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
    entries.push({
      loc: `/umzug/${city.slug}`,
      changefreq: "monthly",
      priority: isTop ? "0.8" : "0.6",
    });
  }

  // Routes
  for (const route of Object.values(routes)) {
    entries.push({ loc: `/umzugsroute/${route.slug}`, changefreq: "monthly", priority: "0.7" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${BASE_URL}${e.loc}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n")}
</urlset>`;

  return xml;
}

export { generateSitemap };
export default generateSitemap;
