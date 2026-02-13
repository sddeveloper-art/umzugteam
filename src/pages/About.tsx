import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Award, Clock, ShieldCheck, Heart, Target } from "lucide-react";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Thomas Müller", role: "Geschäftsführer", desc: "Über 25 Jahre Erfahrung in der Umzugsbranche." },
  { name: "Sarah Weber", role: "Kundenbetreuung", desc: "Ihr persönlicher Ansprechpartner für jedes Anliegen." },
  { name: "Marco Schmidt", role: "Teamleiter Logistik", desc: "Koordiniert täglich bis zu 15 Umzüge fehlerfrei." },
  { name: "Lisa Hoffmann", role: "Qualitätsmanagement", desc: "Sorgt für höchste Standards bei jedem Einsatz." },
];

const values = [
  { icon: ShieldCheck, title: "Zuverlässigkeit", desc: "Pünktlich, sorgfältig und transparent – bei jedem Umzug." },
  { icon: Heart, title: "Kundennähe", desc: "Wir behandeln Ihre Sachen so, als wären es unsere eigenen." },
  { icon: Target, title: "Professionalität", desc: "Geschultes Personal, moderne Ausstattung, klare Prozesse." },
  { icon: Award, title: "Qualitätsgarantie", desc: "Vollversicherung und Zufriedenheitsgarantie inklusive." },
];

const milestones = [
  { year: "1998", text: "Gründung in Berlin mit 2 Mitarbeitern" },
  { year: "2005", text: "Expansion auf 5 Standorte deutschlandweit" },
  { year: "2012", text: "10.000. Umzug erfolgreich abgeschlossen" },
  { year: "2018", text: "Einführung digitaler Angebotstools" },
  { year: "2024", text: "Über 50.000 zufriedene Kunden" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const About = () => {
  return (
    <>
      <Helmet>
        <title>Über uns – UmzugTeam365 | Ihr Umzugspartner seit 1998</title>
        <meta name="description" content="Lernen Sie das Team hinter UmzugTeam365 kennen. Über 25 Jahre Erfahrung, 50.000+ zufriedene Kunden und ein engagiertes Team für Ihren perfekten Umzug." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-20 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block text-accent font-semibold mb-4">Über uns</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ihr Umzugspartner seit <span className="text-accent">1998</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seit über 25 Jahren begleiten wir Menschen bei ihrem Umzug – professionell, persönlich und mit Leidenschaft.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-3xl mx-auto">
            {[
              { icon: Users, value: "50.000+", label: "Zufriedene Kunden" },
              { icon: Clock, value: "25+", label: "Jahre Erfahrung" },
              { icon: Award, value: "98%", label: "Weiterempfehlung" },
              { icon: ShieldCheck, value: "100%", label: "Versichert" },
            ].map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">Unsere Werte</motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {values.map((v, i) => (
                <motion.div key={v.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center card-elevated">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">Unsere Geschichte</motion.h2>
          <div className="max-w-2xl mx-auto space-y-8">
            {milestones.map((m, i) => (
              <motion.div key={m.year} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 items-start">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-2xl font-bold text-accent">{m.year}</span>
                </div>
                <div className="w-px bg-border self-stretch" />
                <p className="text-foreground pt-1">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">Unser Team</motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, i) => (
                <motion.div key={member.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center card-elevated">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
