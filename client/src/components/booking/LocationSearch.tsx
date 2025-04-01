import { useEffect, useRef, useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Check, X, Info } from 'lucide-react';
import { 
  CENTER_POINT, 
  CALIFORNIA_BOUNDS, 
  SERVICE_LOCATIONS,
  validateServiceLocation,
  filterMapboxResults,
  getGeocoderConfig
} from '@/lib/locationUtils';

// Set your Mapbox access token - store in env for production
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcA';

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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
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
      try {
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
        
        // Initialize the geocoder with our configuration
        const geocoderConfig = getGeocoderConfig(window.mapboxgl);
        const geocoder = new window.MapboxGeocoder(geocoderConfig);
        
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
            
            // Validate using our location utilities
            const validation = validateServiceLocation(placeName, coords);
            setIsInServiceArea(validation.isValid);
            setValidationMessage(validation.reason || null);
            onAddressValidated(validation.isValid, coords);
            
            // Update marker
            if (marker) {
              marker.remove();
            }
            
            const newMarker = new window.mapboxgl.Marker({
              color: validation.isValid ? '#22c55e' : '#ef4444'
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
              'fill-color': '#FFB375',
              'fill-opacity': 0.2,
              'fill-outline-color': '#EE432C'
            }
          });
          
          // Add service cities as points on the map
          const serviceCityFeatures = SERVICE_LOCATIONS.map(location => {
            return {
              type: 'Feature',
              properties: {
                name: location.name
              },
              // These are placeholder coordinates - in production you'd fetch actual coordinates for each city
              // For now, we'll skip adding points since we don't have the exact coordinates
            };
          });
        });
        
        // Handle clear event
        geocoder.on('clear', () => {
          onChange("");
          setCoordinates(null);
          setIsInServiceArea(null);
          setValidationMessage(null);
          onAddressValidated(false);
          
          if (marker) {
            marker.remove();
            setMarker(null);
          }
        });
        
        setMap(mapInstance);
        setGeocoderInitialized(true);
      } catch (error) {
        console.error("Error initializing Mapbox:", error);
      }
    };
    
    initGeocoder();
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [onChange, onAddressValidated, geocoderInitialized, value]);

  return (
    <div className="space-y-4">
      <FormItem className="relative">
        <FormLabel className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-[#EE432C]" />
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
                'border-[#FFAA75]'
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
        
        {validationMessage && (
          <div className={`text-xs flex items-start gap-1 mt-1 ${isInServiceArea ? 'text-amber-600' : 'text-red-500'}`}>
            {isInServiceArea ? (
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
            )}
            <span>{validationMessage}</span>
          </div>
        )}
        
        {formState.errors[field.name] && (
          <FormMessage />
        )}
      </FormItem>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          We currently service Davis, Irvine, Bonita, Costa Mesa, Tustin, Alameda, Mission Viejo, 
          Newport Beach, Dixon, Woodland, Sacramento, and Galt.
        </div>
      </div>
      
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="h-[350px] w-full rounded-md border border-[#FFAA75] overflow-hidden transition-all duration-300 mt-4"
      />
    </div>
  );
}