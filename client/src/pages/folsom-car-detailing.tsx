import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MapPin, Car, Star, Clock, CheckCircle } from 'lucide-react';

export default function FolsomCarDetailing() {
  return (
    <>
      <Helmet>
        <title>Folsom Mobile Car Detailing | Hand Wash & Interior Care</title>
        <meta name="description" content="Get a flawless finish in Folsom. Hand car wash, ceramic coating, and interior detailing delivered to your driveway. Book in under 60 seconds." />
        <meta name="keywords" content="Folsom Mobile Car Detailing, Hand Wash, Interior Care, Car Detailing Folsom CA, Mobile Car Wash Sacramento County, Premium Detailing Service" />
        <link rel="canonical" href="https://hardyswashnwax.com/folsom-car-detailing" />
        
        {/* Structured Data for Local Business with service location */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoWash",
            "name": "Hardys Wash N' Wax - Folsom",
            "image": "https://hardyswashnwax.com/logo.png",
            "description": "Premium mobile car detailing service that comes to your location in Folsom, CA and surrounding neighborhoods.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Folsom",
              "addressRegion": "CA",
              "postalCode": "95630",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 38.6774,
              "longitude": -121.1760
            },
            "url": "https://hardyswashnwax.com/folsom-car-detailing",
            "telephone": "+19497340201",
            "priceRange": "$$",
            "areaServed": {
              "@type": "City",
              "name": "Folsom, CA"
            },
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 38.6774,
                "longitude": -121.1760
              },
              "geoRadius": "20000" // Serving within 20km
            },
            "sameAs": [
              "https://www.facebook.com/hardyswashnwax",
              "https://www.instagram.com/hardyswashnwax"
            ]
          })}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Folsom, CA Mobile Car Detailing Services
            </h1>
            <p className="text-xl text-gray-200 mb-8 speakable-content">
              Hardys Wash N' Wax brings premium mobile car detailing directly to you in Folsom, California. 
              We serve the entire Folsom area, including the Historic District, Broadstone, and all residential neighborhoods.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/booking">Book Your Detail</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Service Area Highlight */}
      <div className="bg-[#F3F4E6] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Serving All of Folsom, CA</h2>
              <p className="text-lg mb-6">
                Our mobile detailing service comes directly to your location throughout Folsom and surrounding areas.
                Whether you're a homeowner, business owner, or local resident, we bring our premium 
                detailing services right to your doorstep.
              </p>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Popular Service Areas in Folsom:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Historic District</li>
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Broadstone</li>
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Empire Ranch</li>
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Prairie City</li>
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Parkway</li>
                  <li className="flex items-center"><MapPin className="h-5 w-5 text-[#EE432C] mr-2" /> Folsom Ranch</li>
                </ul>
              </div>
              <p className="font-medium">
                Proudly serving the entire Sacramento region - if you're within 30 minutes we'll come to you.
              </p>
            </div>
            <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Why Folsom Residents Choose Us:</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#EE432C] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium block">Convenient On-Location Service</span>
                    <span className="text-gray-600">We come to your home, apartment, or workplace in Folsom</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#EE432C] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium block">Hand Wash Expertise</span>
                    <span className="text-gray-600">Gentle, thorough cleaning that protects your paint</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#EE432C] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium block">Eco-Friendly Products</span>
                    <span className="text-gray-600">Environmentally conscious detailing solutions</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#EE432C] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium block">Flexible Scheduling</span>
                    <span className="text-gray-600">Early morning and evening appointments available</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services in Folsom</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F3F4E6] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <Car className="h-12 w-12 text-[#EE432C] mb-4" />
                <h3 className="text-xl font-bold mb-2">Express Detail</h3>
                <p className="text-gray-700 mb-4">
                  Perfect for busy Folsom professionals. A thorough exterior wash, tire 
                  shine, and interior vacuum and wipe-down in just 90 minutes.
                </p>
                <p className="font-bold text-lg mb-4">From $99</p>
                <Button asChild className="w-full">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-[#F3F4E6] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <Car className="h-12 w-12 text-[#EE432C] mb-4" />
                <h3 className="text-xl font-bold mb-2">Full Detail</h3>
                <p className="text-gray-700 mb-4">
                  Our most popular package in Folsom. Complete interior and exterior detailing with clay 
                  bar treatment and wax protection.
                </p>
                <p className="font-bold text-lg mb-4">From $189</p>
                <Button asChild className="w-full">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-[#F3F4E6] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <Car className="h-12 w-12 text-[#EE432C] mb-4" />
                <h3 className="text-xl font-bold mb-2">Ceramic Coating</h3>
                <p className="text-gray-700 mb-4">
                  Premium protection for your vehicle. Long-lasting shine 
                  and protection against Folsom's hot summers and winter elements.
                </p>
                <p className="font-bold text-lg mb-4">From $349</p>
                <Button asChild className="w-full">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-[#FFD7B5]/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Folsom Car Detailing FAQs</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Do you service all of Folsom?</h3>
              <p className="text-gray-700">
                Yes! We provide mobile car detailing services throughout all of Folsom, including 
                Historic District, Broadstone, Empire Ranch, and all residential neighborhoods. We also serve 
                nearby areas like El Dorado Hills and Rancho Cordova.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Do I need to provide water and electricity?</h3>
              <p className="text-gray-700">
                You'll need to provide access to a water spigot. We bring our own pressure washer,
                generators, and all necessary equipment and supplies for a complete detail.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Do you offer weekend appointments in Folsom?</h3>
              <p className="text-gray-700">
                Yes, we offer weekend appointments in Folsom, but they tend to book up quickly.
                We recommend scheduling weekend services at least a week in advance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">How far in advance should I book?</h3>
              <p className="text-gray-700">
                For Folsom locations, we recommend booking at least 3-4 days in advance, especially
                during spring and summer months. Weekend appointments fill up quickly, so consider
                booking a week ahead for Saturday or Sunday service.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-[#EE432C] py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for the Best Car Detailing in Folsom?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience premium mobile detailing service 
            delivered right to your location in Folsom.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-[#EE432C] hover:bg-gray-100">
            <Link href="/booking">Schedule Your Folsom Detail</Link>
          </Button>
        </div>
      </div>
    </>
  );
}