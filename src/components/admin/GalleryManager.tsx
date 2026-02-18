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

interface GalleryForm {
  title: string;
  category: string;
  description: string;
  image_url: string;
  is_approved: boolean;
  sort_order: number;
}

const emptyForm: GalleryForm = {
  title: "", category: "Privatumzug", description: "", image_url: "", is_approved: false, sort_order: 0,
};

const GalleryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<GalleryForm>(emptyForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("gallery_items").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_items").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_items"] });
      setOpen(false); setEditId(null); setForm(emptyForm);
      toast({ title: editId ? "Aktualisiert" : "Erstellt" });
    },
    onError: (e: any) => toast({ title: "Fehler", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_items"] });
      toast({ title: "Gelöscht" });
    },
  });

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, description: item.description || "", image_url: item.image_url || "", is_approved: item.is_approved, sort_order: item.sort_order });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Galerie ({items.length})</h2>
        <Button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Neues Element</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reihenfolge</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${item.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {item.is_approved ? "Genehmigt" : "Ausstehend"}
                </span>
              </TableCell>
              <TableCell>{item.sort_order}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Element bearbeiten" : "Neues Element"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Titel</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><label className="text-sm font-medium">Kategorie</label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">Beschreibung</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div><label className="text-sm font-medium">Bild-URL</label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Reihenfolge</label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_approved} onCheckedChange={(v) => setForm({ ...form, is_approved: v })} />
                <label className="text-sm font-medium">Genehmigt</label>
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

export default GalleryManager;
