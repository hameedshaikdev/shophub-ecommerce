import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Star, ShieldCheck, Truck, Sparkles, Plus, Minus, Play, Tv, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImage, parseProductTags } from '../../utils/productImages';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inWL = isInWishlist(product.id);
  const { cleanDesc, discount_tag } = parseProductTags(product);
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    setAdded(true);
    addToCart(product, qty);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWishlistToggle = () => {
    inWL ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const imageUrl = imgError ? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' : getProductImage(product);

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '820px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            borderRadius: '32px',
            boxShadow: '0 28px 64px -12px rgba(15, 23, 42, 0.28), 0 0 32px rgba(233, 69, 96, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              zIndex: 10,
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}>
            <X size={18} color="#0F172A" />
          </button>

          {/* Body content grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            overflowY: 'auto'
          }}>

            {/* Left Image Section */}
            <div style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(241, 245, 249, 0.5)',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                background: 'white'
              }}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {discount && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}>
                    -{discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Right Details Section */}
            <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>

              {/* Tag & Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#0F172A',
                  background: 'rgba(15, 23, 42, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '9999px'
                }}>
                  <Sparkles size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {product.category || 'Featured'}
                </span>
                {product.sub_category && (
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                    • {product.sub_category}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                lineHeight: 1.25,
                marginBottom: '8px'
              }}>
                {product.name}
              </h2>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < 4 ? '#FFB800' : 'none'} color={i < 4 ? '#FFB800' : '#D1D5DB'} />
                ))}
                <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '4px', fontWeight: 700 }}>4.8 / 5.0</span>
              </div>

              {/* Price Row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                  ₹{product.price.toFixed(0)}
                </span>
                {product.original_price > product.price && (
                  <span style={{ fontSize: '15px', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500 }}>
                    ₹{product.original_price.toFixed(0)}
                  </span>
                )}
                {(discount_tag || discount) && (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#388E3C' }}>
                    {discount_tag || `-${discount}% off`}
                  </span>
                )}
              </div>

              {/* Description preview */}
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                {cleanDesc || 'Engineered for exceptional performance and longevity. Designed with high-grade premium materials for superior craftsmanship.'}
              </p>

              {/* ── PRODUCT VIDEOS & DEMOS ── */}
              {(() => {
                const rawV = product.video_links || product.videos || [];
                let videoList = [];
                try {
                  if (Array.isArray(rawV)) videoList = [...rawV];
                  else if (typeof rawV === 'string' && rawV.trim()) videoList = JSON.parse(rawV);
                } catch (e) {
                  if (typeof rawV === 'string' && rawV.startsWith('http')) videoList = [{ title: 'Product Demo', url: rawV }];
                }

                if (product.video_url && !videoList.some(v => (v.url || v) === product.video_url)) {
                  videoList.push({ title: 'Product Overview', url: product.video_url });
                }

                if (videoList.length === 0) return null;

                const getEmbedUrl = (urlStr) => {
                  if (!urlStr || typeof urlStr !== 'string') return null;
                  const m = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3` : null;
                };

                return (
                  <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '12px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                      <Tv size={15} color="#2563EB" /> Product Videos & Demos
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {videoList.map((v, idx) => {
                        const vUrl = typeof v === 'string' ? v : (v.url || v.link || '');
                        const vTitle = typeof v === 'object' && v.title ? v.title : `Demo Video ${idx + 1}`;
                        const embedUrl = getEmbedUrl(vUrl);

                        return (
                          <div key={idx} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', padding: '8px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 6px 0' }}>
                              <Play size={12} color="#EF4444" fill="#EF4444" /> {vTitle}
                            </p>
                            {embedUrl ? (
                              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                                <iframe
                                  src={embedUrl}
                                  title={vTitle}
                                  style={{ width: '100%', height: '100%', border: 'none' }}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <a href={vUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '11px', textDecoration: 'none' }}>
                                <ExternalLink size={12} /> Watch Video Demo
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(241, 245, 249, 0.8)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Minus size={14} color="#0F172A" />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', minWidth: '18px', textAlign: 'center' }}>{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Plus size={14} color="#0F172A" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '9999px',
                    background: added ? 'linear-gradient(135deg, #30D158, #25B046)' : 'linear-gradient(135deg, #1A1A2E, #0F3460)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(26, 26, 46, 0.25)'
                  }}>
                  <ShoppingCart size={16} />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleWishlistToggle}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                  }}>
                  <Heart size={18} fill={inWL ? '#E94560' : 'none'} color={inWL ? '#E94560' : '#475569'} />
                </motion.button>
              </div>

              {/* Trust highlights */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  <ShieldCheck size={14} color="#30D158" /> 100% Genuine
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  <Truck size={14} color="#3B82F6" /> Express Shipping
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
