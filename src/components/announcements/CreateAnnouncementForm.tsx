import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Send, MapPin, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCreateAnnouncement } from "@/hooks/useAnnouncements";

const formSchema = z.object({
  client_name: z.string().min(2, "Name muss mindestens 2 Zeichen haben").max(100),
  client_email: z.string().email("Ungültige E-Mail-Adresse").max(255),
  client_phone: z.string().optional(),
  from_city: z.string().min(2, "Stadt muss angegeben werden").max(100),
  to_city: z.string().min(2, "Stadt muss angegeben werden").max(100),
  apartment_size: z.string().min(1, "Wohnungsgröße auswählen"),
  volume: z.coerce.number().min(1).max(200).optional(),
  floor: z.coerce.number().min(0).max(50).optional(),
  has_elevator: z.boolean().optional(),
  needs_packing: z.boolean().optional(),
  needs_assembly: z.boolean().optional(),
  preferred_date: z.date().optional(),
  description: z.string().max(1000).optional(),
  bidding_duration: z.string().min(1, "Dauer auswählen"),
});

type FormData = z.infer<typeof formSchema>;

const apartmentSizes = [
  { value: "1-Zimmer", label: "1-Zimmer Wohnung" },
  { value: "2-Zimmer", label: "2-Zimmer Wohnung" },
  { value: "3-Zimmer", label: "3-Zimmer Wohnung" },
  { value: "4-Zimmer", label: "4-Zimmer Wohnung" },
  { value: "5+-Zimmer", label: "5+ Zimmer Wohnung" },
  { value: "Haus", label: "Einfamilienhaus" },
  { value: "Büro", label: "Büro/Gewerbe" },
];

const biddingDurations = [
  { value: "1", label: "1 Tag" },
  { value: "2", label: "2 Tage" },
  { value: "3", label: "3 Tage" },
  { value: "5", label: "5 Tage" },
  { value: "7", label: "1 Woche" },
  { value: "14", label: "2 Wochen" },
];

interface CreateAnnouncementFormProps {
  onSuccess?: () => void;
}

const CreateAnnouncementForm = ({ onSuccess }: CreateAnnouncementFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAnnouncement = useCreateAnnouncement();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      from_city: "",
      to_city: "",
      apartment_size: "",
      volume: 20,
      floor: 0,
      has_elevator: false,
      needs_packing: false,
      needs_assembly: false,
      description: "",
      bidding_duration: "3",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const endDate = addDays(new Date(), parseInt(data.bidding_duration));
      
      await createAnnouncement.mutateAsync({
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || undefined,
        from_city: data.from_city,
        to_city: data.to_city,
        apartment_size: data.apartment_size,
        volume: data.volume,
        floor: data.floor,
        has_elevator: data.has_elevator,
        needs_packing: data.needs_packing,
        needs_assembly: data.needs_assembly,
        preferred_date: data.preferred_date?.toISOString().split("T")[0],
        description: data.description || undefined,
        end_date: endDate.toISOString(),
      });

      form.reset();
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Ihre Kontaktdaten
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="max@beispiel.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="client_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+49 123 456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Moving Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Umzugsdetails
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="from_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Von (Stadt) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Berlin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nach (Stadt) *</FormLabel>
                  <FormControl>
                    <Input placeholder="München" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="apartment_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wohnungsgröße *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {apartmentSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etage</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <FormField
              control={form.control}
              name="has_elevator"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Aufzug vorhanden
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs_packing"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Verpackungsservice
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs_assembly"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Möbelmontage
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="preferred_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Wunschtermin (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-[280px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: de })
                        ) : (
                          <span>Datum auswählen</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zusätzliche Informationen (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Besondere Gegenstände, Zugangshinweise, etc."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bidding Duration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Angebotszeitraum
          </h3>

          <FormField
            control={form.control}
            name="bidding_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wie lange sollen Unternehmen Angebote abgeben können? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full md:w-[280px]">
                      <SelectValue placeholder="Dauer auswählen..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {biddingDurations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nach Ablauf erhalten Sie eine E-Mail mit dem günstigsten Angebot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Wird erstellt..."
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Anfrage veröffentlichen
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAnnouncementForm;
