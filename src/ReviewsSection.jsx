import React from 'react';
import { Star, Quote } from 'lucide-react';

const THEME = {
    primary: '#FF7F50',
    dark: '#0a0a0a',
    text: '#ffffff',
    cardBg: '#111111',
};

const reviews = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Tesla Model Y Owner",
        rating: 5,
        text: "Absolutely incredible service. The ceramic coating makes my car look better than when I drove it off the lot. The team was professional, punctual, and meticulous.",
        date: "2 days ago"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "BMW M4 Owner",
        rating: 5,
        text: "I was skeptical about mobile detailing, but Hardy's blew me away. They removed pet hair I thought was permanent. The interior feels brand new again.",
        date: "1 week ago"
    },
    {
        id: 3,
        name: "David Rodriguez",
        role: "Porsche 911 Owner",
        rating: 5,
        text: "Best detailer in Sacramento, hands down. The paint correction removed all the swirl marks from previous bad washes. Highly recommended!",
        date: "3 weeks ago"
    }
];

const ReviewsSection = () => {
    return (
        <section id="reviews" style={{
            padding: '100px 20px',
            background: '#050505',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: THEME.primary,
                opacity: 0.03,
                filter: 'blur(120px)',
                borderRadius: '50%'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '3rem',
                        color: 'white',
                        marginBottom: '16px'
                    }}>
                        Client Stories
                    </h2>
                    <div style={{
                        width: '60px',
                        height: '3px',
                        background: THEME.primary,
                        margin: '0 auto 24px'
                    }} />
                    <p style={{
                        color: '#888',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Don't just take our word for it. See what our satisfied clients have to say about their transformation experience.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {reviews.map((review) => (
                        <div key={review.id} style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '32px',
                            transition: 'transform 0.3s ease, border-color 0.3s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = 'rgba(255, 127, 80, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill={THEME.primary} color={THEME.primary} />
                                    ))}
                                </div>
                                <Quote size={24} color="rgba(255,255,255,0.1)" />
                            </div>

                            <p style={{
                                color: '#ddd',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                marginBottom: '24px',
                                fontStyle: 'italic'
                            }}>
                                "{review.text}"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #333, #111)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: THEME.primary,
                                    fontWeight: 'bold'
                                }}>
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{review.name}</div>
                                    <div style={{ color: '#666', fontSize: '0.85rem' }}>{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
