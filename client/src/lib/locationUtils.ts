// Service locations based on user's screenshot
export const SERVICE_LOCATIONS = [
  { name: 'Davis, CA', location: 'Davis', state: 'CA' },
  { name: 'Irvine, CA', location: 'Irvine', state: 'CA' },
  { name: 'Bonita, CA', location: 'Bonita', state: 'CA' },
  { name: 'Costa Mesa, CA', location: 'Costa Mesa', state: 'CA' },
  { name: 'Tustin, CA', location: 'Tustin', state: 'CA' },
  { name: 'Alameda, CA', location: 'Alameda', state: 'CA' },
  { name: 'Mission Viejo, CA', location: 'Mission Viejo', state: 'CA' },
  { name: 'Newport Beach, CA', location: 'Newport Beach', state: 'CA' },
  { name: 'Dixon, CA', location: 'Dixon', state: 'CA' },
  { name: 'Woodland, CA', location: 'Woodland', state: 'CA' },
  { name: 'Sacramento, CA', location: 'Sacramento', state: 'CA' },
  { name: 'Galt, CA', location: 'Galt', state: 'CA' },
  // Adding nearby cities for leniency
  { name: 'Santa Ana, CA', location: 'Santa Ana', state: 'CA' },
  { name: 'Huntington Beach, CA', location: 'Huntington Beach', state: 'CA' },
  { name: 'Laguna Beach, CA', location: 'Laguna Beach', state: 'CA' },
  { name: 'Fountain Valley, CA', location: 'Fountain Valley', state: 'CA' },
  { name: 'Anaheim, CA', location: 'Anaheim', state: 'CA' },
  { name: 'Orange, CA', location: 'Orange', state: 'CA' },
  { name: 'West Sacramento, CA', location: 'West Sacramento', state: 'CA' },
  { name: 'Elk Grove, CA', location: 'Elk Grove', state: 'CA' },
  { name: 'Rancho Cordova, CA', location: 'Rancho Cordova', state: 'CA' },
  { name: 'Folsom, CA', location: 'Folsom', state: 'CA' },
  { name: 'Roseville, CA', location: 'Roseville', state: 'CA' },
  { name: 'Fairfield, CA', location: 'Fairfield', state: 'CA' },
  { name: 'Vacaville, CA', location: 'Vacaville', state: 'CA' },
  { name: 'Rocklin, CA', location: 'Rocklin', state: 'CA' },
  { name: 'Aliso Viejo, CA', location: 'Aliso Viejo', state: 'CA' },
  { name: 'Lake Forest, CA', location: 'Lake Forest', state: 'CA' },
];

// Coordinates for California bounds
export const CALIFORNIA_BOUNDS = {
  north: 39.5, // Sacramento area
  south: 32.5, // San Diego area
  west: -124.4, // Pacific Coast
  east: -114.1 // Eastern California
};

// Service area center (roughly central California)
export const CENTER_POINT = [-119.4179, 36.7783];

// Allowed proximity radius in kilometers
export const ALLOWED_PROXIMITY_KM = 15;

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * @param coords1 [longitude, latitude]
 * @param coords2 [longitude, latitude]
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coords1: [number, number], 
  coords2: [number, number]
): number {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Checks if a location string contains any of our service areas
 * @param locationString Full address string
 * @returns True if location contains one of our service cities
 */
export function isInServiceCities(locationString: string): boolean {
  if (!locationString) return false;
  
  const normalizedLocation = locationString.toLowerCase();
  
  // Check if any service location is in the address
  return SERVICE_LOCATIONS.some(location => {
    const cityCheck = normalizedLocation.includes(location.location.toLowerCase());
    const stateCheck = normalizedLocation.includes(location.state.toLowerCase());
    
    return cityCheck && stateCheck;
  });
}

/**
 * Checks if coordinates are within the California service area bounds
 * @param coords [longitude, latitude]
 * @returns True if within California bounds
 */
export function isInCaliforniaBounds(coords: [number, number]): boolean {
  const [lon, lat] = coords;
  
  return (
    lat >= CALIFORNIA_BOUNDS.south &&
    lat <= CALIFORNIA_BOUNDS.north &&
    lon >= CALIFORNIA_BOUNDS.west &&
    lon <= CALIFORNIA_BOUNDS.east
  );
}

/**
 * Main function to validate if a location is serviceable
 * @param locationString Full address string
 * @param coords [longitude, latitude]
 * @returns { isValid: boolean, reason?: string }
 */
export function validateServiceLocation(
  locationString: string, 
  coords?: [number, number]
): { isValid: boolean; reason?: string } {
  // First check if location includes one of our service cities
  const hasServiceCity = isInServiceCities(locationString);
  
  if (hasServiceCity) {
    return { isValid: true };
  }
  
  // If we have coordinates, check if they're in California
  if (coords) {
    const inCaliforniaBounds = isInCaliforniaBounds(coords);
    
    if (!inCaliforniaBounds) {
      return { 
        isValid: false, 
        reason: "This location is outside our California service area." 
      };
    }
    
    // For locations in California but not in our list, we'll be a bit lenient
    // You might want to calculate distance to nearest service city
    // or implement a custom logic here
    
    // For now we'll return true with a notification
    return {
      isValid: true,
      reason: "Your area may have limited availability. We'll contact you to confirm service details."
    };
  }
  
  // If no coordinates provided and no service city match, default to invalid
  return {
    isValid: false,
    reason: "We couldn't verify this location. Please select a location from our service areas."
  };
}

// Filter function for Mapbox Geocoder to restrict results
export function filterMapboxResults(item: any): boolean {
  // Check if item is in California
  if (!item.context) return false;
  
  // Check if result is in California
  const isInCalifornia = item.context.some((context: any) => {
    return (
      (context.id.startsWith("region") && context.text === "California") ||
      (context.id.startsWith("country") && context.short_code === "us")
    );
  });
  
  if (!isInCalifornia) return false;
  
  // Check for city match with more leniency
  const placeName = item.place_name.toLowerCase();
  const cityMatch = SERVICE_LOCATIONS.some(loc => 
    placeName.includes(loc.location.toLowerCase()) && 
    placeName.includes(loc.state.toLowerCase())
  );
  
  // If exact city match, return true
  if (cityMatch) return true;
  
  // For non-exact matches, check proximity to our service areas
  // This requires extra data we might not have in the geocoder results
  // For now, we allow all California results and will validate later
  return isInCalifornia;
}

// Get Mapbox geocoder configuration
export function getGeocoderConfig(mapboxgl: any) {
  return {
    accessToken: process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcA',
    countries: 'us',
    bbox: [CALIFORNIA_BOUNDS.west, CALIFORNIA_BOUNDS.south, CALIFORNIA_BOUNDS.east, CALIFORNIA_BOUNDS.north],
    placeholder: 'Enter your address',
    proximity: {
      longitude: CENTER_POINT[0],
      latitude: CENTER_POINT[1]
    },
    types: 'address,neighborhood,locality,place',
    mapboxgl: mapboxgl,
    filter: filterMapboxResults
  };
}