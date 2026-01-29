import { useState, useMemo, useCallback, useEffect, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { MapPin, Navigation, ArrowRight, Truck, Clock, Euro, Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

interface City {
  name: string;
  lat: number;
  lng: number;
}

interface RouteData {
  from: City | null;
  to: City | null;
  distance: number;
  duration: number;
  estimatedPrice: number;
}

// Major German cities with coordinates
const germanCities: City[] = [
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
  { name: "München", lat: 48.1351, lng: 11.582 },
  { name: "Köln", lat: 50.9375, lng: 6.9603 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
  { name: "Düsseldorf", lat: 51.2277, lng: 6.7735 },
  { name: "Leipzig", lat: 51.3397, lng: 12.3731 },
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
  { name: "Essen", lat: 51.4556, lng: 7.0116 },
  { name: "Bremen", lat: 53.0793, lng: 8.8017 },
  { name: "Dresden", lat: 51.0504, lng: 13.7373 },
  { name: "Hannover", lat: 52.3759, lng: 9.732 },
  { name: "Nürnberg", lat: 49.4521, lng: 11.0767 },
  { name: "Potsdam", lat: 52.3906, lng: 13.0645 },
  { name: "Magdeburg", lat: 52.1205, lng: 11.6276 },
  { name: "Rostock", lat: 54.0924, lng: 12.0991 },
  { name: "Erfurt", lat: 50.9848, lng: 11.0299 },
  { name: "Mainz", lat: 49.9929, lng: 8.2473 },
  { name: "Kiel", lat: 54.3233, lng: 10.1394 },
];

const DEFAULT_CENTER: [number, number] = [51.1657, 10.4515]; // Germany center

// Leaflet CJS/ESM compatibility
const L: any = (Leaflet as any).default ?? Leaflet;

// Haversine formula for distance calculation
const calculateDistance = (from: City, to: City): number => {
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

// Estimate driving time
const estimateDuration = (distanceKm: number): number => {
  if (distanceKm < 50) return (distanceKm / 40) * 60;
  if (distanceKm < 200) return (distanceKm / 70) * 60;
  return (distanceKm / 90) * 60;
};

// Estimate price based on distance
const estimatePrice = (distanceKm: number): number => {
  const basePrice = 299;
  const pricePerKm = 1.5;
  return Math.round(basePrice + distanceKm * pricePerKm);
};

// Component to fit bounds when route changes
const FitBoundsOnRoute = ({ from, to }: { from: City; to: City }) => {
  const map = useMap();

  useEffect(() => {
    if (!L?.latLngBounds || typeof map?.fitBounds !== "function") return;

    const bounds = L.latLngBounds([
      [from.lat, from.lng],
      [to.lat, to.lng],
    ]);

    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, from, to]);

  return null;
};

interface RouteMapCalculatorProps {
  onRouteCalculated?: (data: RouteData) => void;
}

const RouteMapCalculator = forwardRef<HTMLDivElement, RouteMapCalculatorProps>(
  ({ onRouteCalculated }, ref) => {
    const [fromSearch, setFromSearch] = useState("");
    const [toSearch, setToSearch] = useState("");
    const [fromCity, setFromCity] = useState<City | null>(null);
    const [toCity, setToCity] = useState<City | null>(null);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Find nearest city to given coordinates
    const findNearestCity = useCallback((lat: number, lng: number): City => {
      let nearestCity = germanCities[0];
      let minDistance = Infinity;

      for (const city of germanCities) {
        const distance = calculateDistance({ name: "", lat, lng }, city);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      }

      return nearestCity;
    }, []);

    // Handle geolocation
    const handleGeolocation = useCallback(() => {
      if (!navigator.geolocation) {
        toast({
          title: "Géolocalisation non supportée",
          description: "Votre navigateur ne supporte pas la géolocalisation.",
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
          setFromSearch(nearestCity.name);
          setShowFromSuggestions(false);
          setIsLocating(false);

          toast({
            title: "Position détectée",
            description: `Ville la plus proche : ${nearestCity.name}`,
          });
        },
        (error) => {
          setIsLocating(false);
          let errorMessage = "Impossible de récupérer votre position.";
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Veuillez autoriser l'accès à votre position.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Position non disponible.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Délai d'attente dépassé.";
          }

          toast({
            title: "Erreur de géolocalisation",
            description: errorMessage,
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }, [findNearestCity]);

    // Filter cities based on search
    const filteredFromCities = useMemo(() => {
      if (!fromSearch.trim()) return germanCities;
      return germanCities.filter((c) =>
        c.name.toLowerCase().includes(fromSearch.toLowerCase())
      );
    }, [fromSearch]);

    const filteredToCities = useMemo(() => {
      if (!toSearch.trim()) return germanCities;
      return germanCities.filter((c) =>
        c.name.toLowerCase().includes(toSearch.toLowerCase())
      );
    }, [toSearch]);

    // Route calculation
    const routeData = useMemo((): RouteData | null => {
      if (!fromCity || !toCity) return null;

      const distance = calculateDistance(fromCity, toCity);
      const duration = estimateDuration(distance);
      const estimatedPrice = estimatePrice(distance);

      return {
        from: fromCity,
        to: toCity,
        distance,
        duration,
        estimatedPrice,
      };
    }, [fromCity, toCity]);

    const handleSelectFrom = useCallback((city: City) => {
      setFromCity(city);
      setFromSearch(city.name);
      setShowFromSuggestions(false);
    }, []);

    const handleSelectTo = useCallback((city: City) => {
      setToCity(city);
      setToSearch(city.name);
      setShowToSuggestions(false);
    }, []);

    const handleCalculateRoute = useCallback(() => {
      if (!routeData) return;

      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        onRouteCalculated?.(routeData);
      }, 500);
    }, [routeData, onRouteCalculated]);

    const formatDuration = (minutes: number): string => {
      if (minutes < 60) return `${Math.round(minutes)} Min.`;
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours} Std. ${mins > 0 ? `${mins} Min.` : ""}`;
    };

    // Create custom icons
    const fromIcon = useMemo(() => {
      if (!L?.divIcon) return undefined;
      return L.divIcon({
        className: "custom-marker-from",
        html: `<div style="background-color: #22c55e; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    }, []);

    const toIcon = useMemo(() => {
      if (!L?.divIcon) return undefined;
      return L.divIcon({
        className: "custom-marker-to",
        html: `<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
    }, []);

    const routeLine: [number, number][] = useMemo(() => {
      if (!fromCity || !toCity) return [];
      return [
        [fromCity.lat, fromCity.lng],
        [toCity.lat, toCity.lng],
      ];
    }, [fromCity, toCity]);

    return (
      <div ref={ref} className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">
                Trajet-Rechner
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Berechnen Sie Ihren Umzugstrajet
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* City inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* From City */}
            <div className="relative">
              <Label className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Abholort
              </Label>
              <div className="flex gap-2">
                <Input
                  value={fromSearch}
                  onChange={(e) => {
                    setFromSearch(e.target.value);
                    setShowFromSuggestions(true);
                    if (!e.target.value) setFromCity(null);
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  placeholder="Stadt eingeben..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGeolocation}
                  disabled={isLocating}
                  title="Meine Position verwenden"
                  className="shrink-0"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LocateFixed className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {showFromSuggestions && filteredFromCities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredFromCities.slice(0, 8).map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleSelectFrom(city)}
                      className="w-full px-4 py-2 text-left hover:bg-accent/10 text-sm flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To City */}
            <div className="relative">
              <Label className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Zielort
              </Label>
              <Input
                value={toSearch}
                onChange={(e) => {
                  setToSearch(e.target.value);
                  setShowToSuggestions(true);
                  if (!e.target.value) setToCity(null);
                }}
                onFocus={() => setShowToSuggestions(true)}
                placeholder="Stadt eingeben..."
                className="w-full"
              />
              {showToSuggestions && filteredToCities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredToCities.slice(0, 8).map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleSelectTo(city)}
                      className="w-full px-4 py-2 text-left hover:bg-accent/10 text-sm flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-border">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={6}
              className="w-full h-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Route line */}
              {fromCity && toCity && routeLine.length > 0 && (
                <>
                  <Polyline
                    positions={routeLine}
                    pathOptions={{
                      color: "hsl(var(--primary))",
                      weight: 4,
                      opacity: 0.8,
                      dashArray: "10, 10",
                    }}
                  />
                  <FitBoundsOnRoute from={fromCity} to={toCity} />
                </>
              )}

              {/* From marker */}
              {fromCity && (
                <Marker
                  position={[fromCity.lat, fromCity.lng]}
                  {...(fromIcon ? { icon: fromIcon } : {})}
                >
                  <Popup>
                    <div className="text-center">
                      <strong className="text-green-600">Abholort</strong>
                      <p className="font-semibold">{fromCity.name}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* To marker */}
              {toCity && (
                <Marker
                  position={[toCity.lat, toCity.lng]}
                  {...(toIcon ? { icon: toIcon } : {})}
                >
                  <Popup>
                    <div className="text-center">
                      <strong className="text-red-600">Zielort</strong>
                      <p className="font-semibold">{toCity.name}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Route summary */}
          {routeData && (
            <div className="bg-muted rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {routeData.from?.name}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {routeData.to?.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <Navigation className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold text-foreground">
                    {routeData.distance} km
                  </div>
                  <div className="text-xs text-muted-foreground">Entfernung</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-xl font-bold text-foreground">
                    {formatDuration(routeData.duration)}
                  </div>
                  <div className="text-xs text-muted-foreground">Fahrzeit</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <Euro className="w-5 h-5 text-accent mx-auto mb-1" />
                  <div className="text-xl font-bold text-accent">
                    ab {routeData.estimatedPrice}€
                  </div>
                  <div className="text-xs text-muted-foreground">Geschätzt</div>
                </div>
              </div>
            </div>
          )}

          {/* Calculate button */}
          <Button
            onClick={handleCalculateRoute}
            disabled={!fromCity || !toCity || isCalculating}
            variant="accent"
            size="lg"
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Berechnung läuft...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Route berechnen
              </>
            )}
          </Button>

          {/* Info text */}
          <p className="text-xs text-muted-foreground text-center">
            Die angezeigten Preise sind Schätzungen. Der finale Preis hängt von
            Wohnungsgröße, Etage und Zusatzleistungen ab.
          </p>
        </div>
      </div>
    );
  }
);

RouteMapCalculator.displayName = "RouteMapCalculator";

export default RouteMapCalculator;
