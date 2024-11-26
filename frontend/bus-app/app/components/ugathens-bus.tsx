import Link from 'next/Link';
import React, { useEffect, useState } from 'react';
import { getUserLocation, haversineDistance } from '../../utils/utils';
import Button from './ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import LoadingPage from './ui/LoadingPage';
import Map from './ui/map';

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
  const [showAbout, setShowAbout] = useState(false);
  const [mobile, setMobile] = useState(false);


  const convertToDate = (timeString: string): Date => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    else if (modifier === 'AM' && hours === 12) hours = 0;

    return new Date(1970, 0, 1, hours, minutes);
  };
  const toggleAboutPopup = () => setShowAbout(!showAbout);

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

    const updateMobile = () => setMobile(window.innerWidth < 599);

    // Call once to set initial state based on current window width
    updateMobile();

    // Setup event listener for resizing the window
    window.addEventListener('resize', updateMobile);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateMobile);
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
    window.location.href = '/sign-up'; // Redirect to login page after logout
  };

  if (loading) return <LoadingPage />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (filteredBusStops.length === 0) return <p>No bus stops available 😭</p>;

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-black' : 'bg-white'} text-white`}>
      <header className="bg-red-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
        <div className="flex space-x-4 items-center">
          {/* <Link> */}
          <Link href="mailto:ryan.majd@uga.edu?subject=UGAthens Bus Stops" className="text-gray-200 font-bold">
            Contact Us
          </Link>
          <Button onClick={toggleAboutPopup} className="text-white">
            About Us
          </Button>
          {/* </Link> */}
          {/* Light/Dark Mode Toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="primary"
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-800'}`}
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
      {showAbout && (
        <div
          className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50`}
          onClick={toggleAboutPopup}
        >
          <div
            className={` ${darkMode ? 'text-black dark:bg-gray-800 dark:text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-1/2`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:text-sm lg:text-md xl:text-lg">
              <h2 className=" font-bold mb-4">About Us</h2>
              <p className=" leading-relaxed">
                Welcome to UGAthens Bus Stops! Our mission is to provide the most accurate and up-to-date
                information about bus stops around the University of Georgia campus. Whether you're a student
                rushing to class, a staff member heading to work, or a visitor exploring our beautiful campus,
                we are here to make your commute as seamless as possible.
              </p>
              {!mobile ?

                <p className="leading-relaxed mt-4">Our team is dedicated to leveraging technology and user-friendly design to enhance your
                  transportation experience. With features like real-time updates, route planning, and live
                  tracking, we aim to be the ultimate companion for your campus travels. Thank you for choosing UGAthens Bus Stops. Together, let&apos;s move forward efficiently and effectively!</p>
                : ''
              }

              <Button onClick={toggleAboutPopup} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
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
                className={`p-2 rounded w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white-900 text-black border-2 border-black'}`}
              />
            </div>

            {/* Distance filter */}
            <div className={`mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white-900 text-black'}`}>
              <select
                onChange={handleDistanceChange}
                className={`p-2 rounded w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white-900 text-black border-2 border-black'}`}
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
              <Card key={stop.id} className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white-900 text-black border-2 border-black'}`}>
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
        <div className="flex-1 relative pl-4">
          <Map busStops={filteredBusStops} />
        </div>
      </div>
    </div>
  );
};

export default UGAthensBusStops;


