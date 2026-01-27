import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Plus, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CreateAnnouncementForm from "@/components/announcements/CreateAnnouncementForm";
import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import SubmitBidDialog from "@/components/announcements/SubmitBidDialog";
import BidsList from "@/components/announcements/BidsList";
import {
  useActiveAnnouncements,
  useAnnouncementBids,
  MovingAnnouncement,
} from "@/hooks/useAnnouncements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Announcements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<MovingAnnouncement | null>(null);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const { data: announcements, isLoading } = useActiveAnnouncements();
  const { data: bids } = useAnnouncementBids(selectedAnnouncement?.id || "");

  const handleSubmitBid = (announcement: MovingAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowBidDialog(true);
  };

  const handleViewBids = (announcement: MovingAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowBidsDialog(true);
  };

  return (
    <>
      <Helmet>
        <title>Umzugsanfragen | UmzugTeam365</title>
        <meta
          name="description"
          content="Erstellen Sie eine Umzugsanfrage und erhalten Sie Angebote von verschiedenen Umzugsunternehmen. Vergleichen Sie Preise und wählen Sie das beste Angebot."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <Megaphone className="inline-block h-8 w-8 text-primary mr-2 mb-1" />
              Umzugsanfragen & Angebote
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Erstellen Sie eine Anfrage und erhalten Sie Angebote von
              verschiedenen Umzugsunternehmen. Nach Ablauf der Frist erhalten Sie
              automatisch eine E-Mail mit dem günstigsten Angebot.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Anfragen durchsuchen
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Neue Anfrage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Lade Anfragen...</p>
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="space-y-2">
                      <AnnouncementCard
                        announcement={announcement}
                        onSubmitBid={() => handleSubmitBid(announcement)}
                      />
                      <button
                        onClick={() => handleViewBids(announcement)}
                        className="w-full text-sm text-primary hover:underline"
                      >
                        Alle Angebote anzeigen →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardContent className="text-center py-12">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Keine aktiven Anfragen
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Es gibt derzeit keine offenen Umzugsanfragen.
                    </p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="text-primary hover:underline"
                    >
                      Erstellen Sie die erste Anfrage →
                    </button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">
                    Neue Umzugsanfrage erstellen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateAnnouncementForm
                    onSuccess={() => setActiveTab("browse")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SubmitBidDialog
        open={showBidDialog}
        onOpenChange={setShowBidDialog}
        announcement={selectedAnnouncement}
      />

      <Dialog open={showBidsDialog} onOpenChange={setShowBidsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Angebote für Umzug:{" "}
              {selectedAnnouncement?.from_city} → {selectedAnnouncement?.to_city}
            </DialogTitle>
          </DialogHeader>
          <BidsList
            bids={bids || []}
            winnerBidId={selectedAnnouncement?.winner_bid_id}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Announcements;
