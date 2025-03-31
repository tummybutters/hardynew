import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Check, X } from 'lucide-react';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcQ';

// Service area coordinates - Central California
const CENTER_POINT = [-119.4179, 36.7783]; // Central California coordinates
const SERVICE_RADIUS_MILES = 300; // Large enough to cover most of California
const MILES_TO_KM = 1.60934;
const KM_TO_DEGREES = 0.01; // Very rough approximation, 1km ≈ 0.01 degrees at the equator

// Service area bounds - covering Sacramento to SoCal
const CALIFORNIA_BOUNDS = {
  north: 39.5, // Sacramento area
  south: 32.5, // San Diego area
  west: -124.4, // Pacific Coast
  east: -114.1 // Eastern California
};

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onAddressValidated: (isValid: boolean, coordinates?: [number, number]) => void;
  field: any;
  formState: any;
}

export default function LocationSearch({ value, onChange, onAddressValidated, field, formState }: LocationSearchProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [isInServiceArea, setIsInServiceArea] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  
  // Initialize map when container is ready and showMap is true
  useEffect(() => {
    if (!mapContainerRef.current || !showMap) return;
    
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [CENTER_POINT[0], CENTER_POINT[1]] as [number, number],
        zoom: 6
      });
      
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      // Add California service area
      mapInstance.on('load', () => {
        // Create a bounding box for California
        mapInstance.addSource('california-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [CALIFORNIA_BOUNDS.west, CALIFORNIA_BOUNDS.north], // Northwest
                [CALIFORNIA_BOUNDS.east, CALIFORNIA_BOUNDS.north], // Northeast
                [CALIFORNIA_BOUNDS.east, CALIFORNIA_BOUNDS.south], // Southeast
                [CALIFORNIA_BOUNDS.west, CALIFORNIA_BOUNDS.south], // Southwest
                [CALIFORNIA_BOUNDS.west, CALIFORNIA_BOUNDS.north]  // Back to Northwest to close the polygon
              ]]
            },
            properties: {}
          }
        });
        
        mapInstance.addLayer({
          id: 'california-area-fill',
          type: 'fill',
          source: 'california-area',
          paint: {
            'fill-color': '#FFB375',
            'fill-opacity': 0.2,
            'fill-outline-color': '#EE432C'
          }
        });
      });
      
      setMap(mapInstance);
    };
    
    if (!map) {
      initializeMap();
    }
    
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [showMap]);
  
  // Function to check if coordinates are within California service area
  const checkServiceArea = (coords: [number, number]): boolean => {
    const lon = coords[0];
    const lat = coords[1];
    
    // Check if coordinates are within California bounds
    return (
      lat >= CALIFORNIA_BOUNDS.south &&
      lat <= CALIFORNIA_BOUNDS.north &&
      lon >= CALIFORNIA_BOUNDS.west &&
      lon <= CALIFORNIA_BOUNDS.east
    );
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  // Function to fetch address suggestions
  const searchAddress = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a random session token (UUIDv4-like)
      const sessionToken = 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
      });
      
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&language=en&limit=5&session_token=${sessionToken}&country=US&proximity=${CENTER_POINT[0]},${CENTER_POINT[1]}&access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to retrieve full address details and coordinates
  const retrieveAddress = async (mapboxId: string) => {
    setIsLoading(true);
    
    try {
      const sessionToken = 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
      });
      
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      const feature = data.features[0];
      
      if (feature) {
        const coords: [number, number] = feature.geometry.coordinates;
        const fullAddress = feature.properties.full_address || feature.properties.name;
        
        setSelectedAddress(fullAddress);
        setCoordinates(coords);
        
        // Check if the address is within our service area
        const inServiceArea = checkServiceArea(coords);
        setIsInServiceArea(inServiceArea);
        onAddressValidated(inServiceArea, coords);
        
        // Update the form field value
        onChange(fullAddress);
        
        // Update map and marker
        if (map) {
          if (marker) {
            marker.remove();
          }
          
          const newMarker = new mapboxgl.Marker({ color: inServiceArea ? '#4CAF50' : '#F44336' })
            .setLngLat(coords)
            .addTo(map);
          
          setMarker(newMarker);
          map.flyTo({ center: coords, zoom: 14 });
          
          // Show map after we have coordinates
          setShowMap(true);
        }
      }
    } catch (error) {
      console.error('Error retrieving address:', error);
    } finally {
      setIsLoading(false);
      setSuggestions([]);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedAddress('');
    setIsInServiceArea(null);
    onAddressValidated(false);
    searchAddress(newValue);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    retrieveAddress(suggestion.mapbox_id);
  };

  return (
    <div className="space-y-4">
      <FormItem className="relative">
        <FormLabel className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Your Location
        </FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="Enter your address"
              value={value}
              onChange={handleInputChange}
              className={`pr-10 ${isInServiceArea === false ? 'border-red-500' : isInServiceArea === true ? 'border-green-500' : ''}`}
              {...field}
            />
            {isInServiceArea !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isInServiceArea ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </FormControl>
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.mapbox_id || index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-gray-600 text-xs">{suggestion.full_address || suggestion.place_formatted}</div>
              </div>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="text-xs text-gray-500 mt-1">Loading...</div>
        )}
        
        {isInServiceArea === false && (
          <div className="text-xs text-red-500 mt-1">
            This address is outside our service area in California.
          </div>
        )}
        
        {formState.errors[field.name] && (
          <FormMessage />
        )}
      </FormItem>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          We service all California locations from Sacramento to San Diego.
        </div>
      </div>
      
      {/* Map is always visible */}
      <div 
        ref={mapContainerRef} 
        className="h-[350px] w-full rounded-md border border-gray-200 overflow-hidden transition-all duration-300 mt-4"
      />
    </div>
  );
}