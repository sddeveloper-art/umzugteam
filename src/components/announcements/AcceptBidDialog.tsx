import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AcceptBidDialogProps {
  announcementId: string;
  bidId: string;
  companyName: string;
  price: number;
  onAccepted?: () => void;
}

const AcceptBidDialog = ({ announcementId, bidId, companyName, price, onAccepted }: AcceptBidDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      // Update announcement: set winner_bid_id and status to completed
      const { error } = await supabase
        .from("moving_announcements")
        .update({
          winner_bid_id: bidId,
          status: "completed" as const,
        })
        .eq("id", announcementId);

      if (error) throw error;

      toast({
        title: "Angebot angenommen!",
        description: `${companyName} – ${price.toFixed(0)} € wurde als Gewinner ausgewählt.`,
      });
      setOpen(false);
      onAccepted?.();
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message || "Das Angebot konnte nicht angenommen werden.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="h-3.5 w-3.5" />
          Annehmen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Angebot annehmen?</DialogTitle>
          <DialogDescription>
            Möchten Sie das Angebot von <strong>{companyName}</strong> für <strong>{price.toFixed(0)} €</strong> annehmen?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 ring-1 ring-yellow-500/20">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Achtung</p>
              <p>Diese Aktion schließt Ihre Anfrage ab. Andere Unternehmen können danach keine Angebote mehr abgeben.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleAccept}
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {submitting ? "Wird verarbeitet..." : "Ja, annehmen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptBidDialog;
