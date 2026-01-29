import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useAnnouncements,
  useAnnouncementBids,
  MovingAnnouncement,
  formatTimeRemaining,
} from "@/hooks/useAnnouncements";
import BidsList from "@/components/announcements/BidsList";
import {
  Loader2,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Box,
  Building,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const AnnouncementsManager = () => {
  const { toast } = useToast();
  const { data: announcements, isLoading, refetch } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<MovingAnnouncement | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { data: bids, isLoading: bidsLoading } = useAnnouncementBids(
    selectedAnnouncement?.id || ""
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diese Anfrage löschen möchten?")) return;

    try {
      const { error } = await supabase
        .from("moving_announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Anfrage gelöscht" });
      refetch();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: "active" | "expired" | "completed") => {
    try {
      const { error } = await supabase
        .from("moving_announcements")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Status aktualisiert" });
      refetch();
      setShowDetailsDialog(false);
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectWinner = async (announcementId: string, bidId: string) => {
    try {
      const { error } = await supabase
        .from("moving_announcements")
        .update({ 
          winner_bid_id: bidId,
          status: "completed" 
        })
        .eq("id", announcementId);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Gewinner ausgewählt und Anfrage abgeschlossen" });
      refetch();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Aktiv</Badge>;
      case "expired":
        return <Badge className="bg-muted text-muted-foreground border-border">Abgelaufen</Badge>;
      case "completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Abgeschlossen</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Umzugsanfragen verwalten ({announcements?.length || 0})
        </h2>
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {announcement.from_city} → {announcement.to_city}
                      </span>
                      {getStatusBadge(announcement.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {announcement.client_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {announcement.client_email}
                      </div>
                      {announcement.client_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {announcement.client_phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Box className="h-3 w-3" />
                        {announcement.apartment_size}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Erstellt: {format(new Date(announcement.created_at), "dd.MM.yyyy", { locale: de })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {announcement.status === "active" 
                          ? `Verbleibend: ${formatTimeRemaining(announcement.end_date)}`
                          : `Endete: ${format(new Date(announcement.end_date), "dd.MM.yyyy", { locale: de })}`
                        }
                      </span>
                      {announcement.winner_bid_id && (
                        <span className="flex items-center gap-1 text-accent">
                          <CheckCircle className="h-3 w-3" />
                          Gewinner ausgewählt
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Keine Anfragen vorhanden.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedAnnouncement?.from_city} → {selectedAnnouncement?.to_city}
              {selectedAnnouncement && getStatusBadge(selectedAnnouncement.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-6">
              {/* Kundeninformationen */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Kundeninformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedAnnouncement.client_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">E-Mail:</span>
                    <p className="font-medium">{selectedAnnouncement.client_email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefon:</span>
                    <p className="font-medium">{selectedAnnouncement.client_phone || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Umzugsdetails */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Umzugsdetails
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Wohnungsgröße:</span>
                    <p className="font-medium">{selectedAnnouncement.apartment_size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volumen:</span>
                    <p className="font-medium">{selectedAnnouncement.volume} m³</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stockwerk:</span>
                    <p className="font-medium">{selectedAnnouncement.floor}. Etage</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aufzug:</span>
                    <p className="font-medium">{selectedAnnouncement.has_elevator ? "Ja" : "Nein"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verpackung:</span>
                    <p className="font-medium">{selectedAnnouncement.needs_packing ? "Ja" : "Nein"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Möbelmontage:</span>
                    <p className="font-medium">{selectedAnnouncement.needs_assembly ? "Ja" : "Nein"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Wunschtermin:</span>
                    <p className="font-medium">
                      {selectedAnnouncement.preferred_date 
                        ? format(new Date(selectedAnnouncement.preferred_date), "dd.MM.yyyy", { locale: de })
                        : "—"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bieten bis:</span>
                    <p className="font-medium">
                      {format(new Date(selectedAnnouncement.end_date), "dd.MM.yyyy HH:mm", { locale: de })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {selectedAnnouncement.description && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Beschreibung
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAnnouncement.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Angebote */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Eingegangene Angebote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bidsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    </div>
                  ) : (
                    <>
                      <BidsList bids={bids || []} winnerBidId={selectedAnnouncement.winner_bid_id} />
                      {bids && bids.length > 0 && !selectedAnnouncement.winner_bid_id && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">
                            Gewinner manuell auswählen:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {bids.map((bid) => (
                              <Button
                                key={bid.id}
                                size="sm"
                                variant="outline"
                                onClick={() => handleSelectWinner(selectedAnnouncement.id, bid.id)}
                              >
                                {bid.company_name} ({bid.price.toFixed(2)}€)
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Status-Aktionen */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-sm text-muted-foreground mr-2 self-center">Status ändern:</span>
                <Button
                  size="sm"
                  variant={selectedAnnouncement.status === "active" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus(selectedAnnouncement.id, "active")}
                >
                  Aktiv
                </Button>
                <Button
                  size="sm"
                  variant={selectedAnnouncement.status === "expired" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus(selectedAnnouncement.id, "expired")}
                >
                  Abgelaufen
                </Button>
                <Button
                  size="sm"
                  variant={selectedAnnouncement.status === "completed" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus(selectedAnnouncement.id, "completed")}
                >
                  Abgeschlossen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsManager;
