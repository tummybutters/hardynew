import { Link } from "wouter";
import { HeroButton } from "@/components/ui/hero-button";
import hardyLogoPath from "@assets/hardy logo-Photoroom.png";
import carSunsetBg from "@assets/ChatGPT Image Mar 31, 2025, 05_35_46 PM.png";
import mobileHeroBg from "@assets/mobile hero image.png";
import { useIsMobile } from "@/hooks/use-mobile";
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

export default function Hero() {
  const isMobile = useIsMobile();
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
            console.log('Hero booking conversion detected!');
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
              const iframeDoc = iframe.contentWindow.document;
              
              // Look for confirmation elements that may indicate a booking was completed
              const confirmationElements = iframeDoc.querySelectorAll('div[class*="confirmation"], button:contains("BOOK NOW")');
              
              if (confirmationElements.length > 0 && !conversionTracked.current) {
                console.log('Hero booking confirmation screen detected!');
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
    <div className="relative bg-secondary min-h-[85vh] overflow-hidden">
      {/* Background image with different image for mobile, optimized with loading priority */}
      <img 
        src={isMobile ? mobileHeroBg : carSunsetBg} 
        alt="Luxury car detailing at sunset" 
        className={`absolute inset-0 w-full h-full object-cover`}
        loading="eager"
      />
      
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-24">
        {/* Main headline - optimized for mobile */}
        <h1 className={`text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight text-left mb-6 sm:mb-10 max-w-5xl ${isMobile ? 'mobile-hero-text' : ''}`}>
          Luxury Where It Matters Most:
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center min-h-[calc(70vh-12rem)] lg:min-h-[calc(80vh-12rem)]">
          {/* Left side content */}
          <div className="flex flex-col justify-center">
            <h2 className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight ${isMobile ? 'mobile-hero-text' : ''}`}>
              Your Home on the Road,
              <span className="block mt-2">Detailed Right at Your Door.</span>
            </h2>
            
            <p className={`text-gray-100 text-lg sm:text-xl mt-4 sm:mt-6 mb-2 sm:mb-4 font-light ${isMobile ? 'mobile-hero-text' : ''}`}>
              "You'll spend thousands of Hours in your Car, Let Us Spend Two making it perfect"
            </p>
            <p className="text-gray-100 text-base sm:text-lg mb-4 sm:mb-6 font-light speakable-content">
              Proudly serving <span className="font-medium">Davis, Woodland, Dixon, Winters & West Sacramento and more.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
              <Link href="/booking">
                <HeroButton className="text-base sm:text-lg">
                  Book Your Luxury Detail
                </HeroButton>
              </Link>
              <Link href="/services">
                <HeroButton className="text-base sm:text-lg" variant="secondary">
                  View Our Services
                </HeroButton>
              </Link>
            </div>
          </div>
          
          {/* Right side with mini booking iframe */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
              <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg overflow-hidden">
                <div className="py-3 px-4 bg-gradient-to-r from-[#EE432C] to-[#FFB375] text-white">
                  <h3 className="text-lg font-bold">Book Your Detail</h3>
                </div>
                <iframe 
                  ref={iframeRef}
                  src="https://hardyswashnwax.fieldd.co" 
                  style={{
                    width: "100%", 
                    height: "400px",
                    border: "none",
                    overflow: "hidden"
                  }}
                  title="Hardys Wash N' Wax Quick Booking"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats section - simplified for mobile */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-4 mt-8 sm:mt-12 ${isMobile ? 'max-w-full' : 'max-w-3xl'} mx-auto`}>
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className={`text-accent-orange font-bold text-xl sm:text-3xl ${isMobile ? 'mobile-hero-text' : ''}`}>5★</div>
            <div className={`text-white text-xs sm:text-sm mt-1 ${isMobile ? 'mobile-hero-text' : ''}`}>Rated Service</div>
          </div>
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className={`text-accent-orange font-bold text-xl sm:text-3xl ${isMobile ? 'mobile-hero-text' : ''}`}>2K+</div>
            <div className={`text-white text-xs sm:text-sm mt-1 ${isMobile ? 'mobile-hero-text' : ''}`}>Cars Detailed</div>
          </div>
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className={`text-accent-orange font-bold text-xl sm:text-3xl ${isMobile ? 'mobile-hero-text' : ''}`}>100%</div>
            <div className={`text-white text-xs sm:text-sm mt-1 ${isMobile ? 'mobile-hero-text' : ''}`}>Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
