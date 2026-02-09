import React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  MapPin,
  Clock,
  Home,
  Package,
  Wrench,
  Building,
  Calendar,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicAnnouncement, formatTimeRemaining } from "@/hooks/useAnnouncements";

interface AnnouncementCardProps {
  announcement: PublicAnnouncement;
  bidsCount?: number;
  lowestPrice?: number | null;
  onSubmitBid?: () => void;
  showBidButton?: boolean;
}

const AnnouncementCard = ({
  announcement,
  bidsCount = 0,
  lowestPrice,
  onSubmitBid,
  showBidButton = true,
}: AnnouncementCardProps) => {
  const timeRemaining = formatTimeRemaining(announcement.end_date);
  const isExpired = timeRemaining === "Abgelaufen";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{announcement.from_city}</span>
            <span className="text-muted-foreground">→</span>
            <span>{announcement.to_city}</span>
          </div>
          <Badge
            variant={isExpired ? "secondary" : "default"}
            className={isExpired ? "" : "bg-green-500 hover:bg-green-600"}
          >
            {isExpired ? "Beendet" : "Aktiv"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="h-4 w-4" />
            <span>{announcement.apartment_size}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>
              {announcement.floor}. Etage
              {announcement.has_elevator ? " (Aufzug)" : ""}
            </span>
          </div>

          {announcement.needs_packing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Verpackung</span>
            </div>
          )}

          {announcement.needs_assembly && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>Montage</span>
            </div>
          )}
        </div>

        {/* Items inventory display */}
        {announcement.items && announcement.items.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Package className="h-3 w-3" />
              Inventar ({announcement.items.reduce((sum: number, i: any) => sum + i.quantity, 0)} Gegenstände)
            </p>
            <div className="flex flex-wrap gap-1">
              {announcement.items.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs bg-muted px-2 py-0.5 rounded-full"
                >
                  {item.quantity}× {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {announcement.preferred_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Wunschtermin:{" "}
              {format(new Date(announcement.preferred_date), "PPP", { locale: de })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span
                className={
                  isExpired ? "text-muted-foreground" : "text-primary font-medium"
                }
              >
                {timeRemaining}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{bidsCount} Angebote</span>
            </div>

            {lowestPrice && lowestPrice > 0 && (
              <div className="text-sm font-semibold text-green-600">
                ab {lowestPrice.toFixed(2)}€
              </div>
            )}
          </div>

          {showBidButton && !isExpired && onSubmitBid && (
            <Button onClick={onSubmitBid} size="sm">
              Angebot abgeben
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
