import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Service3DButton } from "@/components/ui/service-3d-button";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet";

export default function CeramicCoating() {
  return (
    <>
      <Helmet>
        <title>Ceramic Coating Services Irvine & Orange County | Hardys Wash N' Wax</title>
        <meta name="description" content="Professional ceramic coating services in Irvine and Orange County. Protect your vehicle's paint with our mobile ceramic coating application for long-lasting shine and protection." />
        <meta name="keywords" content="Ceramic Coating Irvine, Car Paint Protection Orange County, Mobile Ceramic Coating, Professional Paint Protection" />
        <link rel="canonical" href="https://hardyswashnwax.com/services/ceramic-coating" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#FFB375] to-[#FFD7B5] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Professional Ceramic Coating</h1>
            <p className="text-xl text-gray-800 mb-8">Protect your vehicle's paint with the ultimate defense against environmental damage and maintain a showroom shine for years to come.</p>
            <Service3DButton asChild>
              <Link href="/booking">Schedule Your Ceramic Coating</Link>
            </Service3DButton>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Superior Protection With Professional Ceramic Coating</h2>
            
            <div className="mb-12">
              <p className="text-gray-700 mb-4">
                Our professional ceramic coating service provides your vehicle with a nano-ceramic shield that bonds with your car's paint at a molecular level. 
                This creates a permanent protective layer that offers superior resistance against environmental hazards, UV rays, and chemical stains.
              </p>
              <p className="text-gray-700 mb-4">
                Unlike traditional waxes and sealants that wear off within weeks or months, ceramic coating provides years of protection while maintaining that 
                wet-look gloss that makes your car stand out.
              </p>
            </div>
            
            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Ceramic Coating</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Long-lasting Protection</h4>
                      <p className="text-gray-700 text-sm">Provides years of paint protection rather than months with traditional wax</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Chemical Resistance</h4>
                      <p className="text-gray-700 text-sm">Protects against acid rain, bird droppings, tree sap, and other contaminants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">UV Ray Protection</h4>
                      <p className="text-gray-700 text-sm">Prevents paint oxidation and fading from harsh sunlight</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Enhanced Gloss</h4>
                      <p className="text-gray-700 text-sm">Creates a deeper, more reflective shine than factory paint alone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Hydrophobic Properties</h4>
                      <p className="text-gray-700 text-sm">Water beads and rolls off easily, taking dirt with it for easier cleaning</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="text-primary shrink-0 mr-3 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">Scratch Resistance</h4>
                      <p className="text-gray-700 text-sm">Helps prevent light scratches and swirl marks from regular washing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Our Process */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Ceramic Coating Process</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Thorough Decontamination Wash</h4>
                    <p className="text-gray-700">We begin with a comprehensive washing process that removes all surface contaminants. This includes iron removal treatments to eliminate embedded particles.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Paint Correction</h4>
                    <p className="text-gray-700">Before applying ceramic coating, we perform paint correction to remove swirl marks, light scratches, and imperfections, creating a perfect surface for the coating to bond with.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Surface Preparation</h4>
                    <p className="text-gray-700">We meticulously clean the surface with specialized products to ensure there is no residue that might affect the ceramic coating's adhesion.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Ceramic Coating Application</h4>
                    <p className="text-gray-700">Our professional-grade ceramic coating is carefully applied by hand to ensure complete coverage and proper bonding with your vehicle's paint.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">5</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Curing Time</h4>
                    <p className="text-gray-700">After application, your vehicle needs time for the coating to properly cure and bond. This typically takes 24-48 hours for initial curing, with full hardness achieved after 7 days.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-[#FFD7B5]/30 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Why Choose Our Ceramic Coating Service?</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span className="text-sm">We use only premium ceramic coating products with proven durability</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span className="text-sm">Our technicians are professionally trained in proper application techniques</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span className="text-sm">We provide detailed maintenance instructions to maximize the lifespan of your coating</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ceramic Coating Pricing</h3>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">Our ceramic coating packages are customized based on your vehicle's size, condition, and the level of protection you desire. Contact us for a detailed quote tailored to your specific needs.</p>
                
                <p className="text-gray-700 mb-2">Ceramic coating typically starts at:</p>
                <p className="text-2xl font-bold text-primary mb-4">$800 - $1,800</p>
                
                <p className="text-gray-700 mb-2">Factors that affect pricing:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span>Vehicle size and type</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span>Current condition of paint (level of correction needed)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span>Type and grade of ceramic coating selected</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="text-primary shrink-0 mr-2 mt-0.5 h-4 w-4" />
                    <span>Additional areas to be coated (wheels, trim, glass)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2">Service Duration:</h4>
                <p className="text-gray-700">1-3 days, depending on vehicle condition and package selected</p>
              </div>
              
              <div className="flex justify-center mt-6">
                <Service3DButton asChild>
                  <Link href="/booking">Get a Ceramic Coating Quote</Link>
                </Service3DButton>
              </div>
            </div>
            
            {/* Customer Reviews */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say About Our Ceramic Coating</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"I had my Tesla coated last year and it still looks incredible. Water just beads off, and washing is so much easier. Worth every penny for the protection and shine."</p>
                  <p className="font-bold text-gray-900">- Mark T., Irvine</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"The paint correction they did before applying the ceramic coating made my 3-year-old car look better than new. The depth and gloss are amazing, and it's so much easier to keep clean."</p>
                  <p className="font-bold text-gray-900">- Lisa R., Newport Beach</p>
                </div>
              </div>
            </div>
            
            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Areas for Ceramic Coating</h3>
              
              <p className="text-gray-700 mb-4">
                We proudly offer our ceramic coating services throughout Orange County and select areas in Southern California, including:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Irvine</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Costa Mesa</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Newport Beach</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Tustin</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Mission Viejo</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Aliso Viejo</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Laguna Beach</div>
                <div className="bg-[#FFD7B5]/30 p-2 rounded text-center">Huntington Beach</div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button asChild variant="outline">
                  <Link href="/booking">Check Availability in Your Area</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold font-heading text-white mb-2">Protect your investment with ceramic coating</h2>
              <p className="text-gray-100/90 text-lg">Get a customized quote for your vehicle today.</p>
            </div>
            <div>
              <Service3DButton asChild>
                <Link href="/booking">Request a Quote</Link>
              </Service3DButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}