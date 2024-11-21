import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import Button from './ui/Button';
import Map from './ui/map';
import { haversineDistance, getUserLocation } from '../../utils/utils';

type BusRoute = {
  busName: string;
  departureTime: string;
  arrivalTime: string;
};

type BusStop = {
  id: number;
  name: string;
  busName: string;
  lat: number;
  lng: number;
  description?: string;
  busRoutes: BusRoute[];
  nextBus: BusRoute | null;
  distance: number;
};

const UGAthensBusStops = () => {
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertToDate = (timeString: string): Date => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    else if (modifier === 'AM' && hours === 12) hours = 0;

    return new Date(1970, 0, 1, hours, minutes);
  };

  useEffect(() => {
    const fetchAndSortBusStops = async () => {
      try {
        setLoading(true);

        // Fetch user location
        const userLocation = await getUserLocation();
        console.log('User Location:', userLocation);

        // Fetch bus stops from the API
        const response = await fetch('/api/busstops');
        if (!response.ok) throw new Error('Failed to fetch bus stops');

        const data: BusStop[] = await response.json();

        // Process and sort bus stops by distance and next bus
        const busStopsWithDetails = data.map((stop) => {
          const busRoutes = stop.busRoutes || [];

          // Sort bus routes by departure time
          const sortedBusRoutes = busRoutes
            .filter((route) => route.departureTime)
            .sort((a, b) =>
              convertToDate(a.departureTime).getTime() -
              convertToDate(b.departureTime).getTime()
            );

          // Find the next available bus
          const now = new Date();
          const nextBus = sortedBusRoutes.find(
            (route) => convertToDate(route.departureTime) > now
          ) || null;

          return {
            ...stop,
            distance: haversineDistance(
              userLocation.latitude,
              userLocation.longitude,
              stop.lat,
              stop.lng
            ),
            nextBus,
            busRoutes: sortedBusRoutes,
          };
        });

        // Sort stops by distance
        const sortedBusStops = busStopsWithDetails.sort(
          (a, b) => (a.distance || 0) - (b.distance || 0)
        );

        setBusStops(sortedBusStops);
      } catch (error) {
        console.error('Error fetching or sorting bus stops:', error);
        setError('Failed to fetch or process bus stops');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortBusStops();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (busStops.length === 0) return <p>No bus stops available</p>;

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="bg-red-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
        <Button variant="primary" size="small" className="md:hidden text-white">
          {/* Menu icon or other icon */}
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="w-full md:w-1/4 min-w-[250px] max-w-[300px] h-full overflow-auto">
          <div className="space-y-4">
            {busStops.map((stop) => (
              <Card key={stop.id} className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-red-500">{stop.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{stop.busName}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {stop.description || 'No description available'}
                  </CardDescription>
                  <p className="text-gray-400 text-sm">
                    Coordinates: {stop.lat}, {stop.lng}
                  </p>
                  {stop.distance && (
                    <p className="text-gray-400 text-sm">
                      Distance: {stop.distance.toFixed(2)} km
                    </p>
                  )}
                  {stop.nextBus ? (
                    <div className="mt-4 text-sm text-gray-300">
                      <strong>Next Bus:</strong> {stop.nextBus.busName} <br />
                      <strong>Departure Time:</strong> {stop.nextBus.departureTime} <br />
                    </div>
                  ) : (
                    <p className="text-gray-500">No upcoming buses available</p>
                  )}
                  {stop.busRoutes.length > 0 ? (
                    <ul className="mt-2 text-sm text-gray-300">
                      {stop.busRoutes.map((route, index) => (
                        <li key={index}>
                          <strong>Bus Name:</strong> {route.busName} <br />
                          <strong>Departure:</strong> {route.departureTime} <br />
                          <strong>Arrival:</strong> {route.arrivalTime} <br />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No bus routes available</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          <Map busStops={busStops} />
        </div>
      </div>
    </div>
  );
};

export default UGAthensBusStops;
