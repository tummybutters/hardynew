import React from 'react';

const ContactHero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#F3F4E6] to-[#FFD7B5] py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif">
          Get In Touch
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
          Have questions about our services or want to schedule a detailing?
          We're here to help!
        </p>
        <div className="mt-8">
          <a
            href="/booking"
            className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mx-2 mb-4"
          >
            Book a Service
          </a>
          <a
            href="tel:+17147134937"
            className="inline-block bg-white text-gray-800 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mx-2 mb-4 border border-gray-200"
          >
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;