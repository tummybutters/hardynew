import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Check, X } from 'lucide-react';

// Set your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcQ';
mapboxgl.accessToken = MAPBOX_TOKEN;

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
    mapboxsearch?: any;
  }
}

export default function LocationSearch({ value, onChange, onAddressValidated, field, formState }: LocationSearchProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [isInServiceArea, setIsInServiceArea] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isAutofillInitialized, setIsAutofillInitialized] = useState(false);
  
  // Initialize Mapbox Address Autofill
  useEffect(() => {
    if (!addressInputRef.current || !formRef.current || isAutofillInitialized) return;

    // Wait for the Mapbox Search JS script to load
    const initMapboxSearch = () => {
      if (window.mapboxsearch && !isAutofillInitialized) {
        window.mapboxsearch.config.accessToken = MAPBOX_TOKEN;
        
        // Create a custom address autofill
        const autofillElement = new window.mapboxsearch.MapboxAddressAutofill({
          accessToken: MAPBOX_TOKEN
        });
        
        autofillElement.options = {
          country: 'us',
          language: 'en'
        };

        // Add event listener for retrieve event
        autofillElement.addEventListener('retrieve', (event: any) => {
          const feature = event.detail;
          if (feature && feature.geometry && feature.geometry.coordinates) {
            const coords: [number, number] = feature.geometry.coordinates;
            handleCoordinates(coords);
          }
        });
        
        // Setup the existing input inside an autofill element
        if (addressContainerRef.current && addressInputRef.current) {
          // Create a temporary input with the correct attributes
          const tempInput = document.createElement('input');
          tempInput.type = 'text';
          tempInput.placeholder = 'Enter your address';
          tempInput.autocomplete = 'address-line1';
          tempInput.className = addressInputRef.current.className;
          
          // Set the current value
          tempInput.value = value;
          
          // Add event listener to sync with the React state
          tempInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            onChange(target.value);
          });

          // Replace the old input with the new one
          if (addressInputRef.current.parentNode) {
            addressInputRef.current.parentNode.replaceChild(tempInput, addressInputRef.current);
          }
          
          // Add the input to the MapboxAddressAutofill element
          autofillElement.appendChild(tempInput);
          
          // Add the autofill element to the container
          addressContainerRef.current.appendChild(autofillElement);
          
          setIsAutofillInitialized(true);
        }
      }
    };
    
    // Check if Mapbox Search JS is already loaded
    if (window.mapboxsearch) {
      initMapboxSearch();
    } else {
      // Wait for the script to load
      const searchScript = document.getElementById('search-js');
      if (searchScript) {
        searchScript.addEventListener('load', initMapboxSearch);
      }
    }
    
    return () => {
      const searchScript = document.getElementById('search-js');
      if (searchScript) {
        searchScript.removeEventListener('load', initMapboxSearch);
      }
    };
  }, [value, onChange, isAutofillInitialized]);
  
  // Initialize map when container is ready
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [CENTER_POINT[0], CENTER_POINT[1]] as [number, number],
        zoom: 5.5
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
  }, []);
  
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

  // Handle coordinates from Mapbox
  const handleCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    
    // Check if the address is within our service area
    const inServiceArea = checkServiceArea(coords);
    setIsInServiceArea(inServiceArea);
    onAddressValidated(inServiceArea, coords);
    
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
    }
  };

  return (
    <form ref={formRef} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormItem className="relative">
        <FormLabel className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Your Location
        </FormLabel>
        <FormControl>
          <div ref={addressContainerRef} className="relative">
            {/* This input will be replaced by the Mapbox Address Autofill */}
            <Input
              ref={addressInputRef}
              placeholder="Enter your address"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`pr-10 ${isInServiceArea === false ? 'border-red-500' : isInServiceArea === true ? 'border-green-500' : ''}`}
              {...field}
            />
            {isInServiceArea !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                {isInServiceArea ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
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
      
      {/* Map is always visible */}
      <div 
        ref={mapContainerRef} 
        className="h-[350px] w-full rounded-md border border-gray-200 overflow-hidden transition-all duration-300 mt-4"
      />
    </form>
  );
}