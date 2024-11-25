import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@googlemaps/google-maps-services-js'; // Initialize Google Maps Client

// Initialize Google Maps API client
const client = new Client({});

// Radius around Athens, Georgia (in meters)
const radius = 16093; // 10 miles = 16093 meters

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Step 1: Get location from the query or default to 'Athens, GA'
    const location = req.query.location || 'Athens, GA';

    // Geocode the location (dynamic based on the query or default)
    const geocodeResponse = await client.geocode({
      params: {
        address: location as string,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    });

    // If geocoding is successful, extract the location
    if (geocodeResponse.data.status === 'OK') {
      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

      // Step 2: Use the Google Places API to search for bus stops within a 10-mile radius
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
          transitName: stop.name,
        }));

        // Return the bus stops as a JSON response
        res.status(200).json(busStops);
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
