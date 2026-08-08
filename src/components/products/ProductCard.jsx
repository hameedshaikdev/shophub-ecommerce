import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImage, parseProductTags } from '../../utils/productImages';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, activeCategory } = useApp();
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const isTailoring = activeCategory === 'tailoring';
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
          boxShadow: isTailoring ? '0 12px 35px rgba(61, 41, 72, 0.13)' : '0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1.5px rgba(37, 99, 235, 0.25)',
          borderColor: isTailoring ? '#CDBDDA' : 'rgba(37, 99, 235, 0.3)'
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: isTailoring ? '0 4px 20px rgba(61, 41, 72, 0.06)' : '0 4px 16px rgba(15, 23, 42, 0.06)',
          border: isTailoring ? '1px solid #E5DCEB' : '1px solid #E2E8F0',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'all 0.3s ease',
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

          {/* Wishlist Button — Perfect Circle */}
          <motion.button
            onClick={handleWish}
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.88 }}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            style={{
              position: 'absolute', top: '8px', right: '8px', zIndex: 3,
              width: '34px', height: '34px', borderRadius: '50%',
              background: inWishlist ? (isTailoring ? '#FAF8FC' : '#FEF2F2') : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: inWishlist ? (isTailoring ? '1px solid #E5DCEB' : '1px solid #FECDD3') : '1px solid rgba(255, 255, 255, 0.9)',
              cursor: 'pointer', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)'
            }}>
            <Heart size={14} fill={inWishlist ? (isTailoring ? '#A95F76' : '#EF4444') : 'none'} color={inWishlist ? (isTailoring ? '#A95F76' : '#EF4444') : (isTailoring ? '#8B72A8' : '#475569')} />
          </motion.button>

          {/* Quick View Button — Perfect Circle */}
          {onQuickView && (
            <motion.button
              onClick={handleQuickViewClick}
              whileHover={{ scale: 1.14 }}
              whileTap={{ scale: 0.88 }}
              title="Quick View"
              style={{
                position: 'absolute', top: '58px', right: '8px', zIndex: 3,
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                cursor: 'pointer', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)'
              }}>
              <Eye size={14} color={isTailoring ? '#8B72A8' : '#475569'} />
            </motion.button>
          )}

          {/* Add to Cart Button — Perfect Circle */}
          {product.stock !== 0 && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.14 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              title="Add to Cart"
              style={{
                position: 'absolute', bottom: '8px', right: '8px', zIndex: 3,
                width: '34px', height: '34px', borderRadius: '50%',
                background: added
                  ? (isTailoring ? 'linear-gradient(135deg, #638B70, #4C6F58)' : 'linear-gradient(135deg, #10B981, #059669)')
                  : (isTailoring ? 'linear-gradient(135deg, #6B5188, #563E70)' : 'linear-gradient(135deg, #0F172A, #1E293B)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.8)', cursor: 'pointer', color: 'white',
                boxShadow: `0 4px 14px ${added ? 'rgba(99,139,112,.45)' : (isTailoring ? 'rgba(107,81,136,.35)' : 'rgba(15,23,42,.38)')}`,
                transition: 'background .25s ease, box-shadow .25s ease'
              }}>
              {added ? <span style={{ fontSize: '13px', fontWeight: 'bold' }}>✓</span> : <ShoppingCart size={14} />}
            </motion.button>
          )}
        </div>

        {/* Info section */}
        <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < 4 ? '#FFB800' : 'none'} color={i < 4 ? '#FFB800' : '#D1D5DB'} />
            ))}
            <span style={{ fontSize: '10px', color: isTailoring ? '#746B78' : '#888', marginLeft: '3px', fontWeight: 600 }}>(4.8)</span>
          </div>

          {/* Product Name */}
          <p style={{
            fontSize: '13px', fontWeight: 600, color: isTailoring ? '#29232D' : '#212121', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0
          }}>
            {product.name}
          </p>

          {/* Unit */}
          {product.unit && (
            <p style={{ fontSize: '11px', color: isTailoring ? '#746B78' : '#888', margin: 0, fontWeight: 400 }}>
              {product.unit}
            </p>
          )}

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: isTailoring ? '#29232D' : '#212121' }}>
              ₹{priceNum.toFixed(0)}
            </span>
            {origPriceNum > priceNum && (
              <span style={{ fontSize: '11px', color: isTailoring ? '#A39AA7' : '#aaa', textDecoration: 'line-through', fontWeight: 400 }}>
                ₹{origPriceNum.toFixed(0)}
              </span>
            )}
            {(discount_tag || discount) && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: isTailoring ? '#A95F76' : '#388E3C',
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
