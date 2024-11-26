import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize Google Maps API client
const client = new Client({});

// Radius around Athens, Georgia (in meters)
const radius = 16093; // 10 miles = 16093 meters

// Function to get transit directions
// Function to get transit directions
const getTransitDirections = async (origin: string, destination: string) => {
  try {
    const response = await client.directions({
      params: {
        origin: origin, 
        destination: destination, 
        mode: TravelMode.transit, 
        departure_time: 'now', 
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    });

    if (response.data.status === 'OK') {
      const legs = response.data.routes[0].legs;

      // Extract transit information with all the required details
      const transitInfo = legs.flatMap((leg) => 
        leg.steps
          .filter((step) => step.transit_details)
          .map((step) => {
            const transitDetail = step.transit_details;

            return {
              line: transitDetail.line.name,  // Bus or line name
              departureTime: {
                text: transitDetail.departure_time.text,  // Text of departure time
                time_zone: transitDetail.departure_time.time_zone,  // Time zone
                value: transitDetail.departure_time.value,  // Departure timestamp (epoch)
              }
            };
          })
      );
      return transitInfo; 
    } else {
      console.error('No transit information available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching transit directions:', error);
    return [];
  }
};


// Main handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const location = req.query.location || 'Athens, GA';
    console.log('Location:', location);

    // Step 1: Geocode the location (dynamic based on the query or default)
    const geocodeResponse = await client.geocode({
      params: {
        address: location as string,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    });

    if (geocodeResponse.data.status === 'OK') {
      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;


      // Step 2: Use Google Places API to search for bus stops within a 10-mile radius
      const placesResponse = await client.placesNearby({
        params: {
          location: `${lat},${lng}`,
          radius,
          type: 'bus_station',
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        },
      });

      // If places are found, map them to a simpler format
      if (placesResponse.data.status === 'OK') {
        const busStops = placesResponse.data.results.map((stop: any) => ({
          id: stop.place_id,
          name: stop.name,
          lat: stop.geometry.location.lat,
          lng: stop.geometry.location.lng,
          description: stop.vicinity || 'No description available',
        }));

        // Display bus stops in terminal
        console.log('Found Bus Stops:', busStops);

        // Now, get transit information for each bus stop (assuming the origin is the location we geocoded)
        const transitDetails = await Promise.all(
          busStops.map(async (stop) => {
            const transitInfo = await getTransitDirections(location as string, `${stop.lat},${stop.lng}`);
            return {
              ...stop,
              transitInfo,  // Include all the detailed transit info here
            };
          })
        );

        // Display final results in terminal
        console.log('Transit Details for Bus Stops:', transitDetails);

        // Return the bus stops and transit info as a JSON response
        res.status(200).json(transitDetails);
      } else {
        res.status(500).json({ error: 'Failed to fetch bus stops from Google Maps API' });
      }
    } else {
      res.status(500).json({ error: 'Geocoding failed' });
    }
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}