// Map.js
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

// Custom icon for bus stops
const busIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Component to display a Leaflet map
const Map = ({ busStops, selectedStop, setSelectedStop }) => {
    return (
        <MapContainer
            center={[33.9550, -83.3751]} // Center of the map on UGA campus
            zoom={15}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {busStops.map((stop) => (
                <Marker
                    key={stop.id}
                    position={[stop.lat, stop.lng]}
                    icon={busIcon}
                    eventHandlers={{
                        click: () => {
                            setSelectedStop(stop);
                        },
                    }}
                >
                    <Popup>
                        <strong>{stop.name}</strong>
                        <br />
                        {stop.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;