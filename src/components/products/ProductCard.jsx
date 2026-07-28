import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    addToCart(product, 1);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWish = (e) => {
    e.preventDefault();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration:'none', display:'block' }}>
      <motion.div
        whileHover={{ y:-6, boxShadow:'0 20px 48px rgba(0,0,0,.12)' }}
        transition={{ duration:.3, ease:[.22,1,.36,1] }}
        style={{ background:'white', borderRadius:'20px', overflow:'hidden',
          boxShadow:'0 2px 12px rgba(0,0,0,.07)', border:'1px solid #F0F0F0',
          cursor:'pointer' }}>

        {/* Image area */}
        <div style={{ position:'relative', aspectRatio:'1', overflow:'hidden', background:'#F8F8F8' }}>
          <motion.img
            src={imgError ? 'https://placehold.co/300x300?text=No+Image' : (product.image_url || 'https://placehold.co/300x300?text=No+Image')}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            whileHover={{ scale:1.07 }}
            transition={{ duration:.5, ease:[.22,1,.36,1] }}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          />

          {/* Discount badge */}
          {discount && (
            <div style={{ position:'absolute', top:'12px', left:'12px',
              background:'#E94560', color:'white',
              fontSize:'10px', fontWeight:800, letterSpacing:'.3px',
              padding:'4px 10px', borderRadius:'99px',
              boxShadow:'0 2px 8px rgba(233,69,96,.4)' }}>
              -{discount}%
            </div>
          )}

          {/* Out of stock */}
          {product.stock === 0 && (
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.75)',
              backdropFilter:'blur(2px)', display:'flex', alignItems:'center',
              justifyContent:'center' }}>
              <span style={{ fontSize:'12px', fontWeight:800, color:'#333',
                padding:'6px 14px', background:'white', borderRadius:'99px',
                border:'1.5px solid #E0E0E0' }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <motion.button
            onClick={handleWish}
            whileHover={{ scale:1.15 }}
            whileTap={{ scale:.9 }}
            style={{ position:'absolute', top:'12px', right:'12px',
              width:'32px', height:'32px', borderRadius:'50%',
              background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'none', cursor:'pointer',
              boxShadow:'0 2px 8px rgba(0,0,0,.12)' }}>
            <Heart size={14}
              fill={inWishlist ? '#E94560' : 'none'}
              color={inWishlist ? '#E94560' : '#666'} />
          </motion.button>

          {/* Add to cart */}
          {product.stock !== 0 && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale:1.1 }}
              whileTap={{ scale:.9 }}
              style={{ position:'absolute', bottom:'12px', right:'12px',
                width:'36px', height:'36px', borderRadius:'50%',
                background: added ? '#30D158' : '#1A1A2E',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'none', cursor:'pointer', color:'white',
                boxShadow:`0 4px 14px ${added ? 'rgba(48,209,88,.4)' : 'rgba(26,26,46,.35)'}`,
                fontSize:'18px', fontWeight:900,
                transition:'background .3s, box-shadow .3s' }}>
              {added
                ? <span style={{ fontSize:'16px' }}>✓</span>
                : <ShoppingCart size={16} />}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div style={{ padding:'14px 16px 18px' }}>

          {/* Rating — static for now */}
          <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'8px' }}>
            {[...Array(5)].map((_,i) => (
              <Star key={i} size={10}
                fill={i < 4 ? '#FFB800' : 'none'}
                color={i < 4 ? '#FFB800' : '#D1D5DB'} />
            ))}
            <span style={{ fontSize:'11px', color:'#8E8E93', marginLeft:'2px' }}>(4.0)</span>
          </div>

          <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A', lineHeight:1.4,
            marginBottom:'4px',
            display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {product.name}
          </p>

          {product.unit && (
            <p style={{ fontSize:'11px', color:'#8E8E93', marginBottom:'10px' }}>
              {product.unit}
            </p>
          )}

          {/* Price row */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
              <span style={{ fontSize:'16px', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.3px' }}>
                ₹{product.price.toFixed(0)}
              </span>
              {product.original_price > product.price && (
                <span style={{ fontSize:'12px', color:'#ADADAD', textDecoration:'line-through' }}>
                  ₹{product.original_price.toFixed(0)}
                </span>
              )}
            </div>
            {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
              <span style={{ fontSize:'10px', fontWeight:700, color:'#E94560',
                background:'#FFF1F3', padding:'2px 8px', borderRadius:'99px' }}>
                {product.stock} left
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
