import React from 'react';

/**
 * Logo Component - Tesla EV Dealer Management System
 * SVG logo được sử dụng xuyên suốt toàn bộ dự án
 */
const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Shadow Filter */}
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main Circle Background */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#logoGradient)"
        filter="url(#logoShadow)"
      />

      {/* Lightning Bolt (Electric Vehicle Symbol) */}
      <path
        d="M 120 40 L 80 100 L 100 100 L 75 160 L 125 90 L 105 90 Z"
        fill="white"
        opacity="0.95"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Circle Outline */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Optional: Small accent circles */}
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
    </svg>
  );
};

export default Logo;
