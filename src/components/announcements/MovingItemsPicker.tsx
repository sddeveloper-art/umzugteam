import React from "react";
import { Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MovingItem {
  name: string;
  quantity: number;
  category: string;
}

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Inventar der Gegenstände
        </h3>
        {totalItems > 0 && (
          <Badge variant="secondary">{totalItems} Gegenstände</Badge>
        )}
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
