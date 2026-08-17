import React from 'react';

/**
 * Authentic, 100% self-contained vector SVG icons for UPI Payment Apps & Support.
 * Zero external network requests needed — guaranteed to work on all phones,
 * browsers, ad-blockers, and private DNS filters without broken image frames.
 */

// ── 1. GOOGLE PAY LOGO ──────────────────────────────────────────
export function GPayLogo({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: '4px', display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label="Google Pay"
    >
      <rect width="24" height="24" rx="5" fill="#FFFFFF" />
      <rect width="23" height="23" x="0.5" y="0.5" rx="4.5" stroke="#CBD5E1" strokeWidth="1" />
      {/* Multicolor Google G Emblem */}
      <path d="M12.24 10.285V12.18H16.89C16.68 13.26 15.69 15.12 12.24 15.12C9.255 15.12 6.825 12.645 6.825 9.66C6.825 6.675 9.255 4.2 12.24 4.2C13.935 4.2 15.075 4.92 15.72 5.535L17.22 4.08C16.26 3.18 14.4 2.4 12.24 2.4C8.235 2.4 5 5.64 5 9.66C5 13.68 8.235 16.92 12.24 16.92C16.425 16.92 19.2 13.98 19.2 9.855C19.2 9.3 19.14 8.85 19.05 8.4H12.24V10.285Z" fill="#4285F4" />
      <path d="M5.565 7.155L7.125 8.37C7.575 7.02 8.79 6 12.24 6C13.935 6 15.075 6.72 15.72 7.335L17.22 5.88C16.26 4.98 14.4 4.2 12.24 4.2C9.405 4.2 6.945 5.43 5.565 7.155Z" fill="#EA4335" />
      <path d="M12.24 15.12C15.12 15.12 16.68 13.56 16.89 12.6H12.24V10.71H19.05C19.14 11.16 19.2 11.61 19.2 12.165C19.2 16.29 16.425 19.23 12.24 19.23C9.555 19.23 7.215 17.895 5.76 15.915L7.425 14.625C8.25 15.825 9.945 16.92 12.24 16.92V15.12Z" fill="#34A853" />
      <path d="M5.565 7.155C5.205 7.905 5 8.76 5 9.66C5 10.56 5.205 11.415 5.565 12.165L7.425 10.725C7.26 10.395 7.17 10.035 7.17 9.66C7.17 9.285 7.26 8.925 7.425 8.595L5.565 7.155Z" fill="#FBBC05" />
    </svg>
  );
}

// ── 2. PHONEPE LOGO ─────────────────────────────────────────────
export function PhonePeLogo({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: '50%', display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label="PhonePe"
    >
      <circle cx="12" cy="12" r="12" fill="#5F259F" />
      {/* Signature PhonePe Devanagari Pe Emblem */}
      <path
        d="M15.8 8.4H13.2V6.8C13.2 6.36 12.84 6 12.4 6H10.6C10.16 6 9.8 6.36 9.8 6.8V17.2C9.8 17.64 10.16 18 10.6 18H12.4C12.84 18 13.2 17.64 13.2 17.2V13.8H14.8C16.8 13.8 18.2 12.4 18.2 10.4C18.2 8.4 16.8 8.4 15.8 8.4ZM14.6 11.8H13.2V10.2H14.6C15.2 10.2 15.8 10.5 15.8 11C15.8 11.5 15.2 11.8 14.6 11.8Z"
        fill="#FFFFFF"
      />
      <path
        d="M8.2 11.5L6.5 6.8C6.3 6.3 6.6 5.8 7.1 5.8H9.2V12.8L8.2 11.5Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </svg>
  );
}

