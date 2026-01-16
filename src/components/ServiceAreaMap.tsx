import { MapPin } from "lucide-react";

interface ServiceArea {
  name: string;
  description: string;
  isMain?: boolean;
}

const serviceAreas: ServiceArea[] = [
  { name: "Berlin Mitte", description: "Hauptstandort - Zentrale Berlin", isMain: true },
  { name: "Charlottenburg", description: "Westliches Berlin" },
  { name: "Prenzlauer Berg", description: "Beliebtes Wohngebiet" },
  { name: "Kreuzberg", description: "Vielfältiger Bezirk" },
  { name: "Potsdam", description: "Brandenburg - Erweiterte Zone" },
  { name: "Spandau", description: "Westlicher Bezirk" },
  { name: "Köpenick", description: "Südöstliches Berlin" },
  { name: "Reinickendorf", description: "Nördliches Berlin" },
];

const ServiceAreaMap = () => {
  return (
    <div className="w-full h-full relative">
      {/* OpenStreetMap iframe embed */}
      <iframe
        title="UmzugTeam365 Servicegebiet Berlin"
        src="https://www.openstreetmap.org/export/embed.html?bbox=12.8%2C52.3%2C13.8%2C52.7&amp;layer=mapnik&amp;marker=52.52%2C13.405"
        className="w-full h-full border-0 rounded-2xl"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Overlay with service areas */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
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
