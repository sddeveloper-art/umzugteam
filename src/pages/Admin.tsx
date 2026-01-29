import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Megaphone, BarChart3 } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import CompetitorsManager from "@/components/admin/CompetitorsManager";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";

const Admin = () => {
  const { user, loading, isAdmin, signIn, signOut } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await signIn(email, password);
    setAuthLoading(false);

    if (error) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-Mail
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Passwort
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Einloggen"
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Nur für autorisierte Administratoren
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Zugriff verweigert
          </h1>
          <p className="text-muted-foreground mb-6">
            Sie haben keine Administratorrechte.
          </p>
          <Button onClick={signOut} variant="outline">
            Ausloggen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userEmail={user.email || ""} onSignOut={signOut} />

      <main className="container mx-auto p-6">
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-2 mb-8">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Umzugsanfragen
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Preisvergleich
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <AnnouncementsManager />
          </TabsContent>

          <TabsContent value="competitors">
            <CompetitorsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
