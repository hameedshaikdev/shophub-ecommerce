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
        whileHover={{
          y: -6,
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1.5px rgba(37, 99, 235, 0.25)',
          borderColor: 'rgba(37, 99, 235, 0.3)'
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
          border: '1px solid #E2E8F0',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'border-color 0.3s ease',
        }}>

        {/* Image area — slightly larger aspect ratio with image zoom */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1.04', overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}>
          <motion.img
            src={imageUrl}
            alt={product.name || 'Product'}
            loading="lazy"
            onError={() => setImgError(true)}
            whileHover={{ scale: 1.10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Top-Left Badge (SALE, NEW, etc.) */}
          {badge && (
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', color: 'white',
              fontSize: '9px', fontWeight: 800, letterSpacing: '.4px',
              padding: '4px 9px', borderRadius: '6px',
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
            whileHover={{ scale: 1.16 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,.12)', zIndex: 2
            }}>
            <Heart size={14} fill={inWishlist ? '#E94560' : 'none'} color={inWishlist ? '#E94560' : '#666'} />
          </motion.button>

          {/* Quick View */}
          {onQuickView && (
            <motion.button
              onClick={handleQuickViewClick}
              whileHover={{ scale: 1.16 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              title="Quick View"
              style={{
                position: 'absolute', top: '48px', right: '10px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,.12)', zIndex: 2
              }}>
              <Eye size={14} color="#475569" />
            </motion.button>
          )}

          {/* Add-to-cart button (bottom right of image) */}
          {product.stock !== 0 && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                position: 'absolute', bottom: '10px', right: '10px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: added
                  ? 'linear-gradient(135deg, #30D158, #25B046)'
                  : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', color: 'white',
                boxShadow: `0 4px 14px ${added ? 'rgba(48,209,88,.45)' : 'rgba(37,99,235,.4)'}`,
                transition: 'background .3s, box-shadow .3s', zIndex: 2
              }}>
              {added ? <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span> : <ShoppingCart size={15} />}
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
