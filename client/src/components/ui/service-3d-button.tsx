import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import './service-3d-button.css';

export interface Service3DButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  asChild?: boolean;
}

export const Service3DButton = forwardRef<HTMLButtonElement, Service3DButtonProps>(({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={`service-3d-button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <div className="service-3d-button-face">
        {children}
      </div>
      <div className="service-3d-button-shadow"></div>
    </Comp>
  );
});