import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Euro, Building2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateBid } from "@/hooks/useAnnouncements";

const formSchema = z.object({
  company_name: z.string().min(2, "Firmenname muss mindestens 2 Zeichen haben").max(100),
  company_email: z.string().email("Ungültige E-Mail-Adresse").max(255),
  company_phone: z.string().max(30).optional(),
  price: z.coerce.number().min(1, "Preis muss mindestens 1€ sein").max(1000000),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubmitBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcementId: string | null;
  announcementTitle: string;
}

const SubmitBidDialog = ({
  open,
  onOpenChange,
  announcementId,
  announcementTitle,
}: SubmitBidDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBid = useCreateBid();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      company_email: "",
      company_phone: "",
      price: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!announcementId) return;

    setIsSubmitting(true);
    try {
      await createBid.mutateAsync({
        announcement_id: announcementId,
        company_name: data.company_name,
        company_email: data.company_email,
        company_phone: data.company_phone || undefined,
        price: data.price,
        notes: data.notes || undefined,
      });

      form.reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!announcementId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Angebot abgeben
          </DialogTitle>
          <DialogDescription>
            Umzug: <strong>{announcementTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firmenname *</FormLabel>
                  <FormControl>
                    <Input placeholder="Mustermann Umzüge GmbH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@firma.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+49 123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Ihr Preis (inkl. MwSt.) *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="500.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bemerkungen (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Zusätzliche Informationen zu Ihrem Angebot..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Wird gesendet..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Angebot abgeben
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitBidDialog;
