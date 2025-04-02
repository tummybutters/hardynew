import { useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowRight, Check, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThreeDButton } from "@/components/ui/3d-button";
import { useToast } from "@/hooks/use-toast";

export default function Subscriptions() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const subscriptionPlans = [
    {
      id: "signature",
      name: "Signature Service",
      price: "$120+",
      period: "per month",
      popular: false,
      description: "A premium, gentle cleaning that maintains your vehicle's shine without the commitment of a full detail.",
      features: [
        "Exterior Hand Wash & Dry: Premium, gentle cleaning to maintain shine",
        "Wheel & Tire Detailing: Protection from brake dust and road grime",
        "Interior Touch-Up: Quick vacuuming and wipe-down of high-touch areas",
        "Add-On Discounts: Special rates on additional services"
      ],
      color: "bg-white"
    },
    {
      id: "executive",
      name: "Executive Detail",
      price: "$300+",
      period: "per month",
      popular: true,
      description: "Comprehensive care for vehicles that deserve meticulous attention to maintain a near-showroom finish.",
      features: [
        "Comprehensive Exterior Care: Includes Signature cleaning plus spray wax",
        "Enhanced Interior Care: Deep cleaning of all surfaces and crevices",
        "Glass & Surface Treatments: For better clarity and protection",
        "Scheduled Checkups: Regular assessments of vehicle condition",
        "Light Paint Correction: Reduces swirls and minor imperfections",
        "Dashboard & Console Deep Conditioning"
      ],
      color: "bg-gradient-to-b from-primary/5 to-primary/10"
    },
    {
      id: "concierge",
      name: "Concierge Express",
      price: "$800+",
      period: "per month",
      popular: false,
      description: "Our premium service designed for busy families with multiple vehicles, offering the ultimate in flexibility and convenience.",
      features: [
        "Multiple Express Details: Several exterior detail sessions per month",
        "Combination Service: Blend of exterior and interior treatments",
        "Flexible Service Mix: Choose what works for your schedule",
        "Priority Scheduling: Fast, guaranteed booking times",
        "Custom Add-Ons: Tailored services for your specific needs",
        "Headlight Restoration: Specialized care for clarity and safety",
        "Specialized Surface Care: Premium treatments for all surfaces"
      ],
      color: "bg-white"
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Subscription Selected",
      description: "Schedule your first appointment by contacting us.",
    });
  };
  
  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Monthly Detailing Subscriptions | Hardys Wash N' Wax</title>
        <meta name="description" content="Save money with our monthly car detailing subscription plans. Choose from three tiers of recurring service for your vehicle." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative bg-secondary py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-90"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Subscription Plans</h1>
            <p className="text-gray-100 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              Keep your vehicle looking its best year-round with our convenient subscription plans.
            </p>
          </div>
        </div>
      </div>
      
      {/* Subscription Plans */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Select a subscription that fits your needs. All plans include recurring service with no long-term contracts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden border ${plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'} ${plan.color}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-xs px-3 py-1 rounded-bl-md font-medium">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-primary mr-2 mt-1 h-4 w-4 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <ThreeDButton 
                  onClick={() => handleSelectPlan(plan.id)} 
                  className="w-full"
                  variant={plan.popular ? "primary" : "secondary"}
                >
                  Select Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ThreeDButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscription FAQs</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Common questions about our subscription services
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-900">How do subscriptions work?</h3>
              <p className="mt-2 text-gray-700">
                Our subscriptions are billed monthly and include recurring service at your preferred location. You can schedule your appointments based on the frequency of your plan, with flexible booking options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-900">Can I cancel anytime?</h3>
              <p className="mt-2 text-gray-700">
                Yes, all subscriptions are month-to-month with no long-term contracts. You can cancel at any time with 7 days' notice before your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-900">How do I schedule appointments?</h3>
              <p className="mt-2 text-gray-700">
                After subscribing, you'll receive access to priority booking. You can schedule your appointments through our online booking system or by contacting our customer service team.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-900">Are there any additional fees?</h3>
              <p className="mt-2 text-gray-700">
                Your subscription includes the services listed in your plan. Vehicles with excessive soil, pet hair, or special needs may incur additional charges, which will be communicated before service.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready for Consistent Care?</h2>
            <p className="mt-3 text-gray-700">
              Join our subscription service today and experience the convenience of scheduled professional detailing.
            </p>
            <div className="mt-6">
              <ThreeDButton onClick={() => window.location.href = '/contact'} variant="primary">
                Contact Us to Get Started
              </ThreeDButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}