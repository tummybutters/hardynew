import { useIsMobile } from "@/hooks/use-mobile";

export default function BookingHero() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative bg-secondary py-12 sm:py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-90"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-3 sm:mb-4">
            Book Your Appointment
          </h1>
          <p className="text-gray-100/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            {isMobile 
              ? "Schedule your vehicle's luxury detailing experience."
              : "Schedule your vehicle's transformation with our premium detailing services."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
