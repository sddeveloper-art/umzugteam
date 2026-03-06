import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Truck, Shield, Star, TrendingUp } from "lucide-react";
import { CATEGORY_LABELS, TransportCategory, useCreateTransporter } from "@/hooks/useTransporter";

const TransporterAuth = () => {
  const [step, setStep] = useState<"auth" | "profile">("auth");
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const createTransporter = useCreateTransporter();

  // Profile fields
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<TransportCategory[]>(["demenagement"]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Willkommen zurück!", description: "Weiterleitung zum Dashboard…" });
        navigate("/transporteur/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").insert({ user_id: data.user.id, full_name: contactName || email });
        }
        setStep("profile");
      }
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransporter.mutateAsync({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone: phone || undefined,
        city: city || undefined,
        description: description || undefined,
        categories: selectedCategories,
      });
      toast({ title: "Profil erstellt!", description: "Willkommen bei UmzugTeam365 als Transporteur." });
      navigate("/transporteur/dashboard");
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: TransportCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const benefits = [
    { icon: TrendingUp, title: "Neue Aufträge finden", desc: "Zugang zu Tausenden von Transportanfragen" },
    { icon: Star, title: "Reputation aufbauen", desc: "Sammeln Sie Bewertungen und werden Sie Top-Transporteur" },
    { icon: Shield, title: "Kostenlos registrieren", desc: "Keine Gebühren für die Anmeldung" },
  ];

  return (
    <>
      <Helmet>
        <title>Transporteur werden – UmzugTeam365</title>
        <meta name="description" content="Registrieren Sie sich als Transporteur und finden Sie neue Aufträge." />
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Left: Benefits */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-accent-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Transporteur werden</h1>
              </div>
              <p className="text-muted-foreground mb-8">
                Treten Sie unserem Netzwerk bei und erhalten Sie Zugang zu Transportanfragen in ganz Deutschland.
              </p>
              <div className="space-y-6">
                {benefits.map((b) => (
                  <div key={b.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-8 card-elevated">
              
              {step === "auth" ? (
                <>
                  <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                    {isLogin ? "Transporteur Login" : "Transporteur Registrierung"}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    {isLogin ? "Melden Sie sich in Ihrem Transporteur-Konto an" : "Erstellen Sie Ihr Transporteur-Konto"}
                  </p>
                  <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <Label>Kontaktname *</Label>
                        <Input value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                      </div>
                    )}
                    <div>
                      <Label>E-Mail *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                      <Label>Passwort *</Label>
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                      {loading ? "Laden…" : isLogin ? "Anmelden" : "Weiter →"}
                    </Button>
                  </form>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    {isLogin ? "Noch kein Konto?" : "Bereits registriert?"}{" "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
                      {isLogin ? "Jetzt registrieren" : "Jetzt anmelden"}
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-foreground mb-1 text-center">Unternehmensprofil</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">Vervollständigen Sie Ihr Profil</p>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <Label>Firmenname *</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49…" />
                    </div>
                    <div>
                      <Label>Stadt</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div>
                      <Label>Beschreibung</Label>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Beschreiben Sie Ihre Dienstleistungen…" />
                    </div>
                    <div>
                      <Label className="mb-2 block">Transportkategorien *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(CATEGORY_LABELS) as [TransportCategory, { de: string; icon: string }][]).map(
                          ([key, val]) => (
                            <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                              selectedCategories.includes(key) ? "border-accent bg-accent/5" : "border-border"
                            }`}>
                              <Checkbox
                                checked={selectedCategories.includes(key)}
                                onCheckedChange={() => toggleCategory(key)}
                              />
                              <span className="text-sm">{val.icon} {val.de}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                      {loading ? "Laden…" : "Profil erstellen"}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TransporterAuth;
