import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/useI18n";

const Auth = () => {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: t("auth.welcomeBack"), description: t("auth.welcomeBackDesc") });
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").insert({ user_id: data.user.id, full_name: fullName });
        }
        toast({ title: t("auth.accountCreated"), description: t("auth.confirmEmail") });
      }
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? t("auth.loginTitle") : t("auth.registerTitle")} – UmzugTeam365</title>
      </Helmet>
      <Header />
      <main className="pt-32 pb-24 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-card rounded-2xl p-8 card-elevated">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? t("auth.loading") : isLogin ? t("auth.login") : t("auth.register")}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
              {isLogin ? t("auth.registerNow") : t("auth.loginNow")}
            </button>
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
