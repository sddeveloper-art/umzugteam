import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useTransporterById, CATEGORY_LABELS, TransportCategory } from "@/hooks/useTransporter";
import { Star, MapPin, Calendar, Truck, Shield, Award } from "lucide-react";

const TransporterProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: transporter, isLoading } = useTransporterById(id || "");

  if (isLoading) {
    return (
      <><Header /><main className="pt-32 pb-24 min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Laden…</p></main><Footer /></>
    );
  }

  if (!transporter) {
    return (
      <><Header /><main className="pt-32 pb-24 min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Transporteur nicht gefunden.</p></main><Footer /></>
    );
  }

  const memberSince = new Date(transporter.created_at).toLocaleDateString("de-DE", { year: "numeric", month: "long" });
  const isTopTransporter = transporter.completed_deliveries >= 50 && transporter.avg_rating >= 4.5;

  return (
    <>
      <Helmet>
        <title>{transporter.company_name} – Transporteur Profil | UmzugTeam365</title>
        <meta name="description" content={`${transporter.company_name} - Verifizierter Transporteur. ${transporter.completed_deliveries} Lieferungen, ${transporter.avg_rating.toFixed(1)} Sterne.`} />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Profile header */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {transporter.logo_url ? (
                    <img src={transporter.logo_url} alt={transporter.company_name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-3xl font-bold text-accent">
                      {transporter.company_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-foreground">{transporter.company_name}</h1>
                    {transporter.is_verified && (
                      <Badge className="bg-emerald-500/10 text-emerald-600"><Shield className="w-3 h-3 mr-1" /> Verifiziert</Badge>
                    )}
                    {isTopTransporter && (
                      <Badge className="bg-amber-500/10 text-amber-600"><Award className="w-3 h-3 mr-1" /> Top Transporteur</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{transporter.contact_name}</p>
                  {transporter.city && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {transporter.city}, {transporter.country}
                    </p>
                  )}
                </div>
              </div>

              {transporter.description && (
                <p className="text-foreground/80 mt-6 border-t border-border pt-4">{transporter.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="text-center py-4">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{transporter.avg_rating > 0 ? transporter.avg_rating.toFixed(1) : "–"}</span>
                </div>
                <p className="text-xs text-muted-foreground">{transporter.total_ratings} Bewertungen</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <Truck className="w-5 h-5" />
                  <span className="text-2xl font-bold">{transporter.completed_deliveries}</span>
                </div>
                <p className="text-xs text-muted-foreground">Lieferungen</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground">Mitglied seit {memberSince}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <p className="text-xs text-muted-foreground mb-1">Kategorien</p>
                <p className="text-lg font-bold text-foreground">{transporter.categories?.length || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground mb-3">Transportkategorien</h2>
              <div className="flex flex-wrap gap-2">
                {transporter.categories?.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-sm py-1.5 px-3">
                    {CATEGORY_LABELS[cat as TransportCategory]?.icon} {CATEGORY_LABELS[cat as TransportCategory]?.de || cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TransporterProfile;
