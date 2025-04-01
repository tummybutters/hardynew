import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import expressImage from "@assets/express.jpg";
import extImage from "@assets/ext.jpg";
import luxImage from "@assets/lux.jpg";

const services = [
  {
    id: 1,
    title: "Express Detail",
    description: "From gentle hand wash to wheel cleaning—restoring your vehicle's exterior to a showroom-worthy finish.",
    image: expressImage,
    link: "/services",
  },
  {
    id: 2,
    title: "Exterior Wash & Wax",
    description: "Professional ceramic coating application providing up to 5 years of protection while enhancing your paint's depth and mirror finish.",
    image: extImage,
    link: "/services",
  },
  {
    id: 3,
    title: "Luxury Full Detail",
    description: "Professional machine buffing and ceramic coating providing years of protection while enhancing your paint's depth and perfect mirror finish.",
    image: luxImage,
    link: "/services",
  },
];

export default function FeaturedServicesNew() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  return (
    <div className="bg-[#F3F4E6] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Premium Services, Delivered at Your Door</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Every service includes our signature mobile setup—bringing the full detailing shop experience directly to your location.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="relative group overflow-hidden"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* 3D Card with enhanced transform effect */}
              <div 
                className={`border border-[#FFAA75] rounded-lg overflow-hidden transition-all duration-300 transform ${
                  hoveredCard === service.id ? 'scale-[1.03] shadow-xl' : 'shadow-lg'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: hoveredCard === service.id ? 'perspective(1000px) rotateX(3deg) rotateY(-3deg) translateZ(10px)' : 'perspective(1000px)',
                  boxShadow: hoveredCard === service.id ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '',
                }}
              >
                {/* Service Image */}
                <div className="h-52 overflow-hidden">
                  {service.image !== "/images/interior-placeholder.jpg" ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#FFB375] to-[#FFAA75] flex items-center justify-center text-white">
                      <span className="text-lg font-medium">Interior Detail</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-700 mb-4 text-sm">{service.description}</p>
                  
                  <Link href={service.link} className="inline-flex items-center text-sm font-medium text-[#EE432C] hover:text-red-700 transition-colors">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                {/* 3D Edges for enhanced effect */}
                {/* Bottom Edge */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[#EE432C] to-[#FFAA75] transform origin-bottom"
                  style={{
                    transform: hoveredCard === service.id ? 'perspective(1000px) rotateX(-45deg) scaleY(2) translateY(1px)' : 'scaleY(0)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease-out',
                    opacity: hoveredCard === service.id ? 0.85 : 0,
                  }}
                ></div>
                
                {/* Right Edge */}
                <div 
                  className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-[#EE432C] to-[#FFAA75] transform origin-right"
                  style={{
                    transform: hoveredCard === service.id ? 'perspective(1000px) rotateY(-45deg) scaleX(2) translateX(1px)' : 'scaleX(0)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease-out',
                    opacity: hoveredCard === service.id ? 0.85 : 0,
                  }}
                ></div>
                
                {/* Left Edge */}
                <div 
                  className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-[#EE432C] to-[#FFAA75] transform origin-left"
                  style={{
                    transform: hoveredCard === service.id ? 'perspective(1000px) rotateY(45deg) scaleX(2) translateX(-1px)' : 'scaleX(0)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease-out',
                    opacity: hoveredCard === service.id ? 0.85 : 0,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/services">
            <button className="bg-[#EE432C] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md inline-flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}