// ── 3. PAYTM LOGO ───────────────────────────────────────────────
export function PaytmLogo({ size = 20, style = {} }) {
  const width = Math.round(size * 1.9);
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 38 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label="Paytm"
    >
      <rect width="38" height="20" rx="4" fill="#FFFFFF" />
      <rect width="37" height="19" x="0.5" y="0.5" rx="3.5" stroke="#CBD5E1" strokeWidth="1" />
      {/* Dark Navy Pay */}
      <path d="M4.5 4.5H7.2C8.8 4.5 9.8 5.4 9.8 6.8C9.8 8.2 8.8 9.1 7.2 9.1H6.1V14.5H4.5V4.5ZM7.1 7.7C7.9 7.7 8.3 7.3 8.3 6.8C8.3 6.3 7.9 5.9 7.1 5.9H6.1V7.7H7.1Z" fill="#002E6E" />
      <path d="M12.5 7.8C12.5 6.5 13.4 5.7 14.7 5.7C16 5.7 16.8 6.5 16.8 7.8V14.5H15.3V13.3C14.8 14.1 13.9 14.6 12.8 14.6C11.5 14.6 10.6 13.7 10.6 12.3C10.6 10.8 11.7 10 13.5 10H15.2V9.4C15.2 8.5 14.5 8 13.6 8C12.9 8 12.4 8.3 12.3 8.8L10.8 8.4C11.1 7.3 12.1 6.5 13.6 6.5C15.6 6.5 16.8 7.5 16.8 9.4V14.5H15.3V13.3C14.8 14.1 13.8 14.6 12.7 14.6C11.3 14.6 10.4 13.7 10.4 12.3Z" fill="#002E6E" />
      {/* Cyan tm */}
      <path d="M21 4.5H22.6V6.2H24V7.5H22.6V12.1C22.6 12.7 22.9 13 23.4 13C23.7 13 23.9 12.9 24.1 12.8L24.5 14.1C24.1 14.4 23.5 14.5 22.8 14.5C21.6 14.5 21 13.7 21 12.2V7.5H19.8V6.2H21V4.5Z" fill="#00BAF2" />
      <path d="M25.2 6.5H26.7V7.6C27.2 6.8 28.1 6.4 29.1 6.4C30.2 6.4 31 7 31.3 7.9C31.9 6.9 32.9 6.4 34 6.4C35.5 6.4 36.4 7.4 36.4 9.1V14.5H34.8V9.4C34.8 8.4 34.3 7.8 33.4 7.8C32.5 7.8 31.8 8.5 31.8 9.6V14.5H30.2V9.4C30.2 8.4 29.7 7.8 28.8 7.8C27.9 7.8 27.2 8.5 27.2 9.6V14.5H25.6V6.5H25.2Z" fill="#00BAF2" />
    </svg>
  );
}

// ── 4. CRED LOGO ───────────────────────────────────────────────
export function CredLogo({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: '5px', display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label="CRED"
    >
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path d="M7 6H17V18H7V6Z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="miter" fill="none" />
      <path d="M9.5 8.5H14.5V15.5H9.5V8.5Z" stroke="#FFFFFF" strokeWidth="1.4" strokeLinejoin="miter" fill="none" />
      <path d="M12.5 11.5L14.5 13.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ── 5. WHATSAPP ICON ────────────────────────────────────────────
export function WhatsAppIcon({ size = 20, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: '6px', display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label="WhatsApp"
    >
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        d="M12.04 4C7.6 4 4 7.6 4 12.04C4 13.56 4.43 15.02 5.23 16.29L4.35 19.5L7.68 18.63C8.91 19.38 10.33 19.78 11.8 19.78C16.24 19.78 19.84 16.18 19.84 11.74C19.84 7.3 16.48 4 12.04 4ZM12.04 18.24C10.74 18.24 9.47 17.89 8.37 17.23L8.13 17.09L6.15 17.61L6.68 15.68L6.52 15.43C5.79 14.26 5.4 12.91 5.4 11.53C5.4 7.87 8.38 4.89 12.04 4.89C15.7 4.89 18.68 7.87 18.68 11.53C18.68 15.19 15.7 18.24 12.04 18.24ZM15.68 13.62C15.48 13.52 14.5 13.04 14.32 12.97C14.14 12.9 14.01 12.87 13.88 13.07C13.75 13.27 13.37 13.72 13.25 13.85C13.13 13.98 13.01 14 12.81 13.9C12.61 13.8 11.97 13.59 11.21 12.91C10.62 12.39 10.22 11.74 10.1 11.54C9.98 11.34 10.09 11.23 10.19 11.13C10.28 11.04 10.39 10.9 10.49 10.78C10.59 10.66 10.63 10.57 10.7 10.44C10.77 10.31 10.73 10.2 10.68 10.1C10.63 10 10.25 9.07 10.09 8.69C9.93 8.32 9.77 8.37 9.65 8.36C9.54 8.36 9.41 8.36 9.28 8.36C9.15 8.36 8.94 8.41 8.77 8.6C8.6 8.79 8.12 9.24 8.12 10.16C8.12 11.08 8.79 11.97 8.89 12.1C8.99 12.23 10.21 14.1 12.07 14.9C12.51 15.09 12.85 15.21 13.12 15.3C13.56 15.44 13.96 15.42 14.28 15.37C14.64 15.31 15.39 14.91 15.54 14.48C15.69 14.05 15.69 13.69 15.64 13.61C15.6 13.52 15.88 13.72 15.68 13.62Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default {
  GPayLogo,
  PhonePeLogo,
  PaytmLogo,
  CredLogo,
  WhatsAppIcon
};
