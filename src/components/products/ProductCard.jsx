import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImage, parseProductTags } from '../../utils/productImages';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const inWishlist = product.id ? isInWishlist(product.id) : false;
  const { badge, discount_tag } = parseProductTags(product);

  const priceNum = Number(product.price || 0);
  const origPriceNum = Number(product.original_price || 0);
  const discount = origPriceNum > priceNum && origPriceNum > 0
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    addToCart(product, 1);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWish = (e) => {
    e.preventDefault();
    if (!product.id) return;
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    if (onQuickView) onQuickView(product);
  };

  const imageUrl = imgError
    ? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
    : getProductImage(product);

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.13)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>

        {/* Image area — square, no inner margin */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
          <motion.img
            src={imageUrl}
            alt={product.name || 'Product'}
            loading="lazy"
            onError={() => setImgError(true)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Top-Left Badge (SALE, NEW, etc.) */}
          {badge && (
            <div style={{
              position: 'absolute', top: '8px', left: '8px',
              background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', color: 'white',
              fontSize: '9px', fontWeight: 800, letterSpacing: '.4px',
              padding: '3px 8px', borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,.3)',
              zIndex: 2, maxWidth: '65%', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {badge}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#555', padding: '5px 12px', background: 'white', borderRadius: '6px', border: '1px solid #eee' }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            onClick={handleWish}
            whileHover={{ scale: 1.14 }} whileTap={{ scale: .92 }}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,.12)', zIndex: 2
            }}>
            <Heart size={13} fill={inWishlist ? '#E94560' : 'none'} color={inWishlist ? '#E94560' : '#666'} />
          </motion.button>

          {/* Quick View */}
          {onQuickView && (
            <motion.button
              onClick={handleQuickViewClick}
              whileHover={{ scale: 1.14 }} whileTap={{ scale: .92 }}
              title="Quick View"
              style={{
                position: 'absolute', top: '44px', right: '8px',
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,.12)', zIndex: 2
              }}>
              <Eye size={13} color="#475569" />
            </motion.button>
          )}

          {/* Add-to-cart button (bottom right of image) */}
          {product.stock !== 0 && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: .92 }}
              style={{
                position: 'absolute', bottom: '8px', right: '8px',
                width: '34px', height: '34px', borderRadius: '50%',
                background: added
                  ? 'linear-gradient(135deg, #30D158, #25B046)'
                  : 'linear-gradient(135deg, #1A1A2E, #0F3460)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', color: 'white',
                boxShadow: `0 4px 14px ${added ? 'rgba(48,209,88,.45)' : 'rgba(26,26,46,.35)'}`,
                transition: 'background .3s, box-shadow .3s', zIndex: 2
              }}>
              {added ? <span style={{ fontSize: '14px' }}>✓</span> : <ShoppingCart size={14} />}
            </motion.button>
          )}
        </div>

        {/* Info section — clean, minimal like Flipkart */}
        <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < 4 ? '#FFB800' : 'none'} color={i < 4 ? '#FFB800' : '#D1D5DB'} />
            ))}
            <span style={{ fontSize: '10px', color: '#888', marginLeft: '3px', fontWeight: 600 }}>(4.8)</span>
          </div>

          {/* Product Name */}
          <p style={{
            fontSize: '13px', fontWeight: 600, color: '#212121', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0
          }}>
            {product.name}
          </p>

          {/* Unit */}
          {product.unit && (
            <p style={{ fontSize: '11px', color: '#888', margin: 0, fontWeight: 400 }}>
              {product.unit}
            </p>
          )}

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#212121' }}>
              ₹{priceNum.toFixed(0)}
            </span>
            {origPriceNum > priceNum && (
              <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through', fontWeight: 400 }}>
                ₹{origPriceNum.toFixed(0)}
              </span>
            )}
            {(discount_tag || discount) && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: '#388E3C',
              }}>
                {discount_tag || `-${discount}% off`}
              </span>
            )}
          </div>

          {/* Low stock */}
          {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#E94560' }}>
              Only {product.stock} left!
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
