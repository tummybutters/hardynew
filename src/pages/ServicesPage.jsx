import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Car, Shield, ChevronRight } from 'lucide-react';

const ASSETS = {
  interiorDetailImage: '/services/interior detailing_1755240294292.jpg',
  acuraImage: '/services/acura_1755241438565.jpg',
  porschePanameraImage: '/services/int_1755241550770.jpg',
  porsche718Image: '/services/718_1755241627534.jpg',
  petHairBeforeImage: '/services/hair before_1755241679282.jpg',
  petHairAfterImage: '/services/hair after_1755241684573.jpg',
  audiSQ5Image: '/services/blue_1755666323913.jpg',
  bmwX50i1Image: '/services/exttt_1755666334962.jpg',
  bmwX50i2Image: '/services/extt_1755666340879.jpg',
  porscheSpyder1Image: '/services/green_1755666353308.jpg',
  porscheSpyder2Image: '/services/green 2_1755666356311.jpg',
  teslaModelSImage: '/services/tes_1755666391761.jpg',
  headlightBeforeImage: '/services/before_1755668254553.jpg',
  headlightAfterImage: '/services/after_1755668250810.jpg',
  engineBayImage: '/services/engine_1755668325321.jpg',
  porscheSpyderAfter: '/services/porsche-spyder-after.jpg',
  porscheSpyderInterior: '/services/porsche-spyder-718-interior.jpg',
  bmwM40i: '/services/bmw-m40i.jpg',
  corvetteStingray: '/services/corvette-stingray.jpg'
};

