import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Megaphone, BarChart3, FileText, Image, HelpCircle, Wrench, Package } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import CompetitorsManager from "@/components/admin/CompetitorsManager";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";
import BlogManager from "@/components/admin/BlogManager";
import GalleryManager from "@/components/admin/GalleryManager";
import FAQManager from "@/components/admin/FAQManager";
import ServicesManager from "@/components/admin/ServicesManager";
import PackagesManager from "@/components/admin/PackagesManager";

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
              <label className="block text-sm font-medium text-foreground mb-2">E-Mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Passwort</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Einloggen"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">Nur für autorisierte Administratoren</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Zugriff verweigert</h1>
          <p className="text-muted-foreground mb-6">Sie haben keine Administratorrechte.</p>
          <Button onClick={signOut} variant="outline">Ausloggen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userEmail={user.email || ""} onSignOut={signOut} />

      <main className="container mx-auto p-6">
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="flex flex-wrap w-full max-w-4xl gap-1 mb-8 h-auto p-1">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Anfragen</span>
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Preise</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Galerie</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Pakete</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements"><AnnouncementsManager /></TabsContent>
          <TabsContent value="competitors"><CompetitorsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="gallery"><GalleryManager /></TabsContent>
          <TabsContent value="faq"><FAQManager /></TabsContent>
          <TabsContent value="services"><ServicesManager /></TabsContent>
          <TabsContent value="packages"><PackagesManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
