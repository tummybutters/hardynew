import React from 'react';
import Navbar from '../Navbar';

export default function ContactPage() {
  return (
    <div style={{ background: '#f6f7fb', minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(180deg, #f5eacb 0%, #FFB375 100%)',
        padding: '80px 0 70px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', fontWeight: 800, marginBottom: '12px', color: '#111' }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: '20px', color: '#1f2937', lineHeight: 1.5, maxWidth: '720px', margin: '0 auto' }}>
            Have questions about our services or want to schedule a detailing? We&apos;re here to help!
          </p>
          <a
            href="tel:+19497340201"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '22px',
              background: '#fff',
              color: '#111',
              padding: '12px 18px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow: '0 10px 20px rgba(0,0,0,0.10)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            Call Us
          </a>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '-60px auto 0', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 18px 34px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', marginBottom: '14px' }}>Contact Us</h2>
            <form>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#111' }}>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#111' }}>Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#111' }}>Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="(123) 456-7890"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#111' }}>Subject (Optional)</label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#111' }}>Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <button
                type="button"
                style={{
                  width: '100%',
                  background: '#EE432C',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 12px 20px rgba(238,67,44,0.35)'
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 18px 34px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', marginBottom: '14px' }}>Contact Information</h2>
            <div style={{ display: 'grid', gap: '12px', color: '#374151' }}>
              <InfoRow label="Phone" value="(949) 734-0201" href="tel:+19497340201" />
              <InfoRow label="Email" value="hardyswashnwax@gmail.com" href="mailto:hardyswashnwax@gmail.com" />
              <div>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#111' }}>Service Area</div>
                <p style={{ margin: 0, lineHeight: 1.5 }}>
                  Sacramento, CA | Davis, CA | Woodland, CA | Elk Grove, CA | Winters, CA | Dixon, CA | West Sacramento, CA
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#111' }}>Hours</div>
                <p style={{ margin: 0 }}>24/7 — Bookings by appointment</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  background: '#fef3e7',
  fontSize: '15px',
  color: '#111',
  outline: 'none'
};

function InfoRow({ label, value, href }) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 700, color: '#111' }}>{label}</span>
      <span>{value}</span>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ color: '#374151', textDecoration: 'none' }}>
        {content}
      </a>
    );
  }
  return content;
}
