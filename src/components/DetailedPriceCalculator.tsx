import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  MapPin,
  Home,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  LocateFixed,
  Loader2,
  CheckCircle,
  Euro,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// German cities with coordinates
const germanCities = [
  { name: "Aachen", lat: 50.7753, lng: 6.0839 },
  { name: "Augsburg", lat: 48.3705, lng: 10.8978 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Bielefeld", lat: 52.0302, lng: 8.5325 },
  { name: "Bochum", lat: 51.4818, lng: 7.2162 },
  { name: "Bonn", lat: 50.7374, lng: 7.0982 },
  { name: "Braunschweig", lat: 52.2689, lng: 10.5268 },
  { name: "Bremen", lat: 53.0793, lng: 8.8017 },
  { name: "Chemnitz", lat: 50.8278, lng: 12.9214 },
  { name: "Darmstadt", lat: 49.8728, lng: 8.6512 },
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
  { name: "Dresden", lat: 51.0504, lng: 13.7373 },
  { name: "Duisburg", lat: 51.4344, lng: 6.7623 },
  { name: "Düsseldorf", lat: 51.2277, lng: 6.7735 },
  { name: "Erfurt", lat: 50.9848, lng: 11.0299 },
  { name: "Essen", lat: 51.4556, lng: 7.0116 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "Freiburg", lat: 47.999, lng: 7.8421 },
  { name: "Gelsenkirchen", lat: 51.5177, lng: 7.0857 },
  { name: "Göttingen", lat: 51.5413, lng: 9.9158 },
  { name: "Halle", lat: 51.4969, lng: 11.9688 },
  { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
  { name: "Hannover", lat: 52.3759, lng: 9.732 },
  { name: "Heidelberg", lat: 49.3988, lng: 8.6724 },
  { name: "Ingolstadt", lat: 48.7665, lng: 11.4258 },
  { name: "Jena", lat: 50.9272, lng: 11.5892 },
  { name: "Karlsruhe", lat: 49.0069, lng: 8.4037 },
  { name: "Kassel", lat: 51.3127, lng: 9.4797 },
  { name: "Kiel", lat: 54.3233, lng: 10.1394 },
  { name: "Koblenz", lat: 50.3569, lng: 7.5889 },
  { name: "Köln", lat: 50.9375, lng: 6.9603 },
  { name: "Krefeld", lat: 51.3388, lng: 6.5853 },
  { name: "Leipzig", lat: 51.3397, lng: 12.3731 },
  { name: "Lübeck", lat: 53.8655, lng: 10.6866 },
  { name: "Magdeburg", lat: 52.1205, lng: 11.6276 },
  { name: "Mainz", lat: 49.9929, lng: 8.2473 },
  { name: "Mannheim", lat: 49.4875, lng: 8.466 },
  { name: "Mönchengladbach", lat: 51.1805, lng: 6.4428 },
  { name: "Mülheim an der Ruhr", lat: 51.4308, lng: 6.8825 },
  { name: "München", lat: 48.1351, lng: 11.582 },
  { name: "Münster", lat: 51.9607, lng: 7.6261 },
  { name: "Nürnberg", lat: 49.4521, lng: 11.0767 },
  { name: "Oberhausen", lat: 51.4963, lng: 6.8635 },
  { name: "Offenbach", lat: 50.0956, lng: 8.7761 },
  { name: "Oldenburg", lat: 53.1435, lng: 8.2146 },
  { name: "Osnabrück", lat: 52.2799, lng: 8.0472 },
  { name: "Paderborn", lat: 51.7189, lng: 8.7575 },
  { name: "Pforzheim", lat: 48.8922, lng: 8.6947 },
  { name: "Potsdam", lat: 52.3906, lng: 13.0645 },
  { name: "Regensburg", lat: 49.0134, lng: 12.1016 },
  { name: "Rostock", lat: 54.0924, lng: 12.0991 },
  { name: "Saarbrücken", lat: 49.2402, lng: 6.9969 },
  { name: "Schwerin", lat: 53.6355, lng: 11.4012 },
  { name: "Solingen", lat: 51.1652, lng: 7.0671 },
  { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
  { name: "Trier", lat: 49.7596, lng: 6.6439 },
  { name: "Ulm", lat: 48.4011, lng: 9.9876 },
  { name: "Wiesbaden", lat: 50.0782, lng: 8.2398 },
  { name: "Wolfsburg", lat: 52.4227, lng: 10.7865 },
  { name: "Wuppertal", lat: 51.2562, lng: 7.1508 },
  { name: "Würzburg", lat: 49.7944, lng: 9.9294 },
];

interface Room {
  id: string;
  name: string;
  surface: number;
}

const roomTypes = [
  "Wohnzimmer",
  "Schlafzimmer",
  "Kinderzimmer",
  "Küche",
  "Badezimmer",
  "Arbeitszimmer",
  "Esszimmer",
  "Flur",
  "Keller",
  "Dachboden",
  "Garage",
  "Sonstiges",
];

// Haversine formula for distance calculation
const calculateDistance = (fromCity: string, toCity: string): number => {
  const from = germanCities.find(
    (c) => c.name.toLowerCase() === fromCity.toLowerCase()
  );
  const to = germanCities.find(
    (c) => c.name.toLowerCase() === toCity.toLowerCase()
  );

  if (!from || !to) return 50;

  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Find nearest city from coordinates
const findNearestCity = (lat: number, lng: number): string => {
  let nearestCity = germanCities[0];
  let minDistance = Infinity;

  germanCities.forEach((city) => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity.name;
};

const DetailedPriceCalculator = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState<Room[]>([
    { id: crypto.randomUUID(), name: "Wohnzimmer", surface: 20 },
  ]);
  const [floor, setFloor] = useState("0");
  const [hasElevator, setHasElevator] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    notes: "",
  });

  // Geolocation handler
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Nicht unterstützt",
        description: "Geolokalisierung wird von Ihrem Browser nicht unterstützt.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestCity(latitude, longitude);
        setFromCity(nearestCity);
        toast({
          title: "Standort erkannt",
          description: `Nächste Stadt: ${nearestCity}`,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Standort nicht verfügbar",
          description: "Bitte wählen Sie Ihre Stadt manuell aus.",
          variant: "destructive",
        });
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Room management
  const addRoom = () => {
    setRooms([
      ...rooms,
      { id: crypto.randomUUID(), name: "Schlafzimmer", surface: 15 },
    ]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const updateRoom = (id: string, field: keyof Room, value: string | number) => {
    setRooms(
      rooms.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Calculations
  const calculation = useMemo(() => {
    if (!fromCity || !toCity) return null;

    const distance = calculateDistance(fromCity, toCity);
    const totalSurface = rooms.reduce((sum, r) => sum + (r.surface || 0), 0);
    const roomCount = rooms.length;

    // Pricing logic
    const basePricePerM2 = 12; // €12 per m²
    const distancePricePerKm = 1.5; // €1.50 per km
    const roomBaseCost = 50; // €50 base per room
    const floorCost = hasElevator ? 0 : parseInt(floor) * 30;

    const surfaceCost = totalSurface * basePricePerM2;
    const distanceCost = distance * distancePricePerKm;
    const roomsCost = roomCount * roomBaseCost;

    const subtotal = surfaceCost + distanceCost + roomsCost + floorCost;
    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return {
      distance,
      totalSurface,
      roomCount,
      surfaceCost,
      distanceCost,
      roomsCost,
      floorCost,
      subtotal,
      tax,
      total,
    };
  }, [fromCity, toCity, rooms, floor, hasElevator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!calculation) return;

    setIsSubmitting(true);

    try {
      const roomsDetails = rooms
        .map((r) => `${r.name}: ${r.surface}m²`)
        .join(", ");

      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          fromCity,
          toCity,
          apartmentSize: `${calculation.roomCount} Zimmer (${calculation.totalSurface}m²)`,
          floor: parseInt(floor) || 0,
          hasElevator,
          needsPacking: false,
          needsAssembly: false,
          preferredDate: contactInfo.preferredDate,
          estimatedPrice: Math.round(calculation.total),
          distance: calculation.distance,
          volume: calculation.totalSurface,
          message: `Detaillierte Raumangaben: ${roomsDetails}\n\n${contactInfo.notes}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Erfolg!",
        description: "Ihre Anfrage wurde erfolgreich gesendet!",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = fromCity && toCity && rooms.length > 0;
  const canProceedStep2 =
    contactInfo.name && contactInfo.email && contactInfo.phone;

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Vielen Dank für Ihre Anfrage!
          </h3>
          <p className="text-muted-foreground mb-6">
            Wir haben Ihre detaillierte Anfrage erhalten und werden uns innerhalb
            von 24 Stunden bei Ihnen melden.
          </p>
          <div className="bg-muted rounded-xl p-6 text-left mb-6">
            <h4 className="font-semibold text-foreground mb-3">Zusammenfassung:</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Route:</span>{" "}
                {fromCity} → {toCity} ({calculation?.distance} km)
              </p>
              <p>
                <span className="text-muted-foreground">Zimmer:</span>{" "}
                {calculation?.roomCount}
              </p>
              <p>
                <span className="text-muted-foreground">Gesamtfläche:</span>{" "}
                {calculation?.totalSurface} m²
              </p>
              <p>
                <span className="text-muted-foreground">Geschätzter Preis:</span>{" "}
                <span className="font-bold text-accent">
                  {calculation?.total.toFixed(2)} €
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setRooms([{ id: crypto.randomUUID(), name: "Wohnzimmer", surface: 20 }]);
              setContactInfo({ name: "", email: "", phone: "", preferredDate: "", notes: "" });
            }}
          >
            Neue Anfrage stellen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Detaillierter Preisrechner</CardTitle>
            <p className="text-sm text-muted-foreground">
              Berechnen Sie Ihren Umzugspreis basierend auf Ihren Räumen
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mt-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? "bg-accent" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Umzugsdetails</span>
          <span>Kontakt & Angebot</span>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Moving Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Cities selection */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Abholort *
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      <option value="">Bitte wählen</option>
                      {germanCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGeolocation}
                      disabled={isLocating}
                      title="Standort automatisch erkennen"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LocateFixed className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Zielort *
                  </Label>
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="">Bitte wählen</option>
                    {germanCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Distance display */}
              {fromCity && toCity && (
                <div className="bg-accent/10 rounded-lg p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="text-foreground">
                    Entfernung: <strong>{calculation?.distance} km</strong>
                  </span>
                </div>
              )}

              {/* Rooms section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-accent" />
                    Räume ({rooms.length})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRoom}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Raum hinzufügen
                  </Button>
                </div>

                <div className="space-y-3">
                  {rooms.map((room, index) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-3 p-4 bg-muted rounded-lg"
                    >
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <select
                        value={room.name}
                        onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      >
                        {roomTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="200"
                          value={room.surface}
                          onChange={(e) =>
                            updateRoom(room.id, "surface", parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-center"
                        />
                        <span className="text-sm text-muted-foreground">m²</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRoom(room.id)}
                        disabled={rooms.length === 1}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Total surface */}
                <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">
                      Gesamtfläche:
                    </span>
                    <span className="text-xl font-bold text-accent">
                      {calculation?.totalSurface || 0} m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Floor selection */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Stockwerk</Label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="0">Erdgeschoss</option>
                    <option value="1">1. Stock</option>
                    <option value="2">2. Stock</option>
                    <option value="3">3. Stock</option>
                    <option value="4">4. Stock</option>
                    <option value="5">5. Stock oder höher</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasElevator}
                      onChange={(e) => setHasElevator(e.target.checked)}
                      className="w-5 h-5 rounded border-input text-accent focus:ring-accent"
                    />
                    <span className="text-foreground">Aufzug vorhanden</span>
                  </label>
                </div>
              </div>

              {/* Price preview */}
              {calculation && (
                <div className="bg-primary/5 rounded-xl p-6 border border-border">
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Euro className="w-5 h-5 text-accent" />
                    Geschätzter Preis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Flächenkosten ({calculation.totalSurface} m² × 12€)
                      </span>
                      <span>{calculation.surfaceCost.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Entfernungskosten ({calculation.distance} km × 1,50€)
                      </span>
                      <span>{calculation.distanceCost.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Raumkosten ({calculation.roomCount} Räume × 50€)
                      </span>
                      <span>{calculation.roomsCost.toFixed(2)} €</span>
                    </div>
                    {calculation.floorCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Stockwerkzuschlag
                        </span>
                        <span>{calculation.floorCost.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zwischensumme</span>
                        <span>{calculation.subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MwSt. (19%)</span>
                        <span>{calculation.tax.toFixed(2)} €</span>
                      </div>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between text-lg font-bold">
                      <span className="text-foreground">Gesamtpreis</span>
                      <span className="text-accent">
                        {calculation.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="accent"
                className="w-full"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Weiter zu Kontaktdaten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                    placeholder="Ihr vollständiger Name"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder="01XX XXX XXXX"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  placeholder="ihre@email.de"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="date">Wunschtermin</Label>
                <Input
                  id="date"
                  type="date"
                  value={contactInfo.preferredDate}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      preferredDate: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Zusätzliche Anmerkungen</Label>
                <textarea
                  id="notes"
                  value={contactInfo.notes}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, notes: e.target.value })
                  }
                  placeholder="Besondere Wünsche, schwere Gegenstände, etc."
                  className="w-full mt-2 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-[100px]"
                />
              </div>

              {/* Summary */}
              {calculation && (
                <div className="bg-muted rounded-xl p-6">
                  <h4 className="font-bold text-foreground mb-3">Zusammenfassung</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Route:</span>{" "}
                      {fromCity} → {toCity} ({calculation.distance} km)
                    </p>
                    <p>
                      <span className="text-muted-foreground">Zimmer:</span>{" "}
                      {rooms.map((r) => r.name).join(", ")}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Gesamtfläche:</span>{" "}
                      {calculation.totalSurface} m²
                    </p>
                    <p className="text-lg font-bold text-accent pt-2">
                      Geschätzter Preis: {calculation.total.toFixed(2)} €
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  className="flex-1"
                  disabled={!canProceedStep2 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    "Angebot anfordern"
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Mit dem Absenden stimmen Sie zu, für Ihr Angebot kontaktiert zu
                werden.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default DetailedPriceCalculator;
