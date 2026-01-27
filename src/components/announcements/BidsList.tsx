import React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Trophy, Euro, Mail, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyBid } from "@/hooks/useAnnouncements";

interface BidsListProps {
  bids: CompanyBid[];
  winnerBidId?: string | null;
}

const BidsList = ({ bids, winnerBidId }: BidsListProps) => {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Noch keine Angebote eingegangen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bids.map((bid, index) => {
        const isWinner = bid.id === winnerBidId || (index === 0 && !winnerBidId);
        const rankIcon =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

        return (
          <Card
            key={bid.id}
            className={
              isWinner
                ? "border-primary bg-primary/5"
                : ""
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {rankIcon && <span className="text-xl">{rankIcon}</span>}
                    <h4 className="font-semibold text-foreground">
                      {bid.company_name}
                    </h4>
                    {isWinner && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Trophy className="h-3 w-3 mr-1" />
                        Günstigstes
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{bid.company_email}</span>
                    </div>
                    {bid.company_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{bid.company_phone}</span>
                      </div>
                    )}
                  </div>

                  {bid.notes && (
                    <div className="flex items-start gap-1 mt-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mt-0.5" />
                      <span>{bid.notes}</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Eingereicht am{" "}
                    {format(new Date(bid.created_at), "PPp", { locale: de })}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <Euro className="h-6 w-6" />
                    <span>{bid.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BidsList;
