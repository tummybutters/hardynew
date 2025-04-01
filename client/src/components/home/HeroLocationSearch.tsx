import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Check, X, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Set your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGJ1dGNoZXIzIiwiYSI6ImNtOHhpOW81YTA0OHYycnEwNnM4MWphZDgifQ.VSLkTQ3yEJBUTqC14kAkcQ';

// Service area bounds - covering Sacramento to SoCal
const CALIFORNIA_BOUNDS = {
  north: 39.5, // Sacramento area
  south: 32.5, // San Diego area
  west: -124.4, // Pacific Coast
  east: -114.1 // Eastern California
};

declare global {
  interface Window {
    mapboxgl?: any;
    MapboxGeocoder?: any;
  }
}

export default function HeroLocationSearch() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState("");
  const [isInServiceArea, setIsInServiceArea] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [geocoderInitialized, setGeocoderInitialized] = useState(false);
  
  // Initialize Mapbox Geocoder
  useEffect(() => {
    if (!geocoderContainerRef.current || geocoderInitialized) return;

    // Dynamically load Mapbox GL JS and Geocoder
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
      
      // Initialize the geocoder
      const geocoder = new window.MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        countries: 'us',
        bbox: [-124.409591, 32.534156, -114.131211, 37.0], // Bounding box for California
        placeholder: 'Enter your address',
        proximity: {
          longitude: -119.4179,
          latitude: 36.7783
        },
        types: 'address,neighborhood,locality,place',
        marker: false
      });
      
      // Add the geocoder to the container
      if (geocoderContainerRef.current) {
        geocoder.addTo(geocoderContainerRef.current);
      }
      
      // When a result is selected, extract coordinates and check service area
      geocoder.on('result', (e: any) => {
        const result = e.result;
        if (result && result.geometry && result.geometry.coordinates) {
          const coords = result.geometry.coordinates as [number, number];
          const placeName = result.place_name;
          
          // Update state
          setAddress(placeName);
          setCoordinates(coords);
          
          // Check if in service area
          const inServiceArea = checkServiceArea(coords);
          setIsInServiceArea(inServiceArea);
          
          // Show notification
          if (inServiceArea) {
            toast({
              title: "Great News!",
              description: "We service your area. Schedule your detailing now!",
              variant: "default",
            });
          } else {
            toast({
              title: "Outside Service Area",
              description: "We currently only service California locations from Sacramento to San Diego.",
              variant: "destructive",
            });
          }
        }
      });
      
      // Handle clear event
      geocoder.on('clear', () => {
        setAddress("");
        setCoordinates(null);
        setIsInServiceArea(null);
      });
      
      setGeocoderInitialized(true);
    };
    
    initGeocoder();
  }, [toast, geocoderInitialized]);
  
  // Function to check if coordinates are within California service area
  const checkServiceArea = (coords: [number, number]): boolean => {
    const lon = coords[0];
    const lat = coords[1];
    
    return (
      lat >= CALIFORNIA_BOUNDS.south &&
      lat <= CALIFORNIA_BOUNDS.north &&
      lon >= CALIFORNIA_BOUNDS.west &&
      lon <= CALIFORNIA_BOUNDS.east
    );
  };
  
  // Handle submission - redirect to booking page with location
  const handleGetQuote = () => {
    if (isInServiceArea && address) {
      // Store the address in localStorage to pre-fill the booking form
      localStorage.setItem('prefilledAddress', address);
      if (coordinates) {
        localStorage.setItem('prefilledCoordinates', JSON.stringify(coordinates));
      }
      
      // Navigate to booking page
      navigate('/booking');
    } else if (address && !isInServiceArea) {
      toast({
        title: "Cannot Proceed",
        description: "Please enter an address within our service area.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Address Required",
        description: "Please enter your address to continue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Transform Your Vehicle?</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-primary-red" />
            Your Location
          </label>
          
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
          
          {isInServiceArea === false && (
            <p className="text-xs text-red-500">
              This address is outside our service area in California.
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            We service all California locations from Sacramento to San Diego.
          </p>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={handleGetQuote}
            disabled={!isInServiceArea || !address}
            className="w-full bg-primary-red hover:bg-red-600 text-white flex items-center justify-center py-2 rounded-md"
          >
            Get an Instant Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}