const serviceCategories = [
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    description: 'Deep cleaning and conditioning for seats, carpets, dashboard, and all interior surfaces.',
    icon: Sparkles,
    features: [
      'Deep vacuum & steam cleaning',
      'Leather conditioning & protection',
      'Dashboard & trim restoration',
      'Pet hair removal specialist'
    ],
    color: { from: '#EE432C', to: '#FFB375' },
    portfolioJobs: [
      {
        title: 'Mercedes AMG',
        description: 'Interior Detail with Leather Conditioning',
        image: ASSETS.interiorDetailImage,
        services: ['Interior Detail', 'Leather Conditioning'],
        condition: 'Premium interior restoration'
      },
      {
        title: 'Camaro ZL1',
        description: 'Interior Detail - Leather Conditioner & Carpet Shampoo',
        image: ASSETS.porschePanameraImage,
        services: ['Interior Detail', 'Leather Conditioning', 'Carpet Shampoo'],
        condition: 'Luxury interior maintenance'
      },
      {
        title: 'Porsche Panamera',
        description: 'Interior Detail with Leather Conditioning and Carpet Shampooing',
        image: ASSETS.porscheSpyderAfter,
        services: ['Interior Detail', 'Leather Conditioning', 'Carpet Shampoo'],
        condition: 'Complete interior restoration'
      },
      {
        title: 'Pet Hair Removal - Before',
        description: 'Interior Detail with Pet Hair Removal',
        image: ASSETS.petHairBeforeImage,
        services: ['Pet Hair Removal', 'Before Photo'],
        condition: 'Heavy pet hair contamination'
      },
      {
        title: 'Pet Hair Removal - After',
        description: 'Interior Detail with Pet Hair Removal',
        image: ASSETS.petHairAfterImage,
        services: ['Interior Detail', 'Pet Hair Removal'],
        condition: 'Complete hair removal & restoration'
      },
      {
        title: 'Porsche Spyder 718',
        description: 'Interior Detail',
        image: ASSETS.porscheSpyderInterior,
        services: ['Interior Detail'],
        condition: 'Premium interior restoration'
      }
    ]
  },
  {
    id: 'exterior-detail',
    title: 'Exterior Detail',
    description: "Complete exterior restoration and protection for your vehicle's paint, wheels, and trim.",
    icon: Car,
    features: [
      'Premium hand wash & dry',
      'Clay bar paint decontamination',
      'High-quality wax protection',
      'Wheel & tire detailing'
    ],
    color: { from: '#EE432C', to: '#FFB375' },
    portfolioJobs: [
      {
        title: 'Acura A-Spec',
        description: 'Exterior Detail with Wash & Ceramic Spray Wax',
        image: ASSETS.acuraImage,
        services: ['Exterior Detail', 'Ceramic Spray Wax'],
        condition: 'Maintaining premium finish'
      },
      {
        title: 'Audi SQ5',
        description: 'Exterior Detail - Clay Bar, Polish and Ceramic Machine Wax',
        image: ASSETS.audiSQ5Image,
        services: ['Exterior Detail', 'Clay Bar', 'Polish', 'Ceramic Machine Wax'],
        condition: 'Complete paint restoration'
      },
      {
        title: 'Tesla Model S',
        description: 'Pre Wash Foam Bath Treatment',
        image: ASSETS.teslaModelSImage,
        services: ['Pre Wash', 'Foam Bath Treatment'],
        condition: 'Preparation for full detail'
      },
      {
        title: 'Scion XB - Before',
        description: 'Before and After - Headlight Restoration Scion XB',
        image: ASSETS.headlightBeforeImage,
        services: ['Exterior Detail', 'Headlight Restoration'],
        condition: 'Cloudy, oxidized headlights'
      },
      {
        title: 'Scion XB - After',
        description: 'Before and After - Headlight Restoration Scion XB',
        image: ASSETS.headlightAfterImage,
        services: ['Headlight Restoration', 'After Photo'],
        condition: 'Crystal clear headlights'
      },
      {
        title: 'Ford Mustang GT',
        description: 'Engine Bay Detailing - Ford Mustang GT',
        image: ASSETS.engineBayImage,
        services: ['Deep Clean', 'Engine Bay Detailing'],
        condition: 'Complete engine bay restoration'
      }
    ]
  },
  {
    id: 'premium-protection',
    title: 'Premium Protection',
    description: 'Advanced paint correction, ceramic coating, and specialty treatments for ultimate vehicle protection.',
    icon: Shield,
    features: [
      'Multi-stage paint correction',
      'Professional ceramic coating',
      'Swirl & scratch removal',
      'UV & chemical resistance',
      'Long-term protection warranty'
    ],
    color: { from: '#EE432C', to: '#FFB375' },
    portfolioJobs: [
      {
        title: 'Porsche Spyder 718 - Interior View',
        description: 'Paint Correction Polish & Ceramic Coat',
        image: ASSETS.porscheSpyder1Image,
        services: ['Paint Correction', 'Polish', 'Ceramic Coating'],
        condition: 'Complete paint restoration & protection'
      },
      {
        title: 'Porsche Spyder 718 - Exterior View',
        description: 'Paint Correction Polish & Ceramic Coat',
        image: ASSETS.porscheSpyder2Image,
        services: ['Paint Correction', 'Polish', 'Ceramic Coating'],
        condition: 'Complete paint restoration & protection'
      },
      {
        title: 'BMW M40i',
        description: 'Ceramic Coat and Paint Correction',
        image: ASSETS.bmwM40i,
        services: ['Paint Correction', 'Ceramic Coating'],
        condition: 'Complete paint restoration & protection'
      },
      {
        title: 'BMW X50i - Front View',
        description: 'Ceramic Coat BMW X50i',
        image: ASSETS.bmwX50i1Image,
        services: ['Ceramic Coating', 'Paint Protection'],
        condition: 'Premium ceramic application'
      },
      {
        title: 'Corvette Stingray',
        description: 'Ceramic Coat',
        image: ASSETS.corvetteStingray,
        services: ['Ceramic Coating', 'Paint Protection'],
        condition: 'Premium ceramic application'
      },
      {
        title: 'BMW X50i - Side Detail',
        description: 'Ceramic Coat BMW X50i',
        image: ASSETS.bmwX50i2Image,
        services: ['Ceramic Coating', 'Paint Protection'],
        condition: 'Premium ceramic application'
      }
    ]
  }
];

