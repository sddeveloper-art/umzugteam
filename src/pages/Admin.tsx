import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  logo_url: string | null;
  base_price_multiplier: number;
  distance_price_multiplier: number;
  floor_price_multiplier: number;
  is_active: boolean;
}

const Admin = () => {
  const { user, loading, isAdmin, signIn, signOut } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Competitor>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    base_price_multiplier: 1.2,
    distance_price_multiplier: 1.2,
    floor_price_multiplier: 1.15,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchCompetitors();
    }
  }, [isAdmin]);

  const fetchCompetitors = async () => {
    setLoadingCompetitors(true);
    try {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .order("name");

      if (error) throw error;
      setCompetitors(data || []);
    } catch (err) {
      console.error("Error fetching competitors:", err);
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Konkurrenten",
        variant: "destructive",
      });
    } finally {
      setLoadingCompetitors(false);
    }
  };

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

  const handleAddCompetitor = async () => {
    try {
      const { error } = await supabase.from("competitors").insert([newCompetitor]);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Konkurrent hinzugefügt" });
      setShowAddForm(false);
      setNewCompetitor({
        name: "",
        base_price_multiplier: 1.2,
        distance_price_multiplier: 1.2,
        floor_price_multiplier: 1.15,
      });
      fetchCompetitors();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompetitor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("competitors")
        .update(editForm)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Konkurrent aktualisiert" });
      setEditingId(null);
      fetchCompetitors();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (!confirm("Sind Sie sicher?")) return;

    try {
      const { error } = await supabase.from("competitors").delete().eq("id", id);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Konkurrent gelöscht" });
      fetchCompetitors();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
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
            <LogOut className="w-4 h-4 mr-2" />
            Ausloggen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">
            Preisvergleich Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Ausloggen
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Konkurrenten verwalten
          </h2>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Hinzufügen
          </Button>
        </div>

        {showAddForm && (
          <div className="bg-card p-6 rounded-xl border border-border mb-6">
            <h3 className="font-semibold mb-4">Neuer Konkurrent</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Name
                </label>
                <Input
                  value={newCompetitor.name}
                  onChange={(e) =>
                    setNewCompetitor({ ...newCompetitor, name: e.target.value })
                  }
                  placeholder="Firmenname"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Grundpreis-Faktor
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCompetitor.base_price_multiplier}
                  onChange={(e) =>
                    setNewCompetitor({
                      ...newCompetitor,
                      base_price_multiplier: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Entfernungs-Faktor
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCompetitor.distance_price_multiplier}
                  onChange={(e) =>
                    setNewCompetitor({
                      ...newCompetitor,
                      distance_price_multiplier: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Stockwerk-Faktor
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCompetitor.floor_price_multiplier}
                  onChange={(e) =>
                    setNewCompetitor({
                      ...newCompetitor,
                      floor_price_multiplier: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddCompetitor}>
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        )}

        {loadingCompetitors ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-foreground">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">
                    Grundpreis ×
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">
                    Entfernung ×
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">
                    Stockwerk ×
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">
                    Aktiv
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-foreground">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor) => (
                  <tr key={competitor.id} className="border-t border-border">
                    {editingId === competitor.id ? (
                      <>
                        <td className="p-4">
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.base_price_multiplier || 1}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                base_price_multiplier: parseFloat(e.target.value),
                              })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.distance_price_multiplier || 1}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                distance_price_multiplier: parseFloat(e.target.value),
                              })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.floor_price_multiplier || 1}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                floor_price_multiplier: parseFloat(e.target.value),
                              })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={editForm.is_active ?? true}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                is_active: e.target.checked,
                              })
                            }
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateCompetitor(competitor.id)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 font-medium text-foreground">
                          {competitor.name}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {competitor.base_price_multiplier}×
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {competitor.distance_price_multiplier}×
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {competitor.floor_price_multiplier}×
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs ${
                              competitor.is_active
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {competitor.is_active ? "Ja" : "Nein"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(competitor.id);
                                setEditForm(competitor);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCompetitor(competitor.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
