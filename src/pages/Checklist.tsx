import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Package, FileText, Home } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CheckItem { id: string; labelKey: string; checked: boolean; }
interface ChecklistGroup { titleKey: string; icon: React.ElementType; timingKey: string; items: CheckItem[]; }

const buildChecklist = (): ChecklistGroup[] => [
  {
    titleKey: "checklist.8weeks", icon: CalendarDays, timingKey: "checklist.8weeksDesc",
    items: [
      { id: "1", labelKey: "checklist.item1", checked: false },
      { id: "2", labelKey: "checklist.item2", checked: false },
      { id: "3", labelKey: "checklist.item3", checked: false },
      { id: "4", labelKey: "checklist.item4", checked: false },
      { id: "5", labelKey: "checklist.item5", checked: false },
    ],
  },
  {
    titleKey: "checklist.4weeks", icon: FileText, timingKey: "checklist.4weeksDesc",
    items: [
      { id: "6", labelKey: "checklist.item6", checked: false },
      { id: "7", labelKey: "checklist.item7", checked: false },
      { id: "8", labelKey: "checklist.item8", checked: false },
      { id: "9", labelKey: "checklist.item9", checked: false },
      { id: "10", labelKey: "checklist.item10", checked: false },
    ],
  },
  {
    titleKey: "checklist.1week", icon: Package, timingKey: "checklist.1weekDesc",
    items: [
      { id: "11", labelKey: "checklist.item11", checked: false },
      { id: "12", labelKey: "checklist.item12", checked: false },
      { id: "13", labelKey: "checklist.item13", checked: false },
      { id: "14", labelKey: "checklist.item14", checked: false },
      { id: "15", labelKey: "checklist.item15", checked: false },
    ],
  },
  {
    titleKey: "checklist.moveDay", icon: Home, timingKey: "checklist.moveDayDesc",
    items: [
      { id: "16", labelKey: "checklist.item16", checked: false },
      { id: "17", labelKey: "checklist.item17", checked: false },
      { id: "18", labelKey: "checklist.item18", checked: false },
      { id: "19", labelKey: "checklist.item19", checked: false },
      { id: "20", labelKey: "checklist.item20", checked: false },
    ],
  },
];

const Checklist = () => {
  const { t } = useI18n();
  const [groups, setGroups] = useState<ChecklistGroup[]>(() => {
    const saved = localStorage.getItem("umzug-checklist");
    return saved ? JSON.parse(saved) : buildChecklist();
  });

  const toggleItem = (groupIdx: number, itemId: string) => {
    setGroups(prev => {
      const next = prev.map((g, gi) =>
        gi === groupIdx
          ? { ...g, items: g.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
          : g
      );
      localStorage.setItem("umzug-checklist", JSON.stringify(next));
      return next;
    });
  };

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const checkedItems = groups.reduce((sum, g) => sum + g.items.filter(i => i.checked).length, 0);
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{t("checklist.title")} – UmzugTeam365</title>
        <meta name="description" content={t("checklist.subtitle")} />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">{t("checklist.badge")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("checklist.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("checklist.subtitle")}</p>
          </motion.div>

          <div className="bg-card rounded-2xl p-6 mb-8 card-elevated">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-foreground">{t("checklist.progress")}</span>
              <span className="text-sm font-medium text-accent">{checkedItems}/{totalItems} {t("checklist.done")} ({progress}%)</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="space-y-8">
            {groups.map((group, gi) => {
              const Icon = group.icon;
              const groupChecked = group.items.filter(i => i.checked).length;
              return (
                <motion.div key={group.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: gi * 0.1 }}
                  className="bg-card rounded-2xl p-6 card-elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{t(group.titleKey)}</h2>
                      <p className="text-xs text-muted-foreground">{t(group.timingKey)} · {groupChecked}/{group.items.length}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(gi, item.id)} />
                        <span className={`text-sm transition-colors ${item.checked ? "line-through text-muted-foreground" : "text-foreground group-hover:text-accent"}`}>
                          {t(item.labelKey)}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button onClick={() => { setGroups(buildChecklist()); localStorage.removeItem("umzug-checklist"); }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors underline">
              {t("checklist.reset")}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checklist;
