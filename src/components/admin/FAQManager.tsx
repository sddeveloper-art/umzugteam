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

interface FAQForm {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: FAQForm = { question: "", answer: "", sort_order: 0, is_active: true };

const FAQManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FAQForm>(emptyForm);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin_faq"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faq_items").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("faq_items").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faq_items").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_faq"] });
      queryClient.invalidateQueries({ queryKey: ["faq_items"] });
      setOpen(false); setEditId(null); setForm(emptyForm);
      toast({ title: editId ? "FAQ aktualisiert" : "FAQ erstellt" });
    },
    onError: (e: any) => toast({ title: "Fehler", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_faq"] });
      queryClient.invalidateQueries({ queryKey: ["faq_items"] });
      toast({ title: "FAQ gelöscht" });
    },
  });

  const openEdit = (faq: any) => {
    setEditId(faq.id);
    setForm({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order, is_active: faq.is_active });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">FAQ ({faqs.length})</h2>
        <Button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Neue FAQ</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Frage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reihenfolge</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium max-w-md truncate">{faq.question}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${faq.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {faq.is_active ? "Aktiv" : "Inaktiv"}
                </span>
              </TableCell>
              <TableCell>{faq.sort_order}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(faq)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(faq.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "FAQ bearbeiten" : "Neue FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div><label className="text-sm font-medium">Frage</label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
            <div><label className="text-sm font-medium">Antwort</label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required rows={4} /></div>
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

export default FAQManager;
