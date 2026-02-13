import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, FileText, Gift, LogOut } from "lucide-react";
import type { User as SupaUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (p) setProfile({ full_name: p.full_name || "", phone: p.phone || "" });

      const { data: q } = await supabase.from("client_quotes").select("*").order("created_at", { ascending: false });
      if (q) setQuotes(q);

      const { data: r } = await supabase.from("referral_codes").select("*").eq("user_id", user.id).single();
      if (r) setReferralCode(r.code);

      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else toast({ title: "Profil aktualisiert!" });
  };

  const generateReferral = async () => {
    if (!user) return;
    const code = "UT365-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("referral_codes").insert({ user_id: user.id, code }).select().single();
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else if (data) { setReferralCode(data.code); toast({ title: "Empfehlungscode erstellt!", description: code }); }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <><Header /><main className="pt-32 pb-24 text-center text-muted-foreground">Laden...</main><Footer /></>;

  return (
    <>
      <Helmet><title>Mein Bereich – UmzugTeam365</title></Helmet>
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-foreground">
              Mein Bereich
            </motion.h1>
            <Button variant="outline" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Abmelden</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 card-elevated">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Profil</h2>
              </div>
              <form onSubmit={updateProfile} className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={profile?.full_name || ""} onChange={(e) => setProfile(p => ({ ...p!, full_name: e.target.value }))} />
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input value={profile?.phone || ""} onChange={(e) => setProfile(p => ({ ...p!, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>E-Mail</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
                <Button type="submit" variant="accent" className="w-full">Speichern</Button>
              </form>
            </motion.div>

            {/* Referral */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 card-elevated">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Empfehlungsprogramm</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Empfehlen Sie uns weiter und erhalten Sie 10% Rabatt auf Ihren nächsten Umzug! Ihr Freund spart ebenfalls 10%.
              </p>
              {referralCode ? (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Ihr Empfehlungscode</p>
                  <p className="text-2xl font-bold text-accent tracking-wider">{referralCode}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => { navigator.clipboard.writeText(referralCode); toast({ title: "Kopiert!" }); }}>
                    Code kopieren
                  </Button>
                </div>
              ) : (
                <Button variant="accent" className="w-full" onClick={generateReferral}>
                  Empfehlungscode generieren
                </Button>
              )}
            </motion.div>
          </div>

          {/* Quotes history */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 card-elevated mt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-foreground">Meine Angebote</h2>
            </div>
            {quotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sie haben noch keine Angebote. Fordern Sie Ihr erstes kostenloses Angebot an!
              </p>
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
                        {q.status === "pending" ? "Ausstehend" : q.status === "confirmed" ? "Bestätigt" : q.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
