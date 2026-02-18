import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Award, Clock, ShieldCheck, Heart, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/hooks/useI18n";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const About = () => {
  const { t } = useI18n();

  const teamMembers = [
    { name: t("about.team1.name"), role: t("about.team1.role"), desc: t("about.team1.desc") },
    { name: t("about.team2.name"), role: t("about.team2.role"), desc: t("about.team2.desc") },
    { name: t("about.team3.name"), role: t("about.team3.role"), desc: t("about.team3.desc") },
    { name: t("about.team4.name"), role: t("about.team4.role"), desc: t("about.team4.desc") },
  ];

  const values = [
    { icon: ShieldCheck, title: t("about.reliability"), desc: t("about.reliabilityDesc") },
    { icon: Heart, title: t("about.closeness"), desc: t("about.closenessDesc") },
    { icon: Target, title: t("about.professionalism"), desc: t("about.professionalismDesc") },
    { icon: Award, title: t("about.qualityGuarantee"), desc: t("about.qualityGuaranteeDesc") },
  ];

  const milestones = [
    { year: "1998", text: t("about.milestone1") },
    { year: "2005", text: t("about.milestone2") },
    { year: "2012", text: t("about.milestone3") },
    { year: "2018", text: t("about.milestone4") },
    { year: "2024", text: t("about.milestone5") },
  ];

  return (
    <>
      <Helmet>
        <title>{t("about.badge")} – UmzugTeam365</title>
        <meta name="description" content={t("about.subtitle")} />
        <link rel="canonical" href="https://umzugteam365.de/ueber-uns" />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <section className="container mx-auto px-4 mb-20 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block text-accent font-semibold mb-4">{t("about.badge")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("about.title")} <span className="text-accent">1998</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("about.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-3xl mx-auto">
            {[
              { icon: Users, value: "50.000+", label: t("about.satisfiedCustomers") },
              { icon: Clock, value: "25+", label: t("about.yearsExperience") },
              { icon: Award, value: "98%", label: t("about.recommendation") },
              { icon: ShieldCheck, value: "100%", label: t("about.insured") },
            ].map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">{t("about.valuesTitle")}</motion.h2>
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

        <section className="container mx-auto px-4 py-20">
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">{t("about.historyTitle")}</motion.h2>
          <div className="max-w-2xl mx-auto space-y-8">
            {milestones.map((m, i) => (
              <motion.div key={m.year} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex gap-6 items-start">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-2xl font-bold text-accent">{m.year}</span>
                </div>
                <div className="w-px bg-border self-stretch" />
                <p className="text-foreground pt-1">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeUp} className="text-3xl font-bold text-center text-foreground mb-12">{t("about.teamTitle")}</motion.h2>
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
