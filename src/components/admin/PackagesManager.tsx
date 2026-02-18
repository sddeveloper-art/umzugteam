import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface PackageForm {
  name: string;
  icon_name: string;
  price: string;
  price_note: string;
  badge: string;
  is_highlighted: boolean;
  features: string;
  excluded_features: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: PackageForm = {
  name: "", icon_name: "Zap", price: "", price_note: "", badge: "",
  is_highlighted: false, features: "", excluded_features: "", sort_order: 0, is_active: true,
};

const parseComma = (s: string): string[] => s.split(",").map(f => f.trim()).filter(Boolean);

const PackagesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin_packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name, icon_name: form.icon_name, price: form.price,
        price_note: form.price_note || null, badge: form.badge || null,
        is_highlighted: form.is_highlighted,
        features: parseComma(form.features),
        excluded_features: parseComma(form.excluded_features),
        sort_order: form.sort_order, is_active: form.is_active,
      };
      if (editId) {
        const { error } = await supabase.from("packages").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("packages").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_packages"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setOpen(false); setEditId(null); setForm(emptyForm);
      toast({ title: editId ? "Paket aktualisiert" : "Paket erstellt" });
    },
    onError: (e: any) => toast({ title: "Fehler", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_packages"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Gelöscht" });
    },
  });

  const openEdit = (p: any) => {
    setEditId(p.id);
    const feats = Array.isArray(p.features) ? (p.features as string[]).join(", ") : "";
    const excl = Array.isArray(p.excluded_features) ? (p.excluded_features as string[]).join(", ") : "";
    setForm({
      name: p.name, icon_name: p.icon_name, price: p.price,
      price_note: p.price_note || "", badge: p.badge || "",
      is_highlighted: p.is_highlighted, features: feats, excluded_features: excl,
      sort_order: p.sort_order, is_active: p.is_active,
    });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Pakete ({packages.length})</h2>
        <Button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Neues Paket</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Preis</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reihenfolge</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.badge || "—"}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {p.is_active ? "Aktiv" : "Inaktiv"}
                </span>
              </TableCell>
              <TableCell>{p.sort_order}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Paket bearbeiten" : "Neues Paket"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })}>
                  {["Zap", "Star", "Crown"].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Preis</label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div><label className="text-sm font-medium">Preisnotiz</label><Input value={form.price_note} onChange={(e) => setForm({ ...form, price_note: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Badge</label><Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="z.B. Beliebt" /></div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_highlighted} onCheckedChange={(v) => setForm({ ...form, is_highlighted: v })} />
                <label className="text-sm font-medium">Hervorgehoben</label>
              </div>
            </div>
            <div><label className="text-sm font-medium">Features (kommagetrennt)</label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Ausgeschlossene Features (kommagetrennt)</label><Input value={form.excluded_features} onChange={(e) => setForm({ ...form, excluded_features: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Reihenfolge</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <label className="text-sm font-medium">Aktiv</label>
              </div>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? "Speichern" : "Erstellen"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesManager;
