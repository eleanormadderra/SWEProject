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
  const [filteredBusStops, setFilteredBusStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);

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

        // Process bus stops with details
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
          const nextBus =
            sortedBusRoutes.find(
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

        // Set all bus stops, including the ones that meet the distance filter
        setBusStops(busStopsWithDetails);
        setFilteredBusStops(busStopsWithDetails);
      } catch (error) {
        console.error('Error fetching or processing bus stops:', error);
        setError('Failed to fetch or process bus stops');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortBusStops();
  }, []);

  useEffect(() => {
    let filtered = busStops;

    // Apply the distance filter
    if (selectedDistance !== null) {
      filtered = filtered.filter((stop) => stop.distance <= selectedDistance);
    }

    // Apply the search filter
    if (searchQuery) {
      filtered = filtered.filter((stop) =>
        stop.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBusStops(filtered);
  }, [selectedDistance, searchQuery, busStops]);

  const handleDistanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDistance(value ? parseInt(value, 10) : null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Logout logic (e.g., clearing session, redirecting to login page)
    // Example of clearing cookies or sessionStorage
    // sessionStorage.clear();
    // localStorage.clear();
    window.location.href = '/login'; // Redirect to login page after logout
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (filteredBusStops.length === 0) return <p>No bus stops available</p>;

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-black' : 'bg-white'} text-white`}>
      <header className="bg-red-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
        <div className="flex space-x-4 items-center">
          {/* Light/Dark Mode Toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="primary"
            className={`p-2 rounded-full ${darkMode ? 'bg-black' : 'bg-white'}`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="w-full md:w-1/4 min-w-[250px] max-w-[300px] h-full overflow-auto">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search for bus stops..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-800 text-white p-2 rounded w-full"
              />
            </div>

            {/* Distance filter */}
            <div className="mb-4">
              <select
                onChange={handleDistanceChange}
                className="bg-gray-800 text-white p-2 rounded"
              >
                <option value="">Select Distance</option>
                <option value="1">1 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
            </div>

            {/* Bus Stops List */}
            {filteredBusStops.map((stop) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          <Map busStops={filteredBusStops} />
        </div>
      </div>
    </div>
  );
};

export default UGAthensBusStops;


