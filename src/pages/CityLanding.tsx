import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Check, ArrowRight } from "lucide-react";

const cityData: Record<string, { name: string; population: string; description: string; features: string[] }> = {
  berlin: {
    name: "Berlin",
    population: "3,7 Mio.",
    description: "Als Hauptstadt bietet Berlin vielfältige Umzugsmöglichkeiten. Ob Kreuzberg, Mitte oder Charlottenburg – wir kennen jeden Kiez.",
    features: ["Halteverbot-Beantragung übernehmen wir", "Alle Berliner Bezirke abgedeckt", "Express-Umzüge innerhalb von 24h", "Spezialservice für Altbauwohnungen"],
  },
  muenchen: {
    name: "München",
    population: "1,5 Mio.",
    description: "In München sind wir Ihr zuverlässiger Partner – ob Schwabing, Bogenhausen oder das Umland.",
    features: ["Erfahrung mit Münchner Altbauten", "Umzüge ins Münchner Umland", "Premium-Service für anspruchsvolle Kunden", "Firmenumzüge im Businessviertel"],
  },
  hamburg: {
    name: "Hamburg",
    population: "1,9 Mio.",
    description: "Von der Hafencity bis Blankenese – wir kennen Hamburg und sorgen für einen reibungslosen Umzug.",
    features: ["Umzüge an der Alster und Elbe", "Spezialtransporte für Villen", "Erfahrung mit engen Treppenhäusern", "Hamburger Umland inklusive"],
  },
  koeln: {
    name: "Köln",
    population: "1,1 Mio.",
    description: "Ob Ehrenfeld, Nippes oder Lindenthal – in Köln sind wir schnell und zuverlässig vor Ort.",
    features: ["Alle Kölner Veedel abgedeckt", "Rhein-Überquerung kein Problem", "Studentenumzüge zum Sondertarif", "Flexible Terminwahl"],
  },
  frankfurt: {
    name: "Frankfurt",
    population: "760.000",
    description: "Die Finanzmetropole am Main: Wir übernehmen Privat- und Firmenumzüge in und um Frankfurt.",
    features: ["Büroumzüge im Bankenviertel", "Sachsenhausen bis Nordend", "Umzüge ins Rhein-Main-Gebiet", "Hochhaus-Erfahrung vorhanden"],
  },
  stuttgart: {
    name: "Stuttgart",
    population: "635.000",
    description: "Stuttgart und die Halbhöhenlage – unsere Teams meistern jede Steigung für Ihren Umzug.",
    features: ["Erfahrung mit Hanglage-Häusern", "Umzüge in der Region Stuttgart", "Premium-Verpackung für Automobile", "Firmenumzüge in der Industrie"],
  },
};

const CityLanding = () => {
  const { city } = useParams<{ city: string }>();
  const data = city ? cityData[city] : null;

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Stadt nicht gefunden</h1>
          <Link to="/" className="text-accent hover:underline">Zur Startseite</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Umzugsunternehmen {data.name} – UmzugTeam365 | Professioneller Umzug</title>
        <meta name="description" content={`Professionelles Umzugsunternehmen in ${data.name}. Privat- und Firmenumzüge, Verpackungsservice und mehr. Jetzt kostenloses Angebot anfordern!`} />
        <link rel="canonical" href={`https://umzugteam365.de/umzug/${city}`} />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="hero-section text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{data.name} · {data.population} Einwohner</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Umzugsunternehmen in {data.name}
              </h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">{data.description}</p>
              <Link to="/#kostenrechner">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Kostenloses Angebot für {data.name}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Warum UmzugTeam365 in {data.name}?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {data.features.map((f, i) => (
              <motion.div key={f}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 bg-card rounded-xl p-5 card-elevated">
                <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{f}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other cities */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Weitere Standorte</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(cityData).filter(([key]) => key !== city).map(([key, val]) => (
                <Link key={key} to={`/umzug/${key}`}
                  className="px-4 py-2 rounded-full bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors card-elevated text-sm font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {val.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CityLanding;
