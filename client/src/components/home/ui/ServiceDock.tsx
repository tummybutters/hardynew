// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';

const THEME = {
    primary: '#FF7F50',
    dark: '#0a0a0a',
    text: '#ffffff',
    cardBg: 'rgba(10, 10, 10, 0.90)',
    border: 'rgba(255, 255, 255, 0.1)'
};

/**
 * Mobile bottom service dock with horizontal scrolling
 */
export const ServiceDock = ({
    activeService,
    activeMenuItem,
    setActiveMenuItem,
    setActiveService,
    setCameraView,
    queueInfoCard,
    menuItems
}) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            background: 'rgba(10, 10, 10, 0.92)',
            borderTop: `1px solid ${THEME.border}`,
            zIndex: 80, // Above other hero UI, still below booking popup
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '10px 12px 14px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom))', // Account for iOS safe area
            boxSizing: 'border-box',
            boxShadow: '0 -6px 20px rgba(0,0,0,0.35)'
        }}>
            <div style={{
                color: '#b3b3b3',
                fontSize: '0.8rem',
                letterSpacing: '0.3px',
                paddingLeft: '4px'
            }}>
                Tap a service to view the 3D experience
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px',
                alignItems: 'stretch'
            }}>
            {menuItems?.map((service) => {
                const isActive = activeMenuItem === service.id;
                return (
                    <motion.div
                        key={service.id}
                        layout
                        onClick={() => {
                            setActiveMenuItem(service.id);
                            setActiveService(service);
                            setCameraView(service.target);
                            queueInfoCard(service.target);
                        }}
                        style={{
                            width: '100%',
                            minHeight: '52px',
                            background: isActive ? 'rgba(255, 127, 80, 0.12)' : 'rgba(255,255,255,0.04)',
                            border: isActive ? `1px solid ${THEME.primary}` : '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            boxShadow: isActive ? '0 8px 20px rgba(255,127,80,0.18)' : 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease'
                        }}
                    >
                        <div style={{
                            color: isActive ? THEME.primary : 'white',
                            fontWeight: isActive ? '700' : '500',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {service.title || service.name}
                        </div>
                        {isActive && (
                            <motion.div
                                layoutId="activeIndicator"
                                style={{
                                    position: 'absolute',
                                    bottom: '6px',
                                    left: '50%',
                                    x: '-50%',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: THEME.primary
                                }}
                            />
                        )}
                    </motion.div>
                );
            })}
            </div>
        </div>
    );
};
