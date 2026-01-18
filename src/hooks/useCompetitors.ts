import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Competitor {
  id: string;
  name: string;
  logo_url: string | null;
  base_price_multiplier: number;
  distance_price_multiplier: number;
  floor_price_multiplier: number;
}

export const useCompetitors = () => {
  return useQuery({
    queryKey: ["competitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data as Competitor[];
    },
  });
};

export interface PriceComparison {
  competitorName: string;
  price: number;
  savings: number;
  savingsPercent: number;
}

export const calculateCompetitorPrices = (
  competitors: Competitor[],
  ourPrice: number,
  basePrice: number,
  distanceCost: number,
  floorCost: number
): PriceComparison[] => {
  return competitors.map((competitor) => {
    const competitorPrice =
      basePrice * competitor.base_price_multiplier +
      distanceCost * competitor.distance_price_multiplier +
      floorCost * competitor.floor_price_multiplier;
    
    const withTax = competitorPrice * 1.19;
    const savings = withTax - ourPrice;
    const savingsPercent = (savings / withTax) * 100;

    return {
      competitorName: competitor.name,
      price: withTax,
      savings,
      savingsPercent,
    };
  });
};

export const getAverageSavings = (comparisons: PriceComparison[]): number => {
  if (comparisons.length === 0) return 0;
  const totalSavings = comparisons.reduce((sum, c) => sum + c.savings, 0);
  return totalSavings / comparisons.length;
};

export const getMaxSavings = (comparisons: PriceComparison[]): PriceComparison | null => {
  if (comparisons.length === 0) return null;
  return comparisons.reduce((max, c) => (c.savings > max.savings ? c : max), comparisons[0]);
};
