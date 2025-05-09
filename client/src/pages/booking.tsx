import BookingHero from "@/components/booking/BookingHero";
import { Helmet } from "react-helmet";
import { useEffect, useRef } from "react";

// Google Ads conversion tracking function
function gtag_report_conversion(url?: string) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url as Location | (string & Location);
    }
  };
  
  // @ts-ignore - gtag may not be recognized by TypeScript
  gtag('event', 'conversion', {
      'send_to': 'AW-17059179967/bFhZCJWZ0MQaEL_bucY_',
      'value': 1.0,
      'currency': 'USD',
      'event_callback': callback
  });
  return false;
}

export default function Booking() {
  const conversionTracked = useRef<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Listen for messages from the iframe
    const handleIframeMessage = (event: MessageEvent) => {
      // Security check - only accept messages from Fieldd
      if (event.origin.includes('fieldd.co')) {
        // Check if the message indicates booking completion
        if (event.data && typeof event.data === 'object' && event.data.type === 'booking_complete') {
          // Avoid duplicate conversion tracking
          if (!conversionTracked.current) {
            console.log('Booking conversion detected!');
            gtag_report_conversion();
            conversionTracked.current = true;
          }
        }
      }
    };

    // Set up message listener
    window.addEventListener('message', handleIframeMessage);
    
    // Visual detection fallback (if postMessage isn't implemented by Fieldd)
    let checkInterval: NodeJS.Timeout | null = null;
    
    // Wait for iframe to load
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        // Check periodically for confirmation screen
        checkInterval = setInterval(() => {
          try {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              // Try to detect booking confirmation screen
              // This is a fallback that may not work due to same-origin policy
              // But we implement it as a best-effort approach
              const iframeDoc = iframe.contentWindow.document;
              
              // Look for confirmation elements that may indicate a booking was completed
              const confirmationElements = iframeDoc.querySelectorAll('div[class*="confirmation"], button:contains("BOOK NOW")');
              
              if (confirmationElements.length > 0 && !conversionTracked.current) {
                console.log('Booking confirmation screen detected!');
                gtag_report_conversion();
                conversionTracked.current = true;
                
                if (checkInterval) {
                  clearInterval(checkInterval);
                  checkInterval = null;
                }
              }
            }
          } catch (error) {
            // We expect this to fail due to same-origin policy
            // This is just a fallback attempt
            console.log('Unable to access iframe content due to cross-origin restrictions');
            
            // Since direct access failed, clear the interval
            if (checkInterval) {
              clearInterval(checkInterval);
              checkInterval = null;
            }
          }
        }, 2000); // Check every 2 seconds
      });
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleIframeMessage);
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Book Mobile Car Detailing in Davis, Woodland & Yolo County | Hardys Wash N' Wax</title>
        <meta name="description" content="Schedule your mobile car detailing service in Davis, Woodland and Yolo County. Our professional auto detailers come to your location for convenient, premium service at your home or office." />
        <meta name="keywords" content="Book Car Detailing Davis CA, Schedule Mobile Detailing UC Davis, Car Wash Appointment Woodland CA, Mobile Auto Detailing Booking Yolo County" />
        <link rel="canonical" href="https://hardyswashnwax.com/booking" />
        
        {/* Structured Data for Reservation */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ReservationService",
            "name": "Hardys Wash N' Wax Mobile Detail Booking",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Hardys Wash N' Wax",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Davis",
                "addressRegion": "CA",
                "postalCode": "95616",
                "addressCountry": "US"
              }
            },
            "serviceType": "Mobile Car Detailing",
            "availableAtOrFrom": [
              { "@type": "Place", "name": "Davis, CA" },
              { "@type": "Place", "name": "Woodland, CA" },
              { "@type": "Place", "name": "Dixon, CA" },
              { "@type": "Place", "name": "Winters, CA" },
              { "@type": "Place", "name": "West Sacramento, CA" }
            ]
          })}
        </script>
      </Helmet>
      <BookingHero />
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <iframe 
          ref={iframeRef}
          src="https://hardyswashnwax.fieldd.co" 
          style={{
            overflow: "scroll", 
            width: "100%", 
            maxWidth: "1300px", 
            minHeight: "calc(85vh)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
          title="Hardys Wash N' Wax Booking System"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
}
