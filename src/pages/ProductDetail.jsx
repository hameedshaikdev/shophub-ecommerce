import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart, Minus, Plus, ShoppingCart, ArrowLeft,
  Truck, RefreshCw, Star, Package,
  ChevronRight, MessageCircle, Sparkles, ShieldCheck,
  Maximize2, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import { getProductImage, parseProductTags } from '../utils/productImages';

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();

  const [product,      setProduct]      = useState(null);
  const [related,      setRelated]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [quantity,     setQuantity]     = useState(1);
  const [added,        setAdded]        = useState(false);
  const [selImg,       setSelImg]       = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomScale,    setZoomScale]    = useState(1);

  const inWishlist = product ? isInWishlist(product.id) : false;
  const { cleanDesc, badge, discount_tag } = parseProductTags(product);

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
            .neq('id', id).limit(8);
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

  const priceNum = Number(product?.price || 0);
  const origPriceNum = Number(product?.original_price || 0);

  const discount = origPriceNum > priceNum && origPriceNum > 0
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
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
    <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)', paddingBottom:'88px' }}>

      {/* Glass Back Nav */}
      <div style={{ background:'rgba(255,255,255,0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderBottom:'1px solid rgba(255,255,255,0.9)', padding:'12px 16px', position:'sticky', top:0, zIndex:40, boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => navigate(-1)}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.8)', border:'1px solid rgba(226,232,240,0.8)', borderRadius:'9999px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:800, color:'#0F172A', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <ArrowLeft size={15} /> Back
          </button>
          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:'#64748B', fontWeight:600 }}>
            <span style={{ cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={11} />
            <span style={{ cursor:'pointer', textTransform:'capitalize' }} onClick={() => navigate('/')}>{product.category}</span>
            {product.sub_category && <>
              <ChevronRight size={11} />
              <span style={{ textTransform:'capitalize', color:'#0F172A', fontWeight:800 }}>{product.sub_category}</span>
            </>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1140px', margin:'0 auto', padding:'20px 16px' }}>

        {/* ── UNIFIED SINGLE GLASS CARD (Image + Details Together) ── */}
        <div className="product-main-card">

          {/* ── IMAGE SECTION ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <motion.div
              onClick={() => { setLightboxOpen(true); setZoomScale(1); }}
              style={{ borderRadius:'22px', overflow:'hidden', background:'rgba(241, 245, 249, 0.8)', aspectRatio:'1', position:'relative', boxShadow:'0 8px 24px rgba(0,0,0,0.06)', cursor:'pointer' }}
              whileHover={{ scale:1.01 }}>
              <img src={currentImg} alt={product.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'22px' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'; }}
              />

              {/* Main Badge Tag */}
              {badge && (
                <div style={{ position:'absolute', top:'12px', left:'12px', background:'linear-gradient(135deg, #1A1A2E, #0F3460)', color:'white', fontSize:'11px', fontWeight:900, padding:'4px 12px', borderRadius:'9999px', boxShadow:'0 4px 14px rgba(0,0,0,.3)', border:'1px solid rgba(255,255,255,.4)', zIndex:2 }}>
                  {badge}
                </div>
              )}

              {/* Tap to Fullscreen Photo Hint */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); setZoomScale(1); }}
                style={{ position:'absolute', bottom:'12px', left:'12px', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', color:'white', border:'none', borderRadius:'9999px', padding:'5px 11px', fontSize:'10px', fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:'4px' }}>
                <Maximize2 size={12} /> Full Photo
              </button>

              {/* Wishlist button */}
              <motion.button onClick={(e) => { e.stopPropagation(); handleWish(e); }}
                whileHover={{ scale:1.14, y:-1 }} whileTap={{ scale:.92 }}
                style={{ position:'absolute', top:'12px', right:'12px', width:'40px', height:'40px', borderRadius:'9999px', background:'rgba(255,255,255,.9)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,.1)', zIndex:2 }}>
                <Heart size={18} fill={inWishlist ? '#E94560' : 'none'} color={inWishlist ? '#E94560' : '#475569'} />
              </motion.button>
            </motion.div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="sh-scroll-hide" style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    style={{ width:'64px', height:'64px', borderRadius:'14px', overflow:'hidden', border:`2px solid ${selImg===i?'#E94560':'rgba(226,232,240,0.8)'}`, padding:0, cursor:'pointer', flexShrink:0, background:'#F8FAFC', transition:'all .25s ease', boxShadow: selImg===i ? '0 4px 14px rgba(233,69,96,0.3)' : 'none' }}>
                    <img src={img} alt={`view-${i}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── DETAILS SECTION (Flows directly inside the same card) ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Category Tag */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#E94560', background:'rgba(233,69,96,0.1)', padding:'3px 10px', borderRadius:'9999px', border:'1px solid rgba(233,69,96,0.2)' }}>
                <Sparkles size={11} style={{ verticalAlign:'middle', marginRight:'4px' }} />
                {product.category}
              </span>
              {product.sub_category && (
                <span style={{ fontSize:'11px', fontWeight:700, color:'#64748B', textTransform:'capitalize' }}>
                  • {product.sub_category}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontSize:'clamp(20px, 3.5vw, 30px)', fontWeight:900, color:'#0F172A', letterSpacing:'-0.5px', lineHeight:1.25 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              {[...Array(5)].map((_,i) => (
                <Star key={i} size={14} fill={i<4?'#FFB800':'none'} color={i<4?'#FFB800':'#D1D5DB'} />
              ))}
              <span style={{ fontSize:'12px', color:'#64748B', fontWeight:700, marginLeft:'4px' }}>
                4.8 / 5.0 Rating (Certified Quality)
              </span>
            </div>

            {/* Price block */}
            <div style={{ background:'rgba(241, 245, 249, 0.7)', borderRadius:'20px', padding:'16px 20px', border:'1px solid rgba(255,255,255,0.9)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'32px', fontWeight:900, color:'#0F172A', letterSpacing:'-1px' }}>
                  ₹{priceNum.toFixed(0)}
                </span>
                {origPriceNum > priceNum && (
                  <span style={{ fontSize:'16px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500 }}>
                    ₹{origPriceNum.toFixed(0)}
                  </span>
                )}
                {(discount_tag || discount) && (
                  <span style={{ fontSize:'12px', fontWeight:800, color:'#E94560', background:'rgba(233,69,96,0.12)', padding:'4px 12px', borderRadius:'9999px', border:'1px solid rgba(233,69,96,0.25)' }}>
                    {discount_tag || `-${discount}% OFF`}
                  </span>
                )}
                {discount && (
                  <span style={{ fontSize:'12px', fontWeight:800, color:'#30D158', background:'rgba(48,209,88,0.12)', padding:'3px 10px', borderRadius:'9999px' }}>
                    Save ₹{(origPriceNum - priceNum).toFixed(0)}
                  </span>
                )}
              </div>
              {product.unit && (
                <p style={{ fontSize:'12px', color:'#64748B', fontWeight:500, marginTop:'4px' }}>Unit: {product.unit}</p>
              )}

              {/* Stock status */}
              {product.stock !== null && (
                <div style={{ marginTop:'10px', display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'9999px', background: product.stock === 0 ? 'rgba(255,59,48,0.1)' : product.stock < 10 ? 'rgba(255,184,0,0.12)' : 'rgba(48,209,88,0.12)', border:'1px solid rgba(255,255,255,0.8)' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: product.stock === 0 ? '#FF3B30' : product.stock < 10 ? '#FFB800' : '#30D158' }} />
                  <span style={{ fontSize:'11px', fontWeight:800, color: product.stock === 0 ? '#FF3B30' : product.stock < 10 ? '#D97706' : '#166534' }}>
                    {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left in stock!` : `In Stock (${product.stock} units)`}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {cleanDesc && (
              <div>
                <p style={{ fontSize:'11px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>
                  Description & Specifications
                </p>
                <p style={{ fontSize:'13px', color:'#334155', lineHeight:1.6, fontWeight:500 }}>
                  {cleanDesc}
                </p>
              </div>
            )}

            {/* Quantity selector */}
            {product.stock !== 0 && (
              <div>
                <p style={{ fontSize:'11px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>
                  Select Quantity
                </p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'12px', background:'rgba(241,245,249,0.8)', padding:'5px 14px', borderRadius:'9999px', border:'1px solid rgba(226,232,240,0.8)' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                    style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Minus size={15} color="#0F172A" />
                  </button>
                  <span style={{ width:'30px', textAlign:'center', fontSize:'15px', fontWeight:900, color:'#0F172A' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => product.stock ? Math.min(product.stock, q+1) : q+1)}
                    style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Plus size={15} color="#0F172A" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {product.stock !== 0 ? (
                <>
                  <motion.button onClick={handleAddToCart}
                    whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:.98 }}
                    style={{ width:'100%', height:'48px', borderRadius:'9999px', background: added ? 'linear-gradient(135deg, #30D158, #25B046)' : 'linear-gradient(135deg,#1A1A2E,#0F3460)', color:'white', fontSize:'14px', fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'background .3s', boxShadow:'0 6px 22px rgba(26,26,46,.25)' }}>
                    <ShoppingCart size={17} />
                    {added ? '✓ Added to Cart!' : 'Add to Cart'}
                  </motion.button>
                  <motion.button onClick={handleBuyNow}
                    whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:.98 }}
                    style={{ width:'100%', height:'48px', borderRadius:'9999px', background:'linear-gradient(135deg, #E94560, #FF6B8B)', color:'white', fontSize:'14px', fontWeight:800, border:'none', cursor:'pointer', boxShadow:'0 6px 22px rgba(233,69,96,.3)' }}>
                    Buy Now Immediately
                  </motion.button>
                </>
              ) : (
                <div style={{ padding:'14px', borderRadius:'9999px', background:'#F1F5F9', textAlign:'center', fontSize:'14px', fontWeight:800, color:'#94A3B8' }}>
                  Currently Out of Stock
                </div>
              )}
            </div>

            {/* Trust Badges Strip */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'10px', paddingTop:'16px', borderTop:'1px solid rgba(226,232,240,0.8)' }}>
              {[
                { icon:Truck, text:'Free Shipping', color:'#3B82F6' },
                { icon:ShieldCheck, text:'Secure Checkout', color:'#30D158' },
                { icon:RefreshCw, text:'Easy Replacement', color:'#E94560' },
              ].map(({ icon:Icon, text, color }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <Icon size={15} color={color} />
                  <span style={{ fontSize:'11px', fontWeight:700, color:'#475569' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp Enquiry */}
            <div>
              <a href={`https://wa.me/917013942909?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name} (₹${product.price}) — ${window.location.href}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'10px', borderRadius:'9999px', background:'rgba(48,209,88,0.1)', border:'1px solid rgba(48,209,88,0.3)', textDecoration:'none', fontSize:'12px', fontWeight:800, color:'#16A34A', boxShadow:'0 4px 12px rgba(48,209,88,0.1)' }}>
                <MessageCircle size={15} /> Direct WhatsApp Inquiry
              </a>
            </div>

          </div>
        </div>

        {/* ── HORIZONTAL SCROLL CAROUSEL FOR RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ marginTop:'40px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
              <div>
                <p style={{ fontSize:'10px', fontWeight:800, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'2px' }}>
                  Handpicked For You
                </p>
                <h2 style={{ fontSize:'20px', fontWeight:900, color:'#0F172A', letterSpacing:'-0.5px' }}>
                  Similar Products
                </h2>
              </div>
              <button onClick={() => navigate('/')}
                style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(255,255,255,0.8)', border:'1px solid rgba(226,232,240,0.8)', borderRadius:'9999px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:800, color:'#0F172A', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                View All <ChevronRight size={14} />
              </button>
            </div>

            {/* Horizontal Scroll Strip */}
            <div className="related-products-row sh-scroll-hide">
              {related.map(p => {
                const pPrice = Number(p.price || 0);
                const pOrig = Number(p.original_price || 0);
                return (
                  <motion.div key={p.id}
                    whileHover={{ y:-4, scale:1.02 }}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="related-product-card">
                    <div className="related-card-img-wrap">
                      <img src={getProductImage(p)} alt={p.name} />
                    </div>
                    <div className="related-card-body">
                      <p className="related-card-title">{p.name}</p>
                      <div className="related-card-price-row">
                        <span className="related-card-price">₹{pPrice.toFixed(0)}</span>
                        {pOrig > pPrice && (
                          <span className="related-card-old-price">₹{pOrig.toFixed(0)}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── FULL SCREEN PHOTO LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.94)', backdropFilter:'blur(12px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'16px' }}
            onClick={() => setLightboxOpen(false)}>

            {/* Top Bar Controls */}
            <div style={{ position:'absolute', top:'16px', left:'20px', right:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10000 }} onClick={e=>e.stopPropagation()}>
              <span style={{ color:'white', fontSize:'14px', fontWeight:800, background:'rgba(255,255,255,0.15)', padding:'4px 12px', borderRadius:'9999px' }}>
                📷 {selImg + 1} / {allImages.length} Photo
              </span>
              <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                <button onClick={() => setZoomScale(s => Math.min(s + 0.5, 3))} title="Zoom In"
                  style={{ background:'rgba(255,255,255,0.18)', color:'white', border:'none', borderRadius:'50%', width:'38px', height:'38px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:800 }}>
                  +
                </button>
                <button onClick={() => setZoomScale(s => Math.max(s - 0.5, 1))} title="Zoom Out"
                  style={{ background:'rgba(255,255,255,0.18)', color:'white', border:'none', borderRadius:'50%', width:'38px', height:'38px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:800 }}>
                  -
                </button>
                <button onClick={() => setLightboxOpen(false)} title="Close"
                  style={{ background:'#EF4444', color:'white', border:'none', borderRadius:'50%', width:'38px', height:'38px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image with Zoom & Touch Pan */}
            <motion.div style={{ position:'relative', maxWidth:'92vw', maxHeight:'75vh', overflow:'hidden', cursor:'zoom-in', display:'flex', alignItems:'center', justifyContent:'center' }}
              onClick={e => e.stopPropagation()}>
              <motion.img src={currentImg} alt="Full screen view"
                animate={{ scale: zoomScale }}
                transition={{ type:'spring', damping:25, stiffness:200 }}
                style={{ maxWidth:'100%', maxHeight:'75vh', objectFit:'contain', borderRadius:'14px', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }} />
            </motion.div>

            {/* Bottom thumbnail strip inside Lightbox */}
            {allImages.length > 1 && (
              <div style={{ position:'absolute', bottom:'20px', display:'flex', gap:'8px', overflowX:'auto', maxWidth:'90vw', padding:'6px', background:'rgba(0,0,0,0.5)', borderRadius:'16px', backdropFilter:'blur(8px)' }}
                onClick={e => e.stopPropagation()} className="sh-scroll-hide">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => { setSelImg(i); setZoomScale(1); }}
                    style={{ width:'52px', height:'52px', borderRadius:'10px', overflow:'hidden', border: selImg === i ? '2.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.3)', cursor:'pointer', flexShrink:0, padding:0, background:'#1E293B', transition:'all .2s' }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
