import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Clock, Car, Loader2, AlertCircle } from "lucide-react";

interface RouteInfo {
  distance: number;
  duration: number;
  userLocation: { lat: number; lng: number };
}

// Berlin service center coordinates
const BERLIN_CENTER = { lat: 52.52, lng: 13.405 };

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate driving time (avg 60 km/h in urban areas, 100 km/h on highways)
const estimateDuration = (distanceKm: number): number => {
  if (distanceKm < 20) {
    return (distanceKm / 30) * 60; // City driving ~30 km/h -> minutes
  } else if (distanceKm < 100) {
    return (distanceKm / 60) * 60; // Mixed ~60 km/h -> minutes
  }
  return (distanceKm / 80) * 60; // Longer distance ~80 km/h -> minutes
};

interface RouteCalculatorProps {
  onRouteCalculated?: (route: RouteInfo) => void;
}

const RouteCalculator = ({ onRouteCalculated }: RouteCalculatorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const calculateRoute = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation wird von Ihrem Browser nicht unterstützt.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = calculateDistance(
          userLat,
          userLng,
          BERLIN_CENTER.lat,
          BERLIN_CENTER.lng
        );

        const duration = estimateDuration(distance);

        const route: RouteInfo = {
          distance,
          duration,
          userLocation: { lat: userLat, lng: userLng },
        };

        setRouteInfo(route);
        onRouteCalculated?.(route);
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Standortzugriff wurde verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Standortinformationen sind nicht verfügbar.");
            break;
          case err.TIMEOUT:
            setError("Zeitüberschreitung bei der Standortabfrage.");
            break;
          default:
            setError("Ein unbekannter Fehler ist aufgetreten.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [onRouteCalculated]);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} Min.`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours} Std. ${mins} Min.`;
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
          <Navigation className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Entfernungsrechner</h3>
          <p className="text-sm text-muted-foreground">
            Berechnen Sie die Entfernung zu unserem Standort
          </p>
        </div>
      </div>

      {!routeInfo && !error && (
        <Button
          onClick={calculateRoute}
          disabled={isLoading}
          variant="accent"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Standort wird ermittelt...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Meinen Standort verwenden
            </>
          )}
        </Button>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive">{error}</p>
              <Button
                onClick={calculateRoute}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Erneut versuchen
              </Button>
            </div>
          </div>
        </div>
      )}

      {routeInfo && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/10 rounded-lg p-4 text-center">
              <Car className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {routeInfo.distance.toFixed(1)} km
              </div>
              <div className="text-sm text-muted-foreground">Entfernung</div>
            </div>
            <div className="bg-accent/10 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {formatDuration(routeInfo.duration)}
              </div>
              <div className="text-sm text-muted-foreground">Fahrzeit (ca.)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              Ihr Standort: {routeInfo.userLocation.lat.toFixed(4)}, {routeInfo.userLocation.lng.toFixed(4)}
            </span>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              {routeInfo.distance <= 25 ? (
                <span className="text-green-600 font-medium">
                  ✓ Sie befinden sich in unserem Hauptservicegebiet!
                </span>
              ) : routeInfo.distance <= 50 ? (
                <span className="text-accent font-medium">
                  ✓ Sie befinden sich in unserem erweiterten Servicegebiet.
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Kontaktieren Sie uns für Fernumzüge außerhalb Berlins.
                </span>
              )}
            </p>
            <Button
              onClick={calculateRoute}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Navigation className="w-4 h-4" />
              Standort aktualisieren
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteCalculator;
