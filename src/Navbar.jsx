import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const primary = '#EE432C';
const lightOrange = '#FFE8D2';

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/booking', label: 'Book Now' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' }
];

const LOCATION_LINKS = [
  { to: '/', label: 'Sacramento, CA' },
  { to: '/orange-county', label: 'Orange County, CA' }
];

const Navbar = ({ onBookClick }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goBook = () => {
    setMobileOpen(false);
    if (pathname === '/' && onBookClick) {
      onBookClick();
    } else {
      navigate('/booking');
    }
  };

  const isActive = (to) => pathname === to;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(255, 232, 210, 0.9)' : lightOrange,
        boxShadow: isScrolled ? '0 12px 24px rgba(0,0,0,0.08)' : 'none',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px 20px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#111' }}>
            <img src="/hardys_logo.png" alt="Hardys Wash N' Wax" style={{ height: 44 }} />
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: '18px', letterSpacing: '0.3px' }}>
              Hardys Wash N&apos; Wax
            </span>
          </Link>

          {/* Desktop */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowLocations(true)}
              onMouseLeave={() => setShowLocations(false)}
            >
              <button className={`nav-button ${showLocations ? 'active' : ''}`} style={{ color: '#111' }}>
                Locations <ChevronDown size={14} style={{ marginLeft: 6 }} />
              </button>
              {showLocations && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    minWidth: '200px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 16px 28px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '10px',
                    zIndex: 20
                  }}
                >
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    Service Areas
                  </div>
                  {LOCATION_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      style={{
                        display: 'block',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        color: '#111',
                        textDecoration: 'none',
                        fontWeight: 600,
                        background: isActive(link.to) ? 'rgba(238, 67, 44, 0.08)' : 'transparent',
                        borderLeft: isActive(link.to) ? `3px solid ${primary}` : '3px solid transparent'
                      }}
                      onClick={() => setShowLocations(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                <button className={`nav-button ${isActive(link.to) ? 'active' : ''}`}>
                  {link.label}
                </button>
              </Link>
            ))}

            <button
              onClick={goBook}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: primary,
                color: '#fff',
                border: '2px solid #0f172a',
                borderRadius: '14px',
                padding: '8px 14px',
                fontWeight: 800,
                fontSize: '15px',
                boxShadow: '4px 4px 0 #0f172a',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Phone size={15} /> Book Now
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="nav-mobile-toggle" style={{ display: 'none' }}>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              style={{ background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', padding: '8px', display: 'grid', placeItems: 'center' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 90
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '78%',
              maxWidth: '320px',
              height: '100%',
              background: '#fff8ef',
              boxShadow: '-12px 0 24px rgba(0,0,0,0.15)',
              padding: '18px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 800, marginBottom: '10px', color: '#111', fontFamily: '"Playfair Display", serif' }}>Hardys Wash N&apos; Wax</div>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Locations</div>
            {LOCATION_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <button className={`mobile-nav-button ${isActive(link.to) ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left' }}>
                  {link.label}
                </button>
              </Link>
            ))}
            <div style={{ margin: '16px 0 10px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Navigate</div>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <button className={`mobile-nav-button ${isActive(link.to) ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left' }}>
                  {link.label}
                </button>
              </Link>
            ))}
            <div style={{ marginTop: '18px' }}>
              <button
                onClick={goBook}
                style={{
                  width: '100%',
                  background: primary,
                  color: '#fff',
                  border: '2px solid #0f172a',
                  borderRadius: '12px',
                  padding: '12px',
                  fontWeight: 800,
                  boxShadow: '4px 4px 0 #0f172a',
                  cursor: 'pointer'
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
