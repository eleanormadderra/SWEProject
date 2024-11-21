import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'; // Your custom Card components
import Button from './ui/Button'; // Your custom Button component
import Map from './ui/map'; // Assuming you want to keep the map functionality

type BusStop = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description?: string;
};

const UGAthensBusStops = () => {
  const [busStops, setBusStops] = useState<BusStop[]>([]); // State for storing bus stops
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch bus stops from the API
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await fetch('/api/busstops'); // Fetching data from API

        if (!response.ok) {
          throw new Error('Failed to fetch bus stops');
        }

        const data = await response.json(); // Parse the response as JSON

        // If data is an array, set it to state
        if (Array.isArray(data)) {
          setBusStops(data); // Dynamically set bus stop data to state
        } else {
          console.error('Data is not in expected array format');
        }
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBusStops(); // Fetch bus stops on component mount
  }, []);

  // If data is still loading, show a loading message
  if (loading) return <p>Loading...</p>;

  // If no bus stops are available, show a message
  if (busStops.length === 0) return <p>No bus stops available</p>;

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="bg-red-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
        {/* Add your banner image here */}
        <Button
          variant="primary"
          size="small"
          className="md:hidden text-white"
          onClick={() => {/* Handle sidebar toggle if needed */}}
        >
          {/* Menu icon or any other icon */}
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="w-full md:w-1/4 min-w-[250px] max-w-[300px] h-full overflow-auto">
          {/* Sidebar (if needed) */}
          <div className="space-y-4">
            {/* Dynamically render bus stops */}
            {busStops.map((stop) => (
              <Card key={stop.id} className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-red-500">{stop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{stop.description}</CardDescription>
                  <p className="text-gray-400 text-sm">
                    Coordinates: {stop.lat}, {stop.lng}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          <Map busStops={busStops} /> {/* Pass the bus stops to the map component */}
        </div>
      </div>
    </div>
  );
};

export default UGAthensBusStops;
