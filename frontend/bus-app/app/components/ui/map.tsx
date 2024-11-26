import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

type MapProps = {
    busStops: {
        id: string;
        name: string;
        lat: number;
        lng: number;
        description?: string;
    }[];
    darkMode: boolean;
};

const doSomething = () => {
    console.log("Clicked");
}

const Map = ({ busStops }: MapProps) => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    setError("Unable to fetch your location. Please enable location services.");
                    console.error("Geolocation error:", err);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={currentLocation || { lat: 33.9519, lng: -83.3777 }} // Default to Athens, GA if location not available
                zoom={currentLocation ? 15 : 14} // Slightly closer if user's location is available
            >
                {/* Bus Stops Markers */}
                {busStops.map((stop) => (
                    <Marker
                        key={stop.id}
                        position={{ lat: stop.lat, lng: stop.lng }}
                        title={stop.name}
                        icon={"https://cdn-icons-png.flaticon.com/64/3448/3448339.png"}
                        onClick={doSomething}
                    />
                ))}

                {/* User's Current Location Marker */}
                {currentLocation && (

                    <div className="animate-ping">
                        <Marker
                            position={currentLocation}
                            title="You are here"

                            icon={"https://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                        />
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500 absolute top-4 left-4">{error}</p>}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
