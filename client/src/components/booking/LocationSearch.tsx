import { useEffect, useRef, useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Check, X } from 'lucide-react';

// Set your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcQ';

// Service area bounds - covering Sacramento to SoCal
const CALIFORNIA_BOUNDS = {
  north: 39.5, // Sacramento area
  south: 32.5, // San Diego area
  west: -124.4, // Pacific Coast
  east: -114.1 // Eastern California
};

// Service area center
const CENTER_POINT = [-119.4179, 36.7783]; // Central California coordinates

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onAddressValidated: (isValid: boolean, coordinates?: [number, number]) => void;
  field: any;
  formState: any;
}

declare global {
  interface Window {
    mapboxgl?: any;
    MapboxGeocoder?: any;
  }
}

export default function LocationSearch({ value, onChange, onAddressValidated, field, formState }: LocationSearchProps) {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isInServiceArea, setIsInServiceArea] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [geocoderInitialized, setGeocoderInitialized] = useState(false);
  
  // Initialize Mapbox Geocoder
  useEffect(() => {
    if (!geocoderContainerRef.current || geocoderInitialized) return;
    
    // Dynamically load Mapbox GL JS and Geocoder if needed
    const loadMapboxScripts = async () => {
      // Load Mapbox GL JS if not already loaded
      if (!window.mapboxgl) {
        const mapboxScript = document.createElement('script');
        mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
        document.head.appendChild(mapboxScript);
        
        const mapboxCss = document.createElement('link');
        mapboxCss.rel = 'stylesheet';
        mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
        document.head.appendChild(mapboxCss);
        
        await new Promise(resolve => {
          mapboxScript.onload = resolve;
        });
      }
      
      // Load Mapbox Geocoder if not already loaded
      if (!window.MapboxGeocoder) {
        const geocoderScript = document.createElement('script');
        geocoderScript.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js';
        document.head.appendChild(geocoderScript);
        
        const geocoderCss = document.createElement('link');
        geocoderCss.rel = 'stylesheet';
        geocoderCss.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css';
        document.head.appendChild(geocoderCss);
        
        await new Promise(resolve => {
          geocoderScript.onload = resolve;
        });
      }
      
      return true;
    };
    
    const initGeocoder = async () => {
      const scriptsLoaded = await loadMapboxScripts();
      if (!scriptsLoaded) return;
      
      // Set access token
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Initialize the map
      const mapInstance = new window.mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [CENTER_POINT[0], CENTER_POINT[1]],
        zoom: 5.5
      });
      
      // Add navigation controls
      mapInstance.addControl(new window.mapboxgl.NavigationControl(), 'bottom-right');
      
      // Initialize the geocoder
      const geocoder = new window.MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        countries: 'us',
        bbox: [-124.409591, 32.534156, -114.131211, 39.5], // Bounding box for California
        placeholder: 'Enter your address',
        proximity: {
          longitude: CENTER_POINT[0],
          latitude: CENTER_POINT[1]
        },
        types: 'address,neighborhood,locality,place',
        mapboxgl: window.mapboxgl
      });
      
      // Add the geocoder to the container
      if (geocoderContainerRef.current) {
        geocoder.addTo(geocoderContainerRef.current);
      }
      
      // Prefill with any existing value
      if (value) {
        geocoder.setInput(value);
      }
      
      // When a result is selected, extract coordinates and check service area
      geocoder.on('result', (e: any) => {
        const result = e.result;
        if (result && result.geometry && result.geometry.coordinates) {
          const coords = result.geometry.coordinates as [number, number];
          const placeName = result.place_name;
          
          // Update state
          onChange(placeName);
          setCoordinates(coords);
          
          // Check if in service area
          const inServiceArea = checkServiceArea(coords);
          setIsInServiceArea(inServiceArea);
          onAddressValidated(inServiceArea, coords);
          
          // Update marker
          if (marker) {
            marker.remove();
          }
          
          const newMarker = new window.mapboxgl.Marker({
            color: inServiceArea ? '#22c55e' : '#ef4444'
          })
            .setLngLat(coords)
            .addTo(mapInstance);
          
          setMarker(newMarker);
          mapInstance.flyTo({ center: coords, zoom: 14 });
        }
      });
      
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
            'fill-color': 'var(--primary-orange)',
            'fill-opacity': 0.2,
            'fill-outline-color': 'var(--primary-red)'
          }
        });
      });
      
      // Handle clear event
      geocoder.on('clear', () => {
        onChange("");
        setCoordinates(null);
        setIsInServiceArea(null);
        onAddressValidated(false);
        
        if (marker) {
          marker.remove();
          setMarker(null);
        }
      });
      
      setMap(mapInstance);
      setGeocoderInitialized(true);
    };
    
    initGeocoder();
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [onChange, onAddressValidated, geocoderInitialized, value]);
  
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

  return (
    <div className="space-y-4">
      <FormItem className="relative">
        <FormLabel className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary-red" />
          Your Location
        </FormLabel>
        <FormControl>
          <div className="relative">
            {/* Geocoder container */}
            <div 
              ref={geocoderContainerRef} 
              className={`mapboxgl-geocoder-container ${
                isInServiceArea === false ? 'border-red-500' : 
                isInServiceArea === true ? 'border-green-500' : 
                'border-primary-orange'
              }`}
            />
            
            {isInServiceArea !== null && (
              <div className="absolute right-3 top-[22px] transform -translate-y-1/2 z-10">
                {isInServiceArea ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </FormControl>
        
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
      
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="h-[350px] w-full rounded-md border border-primary-orange overflow-hidden transition-all duration-300 mt-4"
      />
    </div>
  );
}