import React from "react";
import { Euro, Users, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BidSummary } from "@/hooks/useAnnouncements";

interface BidSummaryCardProps {
  summary: BidSummary | null;
}

const BidSummaryCard = ({ summary }: BidSummaryCardProps) => {
  if (!summary || summary.bid_count === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Noch keine Angebote eingegangen.</p>
        <p className="text-sm mt-2">
          Seien Sie der Erste, der ein Angebot abgibt!
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Angebote</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {summary.bid_count}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">Günstigstes</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
              <Euro className="h-5 w-5" />
              <span>{summary.lowest_price.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Höchstes</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-muted-foreground">
              <Euro className="h-5 w-5" />
              <span>{summary.highest_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Detaillierte Angebotsinformationen werden nur dem Kunden per E-Mail zugesandt.
        </p>
      </CardContent>
    </Card>
  );
};

export default BidSummaryCard;
