import BookingHero from "@/components/booking/BookingHero";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Booking() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeTimeout, setIframeTimeout] = useState(false);

  // Set a timeout to show a message if iframe takes too long to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIframeTimeout(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <title>Book Mobile Car Detailing in Irvine & Orange County | Hardys Wash N' Wax</title>
        <meta name="description" content="Schedule your mobile car detailing service in Irvine and Orange County. Professional auto detailers come to your location for convenient, premium service." />
        <meta name="keywords" content="Book Car Detailing Irvine, Schedule Mobile Detailing Orange County, Car Wash Appointment, Mobile Auto Detailing Booking" />
        <link rel="canonical" href="https://hardyswashnwax.com/booking" />
        
        {/* Add preconnect to improve performance */}
        <link rel="preconnect" href="https://hardyswashnwax.fieldd.co" />
        <link rel="dns-prefetch" href="https://hardyswashnwax.fieldd.co" />
      </Helmet>
      <BookingHero />
      
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        {/* Loading state */}
        {isLoading && (
          <div className="w-full max-w-[1300px] flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-[#EE432C] animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Booking System</h3>
            <p className="text-gray-600 text-center max-w-md">
              {iframeTimeout 
                ? "The booking system is taking longer than expected. Please wait a moment as we connect to our scheduling service."
                : "We're preparing our booking calendar for you. This may take a few seconds..."}
            </p>
            
            {/* Loading skeleton */}
            <div className="w-full mt-8 space-y-6">
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* The actual iframe */}
        <iframe 
          src="https://hardyswashnwax.fieldd.co" 
          style={{
            overflow: "scroll", 
            width: "100%", 
            maxWidth: "1300px", 
            minHeight: "calc(85vh)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            display: isLoading ? "none" : "block"
          }}
          title="Hardys Wash N' Wax Booking System"
          loading="eager" // Changed from lazy to eager for priority loading
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </>
  );
}
