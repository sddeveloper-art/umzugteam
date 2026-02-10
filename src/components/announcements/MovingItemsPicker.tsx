import React from "react";
import { Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MovingItem {
  name: string;
  quantity: number;
  category: string;
}

// Volume estimates in cubic meters per item
const ITEM_VOLUMES: Record<string, number> = {
  "Sofa": 2.5,
  "Sessel": 1.0,
  "Couchtisch": 0.5,
  "TV-Schrank": 1.2,
  "Bücherregal": 1.0,
  "Stehlampe": 0.3,
  "Fernseher": 0.3,
  "Bett (Einzelbett)": 2.0,
  "Bett (Doppelbett)": 3.5,
  "Kleiderschrank": 2.5,
  "Kommode": 1.0,
  "Nachttisch": 0.3,
  "Matratze": 1.0,
  "Kühlschrank": 1.2,
  "Waschmaschine": 0.8,
  "Trockner": 0.8,
  "Geschirrspüler": 0.6,
  "Herd/Ofen": 0.7,
  "Mikrowelle": 0.2,
  "Küchenkartons": 0.5,
  "Esstisch": 1.5,
  "Stühle (pro Stück)": 0.4,
  "Vitrine": 1.5,
  "Sideboard": 1.2,
  "Schreibtisch": 1.5,
  "Bürostuhl": 0.5,
  "Aktenschrank": 1.0,
  "Drucker": 0.3,
  "Computer/Monitor": 0.3,
  "Umzugskarton (Standard)": 0.15,
  "Umzugskarton (Bücher)": 0.15,
  "Fahrrad": 1.0,
  "Pflanze (groß)": 0.5,
  "Spiegel/Bild": 0.2,
  "Teppich": 0.5,
};

export const calculateEstimatedVolume = (items: MovingItem[]): number => {
  return items.reduce((total, item) => {
    const vol = ITEM_VOLUMES[item.name] || 0.3;
    return total + vol * item.quantity;
  }, 0);
};

const ITEM_CATEGORIES = [
  {
    category: "Wohnzimmer",
    items: ["Sofa", "Sessel", "Couchtisch", "TV-Schrank", "Bücherregal", "Stehlampe", "Fernseher"],
  },
  {
    category: "Schlafzimmer",
    items: ["Bett (Einzelbett)", "Bett (Doppelbett)", "Kleiderschrank", "Kommode", "Nachttisch", "Matratze"],
  },
  {
    category: "Küche",
    items: ["Kühlschrank", "Waschmaschine", "Trockner", "Geschirrspüler", "Herd/Ofen", "Mikrowelle", "Küchenkartons"],
  },
  {
    category: "Esszimmer",
    items: ["Esstisch", "Stühle (pro Stück)", "Vitrine", "Sideboard"],
  },
  {
    category: "Büro",
    items: ["Schreibtisch", "Bürostuhl", "Aktenschrank", "Drucker", "Computer/Monitor"],
  },
  {
    category: "Sonstiges",
    items: ["Umzugskarton (Standard)", "Umzugskarton (Bücher)", "Fahrrad", "Pflanze (groß)", "Spiegel/Bild", "Teppich"],
  },
];

interface MovingItemsPickerProps {
  items: MovingItem[];
  onChange: (items: MovingItem[]) => void;
}

const MovingItemsPicker = ({ items, onChange }: MovingItemsPickerProps) => {
  const getQuantity = (name: string) => {
    return items.find((i) => i.name === name)?.quantity || 0;
  };

  const updateItem = (name: string, category: string, delta: number) => {
    const existing = items.find((i) => i.name === name);
    if (existing) {
      const newQty = Math.max(0, existing.quantity + delta);
      if (newQty === 0) {
        onChange(items.filter((i) => i.name !== name));
      } else {
        onChange(items.map((i) => (i.name === name ? { ...i, quantity: newQty } : i)));
      }
    } else if (delta > 0) {
      onChange([...items, { name, category, quantity: 1 }]);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const estimatedVolume = calculateEstimatedVolume(items);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Inventar der Gegenstände
        </h3>
        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <Badge variant="secondary">{totalItems} Gegenstände</Badge>
          )}
          {estimatedVolume > 0 && (
            <Badge variant="default">~{estimatedVolume.toFixed(1)} m³</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {ITEM_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{cat.category}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cat.items.map((itemName) => {
                const qty = getQuantity(itemName);
                return (
                  <div
                    key={itemName}
                    className={`flex items-center justify-between rounded-lg border p-2 transition-colors ${
                      qty > 0 ? "border-primary/50 bg-primary/5" : "border-border"
                    }`}
                  >
                    <span className="text-sm text-foreground truncate mr-2">{itemName}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItem(itemName, cat.category, -1)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{qty}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItem(itemName, cat.category, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingItemsPicker;
