export interface RouteData {
  slug: string;
  from: string;
  fromSlug: string;
  to: string;
  toSlug: string;
  distance: string;
  duration: string;
  priceFrom: number;
  description: string;
  tips: string[];
}

export const routes: Record<string, RouteData> = {
  "berlin-muenchen": {
    slug: "berlin-muenchen", from: "Berlin", fromSlug: "berlin", to: "München", toSlug: "muenchen",
    distance: "585 km", duration: "ca. 6 Stunden", priceFrom: 899,
    description: "Der Umzug von Berlin nach München ist eine der beliebtesten Strecken Deutschlands. Wir organisieren Ihren Fernumzug zuverlässig über die A9.",
    tips: ["Frühzeitig Halteverbot in beiden Städten beantragen", "Beiladung spart bis zu 40% auf dieser Strecke", "Wochenend-Umzüge oft günstiger", "Zwischenlager möglich bei unterschiedlichen Einzugsterminen"],
  },
  "hamburg-muenchen": {
    slug: "hamburg-muenchen", from: "Hamburg", fromSlug: "hamburg", to: "München", toSlug: "muenchen",
    distance: "775 km", duration: "ca. 7,5 Stunden", priceFrom: 999,
    description: "Von der Elbe an die Isar: Ihr Umzug von Hamburg nach München wird von uns professionell und stressfrei organisiert.",
    tips: ["Langstrecken-Paket nutzen für Kostenersparnis", "Möbel sicher für lange Fahrt verpacken", "Beide Städte haben strenge Halteverbots-Regeln", "Frühbucher-Rabatt bei 4+ Wochen Vorlauf"],
  },
  "berlin-hamburg": {
    slug: "berlin-hamburg", from: "Berlin", fromSlug: "berlin", to: "Hamburg", toSlug: "hamburg",
    distance: "290 km", duration: "ca. 3 Stunden", priceFrom: 599,
    description: "Berlin–Hamburg ist eine der kürzesten Fernumzugsstrecken. Über die A24 sind wir schnell und effizient unterwegs.",
    tips: ["Tagesumzug möglich – morgens laden, abends einziehen", "A24 meist staufrei", "Kombinierbar mit Zwischenstopp in Schwerin", "Auch als Beiladung sehr günstig"],
  },
  "berlin-koeln": {
    slug: "berlin-koeln", from: "Berlin", fromSlug: "berlin", to: "Köln", toSlug: "koeln",
    distance: "575 km", duration: "ca. 5,5 Stunden", priceFrom: 849,
    description: "Vom Spree-Ufer an den Rhein: Wir bringen Sie sicher und pünktlich von Berlin nach Köln.",
    tips: ["Route über A2 und A1 optimal", "In Köln frühzeitig Parkgenehmigung sichern", "Altbauwohnungen in beiden Städten – Möbelaufzug empfohlen", "Wochenumzug spart bis zu 20%"],
  },
  "hamburg-koeln": {
    slug: "hamburg-koeln", from: "Hamburg", fromSlug: "hamburg", to: "Köln", toSlug: "koeln",
    distance: "425 km", duration: "ca. 4,5 Stunden", priceFrom: 749,
    description: "Von Norddeutschland ins Rheinland: Ihr Umzug Hamburg–Köln in erfahrenen Händen.",
    tips: ["A1 als Direktverbindung nutzen", "Zwischenstopp in Bremen oder Münster möglich", "Kölner Veedel oft mit engen Zufahrten", "Frühbucher sparen bis zu 15%"],
  },
  "frankfurt-berlin": {
    slug: "frankfurt-berlin", from: "Frankfurt am Main", fromSlug: "frankfurt", to: "Berlin", toSlug: "berlin",
    distance: "545 km", duration: "ca. 5,5 Stunden", priceFrom: 799,
    description: "Von der Finanzmetropole in die Hauptstadt: Professionelle Umzüge Frankfurt–Berlin zum Festpreis.",
    tips: ["A5 und A9 als Hauptroute", "Büroumzüge am Wochenende besonders effizient", "Beide Städte mit Altbau-Spezialservice", "Kombi-Angebot mit Einlagerung verfügbar"],
  },
  "muenchen-koeln": {
    slug: "muenchen-koeln", from: "München", fromSlug: "muenchen", to: "Köln", toSlug: "koeln",
    distance: "575 km", duration: "ca. 5,5 Stunden", priceFrom: 879,
    description: "Vom Süden in den Westen: München nach Köln – wir meistern die Strecke routiniert.",
    tips: ["Route über A8 und A3", "Stau um Stuttgart einplanen", "Klimatisierter Transport für empfindliche Möbel", "Beide Städte: Halteverbot frühzeitig beantragen"],
  },
  "stuttgart-berlin": {
    slug: "stuttgart-berlin", from: "Stuttgart", fromSlug: "stuttgart", to: "Berlin", toSlug: "berlin",
    distance: "635 km", duration: "ca. 6 Stunden", priceFrom: 899,
    description: "Von Baden-Württemberg in die Hauptstadt: Ihr Umzug Stuttgart–Berlin professionell geplant.",
    tips: ["A81 und A9 als schnellste Route", "Stuttgarter Hanglagen erfordern Spezialequipment", "Zwischenlager bei Bedarf", "Express-Umzug in 2 Tagen möglich"],
  },
  "duesseldorf-berlin": {
    slug: "duesseldorf-berlin", from: "Düsseldorf", fromSlug: "duesseldorf", to: "Berlin", toSlug: "berlin",
    distance: "565 km", duration: "ca. 5,5 Stunden", priceFrom: 799,
    description: "Rheinland trifft Spree: Professionelle Umzüge von Düsseldorf nach Berlin.",
    tips: ["A2 als direkte Verbindung", "Düsseldorfer Altstadt mit engen Straßen", "Tagesumzug bei kleinen Wohnungen möglich", "Firmenkunden-Rabatt verfügbar"],
  },
  "hamburg-berlin": {
    slug: "hamburg-berlin", from: "Hamburg", fromSlug: "hamburg", to: "Berlin", toSlug: "berlin",
    distance: "290 km", duration: "ca. 3 Stunden", priceFrom: 599,
    description: "Kurze Strecke, großer Service: Hamburg nach Berlin schnell und zuverlässig.",
    tips: ["Tagesumzug ideal für diese Strecke", "A24 direkt und schnell", "Beiladung besonders günstig", "Auch Wochenend-Termine verfügbar"],
  },
  "koeln-frankfurt": {
    slug: "koeln-frankfurt", from: "Köln", fromSlug: "koeln", to: "Frankfurt am Main", toSlug: "frankfurt",
    distance: "190 km", duration: "ca. 2 Stunden", priceFrom: 499,
    description: "Rheinland nach Hessen: Köln–Frankfurt ist als kurze Strecke besonders günstig.",
    tips: ["A3 als Direktverbindung", "Halb-Tagesumzug möglich", "Ideal für Beiladung", "Auch spontan buchbar"],
  },
  "muenchen-hamburg": {
    slug: "muenchen-hamburg", from: "München", fromSlug: "muenchen", to: "Hamburg", toSlug: "hamburg",
    distance: "775 km", duration: "ca. 7,5 Stunden", priceFrom: 999,
    description: "Von Bayern an die Elbe: Die längste innerdeutsche Strecke – bei uns in besten Händen.",
    tips: ["2-Tages-Umzug empfohlen", "Zwischenstopp in Hannover möglich", "Klimatisierter LKW für Langstrecke", "Frühbucher-Rabatt bis zu 20%"],
  },
  "frankfurt-muenchen": {
    slug: "frankfurt-muenchen", from: "Frankfurt am Main", fromSlug: "frankfurt", to: "München", toSlug: "muenchen",
    distance: "390 km", duration: "ca. 4 Stunden", priceFrom: 699,
    description: "Finanzmetropole trifft Bayernhauptstadt: Frankfurt–München über die A3 und A9.",
    tips: ["Strecke über Nürnberg oder Würzburg", "Tagesumzug gut machbar", "Firmenumzüge auf dieser Strecke besonders gefragt", "Beiladung spart bis zu 35%"],
  },
  "berlin-frankfurt": {
    slug: "berlin-frankfurt", from: "Berlin", fromSlug: "berlin", to: "Frankfurt am Main", toSlug: "frankfurt",
    distance: "545 km", duration: "ca. 5,5 Stunden", priceFrom: 799,
    description: "Hauptstadt nach Hessen: Berlin–Frankfurt professionell und zum Festpreis.",
    tips: ["Über A9 und A5 am schnellsten", "Büromöbel-Transport mit Spezialverpackung", "Halteverbot in Frankfurt eng begrenzt – früh beantragen", "Studentenrabatt verfügbar"],
  },
  "leipzig-berlin": {
    slug: "leipzig-berlin", from: "Leipzig", fromSlug: "leipzig", to: "Berlin", toSlug: "berlin",
    distance: "190 km", duration: "ca. 2 Stunden", priceFrom: 449,
    description: "Sachsen trifft Brandenburg: Leipzig–Berlin ist eine kurze, unkomplizierte Umzugsstrecke.",
    tips: ["A9 direkt und schnell", "Halb-Tagesumzug möglich", "Besonders günstig als Beiladung", "Auch kurzfristig buchbar"],
  },
  "muenchen-berlin": {
    slug: "muenchen-berlin", from: "München", fromSlug: "muenchen", to: "Berlin", toSlug: "berlin",
    distance: "585 km", duration: "ca. 6 Stunden", priceFrom: 899,
    description: "Von der Isar an die Spree: München–Berlin gehört zu unseren meistgebuchten Strecken.",
    tips: ["A9 als Direktroute", "Frühzeitig Halteverbote beantragen", "Möbelaufzug in Berliner Altbauten empfohlen", "Express-Option für eilige Umzüge"],
  },
  "hannover-berlin": {
    slug: "hannover-berlin", from: "Hannover", fromSlug: "hannover", to: "Berlin", toSlug: "berlin",
    distance: "290 km", duration: "ca. 3 Stunden", priceFrom: 549,
    description: "Niedersachsen nach Brandenburg: Hannover–Berlin als schneller Tagesumzug.",
    tips: ["A2 als schnellste Verbindung", "Tagesumzug problemlos möglich", "Auch Teilumzüge und Beiladung", "Wochenend-Termine verfügbar"],
  },
  "nuernberg-muenchen": {
    slug: "nuernberg-muenchen", from: "Nürnberg", fromSlug: "nuernberg", to: "München", toSlug: "muenchen",
    distance: "170 km", duration: "ca. 2 Stunden", priceFrom: 449,
    description: "Innerhalb Bayerns: Nürnberg–München schnell und günstig über die A9.",
    tips: ["Halb-Tagesumzug ideal", "A9 direkt ohne Umwege", "Beiladung besonders kostengünstig", "Spontan-Umzüge möglich"],
  },
  "stuttgart-muenchen": {
    slug: "stuttgart-muenchen", from: "Stuttgart", fromSlug: "stuttgart", to: "München", toSlug: "muenchen",
    distance: "230 km", duration: "ca. 2,5 Stunden", priceFrom: 549,
    description: "Süddeutschland-Klassiker: Stuttgart–München über die A8 schnell und sicher.",
    tips: ["A8 als Direktverbindung", "Stuttgarter Hanglage beachten", "Tagesumzug gut machbar", "Firmenumzüge auf Anfrage"],
  },
  "dresden-berlin": {
    slug: "dresden-berlin", from: "Dresden", fromSlug: "dresden", to: "Berlin", toSlug: "berlin",
    distance: "195 km", duration: "ca. 2 Stunden", priceFrom: 449,
    description: "Sachsen nach Berlin: Die kurze Strecke Dresden–Berlin meistern wir routiniert.",
    tips: ["A13 als Direktroute", "Halb-Tagesumzug möglich", "Dresdner Altstadt mit Sondergenehmigungen", "Beiladung spart bis zu 40%"],
  },
};

export const routeList = Object.values(routes);

export const popularRoutes = [
  "berlin-muenchen", "hamburg-muenchen", "berlin-hamburg", "berlin-koeln",
  "hamburg-koeln", "frankfurt-berlin", "muenchen-koeln", "koeln-frankfurt",
  "frankfurt-muenchen", "muenchen-berlin",
];
