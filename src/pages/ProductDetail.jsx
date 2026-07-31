import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Minus, Plus, ShoppingCart, ArrowLeft,
  Shield, Truck, RefreshCw, Star, Package,
  ChevronRight, Play, MessageCircle, Share2, Sparkles, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import { getProductImage } from '../utils/productImages';

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added,    setAdded]    = useState(false);
  const [selImg,   setSelImg]   = useState(0);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        setProduct(data);
        if (data) {
          const { data: rel } = await supabase.from('products').select('*')
            .eq('category', data.category).eq('active', true)
            .neq('id', id).limit(4);
          setRelated(rel || []);
        }
      } catch(err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWish = () => {
    if (!product) return;
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const discount = product?.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  // All images: fallback to realistic Unsplash photo if missing
  const mainImage = getProductImage(product);
  const allImages = product ? [
    mainImage,
    ...(product.images || []),
  ] : [];

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ width:'40px', height:'40px', border:'3px solid rgba(226,232,240,0.8)', borderTop:'3px solid #E94560', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', padding:'40px' }}>
        <Package size={56} color="#CBD5E1" />
        <p style={{ fontSize:'18px', fontWeight:800, color:'#475569' }}>Product not found</p>
        <button onClick={() => navigate('/')}
          style={{ padding:'12px 28px', borderRadius:'9999px', background:'var(--primary-grad)', color:'white', fontWeight:800, border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(26,26,46,.25)' }}>
          Go Back
        </button>
      </div>
    );
  }

  const currentImg = allImages[selImg] || mainImage;

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)', paddingBottom:'80px' }}>

      {/* Glass Back Nav */}
      <div style={{ background:'rgba(255,255,255,0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderBottom:'1px solid rgba(255,255,255,0.9)', padding:'14px 20px', position:'sticky', top:0, zIndex:40, boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => navigate(-1)}
            style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.8)', border:'1px solid rgba(226,232,240,0.8)', borderRadius:'9999px', padding:'6px 16px', cursor:'pointer', fontSize:'13px', fontWeight:800, color:'#0F172A', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <ArrowLeft size={16} /> Back
          </button>
          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'#64748B', fontWeight:600 }}>
            <span style={{ cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={12} />
            <span style={{ cursor:'pointer', textTransform:'capitalize' }} onClick={() => navigate('/')}>{product.category}</span>
            {product.sub_category && <>
              <ChevronRight size={12} />
              <span style={{ textTransform:'capitalize', color:'#0F172A', fontWeight:800 }}>{product.sub_category}</span>
            </>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1140px', margin:'0 auto', padding:'32px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'40px', alignItems:'start' }}>

          {/* ── LEFT: Images (Anti-Gravity Glass Container) ── */}
          <div style={{ background:'rgba(255, 255, 255, 0.78)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:'32px', padding:'20px', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 12px 36px rgba(15,23,42,0.06)' }}>
            {/* Main image */}
            <motion.div
              style={{ borderRadius:'24px', overflow:'hidden', background:'rgba(241, 245, 249, 0.8)', aspectRatio:'1', position:'relative', marginBottom:'16px', boxShadow:'0 8px 24px rgba(0,0,0,0.06)' }}
              whileHover={{ scale:1.01 }}>
              <img src={currentImg} alt={product.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'24px' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'; }}
              />

              {/* Discount Badge */}
              {discount && (
                <div style={{ position:'absolute', top:'14px', left:'14px', background:'linear-gradient(135deg, #E94560, #FF6B8B)', color:'white', fontSize:'12px', fontWeight:900, padding:'5px 14px', borderRadius:'9999px', boxShadow:'0 4px 14px rgba(233,69,96,.4)', border:'1px solid rgba(255,255,255,.4)' }}>
                  -{discount}% OFF
                </div>
              )}

              {/* Wishlist button */}
              <motion.button onClick={handleWish}
                whileHover={{ scale:1.14, y:-1 }} whileTap={{ scale:.92 }}
                style={{ position:'absolute', top:'14px', right:'14px', width:'42px', height:'42px', borderRadius:'9999px', background:'rgba(255,255,255,.9)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,.1)' }}>
                <Heart size={18} fill={inWishlist ? '#E94560' : 'none'} color={inWishlist ? '#E94560' : '#475569'} />
              </motion.button>
            </motion.div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div style={{ display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'4px' }}>
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    style={{ width:'76px', height:'76px', borderRadius:'16px', overflow:'hidden', border:`2px solid ${selImg===i?'#E94560':'rgba(226,232,240,0.8)'}`, padding:0, cursor:'pointer', flexShrink:0, background:'#F8FAFC', transition:'all .25s ease', boxShadow: selImg===i ? '0 4px 14px rgba(233,69,96,0.3)' : 'none' }}>
                    <img src={img} alt={`view-${i}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details & Purchase Card ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            {/* Glass Info Surface */}
            <div style={{ background:'rgba(255, 255, 255, 0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderRadius:'32px', padding:'32px', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 16px 48px -8px rgba(15,23,42,0.08)' }}>

              {/* Tag & Subcategory */}
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#E94560', background:'rgba(233,69,96,0.1)', padding:'4px 12px', borderRadius:'9999px', border:'1px solid rgba(233,69,96,0.2)' }}>
                  <Sparkles size={11} style={{ verticalAlign:'middle', marginRight:'4px' }} />
                  {product.category}
                </span>
                {product.sub_category && (
                  <span style={{ fontSize:'12px', fontWeight:700, color:'#64748B', textTransform:'capitalize' }}>
                    • {product.sub_category}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 style={{ fontSize:'clamp(24px,4vw,34px)', fontWeight:900, color:'#0F172A', letterSpacing:'-0.6px', lineHeight:1.2, marginBottom:'10px' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'20px' }}>
                {[...Array(5)].map((_,i) => (
                  <Star key={i} size={15} fill={i<4?'#FFB800':'none'} color={i<4?'#FFB800':'#D1D5DB'} />
                ))}
                <span style={{ fontSize:'13px', color:'#64748B', fontWeight:700, marginLeft:'4px' }}>
                  4.8 / 5.0 Rating (Certified Quality)
                </span>
              </div>

              {/* Price card block */}
              <div style={{ background:'rgba(241, 245, 249, 0.7)', borderRadius:'24px', padding:'20px 24px', border:'1px solid rgba(255,255,255,0.9)', marginBottom:'24px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'6px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'36px', fontWeight:900, color:'#0F172A', letterSpacing:'-1px' }}>
                    ₹{product.price.toFixed(0)}
                  </span>
                  {product.original_price > product.price && (
                    <span style={{ fontSize:'18px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500 }}>
                      ₹{product.original_price.toFixed(0)}
                    </span>
                  )}
                  {discount && (
                    <span style={{ fontSize:'13px', fontWeight:800, color:'#30D158', background:'rgba(48,209,88,0.12)', padding:'4px 12px', borderRadius:'9999px' }}>
                      Save ₹{(product.original_price - product.price).toFixed(0)}
                    </span>
                  )}
                </div>
                {product.unit && (
                  <p style={{ fontSize:'13px', color:'#64748B', fontWeight:500 }}>Unit: {product.unit}</p>
                )}

                {/* Stock status */}
                {product.stock !== null && (
                  <div style={{ marginTop:'12px', display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 14px', borderRadius:'9999px', background: product.stock === 0 ? 'rgba(255,59,48,0.1)' : product.stock < 10 ? 'rgba(255,184,0,0.12)' : 'rgba(48,209,88,0.12)', border:'1px solid rgba(255,255,255,0.8)' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: product.stock === 0 ? '#FF3B30' : product.stock < 10 ? '#FFB800' : '#30D158' }} />
                    <span style={{ fontSize:'12px', fontWeight:800, color: product.stock === 0 ? '#FF3B30' : product.stock < 10 ? '#D97706' : '#166534' }}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left in stock!` : `In Stock (${product.stock} units)`}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom:'24px' }}>
                  <p style={{ fontSize:'12px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>
                    Description & Specifications
                  </p>
                  <p style={{ fontSize:'14px', color:'#334155', lineHeight:1.7, fontWeight:500 }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity selector */}
              {product.stock !== 0 && (
                <div style={{ marginBottom:'28px' }}>
                  <p style={{ fontSize:'12px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>
                    Select Quantity
                  </p>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'12px', background:'rgba(241,245,249,0.8)', padding:'6px 16px', borderRadius:'9999px', border:'1px solid rgba(226,232,240,0.8)' }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                      style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                      <Minus size={16} color="#0F172A" />
                    </button>
                    <span style={{ width:'36px', textAlign:'center', fontSize:'16px', fontWeight:900, color:'#0F172A' }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => product.stock ? Math.min(product.stock, q+1) : q+1)}
                      style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                      <Plus size={16} color="#0F172A" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {product.stock !== 0 ? (
                  <>
                    <motion.button onClick={handleAddToCart}
                      whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:.98 }}
                      style={{ width:'100%', height:'52px', borderRadius:'9999px', background: added ? 'linear-gradient(135deg, #30D158, #25B046)' : 'linear-gradient(135deg,#1A1A2E,#0F3460)', color:'white', fontSize:'15px', fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', transition:'background .3s', boxShadow:'0 8px 28px rgba(26,26,46,.3)' }}>
                      <ShoppingCart size={18} />
                      {added ? '✓ Added to Cart!' : 'Add to Cart'}
                    </motion.button>
                    <motion.button onClick={handleBuyNow}
                      whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:.98 }}
                      style={{ width:'100%', height:'52px', borderRadius:'9999px', background:'linear-gradient(135deg, #E94560, #FF6B8B)', color:'white', fontSize:'15px', fontWeight:800, border:'none', cursor:'pointer', boxShadow:'0 8px 28px rgba(233,69,96,.35)' }}>
                      Buy Now Immediately
                    </motion.button>
                  </>
                ) : (
                  <div style={{ padding:'16px', borderRadius:'9999px', background:'#F1F5F9', textAlign:'center', fontSize:'15px', fontWeight:800, color:'#94A3B8' }}>
                    Currently Out of Stock
                  </div>
                )}
              </div>

              {/* Trust Badges Strip */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid rgba(226,232,240,0.8)' }}>
                {[
                  { icon:Truck, text:'Free Express Shipping', color:'#3B82F6' },
                  { icon:ShieldCheck, text:'Secure Checkout', color:'#30D158' },
                  { icon:RefreshCw, text:'Easy Replacement', color:'#E94560' },
                ].map(({ icon:Icon, text, color }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <Icon size={16} color={color} />
                    <span style={{ fontSize:'12px', fontWeight:700, color:'#475569' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp Enquiry */}
              <div style={{ marginTop:'20px' }}>
                <a href={`https://wa.me/917013942909?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name} (₹${product.price}) — ${window.location.href}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', borderRadius:'9999px', background:'rgba(48,209,88,0.1)', border:'1px solid rgba(48,209,88,0.3)', textDecoration:'none', fontSize:'13px', fontWeight:800, color:'#16A34A', boxShadow:'0 4px 14px rgba(48,209,88,0.12)' }}>
                  <MessageCircle size={16} /> Direct WhatsApp Inquiry
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ marginTop:'60px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
              <div>
                <p style={{ fontSize:'11px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'4px' }}>
                  Handpicked For You
                </p>
                <h2 style={{ fontSize:'24px', fontWeight:900, color:'#0F172A', letterSpacing:'-0.5px' }}>
                  Related Collections
                </h2>
              </div>
              <button onClick={() => navigate('/')}
                style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(255,255,255,0.8)', border:'1px solid rgba(226,232,240,0.8)', borderRadius:'9999px', padding:'8px 18px', cursor:'pointer', fontSize:'13px', fontWeight:800, color:'#0F172A', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
                View All <ChevronRight size={15} />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'20px' }}>
              {related.map(p => (
                <motion.div key={p.id}
                  whileHover={{ y:-8, scale:1.02, boxShadow:'0 20px 48px -8px rgba(15,23,42,0.14)' }}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderRadius:'24px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.9)', cursor:'pointer', boxShadow:'0 6px 24px rgba(0,0,0,0.05)' }}>
                  <div style={{ aspectRatio:'1', background:'rgba(241,245,249,0.8)', overflow:'hidden', margin:'6px 6px 0 6px', borderRadius:'18px' }}>
                    <img src={getProductImage(p)} alt={p.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'18px' }} />
                  </div>
                  <div style={{ padding:'14px 16px' }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'#0F172A', marginBottom:'4px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.3 }}>
                      {p.name}
                    </p>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                      <span style={{ fontSize:'16px', fontWeight:900, color:'#0F172A' }}>
                        ₹{p.price}
                      </span>
                      {p.original_price > p.price && (
                        <span style={{ fontSize:'12px', color:'#94A3B8', textDecoration:'line-through' }}>
                          ₹{p.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
