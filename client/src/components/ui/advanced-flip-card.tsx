import React from 'react';
import './advanced-flip-card.css';

interface AdvancedFlipCardProps {
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  duration?: string;
  image?: string;
  description?: string[];
  onClickBook?: () => void;
  className?: string;
}

export function AdvancedFlipCard({
  title,
  subtitle,
  price,
  originalPrice,
  discount,
  duration,
  image,
  description = [],
  onClickBook,
  className = ''
}: AdvancedFlipCardProps) {
  return (
    <div className={`adv-card ${className}`}>
      <div className="adv-content">
        {/* Back of the card (shows first) */}
        <div className="adv-back">
          <div className="circle"></div>
          <div className="circle" id="bottom"></div>
          <div className="circle" id="right"></div>
          <div className="adv-back-content">
            <h2 className="text-lg font-bold">{title}</h2>
            {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
            <p className="price-tag">{price}</p>
            {originalPrice && <p className="original-price text-sm line-through opacity-50">{originalPrice}</p>}
            {duration && <p className="text-xs opacity-60">{duration}</p>}
            <button className="adv-button" onClick={onClickBook}>Book Now</button>
          </div>
        </div>
        
        {/* Front of the card (shows after hover/flip) */}
        <div className="adv-front">
          {image && <img src={image} className="img" alt={title} />}
          
          <div className="adv-front-content">
            <div>
              {discount && <div className="adv-badge">{discount}</div>}
            </div>
            
            <div className="adv-description">
              <div className="title">
                <p>{title}</p>
                <p>{price}</p>
              </div>
              <div className="card-footer">
                {description.map((item, index) => (
                  <p key={index} className="text-xs my-1">• {item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}