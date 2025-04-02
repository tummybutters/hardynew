import React, { useState, useEffect, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { bookingFormSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import LocationSearch from "./LocationSearch";
import {
  Car,
  Truck,
  Bus,
  Brush,
  Droplets,
  Sparkles,
  MapPin,
  Settings,
  ClipboardList,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Define the form values type using the Zod schema
type FormValues = z.infer<typeof bookingFormSchema>;

// Vehicle Types
const vehicleTypes = [
  { value: "sedan", label: "Sedan", icon: <Car className="w-6 h-6 text-primary-red" />, description: "Economical 4-door car", priceTier: "low" },
  { value: "coupe", label: "Coupe", icon: <Car className="w-6 h-6 text-primary-red" />, description: "Sporty 2-door car", priceTier: "low" },
  { value: "suv", label: "SUV", icon: <Car className="w-6 h-6 text-primary-red" />, description: "Sport utility vehicle", priceTier: "medium" },
  { value: "truck", label: "Truck", icon: <Truck className="w-6 h-6 text-primary-red" />, description: "Pickup truck", priceTier: "medium" },
  { value: "van", label: "Van", icon: <Bus className="w-6 h-6 text-primary-red" />, description: "Family or cargo van", priceTier: "high" },
  { value: "luxury", label: "Luxury/Sports Car", icon: <Car className="w-6 h-6 text-primary-red" />, description: "High-end performance vehicle", priceTier: "high" },
];

// Categories 
const serviceCategories = [
  { value: "interior", label: "Interior Only", icon: <Brush className="w-6 h-6 text-primary-red" />, description: "Focus on cleaning the inside of your vehicle" },
  { value: "exterior", label: "Exterior Only", icon: <Droplets className="w-6 h-6 text-primary-red" />, description: "Focus on making the outside shine" },
  { value: "complete", label: "Complete Package", icon: <Sparkles className="w-6 h-6 text-primary-red" />, description: "Full interior and exterior detailing" }
];

// Service prices for each vehicle tier based on image (static pricing)
const servicePrices = {
  // Sedan/Coupe Tier (Tier 1 - lowest prices)
  sedan: {
    interior: {
      "interior-deep-clean": { price: 150, duration: "2-4 hours" }
    },
    exterior: {
      "express-detail": { price: 125, duration: "2 hours" },
      "exterior-wash-wax": { price: 200, duration: "2-4 hours" },
      "exterior-polish-wax": { price: 350, duration: "3-6 hours" }
    },
    complete: {
      "luxury-full-detail": { price: 550, duration: "4-8 hours" },
      "showroom-prep": { price: 699, duration: "7-8 hours" }
    }
  },
  
  // SUV/Truck Tier (Tier 2 - middle range prices)
  suv: {
    interior: {
      "interior-deep-clean": { price: 250, duration: "2-4 hours" }
    },
    exterior: {
      "express-detail": { price: 150, duration: "2 hours" },
      "exterior-wash-wax": { price: 300, duration: "2-4 hours" },
      "exterior-polish-wax": { price: 400, duration: "3-6 hours" }
    },
    complete: {
      "luxury-full-detail": { price: 699, duration: "4-8 hours" },
      "showroom-prep": { price: 849, duration: "7-8 hours" }
    }
  },
  
  // Van/Luxury Tier (Tier 3 - highest prices)
  luxury: {
    interior: {
      "interior-deep-clean": { price: 350, duration: "2-4 hours" }
    },
    exterior: {
      "express-detail": { price: 175, duration: "2 hours" },
      "exterior-wash-wax": { price: 400, duration: "2-4 hours" },
      "exterior-polish-wax": { price: 450, duration: "3-6 hours" }
    },
    complete: {
      "luxury-full-detail": { price: 850, duration: "4-8 hours" },
      "showroom-prep": { price: 999, duration: "7-8 hours" }
    }
  }
};

// Service Packages (displayed options)
const servicePackages = {
  interior: [
    { 
      value: "interior-deep-clean", 
      label: "Interior Detail Deep Clean", 
      basePrice: servicePrices.sedan.interior["interior-deep-clean"].price,
      duration: servicePrices.sedan.interior["interior-deep-clean"].duration, 
      description: "Thorough cleaning of all interior surfaces, carpet & upholstery cleaning, stain removal, leather conditioning, and protection" 
    }
  ],
  exterior: [
    { 
      value: "express-detail", 
      label: "Express Detail", 
      basePrice: servicePrices.sedan.exterior["express-detail"].price,
      duration: servicePrices.sedan.exterior["express-detail"].duration, 
      description: "Quick exterior wash, tire shine, and basic wax protection" 
    },
    { 
      value: "exterior-wash-wax", 
      label: "Exterior Wash & Wax", 
      basePrice: servicePrices.sedan.exterior["exterior-wash-wax"].price,
      duration: servicePrices.sedan.exterior["exterior-wash-wax"].duration, 
      description: "Thorough wash, premium wax application, wheel cleaning, and tire shine" 
    },
    { 
      value: "exterior-polish-wax", 
      label: "Exterior Polish & Wax", 
      basePrice: servicePrices.sedan.exterior["exterior-polish-wax"].price,
      duration: servicePrices.sedan.exterior["exterior-polish-wax"].duration, 
      description: "Full exterior polish to remove minor scratches and swirls, followed by premium wax protection" 
    }
  ],
  complete: [
    { 
      value: "luxury-full-detail", 
      label: "Luxury Full Detail", 
      basePrice: servicePrices.sedan.complete["luxury-full-detail"].price,
      duration: servicePrices.sedan.complete["luxury-full-detail"].duration, 
      description: "Complete interior and exterior detailing with premium products and extra attention to detail" 
    },
    { 
      value: "showroom-prep", 
      label: "Showroom Prep", 
      basePrice: servicePrices.sedan.complete["showroom-prep"].price,
      duration: servicePrices.sedan.complete["showroom-prep"].duration, 
      description: "Our most comprehensive package bringing your vehicle to like-new condition with ceramic coating" 
    }
  ]
};

// Add-on Services
const addOnServices = [
  { id: "carpet", label: "Carpet Conditioning", price: "+$100", description: "Deep conditioning treatment for carpets and floor mats" },
  { id: "leather", label: "Leather Conditioning", price: "+$50", description: "Deep conditioning and UV protection for leather surfaces" },
  { id: "clay", label: "Clay Bar", price: "+$50", description: "Removes embedded contaminants from paint" },
  { id: "spray-wax", label: "Spray Wax", price: "+$65", description: "Additional layer of wax protection for your vehicle" },
  { id: "headlights", label: "Headlight Restoration", price: "+$50-$100", description: "Restore yellowed or cloudy headlights" },
  { id: "headliner", label: "Headliner Restore", price: "+$50-$75", description: "Clean and restore vehicle headliner" },
  { id: "scratch", label: "Scratch Buffing", price: "+$65-$95", description: "Buff out minor scratches from your vehicle's paint" },
  { id: "plastic", label: "Interior Plastic/Chrome Polishing", price: "+$45-$85", description: "Restore and polish interior plastic and chrome surfaces" }
];

// Time Slots
const timeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" }
];

// Steps configuration
const steps = [
  { 
    id: "location", 
    title: "Location", 
    description: "Where should we meet you?", 
    icon: <MapPin className="h-5 w-5" /> 
  },
  { 
    id: "vehicle", 
    title: "Vehicle Type", 
    description: "Tell us about your vehicle", 
    icon: <Car className="h-5 w-5" /> 
  },
  { 
    id: "category", 
    title: "Service Category", 
    description: "What type of service do you need?", 
    icon: <Settings className="h-5 w-5" /> 
  },
  { 
    id: "service", 
    title: "Select Package", 
    description: "Choose your detailing package", 
    icon: <ClipboardList className="h-5 w-5" /> 
  },
  { 
    id: "appointment", 
    title: "Date & Time", 
    description: "When would you like us to come?", 
    icon: <Calendar className="h-5 w-5" /> 
  },
  { 
    id: "condition", 
    title: "Vehicle Condition", 
    description: "Tell us about your vehicle's condition", 
    icon: <Car className="h-5 w-5" /> 
  },
  { 
    id: "contact", 
    title: "Your Details", 
    description: "How can we reach you?", 
    icon: <Clock className="h-5 w-5" /> 
  },
  { 
    id: "review", 
    title: "Review", 
    description: "Confirm your booking details", 
    icon: <DollarSign className="h-5 w-5" /> 
  },
  { 
    id: "confirmation", 
    title: "Confirmation", 
    description: "Your booking is complete!", 
    icon: <CheckCircle className="h-5 w-5" /> 
  }
];

export default function MultiStepBookingForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedAddOnDetails, setSelectedAddOnDetails] = useState<{id: string, price: string}[]>([]);
  const [bookingReference, setBookingReference] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [addressCoordinates, setAddressCoordinates] = useState<[number, number] | undefined>(undefined);
  const stepsRef = useRef<HTMLDivElement>(null);
  
  // Extract price value as numeric
  const extractPrice = (priceString: string): number => {
    // Special handling for price ranges (e.g., "+$45-$85")
    if (priceString.includes('-')) {
      // Take the lower value in the range for conservative pricing
      const rangeMatch = priceString.match(/\$(\d+)-\$(\d+)/);
      if (rangeMatch && rangeMatch[1]) {
        return parseFloat(rangeMatch[1]) || 0;
      }
    }
    
    // Standard case: remove non-numeric characters except for decimal points
    const numericString = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(numericString) || 0;
  };
  
  // Calculate price based on vehicle type
  // Get the price for a service based on the vehicle type
  const getServicePrice = (serviceValue: string, serviceCategory: string, vehicleType: string): number => {
    // Map vehicle type to one of our three pricing tiers
    const priceTier = vehicleType === 'sedan' || vehicleType === 'coupe' ? 'sedan' : 
                     (vehicleType === 'suv' || vehicleType === 'truck') ? 'suv' : 'luxury';
    
    try {
      // Type-safe lookup for sedan/coupe tier
      if (priceTier === 'sedan') {
        if (serviceCategory === 'interior') {
          if (serviceValue === 'interior-deep-clean') {
            return servicePrices.sedan.interior["interior-deep-clean"].price;
          }
        } else if (serviceCategory === 'exterior') {
          if (serviceValue === 'express-detail') {
            return servicePrices.sedan.exterior["express-detail"].price;
          } else if (serviceValue === 'exterior-wash-wax') {
            return servicePrices.sedan.exterior["exterior-wash-wax"].price;
          } else if (serviceValue === 'exterior-polish-wax') {
            return servicePrices.sedan.exterior["exterior-polish-wax"].price;
          }
        } else if (serviceCategory === 'complete') {
          if (serviceValue === 'luxury-full-detail') {
            return servicePrices.sedan.complete["luxury-full-detail"].price;
          } else if (serviceValue === 'showroom-prep') {
            return servicePrices.sedan.complete["showroom-prep"].price;
          }
        }
      } 
      // Type-safe lookup for SUV/truck tier
      else if (priceTier === 'suv') {
        if (serviceCategory === 'interior') {
          if (serviceValue === 'interior-deep-clean') {
            return servicePrices.suv.interior["interior-deep-clean"].price;
          }
        } else if (serviceCategory === 'exterior') {
          if (serviceValue === 'express-detail') {
            return servicePrices.suv.exterior["express-detail"].price;
          } else if (serviceValue === 'exterior-wash-wax') {
            return servicePrices.suv.exterior["exterior-wash-wax"].price;
          } else if (serviceValue === 'exterior-polish-wax') {
            return servicePrices.suv.exterior["exterior-polish-wax"].price;
          }
        } else if (serviceCategory === 'complete') {
          if (serviceValue === 'luxury-full-detail') {
            return servicePrices.suv.complete["luxury-full-detail"].price;
          } else if (serviceValue === 'showroom-prep') {
            return servicePrices.suv.complete["showroom-prep"].price;
          }
        }
      }
      // Type-safe lookup for luxury/van tier
      else if (priceTier === 'luxury') {
        if (serviceCategory === 'interior') {
          if (serviceValue === 'interior-deep-clean') {
            return servicePrices.luxury.interior["interior-deep-clean"].price;
          }
        } else if (serviceCategory === 'exterior') {
          if (serviceValue === 'express-detail') {
            return servicePrices.luxury.exterior["express-detail"].price;
          } else if (serviceValue === 'exterior-wash-wax') {
            return servicePrices.luxury.exterior["exterior-wash-wax"].price;
          } else if (serviceValue === 'exterior-polish-wax') {
            return servicePrices.luxury.exterior["exterior-polish-wax"].price;
          }
        } else if (serviceCategory === 'complete') {
          if (serviceValue === 'luxury-full-detail') {
            return servicePrices.luxury.complete["luxury-full-detail"].price;
          } else if (serviceValue === 'showroom-prep') {
            return servicePrices.luxury.complete["showroom-prep"].price;
          }
        }
      }
      
      console.error('Unable to find price for this service/vehicle combination:', {serviceValue, serviceCategory, vehicleType, priceTier});
      return 0;
    } catch (error) {
      console.error('Error getting service price:', error);
      return 0;
    }
  };

  // Calculate total price including add-ons
  const calculateTotalPrice = (serviceInfo: any, vehicleType: string, addOns: {id: string, price: string}[]): string => {
    // Get the static price based on service and vehicle type
    let basePrice = 0;
    
    if (serviceInfo && vehicleType) {
      // Get price from our fixed price tiers
      basePrice = getServicePrice(serviceInfo.value, form.getValues().serviceCategory, vehicleType);
    }
    
    // Add the add-on costs
    const addOnTotal = addOns.reduce((total, addon) => {
      return total + extractPrice(addon.price);
    }, 0);
    
    // Return price as a whole number (no decimal places)
    return `$${Math.round(basePrice + addOnTotal)}`;
  };
  
  // Calculate reference number
  const generateBookingReference = (): string => {
    const prefix = "BK";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };
  
  // Track user interactions
  const trackInteraction = (action: string, field: string, value: string) => {
    // Analytics would go here in a real app
    console.log(`User Interaction: ${action} - ${field}:`, value);
  };
  
  // Form initialization
  const form = useForm<FormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      vehicleType: "",
      serviceCategory: "",
      mainService: "",
      addOns: "",
      appointmentDate: "",
      appointmentTime: "",
      conditionNotes: "",
      totalPrice: "$0",
      totalDuration: "",
    },
  });
  
  // Watch for changes to fields we're interested in
  const watchVehicleType = form.watch("vehicleType");
  const watchServiceCategory = form.watch("serviceCategory");
  const watchMainService = form.watch("mainService");
  const watchAddOns = form.watch("addOns");
  
  // Update the selected category when the service category changes
  useEffect(() => {
    if (watchServiceCategory) {
      setSelectedCategory(watchServiceCategory);
      
      // Reset main service when category changes
      form.setValue("mainService", "");
      
      console.log("Selected category changed to:", watchServiceCategory);
    }
  }, [watchServiceCategory, form]);
  
  // Update duration based on selected service
  useEffect(() => {
    if (watchMainService && selectedCategory) {
      const services = servicePackages[selectedCategory as keyof typeof servicePackages];
      const serviceInfo = services.find(s => s.value === watchMainService);
      
      if (serviceInfo) {
        form.setValue("totalDuration", serviceInfo.duration);
        console.log("Duration set to:", serviceInfo.duration);
      }
    }
  }, [watchMainService, selectedCategory, form]);
  
  // Update total price when vehicle type, service, or add-ons change
  useEffect(() => {
    // Only proceed if we have both vehicle type and main service selected
    if (watchVehicleType && watchMainService && selectedCategory) {
      const services = servicePackages[selectedCategory as keyof typeof servicePackages];
      const serviceInfo = services.find(s => s.value === watchMainService);
      
      if (serviceInfo) {
        // Calculate and set the total price
        const totalPrice = calculateTotalPrice(serviceInfo, watchVehicleType, selectedAddOnDetails);
        form.setValue("totalPrice", totalPrice);
        console.log("Total price set to:", totalPrice);
      }
    }
  }, [watchVehicleType, watchMainService, selectedCategory, selectedAddOnDetails, form]);
  
  // Handle add-on selection
  const handleAddOnSelection = (addon: { id: string, label: string, price: string }, isChecked: boolean) => {
    setSelectedAddOns(prev => {
      if (isChecked) {
        return [...prev, addon.id];
      } else {
        return prev.filter(id => id !== addon.id);
      }
    });
    
    setSelectedAddOnDetails(prev => {
      if (isChecked) {
        return [...prev, { id: addon.id, price: addon.price }];
      } else {
        return prev.filter(item => item.id !== addon.id);
      }
    });
    
    // Update the add-ons field in the form
    form.setValue("addOns", isChecked 
      ? [...selectedAddOns, addon.id].join(',') 
      : selectedAddOns.filter(id => id !== addon.id).join(','),
      { shouldValidate: true, shouldDirty: true }
    );
    
    trackInteraction("toggle", "addon", `${addon.id}:${isChecked}`);
  };
  
  // Validate fields at the current step
  const validateCurrentStep = () => {
    const fields: Record<number, string[]> = {
      0: ["location"],
      1: ["vehicleType"],
      2: ["serviceCategory"],
      3: ["mainService"],
      4: ["appointmentDate", "appointmentTime"],
      5: [], // conditionNotes is optional
      6: ["firstName", "lastName", "email", "phone"]
    };
    
    if (currentStep > 7) return true; // No validation for confirmation step
    
    const currentFields = fields[currentStep] || [];
    let isValid = true;
    
    // Location step has special validation
    if (currentStep === 0 && !isValidAddress) {
      toast({
        title: "Invalid Location",
        description: "Please enter a valid service address within our service area.",
        variant: "destructive",
      });
      return false;
    }
    
    // For other steps, validate the relevant fields
    for (const field of currentFields) {
      const value = form.getValues(field as any);
      if (!value) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive",
        });
        isValid = false;
        break;
      }
    }
    
    // Service category validation - if they don't pick a category
    if (currentStep === 2 && !form.getValues("serviceCategory")) {
      toast({
        title: "Service Category Required",
        description: "Please select a service category to continue.",
        variant: "destructive",
      });
      return false;
    }
    
    // Service package validation - if they don't pick a package
    if (currentStep === 3 && !form.getValues("mainService")) {
      toast({
        title: "Service Package Required",
        description: "Please select a service package to continue.",
        variant: "destructive",
      });
      return false;
    }
    
    return isValid;
  };
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Generate a booking reference
    const reference = generateBookingReference();
    setBookingReference(reference);
    
    // Add coordinates and reference to data
    const enhancedData = {
      ...data,
      coordinates: addressCoordinates ? addressCoordinates.join(',') : '',
      bookingReference: reference,
      status: "pending"
    };
    
    try {
      // Submit the booking data
      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(enhancedData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      // Move to the confirmation page
      setCurrentStep(8);
      
      toast({
        title: "Booking Successful!",
        description: `Your booking reference is ${reference}. We'll send you an email confirmation shortly.`,
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next step
  const handleNext = () => {
    // Validate the current step before proceeding
    if (currentStep === 7) {
      // Skip validation for the final submit button (review step)
      console.log('Submitting form...');
      form.handleSubmit(onSubmit)();
      return;
    }
    
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        // Special handling for review step - show confirmation on submit
        if (currentStep === 6) {
          setCurrentStep(prev => prev + 1);
          
          // Simplified scrolling for review step
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          // Additional scroll with element reference for reliability
          setTimeout(() => {
            if (stepsRef.current) {
              stepsRef.current.scrollIntoView({
                behavior: 'smooth', 
                block: 'start'
              });
            }
          }, 50);
        } 
        // Final review to confirmation - submit the form
        else if (currentStep === 7) {
          console.log('Review step complete - submitting form');
          form.handleSubmit(onSubmit)();
        }
        // Regular step advancement
        else {
          setCurrentStep(prev => prev + 1);
          
          // Simplified scrolling for better user experience
          // Two-phase approach similar to handlePrevious
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          // Ensure the top of the form is visible even on complex layouts
          setTimeout(() => {
            if (stepsRef.current) {
              stepsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 50);
        }
      }
    }
  };
  
  // Go back to previous step
  const handlePrevious = () => {
    // Simple log for navigation tracking
    console.log('NAVIGATION: Going back from step', currentStep, 'to step', currentStep-1);
    
    if (currentStep > 0) {
      // Check if we're navigating from date/time back to service packages
      const isDateToServiceTransition = currentStep === 4; // Going from date/time back to service packages
      
      setCurrentStep(prev => prev - 1);
      
      // Simplified, smoother scrolling approach that still ensures reliability
      if (isDateToServiceTransition) {
        // For critical transitions, use a two-phase approach:
        // First, instant scroll to ensure we're at the top
        window.scrollTo(0, 0);
        
        // Then smooth scroll to the reference element with a slight delay
        setTimeout(() => {
          if (stepsRef.current) {
            stepsRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 50);
      } else {
        // For non-critical transitions, use a gentler approach
        if (stepsRef.current) {
          window.scrollTo({
            top: Math.max(0, stepsRef.current.offsetTop - 20),
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Helper to get service info for a given service ID
  const getServiceInfoById = (serviceId: string): any => {
    // Only attempt to get info if we have a category selected
    if (!selectedCategory) return null;
    
    const services = servicePackages[selectedCategory as keyof typeof servicePackages];
    const serviceInfo = services.find(s => s.value === serviceId);
    
    // Add the price property adjusted for vehicle type
    if (serviceInfo && watchVehicleType) {
      return {
        ...serviceInfo,
        price: getServicePrice(serviceInfo.value, selectedCategory, watchVehicleType)
      };
    }
    
    return null;
  };

  const isMobile = useIsMobile();

  return (
    <div className="bg-[#F3F4E6] py-8 md:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900">Book Your Mobile Detailing Service</h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">Experience premium car detailing at your home or office. Our expert team brings everything needed to transform your vehicle.</p>
        </div>
        
        <div ref={stepsRef} className="relative mb-6 md:mb-10">
          {/* Desktop progress indicator */}
          <div className="hidden md:flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center relative ${
                  index <= currentStep ? "text-[#EE432C]" : "text-gray-400"
                } ${index === steps.length - 1 ? "" : "flex-1"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                  index <= currentStep ? "border-[#EE432C]" : "border-gray-300"
                }`}>
                  {step.icon}
                </div>
                <div className="mt-2 text-xs font-medium hidden lg:block">{step.title}</div>
                
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className={`absolute h-0.5 top-5 left-10 right-0 -mr-2 ${
                    index < currentStep ? "bg-[#EE432C]" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile step indicator - just show current step */}
          <div className="md:hidden flex items-center justify-center mb-6 px-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#EE432C] bg-white mr-3">
              {steps[currentStep].icon}
            </div>
            <div>
              <div className="font-medium text-[#EE432C]">Step {currentStep + 1} of {steps.length}</div>
              <div className="text-sm text-gray-600">{steps[currentStep].title} - {steps[currentStep].description}</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <FormProvider {...form}>
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              <CardContent className={`p-0 ${currentStep === 8 ? "bg-[#F3F4E6]" : ""}`}>
                {/* Step 1: Location Information */}
                {currentStep === 0 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Where should we meet you?</h2>
                    <p className="text-gray-500 text-sm mb-6">We provide service in Davis, Irvine, Bonita, Costa Mesa, Tustin, Alameda, Mission Viejo, Newport Beach, Dixon, Woodland, Sacramento, and Galt.</p>
                    
                    <Controller
                      name="location"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <LocationSearch
                            value={field.value}
                            onChange={field.onChange}
                            onAddressValidated={(isValid, coordinates) => {
                              setIsValidAddress(isValid);
                              if (isValid && coordinates) {
                                setAddressCoordinates(coordinates);
                              }
                              if (!isValid) {
                                toast({
                                  title: "Location Not Serviced",
                                  description: "Sorry, we don't provide service at this location. Please choose an address in one of our service areas.",
                                  variant: "destructive",
                                });
                              } else if (isValid) {
                                toast({
                                  title: "Location Valid",
                                  description: "Great! We provide service at this location.",
                                });
                              }
                            }}
                            field={field}
                            formState={form.formState}
                          />
                          
                          {isValidAddress && (
                            <div className="mt-2 text-sm text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Address verified - we service this location!
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 2: Vehicle Type */}
                {currentStep === 1 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">What type of vehicle do you have?</h2>
                    <p className="text-gray-500 text-sm mb-6">Select your vehicle type so we can provide accurate pricing.</p>
                    
                    <Controller
                      name="vehicleType"
                      control={form.control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {vehicleTypes.map((vehicle) => (
                            <div 
                              key={vehicle.value}
                              className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                                field.value === vehicle.value 
                                  ? "border-[#EE432C] bg-red-50" 
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                field.onChange(vehicle.value);
                                trackInteraction("select", "vehicleType", vehicle.value);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="shrink-0 mt-1">
                                  {vehicle.icon}
                                </div>
                                <div>
                                  <div className="font-medium">{vehicle.label}</div>
                                  <div className="text-xs text-gray-500 mt-1">{vehicle.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 3: Service Category */}
                {currentStep === 2 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">What type of service do you need?</h2>
                    <p className="text-gray-500 text-sm mb-6">Select a service category to continue.</p>
                    
                    <Controller
                      name="serviceCategory"
                      control={form.control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {serviceCategories.map((category) => (
                            <div 
                              key={category.value}
                              className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                                field.value === category.value 
                                  ? "border-[#EE432C] bg-red-50" 
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                field.onChange(category.value);
                                trackInteraction("select", "serviceCategory", category.value);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="shrink-0 mt-1">
                                  {category.icon}
                                </div>
                                <div>
                                  <div className="font-medium">{category.label}</div>
                                  <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 4: Choose Service Package */}
                {currentStep === 3 && selectedCategory && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Select Your Package</h2>
                    <p className="text-gray-500 text-sm mb-6">Choose the service that best fits your needs.</p>
                    
                    <FormField
                      control={form.control}
                      name="mainService"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                trackInteraction("select", "mainService", value);
                                
                                // Update service duration based on selection
                                const services = servicePackages[selectedCategory as keyof typeof servicePackages];
                                const serviceInfo = services.find(s => s.value === value);
                                
                                if (serviceInfo) {
                                  form.setValue("totalDuration", serviceInfo.duration);
                                }
                              }}
                              className="space-y-4"
                            >
                              {servicePackages[selectedCategory as keyof typeof servicePackages].map((service) => {
                                // Adjust price based on vehicle type (if selected)
                                const adjustedPrice = watchVehicleType 
                                  ? getServicePrice(service.value, selectedCategory, watchVehicleType)
                                  : service.basePrice;
                                  
                                return (
                                  <div 
                                    key={service.value}
                                    className={`relative rounded-lg border transition-all ${
                                      field.value === service.value 
                                        ? "border-[#EE432C] bg-red-50" 
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      value={service.value}
                                      id={service.value}
                                      className="sr-only"
                                    />
                                    <label
                                      htmlFor={service.value}
                                      className="block cursor-pointer p-4"
                                    >
                                      <div className="flex flex-col sm:flex-row justify-between">
                                        <div className="mb-2 sm:mb-0">
                                          <div className="font-medium text-lg">{service.label}</div>
                                          <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                                          <div className="text-xs text-gray-500 mt-2">Estimated time: {service.duration}</div>
                                        </div>
                                        <div className="sm:text-right">
                                          <div className="text-lg font-bold text-[#EE432C]">${adjustedPrice}</div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Add-on services selection */}
                    {watchMainService && (
                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-4">Enhance Your Service with Add-ons</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {addOnServices.map((addon) => (
                            <div key={addon.id} className="flex items-start space-x-3 border border-gray-200 rounded-lg p-3">
                              <Checkbox
                                id={addon.id}
                                checked={selectedAddOns.includes(addon.id)}
                                onCheckedChange={(checked) => handleAddOnSelection(addon, checked === true)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={addon.id}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {addon.label} <span className="text-[#EE432C] font-semibold">{addon.price}</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Step 5: Date and Time Selection */}
                {currentStep === 4 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Select Date and Time</h2>
                    <p className="text-gray-500 text-sm mb-6">Choose when you'd like us to detail your vehicle.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Date Selection */}
                      <div>
                        <FormField
                          control={form.control}
                          name="appointmentDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date</FormLabel>
                              <div className="border rounded-md p-2 bg-white">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      // Format the date as YYYY-MM-DD
                                      const formattedDate = format(date, "yyyy-MM-dd");
                                      field.onChange(formattedDate);
                                      trackInteraction("select", "appointmentDate", formattedDate);
                                    }
                                  }}
                                  disabled={(date) => {
                                    // Disable past dates and create a 90-day booking window
                                    const now = new Date();
                                    now.setHours(0, 0, 0, 0);
                                    const maxDate = new Date();
                                    maxDate.setDate(maxDate.getDate() + 90);
                                    
                                    // Disable weekends
                                    const day = date.getDay();
                                    const isSunday = day === 0;
                                    
                                    return date < now || date > maxDate || isSunday;
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Time Selection */}
                      <div>
                        <FormField
                          control={form.control}
                          name="appointmentTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  trackInteraction("select", "appointmentTime", value);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time.value} value={time.value}>
                                      {time.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 6: Vehicle Condition */}
                {currentStep === 5 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Vehicle Condition</h2>
                    <p className="text-gray-500 text-sm mb-6">Let us know about any specific areas that need attention or any particular conditions we should be aware of.</p>
                    
                    <FormField
                      control={form.control}
                      name="conditionNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions or Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe any special conditions, areas that need extra attention, or any other information that would help us prepare (optional)"
                              className="min-h-[120px] resize-y bg-white"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value) {
                                  trackInteraction("input", "conditionNotes", "filled");
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 7: Contact Information */}
                {currentStep === 6 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Your Contact Information</h2>
                    <p className="text-gray-500 text-sm mb-6">Please provide your contact details so we can confirm your booking.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" className="bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" className="bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" type="email" className="bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" className="bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 8: Review Booking */}
                {currentStep === 7 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Review Your Booking</h2>
                    
                    <div className="space-y-6">
                      {/* Service Details */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Service Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Vehicle Type:</span>
                            <span className="ml-2 font-medium">
                              {vehicleTypes.find(v => v.value === watchVehicleType)?.label}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Service Category:</span>
                            <span className="ml-2 font-medium">
                              {serviceCategories.find(c => c.value === watchServiceCategory)?.label}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Service Package:</span>
                            <span className="ml-2 font-medium">
                              {getServiceInfoById(watchMainService)?.label}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">{form.getValues().totalDuration}</span>
                          </div>
                        </div>
                        
                        {/* Add-ons */}
                        {selectedAddOns.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="font-medium text-gray-900 mb-2">Add-on Services:</div>
                            <div className="flex flex-wrap gap-2">
                              {selectedAddOns.map(addonId => {
                                const addon = addOnServices.find(a => a.id === addonId);
                                return addon ? (
                                  <Badge key={addon.id} variant="outline" className="bg-white">
                                    {addon.label} ({addon.price})
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Appointment Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <span className="ml-2 font-medium">
                              {form.getValues().appointmentDate ? 
                                format(new Date(form.getValues().appointmentDate), "EEEE, MMMM d, yyyy") : ""}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <span className="ml-2 font-medium">
                              {timeSlots.find(t => t.value === form.getValues().appointmentTime)?.label}
                            </span>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-2 font-medium">{form.getValues().location}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Customer Information */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Name:</span>
                            <span className="ml-2 font-medium">
                              {form.getValues().firstName} {form.getValues().lastName}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <span className="ml-2 font-medium">{form.getValues().email}</span>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <span className="text-gray-500">Phone:</span>
                            <span className="ml-2 font-medium">{form.getValues().phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Special Instructions */}
                      {form.getValues().conditionNotes && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-medium text-gray-900 mb-2">Special Instructions</h3>
                          <p className="text-sm text-gray-700">{form.getValues().conditionNotes}</p>
                        </div>
                      )}
                      
                      {/* Total Price */}
                      <div className="bg-[#FFD7B5] rounded-lg p-4 border border-[#FFB375]">
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-gray-900">Total Price:</div>
                          <div className="text-xl font-bold text-[#EE432C]">{form.getValues().totalPrice}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 9: Confirmation */}
                {currentStep === 8 && (
                  <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-4">Your booking has been received and is being processed.</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 inline-block mx-auto mb-6">
                      <div className="text-sm text-gray-500">Booking Reference:</div>
                      <div className="text-lg font-mono font-bold">{bookingReference}</div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6">
                      We've sent a confirmation email to <span className="font-medium">{form.getValues().email}</span> with your booking details.
                      Our team will contact you before your appointment to confirm the exact timing.
                    </p>
                    
                    <Button 
                      variant="default"
                      className="bg-[#FFB375] hover:bg-[#EE432C] text-white w-full sm:w-auto"
                      onClick={() => window.location.href = '/'}
                    >
                      Return to Homepage
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {/* Navigation buttons */}
              {currentStep < 8 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="mt-3 sm:mt-0"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="default"
                    className={`${currentStep === 7 ? "bg-[#EE432C]" : "bg-[#FFB375]"} hover:bg-[#EE432C] text-white ${currentStep === 0 && "w-full"}`}
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    {currentStep === 7 ? (
                      isSubmitting ? "Processing..." : "Confirm Booking"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
