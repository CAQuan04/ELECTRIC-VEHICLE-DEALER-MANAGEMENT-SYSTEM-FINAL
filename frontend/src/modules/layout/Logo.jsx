import React from "react";

/** Luxe electric logo: rounded diamond + bolt negative space */
const Logo = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className="drop-shadow-lg"
    aria-label="EV Management"
  >
    <defs>
      <linearGradient id="evmGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" /> {/* sky-500 */}
        <stop offset="100%" stopColor="#0369a1" /> {/* sky-700 */}
      </linearGradient>
    </defs>
    {/* Diamond plate */}
    <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#evmGrad)" />
    {/* Subtle inner border for luxury look */}
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
    {/* Lightning bolt (negative look) */}
    <path
      d="M36 14 L26 34 h10 l-8 16 L44 30 h-10z"
      fill="white"
      opacity="0.94"
    />
  </svg>
);

export default Logo;
