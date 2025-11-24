import React from 'react';
import { ArrowRight, Medal, Droplets, Clock, ThumbsUp, Lock, Sparkles, Lightbulb } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'FULL INTERIOR DETAIL',
    description: 'Revitalize your cabin with meticulous interior cleaning that removes stains, odors, and restores freshness.',
    image: '/legacy/interior-detailing.jpg',
    tone: 'light'
  },
  {
    id: 2,
    title: 'FULL EXTERIOR DETAIL',
    description: 'Premium wash and wax that delivers a pristine finish with lasting protection from the elements.',
    image: '/legacy/exterior-detail.jpg',
    tone: 'light'
  },
  {
    id: 3,
    title: 'FULL DETAIL',
    description: 'Interior + exterior restoration for a showroom-ready finish, inside and out.',
    image: '/legacy/full-hand-wash-detail.jpg',
    tone: 'light'
  },
  {
    id: 4,
    title: 'PAINT CORRECTION',
    description: 'Precision correction that removes swirls and scratches for a mirror-like finish.',
    image: '/legacy/paint-correction.jpg',
    tone: 'dark'
  },
  {
    id: 5,
    title: 'CERAMIC COATING',
    description: 'Up to 8 years of premium protection with deep gloss and hydrophobic performance.',
    image: '/legacy/ceramic-coating.webp',
    tone: 'dark'
  },
  {
    id: 6,
    title: 'MAINTENANCE DETAILS',
    description: 'Keep your vehicle pristine between full details with tailored maintenance cleanings.',
    image: '/legacy/interior-detailing-2.jpg',
    tone: 'dark'
  }
];

const gains = [
  { icon: <Medal size={22} />, title: 'Every Detail, Mastered', desc: 'Obsessive focus on every inch of your car—so it feels brand new.' },
  { icon: <Droplets size={22} />, title: 'Convenience Without Compromise', desc: 'We come to you with top-tier results while you go about your day.' },
  { icon: <Clock size={22} />, title: 'Protect & Elevate Value', desc: 'Services designed to safeguard longevity and keep it pristine for years.' },
  { icon: <ThumbsUp size={22} />, title: 'Results That Speak', desc: "If it isn't the cleanest you've seen, the detail is free—no questions asked." }
];

const reasons = [
  { icon: <Lock size={22} />, title: 'Proven Process', desc: 'Precision techniques and products trusted by luxury owners.' },
  { icon: <Sparkles size={22} />, title: 'Instant Results', desc: 'Your car turns heads the moment we’re done.' },
  { icon: <Lightbulb size={22} />, title: 'Effortless Scheduling', desc: 'Book in minutes with service tailored to your car.' }
];

export function LegacyServices() {
  return (
    <section style={{ background: '#F3F4E6', padding: '80px 0' }}>
      <div style={{ width: 'min(1200px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1f1f1f', letterSpacing: '0.5px' }}>
            SEE ALL COMPREHENSIVE MOBILE DETAILING PACKAGES
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {services.slice(0, 3).map((svc) => (
            <div key={svc.id} style={{ border: '2px solid #000', borderRadius: '14px', overflow: 'hidden', background: '#fff', boxShadow: '0 14px 30px rgba(0,0,0,0.12)' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px', background: '#FFB375' }}>
                <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0' }}>{svc.title}</h3>
                <p style={{ textAlign: 'center', fontSize: '14px', lineHeight: 1.5, color: '#111', margin: '0 0 10px 0' }}>{svc.description}</p>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px', letterSpacing: '1px' }}>- LEARN MORE -</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '40px 0 24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#cfcfcf' }} />
          <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1f1f1f' }}>OUR OTHER SERVICES:</h3>
          <div style={{ flex: 1, height: '1px', background: '#cfcfcf' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {services.slice(3).map((svc) => (
            <div key={svc.id} style={{ border: '2px solid #000', borderRadius: '14px', overflow: 'hidden', background: '#111', color: '#fff', boxShadow: '0 14px 30px rgba(0,0,0,0.12)' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px', background: '#111' }}>
                <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 800, margin: '0 0 10px 0', color: '#FFB375' }}>{svc.title}</h3>
                <p style={{ textAlign: 'center', fontSize: '14px', lineHeight: 1.5, color: '#eee', margin: '0 0 10px 0' }}>{svc.description}</p>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', borderTop: '1px solid rgba(255,255,255,0.35)', paddingTop: '8px' }}>- LEARN MORE -</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a
            href="#services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#EE432C',
              color: '#fff',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: 700,
              border: '2px solid #000',
              textDecoration: 'none',
              boxShadow: '0 12px 24px rgba(238,67,44,0.35)'
            }}
          >
            VIEW ALL SERVICES <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function LegacyWhyChoose() {
  return (
    <>
      <section style={{ background: '#FFB375', color: '#111', padding: '70px 0' }}>
        <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px 0' }}>What You'll Gain</h2>
            <p style={{ margin: 0, color: '#2c2c2c', fontSize: '16px' }}>
              Luxury car care without the hassle. We bring convenience and quality together.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '18px' }}>
            {gains.map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fff', margin: '0 auto 12px', display: 'grid', placeItems: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.15)', color: '#EE432C' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#1f1f1f', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F3F4E6', color: '#111', padding: '70px 0' }}>
        <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px 0' }}>Why It Works</h2>
            <p style={{ margin: 0, color: '#3a3a3a', fontSize: '16px' }}>
              Built around what luxury owners want: exceptional results with zero inconvenience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '18px' }}>
            {reasons.map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 12px 22px rgba(0,0,0,0.08)', border: '1px solid #FFD7B5', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FFD7B5', color: '#EE432C', margin: '0 auto 12px', display: 'grid', placeItems: 'center' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#3a3a3a', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function LegacyCTA() {
  return (
    <section style={{ position: 'relative', padding: '70px 0', background: '#FFB375', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(238,67,44,0.25), rgba(255,179,117,0.15))' }} />
      <div style={{ width: 'min(900px, 92vw)', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#111', margin: '0 0 12px' }}>
          Act Now: Limited Appointments Available
        </h2>
        <p style={{ fontSize: '17px', color: '#1f1f1f', margin: '0 0 14px', lineHeight: 1.6 }}>
          Our premium mobile detailing is quickly becoming everyone&apos;s favorite. Secure your spot today—don&apos;t wait for your car to lose its shine.
        </p>
        <p style={{ fontSize: '16px', color: '#1f1f1f', margin: '0 0 24px', fontWeight: 600 }}>
          Our Promise: If your car isn&apos;t the cleanest you&apos;ve ever seen it, the detail is free—no questions asked.
        </p>
        <a
          href="#booking"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: '#EE432C',
            color: '#fff',
            padding: '14px 26px',
            borderRadius: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 14px 28px rgba(238,67,44,0.35)',
            border: '2px solid #000'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          Book Your Luxury Detail Now
        </a>
      </div>
    </section>
  );
}
