import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@googlemaps/google-maps-services-js';

// Initialize Google Maps Client
const client = new Client({});

// Radius around Athens, Georgia (in meters)
const radius = 16093; // 10 miles = 16093 meters
const location = {
  lat: 33.9634, // Latitude of Athens, GA
  lng: -83.3767, // Longitude of Athens, GA
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use the Google Places API to search for bus stops within a 10-mile radius of Athens
    const response = await client.placesNearby({
      params: {
        location: `${location.lat},${location.lng}`,
        radius: radius,
        type: 'bus_station', // Filter by 'bus_station' type
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Your API key
      }
    });

    if (response.data.status === 'OK') {
      // Map the results to return the necessary bus stop details
      const busStops = response.data.results.map((stop: any) => ({
        id: stop.place_id,
        name: stop.name,
        lat: stop.geometry.location.lat,
        lng: stop.geometry.location.lng,
        description: stop.vicinity || 'No description available',
      }));

      res.status(200).json(busStops); // Return the bus stops as a JSON response
    } else {
      res.status(500).json({ error: 'Failed to fetch bus stops from Google Maps API' });
    }
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
