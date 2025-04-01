import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { MapPin, Check, X, ArrowRight, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Set your Mapbox access token - in production, use environment variables
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

// List of service cities
const SERVICE_LOCATIONS = [
  'Davis, CA', 'Irvine, CA', 'Bonita, CA', 'Costa Mesa, CA', 
  'Tustin, CA', 'Alameda, CA', 'Mission Viejo, CA', 
  'Newport Beach, CA', 'Dixon, CA', 'Woodland, CA', 
  'Sacramento, CA', 'Galt, CA'
];

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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
  // Check if placeName contains any of our service cities
  const checkServiceCity = (placeName: string): boolean => {
    if (!placeName) return false;
    
    const normalizedPlace = placeName.toLowerCase();
    return SERVICE_LOCATIONS.some(location => 
      normalizedPlace.includes(location.toLowerCase())
    );
  };
  
  // Check if coordinates are within California service area
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
      try {
        const scriptsLoaded = await loadMapboxScripts();
        if (!scriptsLoaded) return;
        
        // Set access token
        window.mapboxgl.accessToken = MAPBOX_TOKEN;
        
        // Initialize the geocoder
        const geocoder = new window.MapboxGeocoder({
          accessToken: MAPBOX_TOKEN,
          countries: 'us',
          bbox: [CALIFORNIA_BOUNDS.west, CALIFORNIA_BOUNDS.south, CALIFORNIA_BOUNDS.east, CALIFORNIA_BOUNDS.north],
          placeholder: 'Enter your address',
          proximity: {
            longitude: CENTER_POINT[0],
            latitude: CENTER_POINT[1]
          },
          types: 'address,neighborhood,locality,place',
          marker: false,
          // Filter to California only
          filter: function(item: any) {
            // Check if result is in California
            if (!item.context) return false;
            return item.context.some((ctx: any) => 
              (ctx.id.startsWith('region') && ctx.text === 'California')
            );
          }
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
            
            // Check if the location is in our service areas
            const isInServiceCity = checkServiceCity(placeName);
            const inCalBounds = checkServiceArea(coords);
            
            // Determine validation status and message
            let isValid = false;
            let message = null;
            
            if (isInServiceCity) {
              isValid = true;
            } else if (inCalBounds) {
              isValid = true;
              message = "Your area may have limited availability. We'll contact you to confirm service details.";
            } else {
              isValid = false;
              message = "This location is outside our California service area.";
            }
            
            // Update state with validation results
            setIsInServiceArea(isValid);
            setValidationMessage(message);
            
            // Show notification
            if (isValid) {
              toast({
                title: "Great News!",
                description: message || "We service your area. Schedule your detailing now!",
                variant: "default",
              });
            } else {
              toast({
                title: "Outside Service Area",
                description: message || "We currently only service select locations in California.",
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
          setValidationMessage(null);
        });
        
        setGeocoderInitialized(true);
      } catch (error) {
        console.error("Error initializing Mapbox:", error);
      }
    };
    
    initGeocoder();
  }, [toast]);
  
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
          
          {validationMessage && (
            <p className={`text-xs flex items-start gap-1 ${isInServiceArea ? 'text-amber-600' : 'text-red-500'}`}>
              {isInServiceArea ? (
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
              )}
              <span>{validationMessage}</span>
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            We currently service Davis, Irvine, Bonita, Costa Mesa, Tustin, Alameda, Mission Viejo, 
            Newport Beach, Dixon, Woodland, Sacramento, and Galt.
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