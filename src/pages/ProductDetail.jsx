import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Minus, Plus, ShoppingCart, ArrowLeft,
  Shield, Truck, RefreshCw, Star, Package,
  ChevronRight, Play, MessageCircle, Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

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
        // Fetch related products
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

  // All images: main + additional
  const allImages = product ? [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.images || []),
  ] : [];

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center',
        justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid #E2E8F0',
          borderTop:'3px solid #1A1A2E', borderRadius:'50%',
          animation:'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'16px', padding:'40px' }}>
        <Package size={48} color="#E2E8F0" />
        <p style={{ fontSize:'18px', fontWeight:700, color:'#555' }}>Product not found</p>
        <button onClick={() => navigate('/')}
          style={{ padding:'10px 24px', borderRadius:'12px',
            background:'#1A1A2E', color:'white', fontWeight:700,
            border:'none', cursor:'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const currentImg = allImages[selImg] || null;

  return (
    <div style={{ minHeight:'100vh', background:'#FAFAFA', paddingBottom:'80px' }}>

      {/* Back nav */}
      <div style={{ background:'white', borderBottom:'1px solid #F0F0F0',
        padding:'12px 16px', position:'sticky', top:0, zIndex:40 }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <button onClick={() => navigate(-1)}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'none',
              border:'none', cursor:'pointer', fontSize:'14px', fontWeight:600,
              color:'#555', padding:0 }}>
            <ArrowLeft size={18} /> Back
          </button>
          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:'4px',
            marginTop:'4px', fontSize:'11px', color:'#8E8E93' }}>
            <span style={{ cursor:'pointer' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={11} />
            <span style={{ cursor:'pointer', textTransform:'capitalize' }}
              onClick={() => navigate('/')}>
              {product.category}
            </span>
            {product.sub_category && <>
              <ChevronRight size={11} />
              <span style={{ textTransform:'capitalize' }}>{product.sub_category}</span>
            </>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
          gap:'32px', alignItems:'start' }}>

          {/* ── LEFT: Images ── */}
          <div>
            {/* Main image */}
            <motion.div
              style={{ borderRadius:'20px', overflow:'hidden', background:'#F8F9FA',
                aspectRatio:'1', position:'relative', marginBottom:'12px' }}
              whileHover={{ scale:1.01 }}>
              {currentImg ? (
                <img src={currentImg} alt={product.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onError={e => { e.target.style.display='none'; }}
                />
              ) : (
                <div style={{ width:'100%', height:'100%', display:'flex',
                  flexDirection:'column', alignItems:'center', justifyContent:'center',
                  gap:'12px', background:'linear-gradient(135deg,#F4F6F8,#EBEDF0)' }}>
                  <Package size={56} strokeWidth={1} color="#C8CDD5" />
                  <p style={{ fontSize:'14px', color:'#C8CDD5', fontWeight:600 }}>
                    No Image Available
                  </p>
                </div>
              )}

              {/* Badges */}
              {discount && (
                <div style={{ position:'absolute', top:'14px', left:'14px',
                  background:'#EF4444', color:'white', fontSize:'12px',
                  fontWeight:800, padding:'4px 12px', borderRadius:'8px',
                  boxShadow:'0 2px 8px rgba(239,68,68,.4)' }}>
                  -{discount}% OFF
                </div>
              )}

              {/* Wishlist */}
              <motion.button onClick={handleWish}
                whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }}
                style={{ position:'absolute', top:'14px', right:'14px',
                  width:'40px', height:'40px', borderRadius:'50%',
                  background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)',
                  border:'none', cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center',
                  boxShadow:'0 2px 12px rgba(0,0,0,.12)' }}>
                <Heart size={18}
                  fill={inWishlist ? '#EF4444' : 'none'}
                  color={inWishlist ? '#EF4444' : '#555'} />
              </motion.button>
            </motion.div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div style={{ display:'flex', gap:'8px', overflowX:'auto' }}>
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    style={{ width:'72px', height:'72px', borderRadius:'12px',
                      overflow:'hidden', border:`2px solid ${selImg===i?'#1A1A2E':'#E2E8F0'}`,
                      padding:0, cursor:'pointer', flexShrink:0, background:'#F8F9FA',
                      transition:'border-color .2s' }}>
                    <img src={img} alt={`view-${i}`}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Video links */}
            {product.video_links?.length > 0 && (
              <div style={{ marginTop:'16px' }}>
                <p style={{ fontSize:'12px', fontWeight:700, color:'#8E8E93',
                  textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'8px' }}>
                  Tutorial Videos
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {product.video_links.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:'10px',
                        padding:'10px 14px', borderRadius:'12px', background:'#FEF2F2',
                        border:'1px solid #FECACA', textDecoration:'none', transition:'background .2s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#FEE2E2'}
                      onMouseLeave={e => e.currentTarget.style.background='#FEF2F2'}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'8px',
                        background:'#FF0000', display:'flex', alignItems:'center',
                        justifyContent:'center', flexShrink:0 }}>
                        <Play size={14} fill="white" color="white" />
                      </div>
                      <span style={{ fontSize:'13px', fontWeight:700, color:'#DC2626' }}>
                        {v.title || 'Watch Tutorial'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Category breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'12px', fontWeight:600, color:'#8E8E93',
                textTransform:'capitalize', background:'#F4F4F8',
                padding:'3px 10px', borderRadius:'6px' }}>
                {product.category}
              </span>
              {product.sub_category && (
                <span style={{ fontSize:'12px', fontWeight:600, color:'#8E8E93',
                  textTransform:'capitalize', background:'#F4F4F8',
                  padding:'3px 10px', borderRadius:'6px' }}>
                  {product.sub_category}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:900, color:'#0A0A0A',
              letterSpacing:'-0.5px', lineHeight:1.2, margin:0 }}>
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              {[...Array(5)].map((_,i) => (
                <Star key={i} size={14} fill={i<4?'#FFB800':'none'}
                  color={i<4?'#FFB800':'#E0E0E0'} />
              ))}
              <span style={{ fontSize:'12px', color:'#8E8E93', fontWeight:600 }}>
                (4.0)
              </span>
            </div>

            {/* Price block */}
            <div style={{ background:'white', borderRadius:'16px', padding:'16px 18px',
              border:'1px solid #F0F0F0', boxShadow:'0 1px 6px rgba(0,0,0,.04)' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'10px',
                marginBottom:'6px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'32px', fontWeight:900, color:'#0A0A0A',
                  letterSpacing:'-1px' }}>
                  ₹{product.price.toFixed(0)}
                </span>
                {product.original_price > product.price && (
                  <span style={{ fontSize:'18px', color:'#C0C0C0',
                    textDecoration:'line-through', fontWeight:500 }}>
                    ₹{product.original_price.toFixed(0)}
                  </span>
                )}
                {discount && (
                  <span style={{ fontSize:'14px', fontWeight:800, color:'#16A34A',
                    background:'#F0FDF4', padding:'3px 10px', borderRadius:'8px' }}>
                    Save ₹{(product.original_price - product.price).toFixed(0)}
                  </span>
                )}
              </div>
              {product.unit && (
                <p style={{ fontSize:'13px', color:'#8E8E93' }}>{product.unit}</p>
              )}

              {/* Stock status */}
              {product.stock !== null && (
                <div style={{ marginTop:'8px', display:'inline-flex', alignItems:'center',
                  gap:'6px', padding:'4px 10px', borderRadius:'8px',
                  background: product.stock === 0 ? '#FEF2F2'
                    : product.stock < 10 ? '#FFFBEB' : '#F0FDF4' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                    background: product.stock === 0 ? '#EF4444'
                      : product.stock < 10 ? '#F59E0B' : '#16A34A' }} />
                  <span style={{ fontSize:'12px', fontWeight:700,
                    color: product.stock === 0 ? '#EF4444'
                      : product.stock < 10 ? '#F59E0B' : '#16A34A' }}>
                    {product.stock === 0 ? 'Out of Stock'
                      : product.stock < 10 ? `Only ${product.stock} left`
                      : `In Stock (${product.stock} available)`}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p style={{ fontSize:'13px', fontWeight:700, color:'#555',
                  textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'8px' }}>
                  About this product
                </p>
                <p style={{ fontSize:'14px', color:'#444', lineHeight:1.75 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity selector */}
            {product.stock !== 0 && (
              <div>
                <p style={{ fontSize:'13px', fontWeight:700, color:'#555',
                  textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'10px' }}>
                  Quantity
                </p>
                <div style={{ display:'inline-flex', alignItems:'center',
                  border:'1.5px solid #E2E8F0', borderRadius:'12px', overflow:'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                    style={{ width:'44px', height:'44px', display:'flex', alignItems:'center',
                      justifyContent:'center', background:'#F8FAFC', border:'none',
                      cursor:'pointer', fontSize:'18px', fontWeight:700, color:'#555',
                      transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F0F0F0'}
                    onMouseLeave={e => e.currentTarget.style.background='#F8FAFC'}>
                    <Minus size={16} />
                  </button>
                  <span style={{ width:'52px', textAlign:'center', fontSize:'16px',
                    fontWeight:800, color:'#0A0A0A', borderLeft:'1px solid #E2E8F0',
                    borderRight:'1px solid #E2E8F0', padding:'10px 0' }}>
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(q => product.stock ? Math.min(product.stock, q+1) : q+1)}
                    style={{ width:'44px', height:'44px', display:'flex', alignItems:'center',
                      justifyContent:'center', background:'#F8FAFC', border:'none',
                      cursor:'pointer', fontSize:'18px', fontWeight:700, color:'#555',
                      transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F0F0F0'}
                    onMouseLeave={e => e.currentTarget.style.background='#F8FAFC'}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {product.stock !== 0 ? (
                <>
                  <motion.button onClick={handleAddToCart}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
                    style={{ width:'100%', padding:'15px', borderRadius:'14px',
                      background: added ? '#16A34A' : 'linear-gradient(135deg,#1A1A2E,#0F3460)',
                      color:'white', fontSize:'15px', fontWeight:800, border:'none',
                      cursor:'pointer', display:'flex', alignItems:'center',
                      justifyContent:'center', gap:'8px', transition:'background .3s',
                      boxShadow:'0 4px 20px rgba(26,26,46,.3)' }}>
                    <ShoppingCart size={18} />
                    {added ? '✓ Added to Cart!' : 'Add to Cart'}
                  </motion.button>
                  <motion.button onClick={handleBuyNow}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
                    style={{ width:'100%', padding:'15px', borderRadius:'14px',
                      background:'linear-gradient(135deg,#E94560,#C73652)',
                      color:'white', fontSize:'15px', fontWeight:800, border:'none',
                      cursor:'pointer', boxShadow:'0 4px 20px rgba(233,69,96,.3)' }}>
                    Buy Now
                  </motion.button>
                </>
              ) : (
                <div style={{ padding:'15px', borderRadius:'14px', background:'#F4F4F8',
                  textAlign:'center', fontSize:'15px', fontWeight:700, color:'#8E8E93' }}>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ background:'white', borderRadius:'14px', padding:'14px 16px',
              border:'1px solid #F0F0F0', display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { icon:Truck,      text:'Free Delivery on all orders',    color:'#2563EB' },
                { icon:Shield,     text:'Secure UPI Payment',             color:'#16A34A' },
                { icon:RefreshCw,  text:'7-day Easy Returns',             color:'#7C3AED' },
              ].map(({ icon:Icon, text, color }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'8px',
                    background:`${color}18`, display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0 }}>
                    <Icon size={15} strokeWidth={2} color={color} />
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#444' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Share + WhatsApp enquiry */}
            <div style={{ display:'flex', gap:'10px' }}>
              <a href={`https://wa.me/917013942909?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name} (₹${product.price}) — ${window.location.href}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                  gap:'8px', padding:'11px', borderRadius:'12px', background:'#F0FDF4',
                  border:'1px solid #BBF7D0', textDecoration:'none',
                  fontSize:'13px', fontWeight:700, color:'#16A34A' }}>
                <MessageCircle size={15} /> Ask on WhatsApp
              </a>
              <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title:product.name, url:window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }
                }}
                style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#F4F4F8',
                  border:'1px solid #E2E8F0', cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Share2 size={16} color="#555" />
              </button>
            </div>

          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ marginTop:'48px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              marginBottom:'20px' }}>
              <div>
                <p style={{ fontSize:'11px', fontWeight:700, color:'#8E8E93',
                  textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'4px' }}>
                  You May Also Like
                </p>
                <h2 style={{ fontSize:'22px', fontWeight:900, color:'#0A0A0A',
                  letterSpacing:'-0.5px' }}>
                  Related Products
                </h2>
              </div>
              <button onClick={() => navigate('/')}
                style={{ display:'flex', alignItems:'center', gap:'4px',
                  background:'none', border:'none', cursor:'pointer',
                  fontSize:'13px', fontWeight:700, color:'#555' }}>
                View All <ChevronRight size={15} />
              </button>
            </div>
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
              gap:'16px' }}>
              {related.map(p => (
                <motion.div key={p.id}
                  whileHover={{ y:-4, boxShadow:'0 12px 32px rgba(0,0,0,.10)' }}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ background:'white', borderRadius:'16px', overflow:'hidden',
                    border:'1px solid #F0F0F0', cursor:'pointer',
                    boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
                  <div style={{ aspectRatio:'1', background:'#F8F9FA', overflow:'hidden' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover',
                          transition:'transform .4s' }}
                        onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform='scale(1)'}
                      />
                    ) : (
                      <div style={{ width:'100%', height:'100%', display:'flex',
                        alignItems:'center', justifyContent:'center',
                        background:'linear-gradient(135deg,#F4F6F8,#EBEDF0)' }}>
                        <Package size={32} strokeWidth={1} color="#C8CDD5" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'12px 14px' }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A',
                      marginBottom:'4px', overflow:'hidden',
                      display:'-webkit-box', WebkitLineClamp:2,
                      WebkitBoxOrient:'vertical' }}>
                      {p.name}
                    </p>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                      <span style={{ fontSize:'15px', fontWeight:900, color:'#0A0A0A' }}>
                        ₹{p.price}
                      </span>
                      {p.original_price > p.price && (
                        <span style={{ fontSize:'12px', color:'#C0C0C0',
                          textDecoration:'line-through' }}>
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
