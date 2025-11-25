import React from 'react';
import Navbar from '../Navbar';

export default function BookingPage() {
  return (
    <div style={{ background: '#f6f7fb', minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(180deg, #FFB375 0%, #FEC9A5 100%)',
        padding: '80px 0 70px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '44px', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
            Book Your Appointment
          </h1>
          <p style={{ fontSize: '20px', color: '#fff', lineHeight: 1.5, maxWidth: '760px', margin: '0 auto' }}>
            Schedule your vehicle&apos;s transformation with our premium detailing services.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '-60px auto 0', padding: '0 20px 60px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 36px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          <iframe
            src="https://hardyswashnwax.fieldd.co"
            title="Hardys Wash N' Wax Booking System"
            style={{
              width: '100%',
              minHeight: '80vh',
              border: 'none'
            }}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
