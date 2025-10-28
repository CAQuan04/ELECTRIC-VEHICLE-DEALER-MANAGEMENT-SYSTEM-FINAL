import React from "react";

/** Luxe EV logo: rounded diamond + lightning bolt */
const Logo = ({ size = 40, className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={`drop-shadow-lg ${className}`}
    aria-label="EV Management"
  >
    <defs>
      <linearGradient id="evmGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#evmGrad)" />
    <rect
      x="10.5"
      y="10.5"
      width="43"
      height="43"
      rx="12"
      fill="none"
      stroke="rgba(255,255,255,.35)"
      strokeWidth="1.5"
    />
    <path
      d="M36 14 L26 34 h10 l-8 16 L44 30 h-10z"
      fill="white"
      opacity="0.94"
    />
  </svg>
);

export default Logo;
