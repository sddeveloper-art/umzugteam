import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RateCompanyDialogProps {
  announcementId: string;
  bidId: string;
  companyName: string;
  userId: string;
  onRated?: () => void;
}

const RateCompanyDialog = ({ announcementId, bidId, companyName, userId, onRated }: RateCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Bitte bewerten", description: "Wählen Sie mindestens 1 Stern.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("company_ratings").insert({
        announcement_id: announcementId,
        bid_id: bidId,
        user_id: userId,
        company_name: companyName,
        rating,
        comment: comment.trim() || null,
      });

      if (error) throw error;

      toast({ title: "Bewertung abgegeben!", description: `${companyName} – ${rating} Sterne` });
      setOpen(false);
      setRating(0);
      setComment("");
      onRated?.();
    } catch (err: any) {
      const msg = err.message?.includes("unique") ? "Sie haben diese Firma bereits bewertet." : err.message;
      toast({ title: "Fehler", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Star className="h-3.5 w-3.5" />
          Bewerten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{companyName} bewerten</DialogTitle>
          <DialogDescription>Wie zufrieden waren Sie mit dem Umzugsservice?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Star rating */}
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {displayRating === 0 && "Klicken Sie auf die Sterne"}
            {displayRating === 1 && "Schlecht"}
            {displayRating === 2 && "Unterdurchschnittlich"}
            {displayRating === 3 && "Durchschnittlich"}
            {displayRating === 4 && "Gut"}
            {displayRating === 5 && "Ausgezeichnet"}
          </p>

          {/* Comment */}
          <Textarea
            placeholder="Kommentar (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            className="resize-none"
          />

          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full"
          >
            {submitting ? "Wird gesendet..." : "Bewertung abgeben"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateCompanyDialog;
