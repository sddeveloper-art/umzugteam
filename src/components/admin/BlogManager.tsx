import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  is_published: boolean;
  sort_order: number;
}

const emptyForm: BlogForm = {
  title: "", slug: "", excerpt: "", content: "", category: "Ratgeber",
  read_time: "5 Min.", is_published: false, sort_order: 0,
};

const BlogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin_blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("blog_articles").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_articles").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blog"] });
      queryClient.invalidateQueries({ queryKey: ["blog_articles"] });
      setOpen(false);
      setEditId(null);
      setForm(emptyForm);
      toast({ title: editId ? "Artikel aktualisiert" : "Artikel erstellt" });
    },
    onError: (e: any) => toast({ title: "Fehler", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blog"] });
      queryClient.invalidateQueries({ queryKey: ["blog_articles"] });
      toast({ title: "Artikel gelöscht" });
    },
  });

  const openEdit = (article: any) => {
    setEditId(article.id);
    setForm({
      title: article.title, slug: article.slug, excerpt: article.excerpt,
      content: article.content || "", category: article.category, read_time: article.read_time || "",
      is_published: article.is_published, sort_order: article.sort_order,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Blog-Artikel ({articles.length})</h2>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Neuer Artikel</Button>
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
          {articles.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.title}</TableCell>
              <TableCell>{a.category}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${a.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {a.is_published ? "Veröffentlicht" : "Entwurf"}
                </span>
              </TableCell>
              <TableCell>{a.sort_order}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(a.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Artikel bearbeiten" : "Neuer Artikel"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Titel</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Kategorie</label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Lesezeit</label>
                <Input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Reihenfolge</label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Auszug</label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Inhalt</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <label className="text-sm font-medium">Veröffentlicht</label>
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

export default BlogManager;
