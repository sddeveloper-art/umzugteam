import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Gift, LogOut, Megaphone, ChevronDown, ChevronUp, Clock, Euro, Bell } from "lucide-react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { useI18n } from "@/hooks/useI18n";
import { formatTimeRemaining } from "@/hooks/useAnnouncements";

interface Announcement {
  id: string;
  from_city: string;
  to_city: string;
  apartment_size: string;
  status: "active" | "expired" | "completed";
  end_date: string;
  created_at: string;
  preferred_date: string | null;
  volume: number;
  floor: number;
  photos: string[] | null;
}

interface Bid {
  id: string;
  announcement_id: string;
  company_name: string;
  price: number;
  notes: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { t } = useI18n();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bidsByAnnouncement, setBidsByAnnouncement] = useState<Record<string, Bid[]>>({});
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      // Fetch profile, quotes, referral, and announcements in parallel
      const [profileRes, quotesRes, referralRes, announcementsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("client_quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("referral_codes").select("*").eq("user_id", user.id).single(),
        supabase.from("moving_announcements").select("id, from_city, to_city, apartment_size, status, end_date, created_at, preferred_date, volume, floor, photos").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile({ full_name: profileRes.data.full_name || "", phone: profileRes.data.phone || "" });
      if (quotesRes.data) setQuotes(quotesRes.data);
      if (referralRes.data) setReferralCode(referralRes.data.code);
      if (announcementsRes.data) {
        const anns = announcementsRes.data as unknown as Announcement[];
        setAnnouncements(anns);
        // Fetch bids for all user announcements
        if (anns.length > 0) {
          const ids = anns.map(a => a.id);
          const { data: bidsData } = await supabase
            .from("company_bids")
            .select("id, announcement_id, company_name, price, notes, created_at")
            .in("announcement_id", ids)
            .order("price", { ascending: true });
          if (bidsData) {
            const grouped: Record<string, Bid[]> = {};
            (bidsData as unknown as Bid[]).forEach(b => {
              if (!grouped[b.announcement_id]) grouped[b.announcement_id] = [];
              grouped[b.announcement_id].push(b);
            });
            setBidsByAnnouncement(grouped);
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Realtime subscription for new bids on user's announcements
  const announcementIdsRef = useRef<string[]>([]);
  useEffect(() => {
    announcementIdsRef.current = announcements.map(a => a.id);
  }, [announcements]);

  useEffect(() => {
    if (!user || announcements.length === 0) return;

    const channel = supabase
      .channel('dashboard-bids')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'company_bids' },
        (payload) => {
          const newBid = payload.new as Bid;
          // Only process if bid is for one of user's announcements
          if (!announcementIdsRef.current.includes(newBid.announcement_id)) return;

          setBidsByAnnouncement(prev => {
            const existing = prev[newBid.announcement_id] || [];
            const updated = [...existing, newBid].sort((a, b) => a.price - b.price);
            return { ...prev, [newBid.announcement_id]: updated };
          });

          // Find the announcement for context
          const ann = announcements.find(a => a.id === newBid.announcement_id);
          toast({
            title: `🔔 ${t("dashboard.newBidReceived")}`,
            description: `${newBid.company_name} — ${Number(newBid.price).toFixed(0)} € ${ann ? `(${ann.from_city} → ${ann.to_city})` : ""}`,
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, announcements.length]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else toast({ title: t("dashboard.profileUpdated") });
  };

  const generateReferral = async () => {
    if (!user) return;
    const code = "UT365-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("referral_codes").insert({ user_id: user.id, code }).select().single();
    if (error) toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    else if (data) { setReferralCode(data.code); toast({ title: t("dashboard.codeCreated"), description: code }); }
  };

  const logout = async () => { await supabase.auth.signOut(); navigate("/"); };

  const statusColor = (status: string) => {
    if (status === "active") return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
    if (status === "expired") return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30";
    return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
  };

  if (loading) return <><Header /><main className="pt-32 pb-24 text-center text-muted-foreground">{t("dashboard.loading")}</main><Footer /></>;

  return (
    <>
      <Helmet><title>{t("dashboard.title")} – UmzugTeam365</title></Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-foreground">
              {t("dashboard.title")}
            </motion.h1>
            <Button variant="outline" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> {t("dashboard.logout")}</Button>
          </div>

          <Tabs defaultValue="announcements" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="announcements" className="flex items-center gap-1.5">
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">{t("dashboard.tabAnnouncements")}</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">{t("dashboard.tabQuotes")}</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("dashboard.tabProfile")}</span>
              </TabsTrigger>
              <TabsTrigger value="referral" className="flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">{t("dashboard.tabReferral")}</span>
              </TabsTrigger>
            </TabsList>

            {/* ANNOUNCEMENTS TAB */}
            <TabsContent value="announcements">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{t("dashboard.announcements")}</h2>
                  <Button variant="accent" onClick={() => navigate("/anfragen")}>
                    {t("dashboard.createAnnouncement")}
                  </Button>
                </div>

                {announcements.length === 0 ? (
                  <div className="bg-card rounded-2xl p-8 card-elevated text-center">
                    <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">{t("dashboard.noAnnouncements")}</p>
                    <Button variant="accent" className="mt-4" onClick={() => navigate("/anfragen")}>
                      {t("dashboard.createAnnouncement")}
                    </Button>
                  </div>
                ) : (
                  announcements.map((a) => {
                    const bids = bidsByAnnouncement[a.id] || [];
                    const isExpanded = expandedAnnouncement === a.id;
                    const bestPrice = bids.length > 0 ? bids[0].price : null;
                    return (
                      <div key={a.id} className="bg-card rounded-2xl card-elevated overflow-hidden">
                        <div
                          className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedAnnouncement(isExpanded ? null : a.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground truncate">{a.from_city} → {a.to_city}</span>
                                <Badge variant="outline" className={statusColor(a.status)}>
                                  {a.status === "active" ? t("dashboard.active") : a.status === "expired" ? t("dashboard.expired") : t("dashboard.completed")}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{a.apartment_size}</span>
                                <span>{new Date(a.created_at).toLocaleDateString("de-DE")}</span>
                                {a.status === "active" && (
                                  <span className="flex items-center gap-1 text-accent">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeRemaining(a.end_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {bestPrice && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">{t("dashboard.bestOffer")}</p>
                                  <p className="font-bold text-accent flex items-center gap-0.5">
                                    <Euro className="w-3.5 h-3.5" />{Number(bestPrice).toFixed(0)}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="text-sm font-medium">{bids.length}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-border px-5 py-4 space-y-4">
                            {/* Photos */}
                            {a.photos && a.photos.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">📷 Fotos ({a.photos.length})</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                  {(a.photos as string[]).map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden border border-border hover:ring-2 ring-accent transition-all">
                                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bids */}
                            {bids.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">{t("dashboard.noBids")}</p>
                            ) : (
                              <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.bids")} ({bids.length})</h3>
                                {bids.map((b, i) => (
                                  <div key={b.id} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? "bg-accent/5 ring-1 ring-accent/20" : "bg-secondary"}`}>
                                    <div>
                                      <span className="font-medium text-foreground">{b.company_name}</span>
                                      {b.notes && <p className="text-xs text-muted-foreground mt-0.5">{b.notes}</p>}
                                    </div>
                                    <div className="text-right">
                                      <span className={`font-bold ${i === 0 ? "text-accent" : "text-foreground"}`}>{Number(b.price).toFixed(0)} €</span>
                                      <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString("de-DE")}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            </TabsContent>

            {/* QUOTES TAB */}
            <TabsContent value="quotes">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 card-elevated">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">{t("dashboard.quotes")}</h2>
                </div>
                {quotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("dashboard.noQuotes")}</p>
                ) : (
                  <div className="space-y-3">
                    {quotes.map((q) => (
                      <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                        <div>
                          <span className="font-medium text-foreground">{q.from_city} → {q.to_city}</span>
                          <p className="text-xs text-muted-foreground">{q.apartment_size} · {new Date(q.created_at).toLocaleDateString("de-DE")}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-foreground">{Number(q.estimated_price).toFixed(0)} €</span>
                          <p className={`text-xs ${q.status === "confirmed" ? "text-green-600" : "text-muted-foreground"}`}>
                            {q.status === "pending" ? t("dashboard.pending") : q.status === "confirmed" ? t("dashboard.confirmed") : q.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 card-elevated">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">{t("dashboard.profile")}</h2>
                </div>
                <form onSubmit={updateProfile} className="space-y-3">
                  <div><Label>{t("dashboard.name")}</Label><Input value={profile?.full_name || ""} onChange={(e) => setProfile(p => ({ ...p!, full_name: e.target.value }))} /></div>
                  <div><Label>{t("dashboard.phone")}</Label><Input value={profile?.phone || ""} onChange={(e) => setProfile(p => ({ ...p!, phone: e.target.value }))} /></div>
                  <div><Label>{t("dashboard.email")}</Label><Input value={user?.email || ""} disabled /></div>
                  <Button type="submit" variant="accent" className="w-full">{t("dashboard.save")}</Button>
                </form>
              </motion.div>
            </TabsContent>

            {/* REFERRAL TAB */}
            <TabsContent value="referral">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 card-elevated">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">{t("dashboard.referral")}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{t("dashboard.referralDesc")}</p>
                {referralCode ? (
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t("dashboard.referralCode")}</p>
                    <p className="text-2xl font-bold text-accent tracking-wider">{referralCode}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => { navigator.clipboard.writeText(referralCode); toast({ title: t("dashboard.copied") }); }}>
                      {t("dashboard.copyCode")}
                    </Button>
                  </div>
                ) : (
                  <Button variant="accent" className="w-full" onClick={generateReferral}>{t("dashboard.generateCode")}</Button>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
