import { TrendingDown, Award } from "lucide-react";
import { PriceComparison, getMaxSavings, getAverageSavings } from "@/hooks/useCompetitors";

interface PriceComparisonBadgeProps {
  comparisons: PriceComparison[];
  ourPrice: number;
}

const PriceComparisonBadge = ({ comparisons, ourPrice }: PriceComparisonBadgeProps) => {
  if (comparisons.length === 0) return null;

  const maxSaving = getMaxSavings(comparisons);
  const avgSaving = getAverageSavings(comparisons);

  if (!maxSaving || maxSaving.savings <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <Award className="w-4 h-4 text-green-600" />
        </div>
        <span className="font-bold text-green-700 dark:text-green-400">
          Bester Preis garantiert!
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Durchschnittliche Ersparnis:</span>
          <span className="font-bold text-green-600">
            bis zu {avgSaving.toFixed(0)} € günstiger
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Maximale Ersparnis:</span>
          <span className="font-bold text-green-600">
            {maxSaving.savings.toFixed(0)} € vs {maxSaving.competitorName}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-500/20">
          <TrendingDown className="w-4 h-4 text-green-600" />
          <span className="text-xs text-muted-foreground">
            Sie sparen bis zu {maxSaving.savingsPercent.toFixed(0)}% gegenüber anderen Anbietern
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonBadge;
