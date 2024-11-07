"use client"

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Menu } from "lucide-react";
import Image from 'next/Image';
import { useState } from "react";
import banner from '../../public/map key.png';
import Button from "./ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";

// Mock data for UGA bus stops
const busStops = [
    { id: 1, name: "Tate Student Center", lat: 33.9550, lng: -83.3751, description: "Central hub for student activities" },
    { id: 2, name: "Main Library", lat: 33.9547, lng: -83.3735, description: "The main library for UGA students" },
    { id: 3, name: "Sanford Stadium", lat: 33.9500, lng: -83.3734, description: "Home of the UGA Bulldogs" },
    { id: 4, name: "East Campus Village", lat: 33.9402, lng: -83.3667, description: "Residential area for students" },
    { id: 5, name: "Ramsey Center", lat: 33.9352, lng: -83.3721, description: "UGA's premier fitness and aquatic center" },
];

const busIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function UGAthensBusStops() {
    const [selectedStop, setSelectedStop] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <header className="bg-red-700 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
                <Image src={banner.src} width='250' height='250' alt='just a decorative banner' />
                <Button
                    variant="primary"
                    size="small"
                    className=" md:hidden text-white" //can add md:hidden to get rid of it
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <Card
                    className={`w-full md:w-1/4 min-w-[250px] max-w-[300px] h-full rounded-none bg-gray-800 text-white transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } md:translate-x-0 absolute md:relative z-10`}
                >
                    <CardHeader>
                        <CardTitle className="text-red-500">Bus Stops</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {busStops.map((stop) => (
                                <li key={stop.id}>
                                    <Card
                                        className={`p-4 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer ${selectedStop?.id === stop.id ? "bg-red-800" : "bg-gray-700"
                                            }`}
                                        onClick={() => setSelectedStop(stop)}
                                    >
                                        <CardTitle className="text-lg">{stop.name}</CardTitle>
                                        <CardDescription className="text-gray-400 text-sm">
                                            {stop.description}
                                        </CardDescription>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <div className="flex-1 flex items-center justify-center">
                    {selectedStop ? (
                        <div className="text-center">
                            <h2 className="text-3xl font-semibold text-red-500">{selectedStop.name}</h2>
                            <p className="text-gray-300">{selectedStop.description}</p>
                            <p className="text-gray-500 mt-2">
                                Coordinates: {selectedStop.lat}, {selectedStop.lng}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-lg">Select a bus stop to see details</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UGAthensBusStops;
