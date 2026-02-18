import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface ServiceForm {
  title: string;
  description: string;
  icon_name: string;
  features: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: ServiceForm = { title: "", description: "", icon_name: "Truck", features: "", sort_order: 0, is_active: true };

const ServicesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title, description: form.description, icon_name: form.icon_name,
        features: JSON.parse(`[${form.features.split(",").map(f => `"${f.trim()}"`).join(",")}]`),
        sort_order: form.sort_order, is_active: form.is_active,
      };
      if (editId) {
        const { error } = await supabase.from("services").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setOpen(false); setEditId(null); setForm(emptyForm);
      toast({ title: editId ? "Service aktualisiert" : "Service erstellt" });
    },
    onError: (e: any) => toast({ title: "Fehler", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Gelöscht" });
    },
  });

  const openEdit = (s: any) => {
    setEditId(s.id);
    const feats = Array.isArray(s.features) ? (s.features as string[]).join(", ") : "";
    setForm({ title: s.title, description: s.description, icon_name: s.icon_name, features: feats, sort_order: s.sort_order, is_active: s.is_active });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const iconOptions = ["Truck", "Building", "Package", "Warehouse", "Sparkles", "Piano", "Sofa", "ShieldCheck", "PackageCheck"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Services ({services.length})</h2>
        <Button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Neuer Service</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reihenfolge</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.title}</TableCell>
              <TableCell className="text-muted-foreground">{s.icon_name}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {s.is_active ? "Aktiv" : "Inaktiv"}
                </span>
              </TableCell>
              <TableCell>{s.sort_order}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(s.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Service bearbeiten" : "Neuer Service"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Titel</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })}>
                  {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-sm font-medium">Beschreibung</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} /></div>
            <div><label className="text-sm font-medium">Features (kommagetrennt)</label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3" /></div>
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

export default ServicesManager;
