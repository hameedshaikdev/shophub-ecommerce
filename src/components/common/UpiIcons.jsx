import React from 'react';

/**
 * Original uploaded image icons for UPI Payment Apps & WhatsApp Support.
 * Uses exact original photos (/icons/gpay.jpg, /icons/phonepe.png, /icons/paytm.png, /icons/cred.png, /icons/whatsapp.png)
 * across both mobile and desktop.
 */

// ── 1. GOOGLE PAY LOGO ──────────────────────────────────────────
export function GPayLogo({ size = 22, style = {} }) {
  return (
    <img
      src="/icons/gpay.jpg"
      alt="Google Pay"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '4px',
        ...style
      }}
    />
  );
}

// ── 2. PHONEPE LOGO ─────────────────────────────────────────────
export function PhonePeLogo({ size = 22, style = {} }) {
  return (
    <img
      src="/icons/phonepe.png"
      alt="PhonePe"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        ...style
      }}
    />
  );
}

// ── 3. PAYTM LOGO ───────────────────────────────────────────────
export function PaytmLogo({ size = 20, style = {} }) {
  const width = Math.round(size * 1.8);
  return (
    <img
      src="/icons/paytm.png"
      alt="Paytm"
      style={{
        width: `${width}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    />
  );
}

// ── 4. CRED LOGO ───────────────────────────────────────────────
export function CredLogo({ size = 22, style = {} }) {
  return (
    <img
      src="/icons/cred.png"
      alt="CRED"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '5px',
        ...style
      }}
    />
  );
}

// ── 5. WHATSAPP ICON ────────────────────────────────────────────
export function WhatsAppIcon({ size = 20, style = {} }) {
  return (
    <img
      src="/icons/whatsapp.png"
      alt="WhatsApp"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '6px',
        ...style
      }}
    />
  );
}

export default {
  GPayLogo,
  PhonePeLogo,
  PaytmLogo,
  CredLogo,
  WhatsAppIcon
};
