import React from 'react';
import './custom-buttons.css';
import { Button as ShadcnButton } from '@/components/ui/button';

interface InstagramButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function InstagramButton({ icon, onClick, className = '' }: InstagramButtonProps) {
  return (
    <button className={`btn-instagram ${className}`} onClick={onClick}>
      <div className="bg"></div>
      <div className="svg-container">
        {icon}
      </div>
    </button>
  );
}

interface RaisedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function RaisedButton({ children, onClick, className = '' }: RaisedButtonProps) {
  return (
    <button className={`btn-raised ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export function FlipCard({ frontContent, backContent, className = '' }: FlipCardProps) {
  return (
    <div className={`flip-card ${className}`}>
      <div className="flip-card-content">
        <div className="flip-card-front">
          <div className="front-content">
            {frontContent}
          </div>
        </div>
        <div className="flip-card-back">
          <div className="flip-card-back-content">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {children}
    </div>
  );
}

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GradientButton({ children, onClick, className = '' }: GradientButtonProps) {
  return (
    <button className={`gradient-btn ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

interface HoverableCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverableCard({ children, className = '' }: HoverableCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-102 hover:-translate-y-1 ${className}`}>
      {children}
      <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none transition-all duration-300 hover:border-primary"></div>
    </div>
  );
}

export { ShadcnButton as Button };