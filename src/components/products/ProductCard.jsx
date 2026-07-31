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

  const imageUrl = imgError ? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' : getProductImage(product);

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration:'none', display:'flex', flexDirection:'column', height:'100%' }}>
      <motion.div
        whileHover={{
          y: -12,
          scale: 1.01,
          boxShadow: '0 24px 50px -10px rgba(0, 0, 0, 0.12), 0 0 20px rgba(233, 69, 96, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.95)'
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between'
        }}>

        {/* Ambient top light glow */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(233, 69, 96, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Image area */}
        <div style={{ position:'relative', margin:'8px 8px 0 8px', borderRadius:'22px', aspectRatio:'1', overflow:'hidden', background:'rgba(245, 247, 250, 0.8)', flexShrink:0 }}>
          <motion.img
            src={imageUrl}
            alt={product.name || 'Product'}
            loading="lazy"
            onError={() => setImgError(true)}
            whileHover={{ scale:1.06 }}
            transition={{ duration:.5, ease:[.16,1,.3,1] }}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'22px' }}
          />

          {/* Top Left Badge Tag (SALE, NEW, BESTSELLER) */}
          {badge && (
            <div style={{ position:'absolute', top:'10px', left:'10px',
              background:'linear-gradient(135deg, #1A1A2E, #0F3460)', color:'white',
              fontSize:'10px', fontWeight:800, letterSpacing:'.4px',
              padding:'4px 10px', borderRadius:'9999px',
              boxShadow:'0 4px 14px rgba(0,0,0,.3)',
              border:'1px solid rgba(255,255,255,.4)', zIndex:2,
              maxWidth:'65%', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {badge}
            </div>
          )}

          {/* Out of stock */}
          {product.stock === 0 && (
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.8)',
              backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
              justifyContent:'center' }}>
              <span style={{ fontSize:'12px', fontWeight:800, color:'#333',
                padding:'6px 14px', background:'white', borderRadius:'9999px',
                border:'1px solid rgba(0,0,0,.08)', boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Action Buttons Overlay */}
          <div style={{ position:'absolute', top:'10px', right:'10px', display:'flex', flexDirection:'column', gap:'6px' }}>
            {/* Wishlist button */}
            <motion.button
              onClick={handleWish}
              whileHover={{ scale:1.14, y:-1 }}
              whileTap={{ scale:.92 }}
              style={{
                width:'34px', height:'34px', borderRadius:'9999px',
                background:'rgba(255,255,255,.88)', backdropFilter:'blur(12px)',
                WebkitBackdropFilter:'blur(12px)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(255,255,255,.9)', cursor:'pointer',
                boxShadow:'0 4px 14px rgba(0,0,0,.08)' }}>
              <Heart size={14}
                fill={inWishlist ? '#E94560' : 'none'}
                color={inWishlist ? '#E94560' : '#444'} />
            </motion.button>

            {/* Quick View Eye Button */}
            {onQuickView && (
              <motion.button
                onClick={handleQuickViewClick}
                whileHover={{ scale:1.14, y:-1 }}
                whileTap={{ scale:.92 }}
                title="Quick View"
                style={{
                  width:'34px', height:'34px', borderRadius:'9999px',
                  background:'rgba(255,255,255,.88)', backdropFilter:'blur(12px)',
                  WebkitBackdropFilter:'blur(12px)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:'1px solid rgba(255,255,255,.9)', cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(0,0,0,.08)' }}>
                <Eye size={14} color="#475569" />
              </motion.button>
            )}
          </div>

          {/* Add to cart */}
          {product.stock !== 0 && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale:1.1, y:-1 }}
              whileTap={{ scale:.92 }}
              style={{ position:'absolute', bottom:'10px', right:'10px',
                width:'38px', height:'38px', borderRadius:'9999px',
                background: added ? 'linear-gradient(135deg, #30D158, #25B046)' : 'linear-gradient(135deg, #1A1A2E, #0F3460)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(255,255,255,.3)', cursor:'pointer', color:'white',
                boxShadow:`0 6px 20px ${added ? 'rgba(48,209,88,.45)' : 'rgba(26,26,46,.35)'}`,
                fontSize:'18px', fontWeight:900,
                transition:'background .3s, box-shadow .3s' }}>
              {added
                ? <span style={{ fontSize:'16px' }}>✓</span>
                : <ShoppingCart size={16} />}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div style={{ padding:'14px 16px 16px', position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>

          <div>
            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'6px' }}>
              {[...Array(5)].map((_,i) => (
                <Star key={i} size={11}
                  fill={i < 4 ? '#FFB800' : 'none'}
                  color={i < 4 ? '#FFB800' : '#D1D5DB'} />
              ))}
              <span style={{ fontSize:'11px', color:'#8E8E93', marginLeft:'4px', fontWeight:600 }}>(4.8)</span>
            </div>

            <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A', lineHeight:1.35,
              marginBottom:'4px', letterSpacing:'-0.2px', minHeight:'36px',
              display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {product.name}
            </p>

            <p style={{ fontSize:'11px', color:'#8E8E93', marginBottom:'10px', fontWeight:500, minHeight:'16px' }}>
              {product.unit || '\u00A0'}
            </p>
          </div>

          {/* Price row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', minHeight:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', flexWrap:'wrap' }}>
              <span style={{ fontSize:'16px', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.4px' }}>
                ₹{priceNum.toFixed(0)}
              </span>
              {origPriceNum > priceNum && (
                <span style={{ fontSize:'11px', color:'#ADADAD', textDecoration:'line-through', fontWeight:500 }}>
                  ₹{origPriceNum.toFixed(0)}
                </span>
              )}
              {(discount_tag || discount) && (
                <span style={{ fontSize:'10px', fontWeight:800, color:'#E94560', background:'rgba(233,69,96,.1)', padding:'2px 7px', borderRadius:'6px', border:'1px solid rgba(233,69,96,.2)' }}>
                  {discount_tag || `-${discount}%`}
                </span>
              )}
            </div>
            {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
              <span style={{ fontSize:'9px', fontWeight:800, color:'#E94560',
                background:'rgba(233,69,96,.1)', padding:'2px 7px', borderRadius:'9999px',
                border:'1px solid rgba(233,69,96,.2)', flexShrink:0 }}>
                {product.stock} left
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
