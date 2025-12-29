import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const mainIcon = createCustomIcon('#F97316'); // accent orange
const secondaryIcon = createCustomIcon('#1E3A5F'); // primary blue

interface ServiceArea {
  name: string;
  position: [number, number];
  description: string;
  isMain?: boolean;
}

const serviceAreas: ServiceArea[] = [
  {
    name: "Berlin Mitte",
    position: [52.5200, 13.4050],
    description: "Hauptstandort - Zentrale Berlin",
    isMain: true,
  },
  {
    name: "Charlottenburg",
    position: [52.5167, 13.3000],
    description: "Westliches Berlin",
  },
  {
    name: "Prenzlauer Berg",
    position: [52.5388, 13.4244],
    description: "Beliebtes Wohngebiet",
  },
  {
    name: "Kreuzberg",
    position: [52.4970, 13.4030],
    description: "Vielfältiger Bezirk",
  },
  {
    name: "Potsdam",
    position: [52.3906, 13.0645],
    description: "Brandenburg - Erweiterte Zone",
  },
  {
    name: "Spandau",
    position: [52.5352, 13.1995],
    description: "Westlicher Bezirk",
  },
  {
    name: "Köpenick",
    position: [52.4433, 13.5756],
    description: "Südöstliches Berlin",
  },
  {
    name: "Reinickendorf",
    position: [52.5922, 13.3376],
    description: "Nördliches Berlin",
  },
];

const ServiceAreaMap = () => {
  const centerPosition: [number, number] = [52.5200, 13.4050];

  return (
    <MapContainer
      center={centerPosition}
      zoom={10}
      scrollWheelZoom={false}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Service area circle */}
      <Circle
        center={centerPosition}
        radius={25000}
        pathOptions={{
          color: '#F97316',
          fillColor: '#F97316',
          fillOpacity: 0.1,
          weight: 2,
        }}
      />

      {/* Markers for each service area */}
      {serviceAreas.map((area) => (
        <Marker
          key={area.name}
          position={area.position}
          icon={area.isMain ? mainIcon : secondaryIcon}
        >
          <Popup>
            <div className="text-center p-1">
              <h3 className="font-bold text-primary text-lg">{area.name}</h3>
              <p className="text-muted-foreground text-sm">{area.description}</p>
              {area.isMain && (
                <span className="inline-block mt-2 px-2 py-1 bg-accent text-white text-xs rounded-full">
                  Hauptstandort
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ServiceAreaMap;
