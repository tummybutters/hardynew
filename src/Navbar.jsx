import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
    primary: '#FF7F50',
    dark: '#0a0a0a',
    text: '#ffffff',
};

const Navbar = ({ onBookClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Services', href: '#services' },
        { name: 'Reviews', href: '#reviews' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.3s ease'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src="/hardys_logo.png"
                        alt="Hardy's Logo"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                    <span style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: 'white',
                        letterSpacing: '0.5px'
                    }}>
                        Hardy's Wash N' Wax
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                opacity: 0.9,
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = THEME.primary}
                            onMouseLeave={(e) => e.target.style.color = 'white'}
                        >
                            {link.name}
                        </a>
                    ))}
                    <button
                        onClick={onBookClick}
                        style={{
                            background: THEME.primary,
                            color: 'white',
                            border: 'none',
                            padding: '10px 24px',
                            borderRadius: '30px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <Phone size={16} />
                        Book Now
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" style={{ display: 'none' }}>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '80px',
                            left: 0,
                            right: 0,
                            background: '#0a0a0a',
                            padding: '20px',
                            zIndex: 99,
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '16px 0',
                                    fontSize: '1.1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                {link.name}
                            </a>
                        ))}
                        <button
                            onClick={() => { onBookClick(); setMobileMenuOpen(false); }}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                background: THEME.primary,
                                color: 'white',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem'
                            }}
                        >
                            Book Now
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </>
    );
};

export default Navbar;
