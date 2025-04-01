import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import OurValues from "@/components/about/OurValues";
import OurTeam from "@/components/about/OurTeam";
import Certifications from "@/components/about/Certifications";
import ContactCTA from "@/components/about/ContactCTA";
import Location from "@/components/about/Location";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Hardys Wash N' Wax | Mobile Car Detailing in Irvine & Orange County</title>
        <meta name="description" content="Learn about Hardys Wash N' Wax, a premium mobile car detailing service in Irvine and Orange County. Meet our team of certified detailing professionals." />
        <meta name="keywords" content="Car Detailing Irvine, Car Detailing Team Orange County, Professional Auto Detailers, Certified Car Detailing" />
        <link rel="canonical" href="https://hardyswashnwax.com/about" />
      </Helmet>
      <AboutHero />
      <OurStory />
      <OurValues />
      <OurTeam />
      <Certifications />
      <ContactCTA />
      <Location />
    </>
  );
}
