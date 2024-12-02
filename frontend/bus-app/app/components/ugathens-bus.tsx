/**
 * UGAthensBusStops component fetches and displays bus stops around the University of Georgia campus.
 * It allows users to filter bus stops by distance and search query, and provides real-time updates
 * on bus stop information including transit routes and departure times.
 *
 * @component
 * @example
 * return (
 *   <UGAthensBusStops />
 * )
 *
 * @typedef {Object} DepartureTime
 * @property {string} text - The departure time in text format.
 * @property {string} time_zone - The time zone of the departure time.
 * @property {number} value - The departure time in milliseconds since the Unix Epoch.
 *
 * @typedef {Object} TransitInfo
 * @property {string} line - The bus line.
 * @property {DepartureTime} departureTime - The departure time information.
 *
 * @typedef {Object} BusStop
 * @property {string} id - The unique identifier of the bus stop.
 * @property {string} name - The name of the bus stop.
 * @property {string} busName - The name of the bus.
 * @property {number} lat - The latitude of the bus stop.
 * @property {number} lng - The longitude of the bus stop.
 * @property {string} [description] - The description of the bus stop.
 * @property {TransitInfo[]} transitInfo - The transit information for the bus stop.
 * @property {number} [distance] - The distance from the user's location to the bus stop.
 *
 * @typedef {Object} UserLocation
 * @property {number} latitude - The latitude of the user's location.
 * @property {number} longitude - The longitude of the user's location.
 *
 * @function convertToDate
 * @description Converts a DepartureTime object to a Date object.
 * @param {DepartureTime} [departureTime] - The departure time to convert.
 * @returns {Date | null} The converted Date object or null if conversion fails.
 *
 * @function fetchBusStops
 * @description Fetches bus stops from the API, processes them, and updates the state.
 *
 * @function toggleAboutPopup
 * @description Toggles the visibility of the About Us popup.
 *
 * @function handleDistanceChange
 * @description Handles changes to the distance filter.
 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event from the distance filter select element.
 *
 * @function handleSearchChange
 * @description Handles changes to the search query input.
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the search query input element.
 *
 * @function toggleDarkMode
 * @description Toggles the dark mode state.
 *
 * @function handleLogout
 * @description Handles user logout and redirects to the login page.
 *
 * @returns {JSX.Element} The rendered UGAthensBusStops component.
 */
import Link from 'next/Link';
import React, { useCallback, useEffect, useState } from 'react';
import { getUserLocation, haversineDistance } from '../../utils/utils';

// UI Components
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

// Type Definitions
type DepartureTime = {
  text: string;
  time_zone: string;
  value: number;
};

type TransitInfo = {
  line: string;
  departureTime: DepartureTime;
};

type BusStop = {
  id: string;
  name: string;
  busName: string;
  lat: number;
  lng: number;
  description?: string;
  transitInfo: TransitInfo[];
  distance?: number;
};

// Utility Functions
const convertToDate = (departureTime?: DepartureTime): Date | null => {
  if (!departureTime || !departureTime.text) return null;

  try {
    const [time, period] = departureTime.text.split(/\s+/);
    const [hours, minutes] = time.split(':').map(Number);

    let adjustedHours = hours;
    if (period) {
      if (period.toLowerCase() === 'pm' && hours !== 12) {
        adjustedHours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
        adjustedHours = 0;
      }
    }

    const date = new Date();
    date.setHours(adjustedHours, minutes || 0, 0, 0);
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

const UGAthensBusStops: React.FC = () => {
  // State Management
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [filteredBusStops, setFilteredBusStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI States
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showAbout, setShowAbout] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Fetch and Process Bus Stops
  const fetchBusStops = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user location
      const userLocation = await getUserLocation();

      // Fetch bus stops from the API
      const response = await fetch('/api/busstops');
      if (!response.ok) throw new Error('Failed to fetch bus stops');

      const data: BusStop[] = await response.json();

      // Process bus stops
      const processedBusStops = data.map((stop) => {
        // Sort transit info by departure time
        const sortedTransitInfo = stop.transitInfo
          .sort((a, b) => {
            const aDate = convertToDate(a.departureTime);
            const bDate = convertToDate(b.departureTime);

            // Handle invalid dates
            if (!aDate) return 1;
            if (!bDate) return -1;

            return aDate.getTime() - bDate.getTime();
          });

        return {
          ...stop,
          transitInfo: sortedTransitInfo,
          distance: haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            stop.lat,
            stop.lng
          )
        };
      })
        // Sort processed bus stops by earliest departure time
        .sort((a, b) => {
          const aTime = a.transitInfo[0]?.departureTime;
          const bTime = b.transitInfo[0]?.departureTime;

          const aDate = convertToDate(aTime);
          const bDate = convertToDate(bTime);

          if (!aDate) return 1;
          if (!bDate) return -1;

          return aDate.getTime() - bDate.getTime();
        });

      setBusStops(processedBusStops);
      setFilteredBusStops(processedBusStops);
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      setError('Failed to fetch bus stops');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtering Effect
  useEffect(() => {
    let filtered = busStops;

    // Apply distance filter
    if (selectedDistance !== null) {
      filtered = filtered.filter((stop) =>
        stop.distance !== undefined && stop.distance <= selectedDistance
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((stop) =>
        stop.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBusStops(filtered);
  }, [selectedDistance, searchQuery, busStops]);

  // Mobile Detection and Initial Data Fetch
  useEffect(() => {
    fetchBusStops();

    const updateMobile = () => setMobile(window.innerWidth < 599);
    updateMobile();

    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, [fetchBusStops]);

  // Event Handlers
  const toggleAboutPopup = () => setShowAbout(!showAbout);

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
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
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
          <Button
            onClick={toggleDarkMode}
            variant="primary"
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-800'}`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* About Popup */}
      {showAbout && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleAboutPopup}
        >
          <div
            className={` ${darkMode ? 'text-black dark:bg-gray-800 dark:text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-1/2`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">About Us</h2>
            <p className="leading-relaxed">
              Welcome to UGAthens Bus Stops! Our mission is to provide the most accurate
              and up-to-date information about bus stops around the University of Georgia campus.
            </p>
            {!mobile && (
              <p className="leading-relaxed mt-4">
                We provide real-time updates, route planning, and live tracking to enhance
                your transportation experience.
              </p>
            )}
            <Button
              onClick={toggleAboutPopup}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
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
            <div>
              <h3 className="text-lg font-semibold">Bus Stops</h3>
              {filteredBusStops.map((stop) => (
                <Card key={stop.id} className={`mb-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white-900 text-black border-2 border-black'}`}>
                  <CardHeader>
                    <CardTitle className="text-red-500">{stop.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{stop.busName}</p>
                  </CardHeader>
                  <CardContent>
                    {stop.transitInfo.length > 0 ? (
                      <ul>
                        {stop.transitInfo.map((route, index) => (
                          <li key={index} className="mb-2 flex justify-between">
                            <span className="font-medium">{route.line}</span>
                            <span>
                              {route.departureTime.text}
                              <span className="text-xs text-gray-500 ml-2">
                                {route.departureTime.text}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No transit information available</p>
                    )}
                    {stop.distance !== undefined && (
                      <div className="mt-2 text-sm text-gray-600">
                        Distance: {stop.distance.toFixed(2)} meters
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative pl-4">
          <Map busStops={filteredBusStops} />
        </div >
      </div >
    </div >
  );
};

export default UGAthensBusStops;