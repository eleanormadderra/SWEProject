import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Add prop types for bus stops
type MapProps = {
    busStops: {
        id: number;
        name: string;
        lat: number;
        lng: number;
        description?: string;
    }[];
};

const Map = ({ busStops }: MapProps) => {
    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}  // Ensure height is defined here
                center={{ lat: 33.9519, lng: -83.3777 }} // Default to Athens, GA coordinates
                zoom={14}
            >
                {busStops.map((stop) => (
                    <Marker
                        key={stop.id}
                        position={{ lat: stop.lat, lng: stop.lng }}
                        title={stop.name}
                        icon={"https://cdn-icons-png.flaticon.com/64/3448/3448339.png"}
                    />
                ))}

            </GoogleMap>
        </LoadScript>
    );
};

export default Map;