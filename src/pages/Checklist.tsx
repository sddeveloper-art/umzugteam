import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Package, FileText, Home } from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ChecklistGroup {
  title: string;
  icon: React.ElementType;
  timing: string;
  items: CheckItem[];
}

const initialChecklist: ChecklistGroup[] = [
  {
    title: "8 Wochen vorher",
    icon: CalendarDays,
    timing: "Frühzeitige Planung",
    items: [
      { id: "1", label: "Umzugstermin festlegen", checked: false },
      { id: "2", label: "Umzugsunternehmen vergleichen & buchen", checked: false },
      { id: "3", label: "Alten Mietvertrag kündigen", checked: false },
      { id: "4", label: "Entrümpeln: Was mitnehmen, was entsorgen?", checked: false },
      { id: "5", label: "Sonderurlaub beim Arbeitgeber beantragen", checked: false },
    ],
  },
  {
    title: "4 Wochen vorher",
    icon: FileText,
    timing: "Verwaltung & Organisation",
    items: [
      { id: "6", label: "Nachsendeauftrag bei der Post einrichten", checked: false },
      { id: "7", label: "Adressänderungen: Bank, Versicherung, Abo", checked: false },
      { id: "8", label: "Strom, Gas, Internet ummelden", checked: false },
      { id: "9", label: "Halteverbot für Umzugstag beantragen", checked: false },
      { id: "10", label: "Verpackungsmaterial besorgen", checked: false },
    ],
  },
  {
    title: "1 Woche vorher",
    icon: Package,
    timing: "Aktive Vorbereitung",
    items: [
      { id: "11", label: "Alles einpacken (Raum für Raum)", checked: false },
      { id: "12", label: "Kartons beschriften", checked: false },
      { id: "13", label: "Kühlschrank abtauen", checked: false },
      { id: "14", label: "Möbel abbauen", checked: false },
      { id: "15", label: "Wertsachen separat verpacken", checked: false },
    ],
  },
  {
    title: "Am Umzugstag",
    icon: Home,
    timing: "Der große Tag",
    items: [
      { id: "16", label: "Zählerstände ablesen (alt & neu)", checked: false },
      { id: "17", label: "Wohnung besenrein übergeben", checked: false },
      { id: "18", label: "Übergabeprotokoll unterschreiben", checked: false },
      { id: "19", label: "Neue Wohnung auf Schäden prüfen", checked: false },
      { id: "20", label: "Ummeldebestätigung innerhalb von 2 Wochen", checked: false },
    ],
  },
];

const Checklist = () => {
  const [groups, setGroups] = useState<ChecklistGroup[]>(() => {
    const saved = localStorage.getItem("umzug-checklist");
    return saved ? JSON.parse(saved) : initialChecklist;
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
        <title>Umzug-Checkliste – UmzugTeam365 | Alles im Griff</title>
        <meta name="description" content="Interaktive Umzugs-Checkliste: Alle Aufgaben von 8 Wochen vorher bis zum Umzugstag. Nichts vergessen mit UmzugTeam365." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="inline-block text-accent font-semibold mb-4">Checkliste</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Umzug-Checkliste</h1>
            <p className="text-lg text-muted-foreground">Haken Sie Schritt für Schritt ab – Ihr Fortschritt wird gespeichert.</p>
          </motion.div>

          {/* Progress */}
          <div className="bg-card rounded-2xl p-6 mb-8 card-elevated">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-foreground">Fortschritt</span>
              <span className="text-sm font-medium text-accent">{checkedItems}/{totalItems} erledigt ({progress}%)</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Groups */}
          <div className="space-y-8">
            {groups.map((group, gi) => {
              const Icon = group.icon;
              const groupChecked = group.items.filter(i => i.checked).length;
              return (
                <motion.div key={group.title}
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
                      <h2 className="text-lg font-bold text-foreground">{group.title}</h2>
                      <p className="text-xs text-muted-foreground">{group.timing} · {groupChecked}/{group.items.length}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(gi, item.id)} />
                        <span className={`text-sm transition-colors ${item.checked ? "line-through text-muted-foreground" : "text-foreground group-hover:text-accent"}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button onClick={() => { setGroups(initialChecklist); localStorage.removeItem("umzug-checklist"); }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors underline">
              Checkliste zurücksetzen
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checklist;
