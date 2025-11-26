// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const THEME = {
    primary: '#FF7F50',
    dark: '#0a0a0a',
    text: '#ffffff',
    cardBg: 'rgba(10, 10, 10, 0.90)',
    border: 'rgba(255, 255, 255, 0.1)'
};

/**
 * Mobile add-on selection bar that appears above service dock
 */
export const AddOnBar = ({ activeService, activeAddOn, setActiveAddOn, setCameraView, queueInfoCard, showPrice = true }) => {
    if (!activeService?.addOns?.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
                position: 'relative',
                padding: '8px 10px',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                overflowY: 'hidden',
                zIndex: 54,
                background: 'linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.88) 100%)',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x pan-y',
                overscrollBehavior: 'contain',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style>{`::-webkit-scrollbar { display: none; height: 0; }`}</style>
            {activeService.addOns.map((addon, idx) => {
                const isSelected = activeAddOn?.name === addon.name;
                return (
                    <button
                        key={idx}
                        onClick={() => {
                            setActiveAddOn(isSelected ? null : addon);
                            if (addon.target) {
                                setCameraView(addon.target);
                                queueInfoCard(addon.target);
                            }
                        }}
                        style={{
                            background: isSelected ? 'rgba(255, 127, 80, 0.14)' : 'rgba(255,255,255,0.06)',
                            border: isSelected ? `1px solid ${THEME.primary}` : '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '999px',
                            padding: '10px 14px',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            whiteSpace: 'normal',
                            lineHeight: 1.1,
                            textAlign: 'center',
                            minWidth: '120px',
                            maxWidth: '160px',
                            boxShadow: isSelected ? '0 8px 18px rgba(255,127,80,0.18)' : '0 6px 12px rgba(0,0,0,0.18)',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease'
                        }}
                    >
                        {isSelected && <Check size={12} style={{ marginRight: 6, display: 'inline' }} />}
                        {addon.name}
                        {showPrice && typeof addon.price === 'number' && addon.price >= 0 ? ` (+$${addon.price})` : ''}
                    </button>
                );
            })}
        </motion.div>
    );
};
