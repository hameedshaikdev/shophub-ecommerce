import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart, Minus, Plus, ShoppingCart, ArrowLeft,
  Truck, RefreshCw, Star, Package,
  ChevronRight, MessageCircle, Sparkles, ShieldCheck,
  Maximize2, X, Play, Tv, ExternalLink
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
  const [touchStartX,  setTouchStartX]  = useState(null);

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

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e, total) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setSelImg(i => Math.min(i + 1, total - 1)); // swipe left → next
    else        setSelImg(i => Math.max(i - 1, 0));           // swipe right → prev
    setTouchStartX(null);
  };
  const handlePrev = () => setSelImg(i => Math.max(i - 1, 0));
  const handleNext = (total) => setSelImg(i => Math.min(i + 1, total - 1));

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
    <div className="pd-page-wrapper">

      {/* Glass Back Nav */}
      <div className="pd-sticky-header">
        <div className="pd-sticky-header-inner">
          <button onClick={() => navigate(-1)} className="pd-back-pill">
            <ArrowLeft size={15} /> Back
          </button>
          {/* Breadcrumb */}
          <div className="pd-breadcrumbs">
            <span style={{ cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={11} />
            <span style={{ cursor:'pointer', textTransform:'capitalize' }} onClick={() => navigate('/')}>{product.category}</span>
            {product.sub_category && <>
              <ChevronRight size={11} />
              <span style={{ textTransform:'capitalize', color:'#111827', fontWeight:800 }}>{product.sub_category}</span>
            </>}
          </div>
        </div>
      </div>

      <div className="pd-content-container">

        {/* ── UNIFIED SINGLE PRODUCT CARD ── */}
        <div className="product-main-card">

          {/* ── IMAGE SECTION ── */}
          <div className="pd-gallery-section">
            {/* Main Image — swipeable */}
            <div
              className="pd-image-frame"
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, allImages.length)}
              onClick={() => { setLightboxOpen(true); setZoomScale(1); }}>

              <motion.img
                key={selImg}
                src={currentImg}
                alt={product.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'; }}
              />

              {/* Prev Arrow (desktop) */}
              {allImages.length > 1 && selImg > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="pd-arrow-nav"
                  style={{ left: '10px' }}>
                  ‹
                </button>
              )}

              {/* Next Arrow (desktop) */}
              {allImages.length > 1 && selImg < allImages.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(allImages.length); }}
                  className="pd-arrow-nav"
                  style={{ right: '10px' }}>
                  ›
                </button>
              )}

              {/* Dot indicators — Sleek Glass Capsule Pill */}
              {allImages.length > 1 && (
                <div style={{ position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'6px', zIndex:3, background:'rgba(15,23,42,0.65)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', padding:'5px 12px', borderRadius:'9999px', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
                  {allImages.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setSelImg(i); }}
                      style={{ width: selImg===i ? '16px' : '6px', height:'6px', borderRadius:'9999px', background: selImg===i ? '#FFFFFF' : 'rgba(255,255,255,0.45)', border:'none', padding:0, cursor:'pointer', transition:'all 300ms ease' }} />
                  ))}
                </div>
              )}

              {/* Full Photo Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); setZoomScale(1); }}
                className="pd-full-photo-tag">
                <Maximize2 size={12} /> Full Photo
              </button>

              {/* Wishlist */}
              <motion.button onClick={(e) => { e.stopPropagation(); handleWish(e); }}
                whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: .92 }}
                className="pd-wishlist-circle">
                <Heart size={18} fill={inWishlist ? '#E94560' : 'none'} color={inWishlist ? '#E94560' : '#4B5563'} />
              </motion.button>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="pd-thumbnails-strip sh-scroll-hide">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    className={`pd-thumb-item ${selImg === i ? 'active' : 'inactive'}`}>
                    <img src={img} alt={`view-${i}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── DETAILS SECTION ── */}
          <div className="pd-details-section">

            {/* Category Tag */}
            <div className="pd-category-pill">
              <Sparkles size={11} style={{ verticalAlign:'middle', marginRight:'4px' }} />
              {product.category}
              {product.sub_category && <span>• {product.sub_category}</span>}
            </div>

            {/* Name */}
            <h1 className="pd-product-title">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="pd-rating-block">
              {[...Array(5)].map((_,i) => (
                <Star key={i} size={14} fill={i<4?'#F59E0B':'none'} color={i<4?'#F59E0B':'#D1D5DB'} />
              ))}
              <span className="pd-rating-label">
                4.8 / 5.0 Rating • Certified Quality
              </span>
            </div>

            {/* Price block */}
            <div className="pd-price-card">
              <div className="pd-price-row-wrap">
                <span className="pd-current-price-num">
                  ₹{priceNum.toFixed(0)}
                </span>
                {origPriceNum > priceNum && (
                  <span className="pd-original-price-num">
                    ₹{origPriceNum.toFixed(0)}
                  </span>
                )}
                {(discount_tag || discount) && (
                  <span className="pd-discount-pill-tag">
                    {discount_tag || `-${discount}% OFF`}
                  </span>
                )}
                {discount && (
                  <span className="pd-savings-pill-tag">
                    Save ₹{(origPriceNum - priceNum).toFixed(0)}
                  </span>
                )}
              </div>
              {product.unit && (
                <p className="pd-unit-label-text">Unit: {product.unit}</p>
              )}

              {/* Stock status */}
              {product.stock !== null && (
                <div className="pd-stock-pill-box" style={{ background: product.stock === 0 ? 'rgba(239,68,68,0.08)' : product.stock < 10 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)' }}>
                  <div className="pd-live-pulse-dot" style={{ background: product.stock === 0 ? '#EF4444' : product.stock < 10 ? '#F59E0B' : '#10B981' }} />
                  <span style={{ fontSize:'11px', fontWeight:800, color: product.stock === 0 ? '#EF4444' : product.stock < 10 ? '#D97706' : '#059669' }}>
                    {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left in stock!` : `In Stock (${product.stock} units)`}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {cleanDesc && (
              <div className="pd-description-card">
                <p className="pd-section-subheading">
                  Description & Specifications
                </p>
                <p className="pd-description-text">
                  {cleanDesc}
                </p>
              </div>
            )}

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
                <div className="pd-description-card" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', marginTop: '16px' }}>
                  <p className="pd-section-subheading" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', margin: 0 }}>
                    <Tv size={16} color="#2563EB" /> Product Videos & Demos
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {videoList.map((v, idx) => {
                      const vUrl = typeof v === 'string' ? v : (v.url || v.link || '');
                      const vTitle = typeof v === 'object' && v.title ? v.title : `Product Demo ${idx + 1}`;
                      const embedUrl = getEmbedUrl(vUrl);

                      return (
                        <div key={idx} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', padding: '12px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                            <Play size={14} color="#EF4444" fill="#EF4444" /> {vTitle}
                          </p>
                          {embedUrl ? (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
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
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '12px', textDecoration: 'none', border: '1px solid #BFDBFE' }}>
                              <ExternalLink size={14} /> Watch Video Demo
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Quantity selector */}
            {product.stock !== 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <p className="pd-section-subheading">
                  Select Quantity
                </p>
                <div className="pd-quantity-container">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="pd-qty-circle">
                    <Minus size={13} color="#111827" />
                  </button>
                  <span className="pd-quantity-count">{quantity}</span>
                  <button onClick={() => setQuantity(q => product.stock ? Math.min(product.stock, q+1) : q+1)} className="pd-qty-circle">
                    <Plus size={13} color="#111827" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pd-action-buttons-wrap">
              {product.stock !== 0 ? (
                <>
                  <motion.button onClick={handleAddToCart}
                    whileHover={{ scale: 1.015, y: -1 }} whileTap={{ scale: .985 }}
                    className="pd-add-to-cart-button"
                    style={{ background: added ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #1E293B, #0F172A)' }}>
                    <ShoppingCart size={17} />
                    {added ? '✓ Added to Cart!' : 'Add to Cart'}
                  </motion.button>
                  <motion.button onClick={handleBuyNow}
                    whileHover={{ scale: 1.015, y: -1 }} whileTap={{ scale: .985 }}
                    className="pd-buy-now-button">
                    Buy Now Immediately
                  </motion.button>
                </>
              ) : (
                <div style={{ padding:'14px', borderRadius:'12px', background:'#F1F5F9', textAlign:'center', fontSize:'14px', fontWeight:800, color:'#9CA3AF' }}>
                  Currently Out of Stock
                </div>
              )}
            </div>

            {/* Trust Badges Strip */}
            <div className="pd-trust-features-grid">
              {[
                { icon:Truck, text:'Free Shipping', color:'#3B82F6' },
                { icon:ShieldCheck, text:'Secure Checkout', color:'#10B981' },
                { icon:RefreshCw, text:'Easy Replacement', color:'#EF4444' },
              ].map(({ icon:Icon, text, color }) => (
                <div key={text} className="pd-trust-feature-card">
                  <Icon size={16} color={color} />
                  <span className="pd-trust-feature-text">{text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp Enquiry */}
            <div>
              <a href={`https://wa.me/917013942909?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name} (₹${product.price}) — ${window.location.href}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="pd-whatsapp-cta-button">
                <MessageCircle size={16} /> Direct WhatsApp Inquiry
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
