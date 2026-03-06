import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useMyTransporterProfile, useUpdateTransporter, useMyBids, CATEGORY_LABELS, TransportCategory } from "@/hooks/useTransporter";
import { usePublicAnnouncements } from "@/hooks/useAnnouncements";
import { Navigate, Link } from "react-router-dom";
import { Truck, BarChart3, FileText, Settings, Star, MapPin, Clock, Euro } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { formatTimeRemaining } from "@/hooks/useAnnouncements";

const TransporterDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyTransporterProfile();
  const { data: announcements } = usePublicAnnouncements();
  const { data: myBids } = useMyBids();
  const updateTransporter = useUpdateTransporter();

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
    city: "",
    description: "",
    categories: [] as TransportCategory[],
  });

  if (authLoading || profileLoading) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Laden…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return <Navigate to="/transporteur/auth" replace />;
  if (!profile) return <Navigate to="/transporteur/auth" replace />;

  const startEdit = () => {
    setEditData({
      company_name: profile.company_name,
      contact_name: profile.contact_name,
      phone: profile.phone || "",
      city: profile.city || "",
      description: profile.description || "",
      categories: profile.categories || ["demenagement"],
    });
    setEditMode(true);
  };

  const saveProfile = async () => {
    try {
      await updateTransporter.mutateAsync({ id: profile.id, ...editData } as any);
      toast({ title: "Profil aktualisiert!" });
      setEditMode(false);
    } catch (e: any) {
      toast({ title: "Fehler", description: e.message, variant: "destructive" });
    }
  };

  const stats = [
    { icon: FileText, label: "Abgegebene Angebote", value: myBids?.length || 0 },
    { icon: Truck, label: "Abgeschlossene Lieferungen", value: profile.completed_deliveries },
    { icon: Star, label: "Verifiziert", value: profile.is_verified ? "Ja ✓" : "Ausstehend" },
  ];

  return (
    <>
      <Helmet>
        <title>Transporteur Dashboard – UmzugTeam365</title>
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{profile.company_name}</h1>
              <p className="text-sm text-muted-foreground">Transporteur Dashboard</p>
            </div>
            {profile.is_verified && <Badge className="bg-emerald-500/10 text-emerald-600 ml-auto">✓ Verifiziert</Badge>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="search" className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Aufträge
              </TabsTrigger>
              <TabsTrigger value="bids" className="flex items-center gap-1.5">
                <Euro className="w-4 h-4" /> Meine Angebote
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Profil
              </TabsTrigger>
            </TabsList>

            {/* Search announcements */}
            <TabsContent value="search">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {announcements?.map((a) => (
                  <Card key={a.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{CATEGORY_LABELS[(a as any).category as TransportCategory]?.de || "Umzüge"}</Badge>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTimeRemaining(a.end_date)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{a.from_city} → {a.to_city}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {a.apartment_size} • {a.volume} m³ • {a.floor}. OG {a.has_elevator ? "(Aufzug)" : "(kein Aufzug)"}
                      </p>
                      {a.preferred_date && (
                        <p className="text-xs text-muted-foreground mb-3">
                          📅 Wunschtermin: {new Date(a.preferred_date).toLocaleDateString("de-DE")}
                        </p>
                      )}
                      <Link to={`/anfragen`}>
                        <Button variant="accent" size="sm" className="w-full">Angebot abgeben</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {(!announcements || announcements.length === 0) && (
                  <Card className="col-span-full">
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">Keine aktiven Anfragen vorhanden.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* My bids */}
            <TabsContent value="bids">
              <div className="space-y-4">
                {myBids && myBids.length > 0 ? myBids.map((bid: any) => (
                  <Card key={bid.id}>
                    <CardContent className="flex items-center justify-between p-5">
                      <div>
                        <p className="font-semibold text-foreground">{bid.company_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bid.created_at).toLocaleDateString("de-DE")}
                        </p>
                        {bid.notes && <p className="text-xs text-muted-foreground mt-1">{bid.notes}</p>}
                      </div>
                      <p className="text-xl font-bold text-accent">{bid.price} €</p>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">Sie haben noch keine Angebote abgegeben.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Profil bearbeiten
                    {!editMode && <Button variant="outline" size="sm" onClick={startEdit}>Bearbeiten</Button>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Firmenname</Label>
                        <Input value={editData.company_name} onChange={(e) => setEditData({ ...editData, company_name: e.target.value })} />
                      </div>
                      <div>
                        <Label>Kontaktname</Label>
                        <Input value={editData.contact_name} onChange={(e) => setEditData({ ...editData, contact_name: e.target.value })} />
                      </div>
                      <div>
                        <Label>Telefon</Label>
                        <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                      </div>
                      <div>
                        <Label>Stadt</Label>
                        <Input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} />
                      </div>
                      <div>
                        <Label>Beschreibung</Label>
                        <Textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} />
                      </div>
                      <div>
                        <Label className="mb-2 block">Kategorien</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.entries(CATEGORY_LABELS) as [TransportCategory, { de: string; icon: string }][]).map(([key, val]) => (
                            <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                              editData.categories.includes(key) ? "border-accent bg-accent/5" : "border-border"
                            }`}>
                              <Checkbox checked={editData.categories.includes(key)} onCheckedChange={() => {
                                setEditData(d => ({
                                  ...d,
                                  categories: d.categories.includes(key) ? d.categories.filter(c => c !== key) : [...d.categories, key]
                                }));
                              }} />
                              <span className="text-sm">{val.icon} {val.de}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="accent" onClick={saveProfile} disabled={updateTransporter.isPending}>Speichern</Button>
                        <Button variant="outline" onClick={() => setEditMode(false)}>Abbrechen</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-muted-foreground">Firma:</span><span className="font-medium">{profile.company_name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Kontakt:</span><span className="font-medium">{profile.contact_name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">E-Mail:</span><span className="font-medium">{profile.email}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Telefon:</span><span className="font-medium">{profile.phone || "–"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Stadt:</span><span className="font-medium">{profile.city || "–"}</span></div>
                      <div>
                        <span className="text-muted-foreground block mb-2">Kategorien:</span>
                        <div className="flex flex-wrap gap-2">
                          {profile.categories?.map((c) => (
                            <Badge key={c} variant="outline">{CATEGORY_LABELS[c]?.icon} {CATEGORY_LABELS[c]?.de}</Badge>
                          ))}
                        </div>
                      </div>
                      {profile.description && <div><span className="text-muted-foreground">Beschreibung:</span><p className="mt-1 text-sm">{profile.description}</p></div>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TransporterDashboard;
