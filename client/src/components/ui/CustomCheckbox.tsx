import React from 'react';
import './custom-checkbox.css';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function CustomCheckbox({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
}: CustomCheckboxProps) {
  return (
    <label className={`custom-checkbox ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}