import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

const PhotoUploader = ({ photos, onChange, maxPhotos = 50 }: PhotoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      toast({ title: "Maximum erreicht", description: `Max. ${maxPhotos} Fotos erlaubt.`, variant: "destructive" });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of filesToUpload) {
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "Datei zu groß", description: `${file.name} ist größer als 5 MB.`, variant: "destructive" });
          continue;
        }
        if (!file.type.startsWith("image/")) {
          toast({ title: "Ungültiger Dateityp", description: "Nur Bilder erlaubt.", variant: "destructive" });
          continue;
        }

        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const { error } = await supabase.storage.from("announcement-photos").upload(path, file);
        if (error) throw error;

        const { data: urlData } = supabase.storage.from("announcement-photos").getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }

      onChange([...photos, ...newUrls]);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({ title: "Upload-Fehler", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-primary" />
        Fotos (optional, max. {maxPhotos})
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {photos.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < maxPhotos && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Wird hochgeladen...</>
            ) : (
              <><ImagePlus className="h-4 w-4 mr-2" /> Fotos hinzufügen</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
