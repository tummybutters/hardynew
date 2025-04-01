import React from 'react';
import './3d-step-icon.css';

interface ThreeDStepIconProps {
  children: React.ReactNode;
  className?: string;
  status: 'active' | 'completed' | 'upcoming';
}

export function ThreeDStepIcon({
  children,
  className = '',
  status
}: ThreeDStepIconProps) {
  const statusClass = `step-${status}`;
  
  return (
    <div className={`step-3d-icon ${statusClass} ${className}`}>
      <div className="step-3d-icon-shadow"></div>
      <div className="step-3d-icon-face">
        {children}
      </div>
    </div>
  );
}

interface BackButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function BackButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: BackButtonProps) {
  return (
    <button
      className={`back-3d-button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <div className="back-3d-button-face">
        {children}
      </div>
      <div className="back-3d-button-shadow"></div>
    </button>
  );
}