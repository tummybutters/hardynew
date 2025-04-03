import { Link } from "wouter";
import HeroLocationSearch from "./HeroLocationSearch";
import { HeroButton } from "@/components/ui/hero-button";
import hardyLogoPath from "@assets/hardy logo-Photoroom.png";
import carSunsetBg from "@assets/ChatGPT Image Mar 31, 2025, 05_35_46 PM.png";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Hero() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative bg-gray-900 min-h-[85vh] overflow-hidden">
      {/* Background image with different styling for mobile */}
      <img 
        src={carSunsetBg} 
        alt="Luxury car detailing at sunset" 
        className={`absolute inset-0 w-full h-full ${
          isMobile 
            ? "object-contain sm:object-cover opacity-95 scale-[0.95] sm:scale-100" // Mobile optimization - showing full image with slight scaling
            : "object-cover"
        }`}
        style={{
          objectPosition: isMobile ? 'center center' : 'center center'
        }}
      />
      <div className={`absolute inset-0 ${
        isMobile 
          ? "bg-black/50 bg-gradient-to-t from-gray-900/80 to-black/30" // Enhanced mobile gradient for better contrast with full image
          : "bg-overlay-gradient"
      }`}></div>
      
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-24">
        {/* Main headline - optimized for mobile */}
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight text-left mb-6 sm:mb-10 max-w-5xl">
          Luxury Where It Matters Most:
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center min-h-[calc(70vh-12rem)] lg:min-h-[calc(80vh-12rem)]">
          {/* Left side content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
              Your Home on the Road,
              <span className="block mt-2">Detailed Right at Your Door.</span>
            </h2>
            
            <p className="text-gray-100 text-lg sm:text-xl mt-4 sm:mt-6 mb-6 sm:mb-8 font-light">
              "You'll spend thousands of Hours in your Car, Let Us Spend Two making it perfect"
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
          
          {/* Right side with location search - conditionally rendered for mobile */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
              <HeroLocationSearch />
            </div>
          </div>
        </div>
        
        {/* Stats section - simplified for mobile */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-4 mt-8 sm:mt-12 ${isMobile ? 'max-w-full' : 'max-w-3xl'} mx-auto`}>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className="text-accent-orange font-bold text-xl sm:text-3xl">5★</div>
            <div className="text-white text-xs sm:text-sm mt-1">Rated Service</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className="text-accent-orange font-bold text-xl sm:text-3xl">2K+</div>
            <div className="text-white text-xs sm:text-sm mt-1">Cars Detailed</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 text-center border border-white/10">
            <div className="text-accent-orange font-bold text-xl sm:text-3xl">100%</div>
            <div className="text-white text-xs sm:text-sm mt-1">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
