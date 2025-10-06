import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-5 font-heading">Hardys Wash N' Wax</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Premium mobile detailing services bringing luxury car care directly to your location. Proudly serving Davis, Sacramento, Elk Grove, Roseville, Folsom, West Sacramento, and Woodland.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-white hover:text-[#FFB375] transition-colors">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-white hover:text-[#FFB375] transition-colors">
                <Instagram size={22} />
              </a>
              <a href="#" className="text-white hover:text-[#FFB375] transition-colors">
                <Twitter size={22} />
              </a>
              <a href="#" className="text-white hover:text-[#FFB375] transition-colors">
                <Youtube size={22} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5 font-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white hover:text-[#FFB375] transition-colors inline-block">Home</Link></li>
              <li><Link href="/services" className="text-white hover:text-[#FFB375] transition-colors inline-block">Services</Link></li>
              <li><Link href="/booking" className="text-white hover:text-[#FFB375] transition-colors inline-block">Book Now</Link></li>
              <li><Link href="/about" className="text-white hover:text-[#FFB375] transition-colors inline-block">About Us</Link></li>
              <li><Link href="/contact" className="text-white hover:text-[#FFB375] transition-colors inline-block">Contact</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-5 font-heading">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/services/interior-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Interior Car Detailing</Link></li>
              <li><Link href="/services/ceramic-coating" className="text-white hover:text-[#FFB375] transition-colors inline-block">Ceramic Coating</Link></li>
              <li><Link href="/services/full-service-car-wash" className="text-white hover:text-[#FFB375] transition-colors inline-block">Full Service Car Wash</Link></li>
              <li><Link href="/services/car-wash-and-wax" className="text-white hover:text-[#FFB375] transition-colors inline-block">Car Wash & Wax</Link></li>
            </ul>
          </div>
          
          {/* Service Areas */}
          <div>
            <h3 className="text-xl font-bold mb-5 font-heading">Service Areas</h3>
            <ul className="space-y-3">
              <li><Link href="/davis-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Davis</Link></li>
              <li><Link href="/sacramento-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Sacramento</Link></li>
              <li><Link href="/elk-grove-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Elk Grove</Link></li>
              <li><Link href="/roseville-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Roseville</Link></li>
              <li><Link href="/folsom-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Folsom</Link></li>
              <li><Link href="/west-sacramento-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">West Sacramento</Link></li>
              <li><Link href="/woodland-car-detailing" className="text-white hover:text-[#FFB375] transition-colors inline-block">Woodland</Link></li>
            </ul>
          </div>
          

        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-white/80 text-sm mb-2">
                &copy; {new Date().getFullYear()} Hardys Wash N' Wax. All rights reserved.
              </p>
              <p className="text-white/70 text-sm">
                <MapPin className="h-3 w-3 inline-block mr-1 text-[#FFB375]" />
                <span>Davis, CA 95616</span>
                <span className="mx-2">|</span>
                <Phone className="h-3 w-3 inline-block mr-1 text-[#FFB375]" />
                <a href="tel:+19497340201" className="hover:text-[#FFB375] transition-colors">+1 949-734-0201</a>
              </p>
            </div>
            <div className="flex space-x-8">
              <Link href="/privacy-policy" className="text-white/80 hover:text-[#FFB375] text-sm transition-colors">Privacy Policy</Link>
              <Link href="/sms-terms" className="text-white/80 hover:text-[#FFB375] text-sm transition-colors">SMS Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
