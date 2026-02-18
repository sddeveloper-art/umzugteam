import {
  ShieldCheck, Wallet, Clock, Users, HeartHandshake, Award,
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const AdvantagesSection = () => {
  const { t } = useI18n();

  const advantages = [
    { icon: ShieldCheck, title: t("advantages.insurance.title"), description: t("advantages.insurance.desc") },
    { icon: Wallet, title: t("advantages.price.title"), description: t("advantages.price.desc") },
    { icon: Clock, title: t("advantages.time.title"), description: t("advantages.time.desc") },
    { icon: Users, title: t("advantages.team.title"), description: t("advantages.team.desc") },
    { icon: HeartHandshake, title: t("advantages.service.title"), description: t("advantages.service.desc") },
    { icon: Award, title: t("advantages.quality.title"), description: t("advantages.quality.desc") },
  ];

  return (
    <section id="vorteile" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-accent font-semibold mb-4">{t("advantages.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t("advantages.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("advantages.subtitle")}</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {advantages.slice(0, 4).map((advantage, index) => (
                <div key={advantage.title} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><advantage.icon className="w-6 h-6 text-accent" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">25+</div>
                  <div className="text-primary-foreground/80">{t("advantages.yearsExp")}</div>
                </div>
                <div className="bg-accent rounded-2xl p-8 text-accent-foreground">
                  <Award className="w-10 h-10 mb-4" />
                  <div className="font-semibold">{t("advantages.certified")}</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-secondary rounded-2xl p-8">
                  <HeartHandshake className="w-10 h-10 text-accent mb-4" />
                  <div className="font-semibold text-foreground">{t("advantages.personalService")}</div>
                </div>
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-primary-foreground/80">{t("advantages.satisfied")}</div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {advantages.slice(4).map((advantage) => (
            <div key={advantage.title} className="flex gap-4 bg-card rounded-xl p-6 card-elevated">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><advantage.icon className="w-6 h-6 text-accent" /></div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{advantage.title}</h3>
                <p className="text-sm text-muted-foreground">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
