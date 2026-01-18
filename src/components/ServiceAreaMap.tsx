import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { MapPin } from "lucide-react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

interface ServiceArea {
  name: string;
  description: string;
  isMain?: boolean;
  position: [number, number];
}

const serviceAreas: ServiceArea[] = [
  { name: "Berlin Mitte", description: "Hauptstandort - Zentrale Berlin", isMain: true, position: [52.52, 13.405] },
  { name: "Charlottenburg", description: "Westliches Berlin", position: [52.516, 13.304] },
  { name: "Prenzlauer Berg", description: "Beliebtes Wohngebiet", position: [52.538, 13.424] },
  { name: "Kreuzberg", description: "Vielfältiger Bezirk", position: [52.497, 13.403] },
  { name: "Potsdam", description: "Brandenburg - Erweiterte Zone", position: [52.391, 13.065] },
  { name: "Spandau", description: "Westlicher Bezirk", position: [52.535, 13.199] },
  { name: "Köpenick", description: "Südöstliches Berlin", position: [52.446, 13.576] },
  { name: "Reinickendorf", description: "Nördliches Berlin", position: [52.596, 13.334] },
];

const ServiceAreaMap = () => {
  // Create custom icon for markers
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: hsl(34, 100%, 50%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  const mainIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker-main",
      html: `<div style="background-color: hsl(34, 100%, 50%); width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[52.52, 13.405]}
        zoom={10}
        className="w-full h-full rounded-2xl z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Service area circle */}
        <Circle
          center={[52.52, 13.405]}
          radius={25000}
          pathOptions={{
            color: "hsl(34, 100%, 50%)",
            fillColor: "hsl(34, 100%, 50%)",
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
        
        {serviceAreas.map((area) => (
          <Marker
            key={area.name}
            position={area.position}
            icon={area.isMain ? mainIcon : customIcon}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-primary">{area.name}</strong>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay with service areas */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl z-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {serviceAreas.map((area) => (
            <div
              key={area.name}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                area.isMain
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/20 text-white backdrop-blur-sm"
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>{area.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaMap;
