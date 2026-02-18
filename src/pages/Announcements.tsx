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
import BidSummaryCard from "@/components/announcements/BidSummaryCard";
import {
  usePublicAnnouncements,
  useBidSummary,
  PublicAnnouncement,
} from "@/hooks/useAnnouncements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks/useI18n";

const AnnouncementWithBids = ({
  announcement,
  onSubmitBid,
  onViewBids,
}: {
  announcement: PublicAnnouncement;
  onSubmitBid: (a: PublicAnnouncement) => void;
  onViewBids: (a: PublicAnnouncement) => void;
}) => {
  const { t } = useI18n();
  const { data: bidSummary } = useBidSummary(announcement.id);

  return (
    <div className="space-y-2">
      <AnnouncementCard
        announcement={announcement}
        bidsCount={bidSummary?.bid_count || 0}
        lowestPrice={bidSummary?.lowest_price}
        onSubmitBid={() => onSubmitBid(announcement)}
      />
      <button
        onClick={() => onViewBids(announcement)}
        className="w-full text-sm text-primary hover:underline"
      >
        {t("ann.viewBids")}
      </button>
    </div>
  );
};

const Announcements = () => {
  const { t } = useI18n();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<PublicAnnouncement | null>(null);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const { data: announcements, isLoading } = usePublicAnnouncements();
  const { data: selectedBidSummary } = useBidSummary(selectedAnnouncement?.id || "");

  const handleSubmitBid = (announcement: PublicAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowBidDialog(true);
  };

  const handleViewBids = (announcement: PublicAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setShowBidsDialog(true);
  };

  return (
    <>
      <Helmet>
        <title>{t("ann.title")} | UmzugTeam365</title>
        <meta name="description" content={t("ann.subtitle")} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <Megaphone className="inline-block h-8 w-8 text-primary mr-2 mb-1" />
              {t("ann.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("ann.subtitle")}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t("ann.browse")}
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("ann.create")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t("ann.loading")}</p>
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {announcements.map((announcement) => (
                    <AnnouncementWithBids
                      key={announcement.id}
                      announcement={announcement}
                      onSubmitBid={handleSubmitBid}
                      onViewBids={handleViewBids}
                    />
                  ))}
                </div>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardContent className="text-center py-12">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("ann.noRequests")}</h3>
                    <p className="text-muted-foreground mb-4">{t("ann.noRequestsDesc")}</p>
                    <button onClick={() => setActiveTab("create")} className="text-primary hover:underline">
                      {t("ann.createFirst")}
                    </button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">{t("ann.createNew")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateAnnouncementForm onSuccess={() => setActiveTab("browse")} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SubmitBidDialog
        open={showBidDialog}
        onOpenChange={setShowBidDialog}
        announcementId={selectedAnnouncement?.id || null}
        announcementTitle={
          selectedAnnouncement
            ? `${selectedAnnouncement.from_city} → ${selectedAnnouncement.to_city}`
            : ""
        }
      />

      <Dialog open={showBidsDialog} onOpenChange={setShowBidsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("ann.bidsOverview")}{" "}
              {selectedAnnouncement?.from_city} → {selectedAnnouncement?.to_city}
            </DialogTitle>
          </DialogHeader>
          <BidSummaryCard summary={selectedBidSummary || null} />
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Announcements;