function ServiceTags({ services }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px', color: '#4b5563' }}>
      {services.map((service, idx) => {
        const isMain = idx === 0;
        return (
          <span
            key={service + idx}
            style={{
              padding: '6px 10px',
              borderRadius: '10px',
              background: isMain ? '#FFD7B5' : '#d1fae5',
              color: isMain ? '#7c2d12' : '#065f46',
              fontWeight: 600
            }}
          >
            {isMain ? service : `+${service}`}
          </span>
        );
      })}
    </div>
  );
}

export default function ServicesPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #F3F4E6 0%, #FFD7B5 100%)', padding: '70px 0 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '54px', fontWeight: 800, color: '#0f172a', marginBottom: '20px', fontFamily: '"Playfair Display", serif' }}>
            Premium Car Detailing Services
          </h1>
          <p style={{ fontSize: '20px', color: '#374151', maxWidth: '780px', margin: '0 auto' }}>
            Explore our complete range of mobile detailing services. Click any service below to see exactly what&apos;s included and discover the perfect package for your vehicle.
          </p>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '80px 0 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {serviceCategories.map((category) => {
            const gradient = `linear-gradient(90deg, ${category.color.from}, ${category.color.to})`;
            return (
              <div key={category.id} style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div style={{ background: gradient, color: '#fff', padding: '24px', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                      <category.icon size={28} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h2 style={{ fontSize: '30px', fontWeight: 800, margin: 0, fontFamily: '"Playfair Display", serif' }}>{category.title}</h2>
                      <p style={{ margin: '6px 0', fontSize: '17px', color: 'rgba(255,255,255,0.9)' }}>{category.description}</p>
                      <p style={{ margin: '0', fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>Base service shown • Add-ons marked with +$ cost extra</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    {category.features.map((feature, idx) => (
                      <div key={feature + idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                        <ChevronRight size={14} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '2px solid #000', borderTop: '0', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px', boxShadow: '8px 8px 0 #000', padding: '26px 26px 32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                    {(() => {
                      const jobs = category.portfolioJobs || [];
                      const grouped = [];
                      let i = 0;
                      while (i < jobs.length) {
                        const current = jobs[i];
                        const next = jobs[i + 1];
                        if (next && current.title.split(' - ')[0] === next.title.split(' - ')[0]) {
                          grouped.push({
                            type: 'group',
                            title: current.title.split(' - ')[0],
                            description: current.description,
                            services: current.services,
                            condition: current.condition,
                            images: [current.image, next.image]
                          });
                          i += 2;
                        } else {
                          grouped.push({ type: 'single', ...current });
                          i += 1;
                        }
                      }

                      return grouped.map((item, idx) => {
                        if (item.type === 'group') {
                          return (
                            <div key={idx} style={{ gridColumn: 'span 2', background: '#fff', border: '2px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                {item.images.map((img, jdx) => (
                                  <div key={jdx} style={{ aspectRatio: '4 / 3', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedImage(img)}>
                                    <img src={img} alt={`${item.title} view ${jdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding: '14px' }}>
                                <h3 style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#111827' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '14px' }}>{item.description}</p>
                                <ServiceTags services={item.services} />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={idx} style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedImage(item.image)}>
                              <img src={item.image} alt={`${item.title} - ${item.description}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                            </div>
                            <div style={{ padding: '14px' }}>
                              <h3 style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#111827' }}>{item.title}</h3>
                              <p style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '14px' }}>{item.description}</p>
                              <ServiceTags services={item.services} />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, #F3F4E6 0%, #FFD7B5 100%)', borderRadius: '14px', padding: '32px 28px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '30px', fontWeight: 800, color: '#111' }}>Ready to Transform Your Vehicle?</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#374151' }}>
              Choose from our professional detailing services and book your appointment today.
            </p>
            <Link to="/booking" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#EE432C',
                  color: '#fff',
                  border: '2px solid #0f172a',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #0f172a'
                }}
              >
                Book Your Service
              </button>
            </Link>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <img
              src={selectedImage}
              alt="Full size preview"
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                background: '#fff',
                borderRadius: '50%',
                padding: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 800, color: '#111' }}>✕</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
