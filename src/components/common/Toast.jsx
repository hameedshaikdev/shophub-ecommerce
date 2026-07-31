import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.visible) return null;

  const isCart = toast.type === 'cart';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          maxWidth: '380px',
          width: 'calc(100vw - 48px)',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '24px',
          padding: '14px 16px',
          boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.18), 0 0 24px rgba(233, 69, 96, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>

        {/* Thumbnail */}
        {toast.product && (
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'rgba(241, 245, 249, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.9)'
          }}>
            <img
              src={toast.product.image_url || 'https://placehold.co/100x100?text=Item'}
              alt={toast.product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isCart ? (
              <CheckCircle2 size={15} color="#30D158" strokeWidth={2.5} />
            ) : (
              <Heart size={15} fill="#E94560" color="#E94560" />
            )}
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
              {toast.title || (isCart ? 'Added to Cart' : 'Saved to Wishlist')}
            </span>
          </div>
          {toast.product && (
            <p style={{
              fontSize: '11px',
              color: '#64748B',
              fontWeight: 600,
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {toast.product.name}
            </p>
          )}
        </div>

        {/* Link / Action */}
        <Link
          to={isCart ? '/cart' : '/wishlist'}
          onClick={onClose}
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#FFFFFF',
            background: isCart ? 'linear-gradient(135deg, #1A1A2E, #0F3460)' : 'linear-gradient(135deg, #E94560, #FF6B8B)',
            padding: '6px 12px',
            borderRadius: '9999px',
            textDecoration: 'none',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
          }}>
          {isCart ? 'View Cart' : 'Wishlist'}
        </Link>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}>
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
