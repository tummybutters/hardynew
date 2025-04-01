import BookingHero from "@/components/booking/BookingHero";
import MultiStepBookingForm from "@/components/booking/MultiStepBookingForm";
import { Helmet } from "react-helmet";

export default function Booking() {
  return (
    <>
      <Helmet>
        <title>Book Mobile Car Detailing in Irvine & Orange County | Hardys Wash N' Wax</title>
        <meta name="description" content="Schedule your mobile car detailing service in Irvine and Orange County. Professional auto detailers come to your location for convenient, premium service." />
        <meta name="keywords" content="Book Car Detailing Irvine, Schedule Mobile Detailing Orange County, Car Wash Appointment, Mobile Auto Detailing Booking" />
        <link rel="canonical" href="https://hardyswashnwax.com/booking" />
      </Helmet>
      <BookingHero />
      <MultiStepBookingForm />
    </>
  );
}
