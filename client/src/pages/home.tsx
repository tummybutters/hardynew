import Hero from "@/components/home/Hero";
import FeaturedServicesNew from "@/components/home/FeaturedServicesNew";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedServicesNew />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
