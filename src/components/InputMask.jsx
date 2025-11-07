'use client';
import React from 'react';
import { FaXmark } from "react-icons/fa6";

export default function PhoneInputMask({
  value,
  onChange,
  name,
  placeholder = '+63 (___)-___-____',
  className = '',
  required = false,
}) {
  const formatPhone = (input) => {
    const digits = input.replace(/\D/g, '');

    let formatted = '+63 ';
    const localNumber = digits.startsWith('63')
      ? digits.slice(2)
      : digits.startsWith('0')
      ? digits.slice(1)
      : digits;

    if (localNumber.length > 0) {
      formatted += '(' + localNumber.substring(0, 3);
    }
    if (localNumber.length >= 3) {
      formatted += ')-' + localNumber.substring(3, 6);
    }
    if (localNumber.length >= 6) {
      formatted += '-' + localNumber.substring(6, 10);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatPhone(rawValue);
    onChange(formatted);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        maxLength={18}
        placeholder={placeholder}
        required={required}
        className={`border border-gray-300 rounded-lg px-3 py-2 w-full pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 roboto ${className}`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaXmark />
          {/* You can replace ✖ with an icon: <X size={16} /> */}
        </button>
      )}
    </div>
  );
}
