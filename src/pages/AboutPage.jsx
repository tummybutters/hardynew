import React from 'react';
import Navbar from '../Navbar';

export default function AboutPage() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(180deg, #FFB375 0%, #FEC9A5 100%)',
        padding: '80px 0 90px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '14px',
            color: '#fff',
            fontWeight: 700,
            marginBottom: '14px'
          }}>
            Welcome to Hardy&apos;s Wash N&apos; Wax
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '46px', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
            Where Passion Meets Precision
          </h1>
          <div style={{ width: '120px', height: '4px', background: '#fff', margin: '0 auto 18px', borderRadius: '999px' }} />
          <p style={{ fontSize: '19px', lineHeight: 1.6, color: '#fff', maxWidth: '760px', margin: '0 auto' }}>
            We bring luxury detailing to your doorstep, transforming cars into their most pristine state, one detail at a time.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 0' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              color: '#EE432C',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              Meet The Founder
            </span>
            <h2 style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              Hi, I&apos;m Ian – Welcome to Hardy&apos;s Wash N&apos; Wax!
            </h2>
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>
              As a 23-year-old UC Davis graduate, substitute teacher, and car detailing enthusiast, I&apos;ve found my true calling in the art of automotive care. Teaching instilled in me patience, precision, and the satisfaction that comes from a job well done—qualities I bring to every vehicle I detail.
            </p>
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>
              My mission is simple: combine my passion for cars with my commitment to delivering results you&apos;ll love. Whether it&apos;s restoring your vehicle&apos;s original shine or giving it that extra polish, my focus is always on the details that matter.
            </p>
            <p style={{ color: '#374151', lineHeight: 1.7 }}>
              Let&apos;s make your car something to smile about—without you lifting a finger.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', color: '#6b7280', fontStyle: 'italic' }}>
              <div style={{ width: '60px', height: '3px', background: '#EE432C', borderRadius: '999px' }} />
              <span>“Driving&apos;s better when the only thing on your mind is an open road.”</span>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-14px -14px auto auto',
              width: '90px',
              height: '90px',
              background: 'rgba(255, 179, 117, 0.2)',
              borderRadius: '16px',
              zIndex: 0
            }} />
            <img
              src="/legacy/founder.jpg"
              alt="Ian at UC Davis"
              style={{
                width: '100%',
                borderRadius: '16px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                position: 'relative',
                zIndex: 1,
                border: '2px solid #f5f5f5'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
