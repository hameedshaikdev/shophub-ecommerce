import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Scissors, Package, Sparkles, ArrowRight, ChevronDown,
  Star, Truck, Users, Shield, Heart, ShoppingCart,
  Zap, TrendingUp, ChevronLeft, ChevronRight, Clock,
  Eye, BadgeCheck, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';
import QuickViewModal from '../components/products/QuickViewModal';
import { getProductImage, parseProductTags } from '../utils/productImages';

/* ─── Content ─────────────────────────────────────────────── */
const CONTENT = {
  tailoring: {
    title: 'Master Your', titleAccent: 'Craft.',
    titleLine2: 'Professional Tailoring Tools',
    sub: 'Premium tools engineered for craftsmen who demand the best. Every stitch, perfected.',
    grad: 'linear-gradient(180deg, #9C80AA 0%, #D1B6D5 18%, #D1B6D5 100%)',
    accentColor: '#6B4F8A',
    illustration: '/images/tailoring_hero.jpg',
    illustrationAlt: 'Luxury professional tailoring tools atelier',
    collections: [
      { id:'machines',  label:'Tailoring Kit',    emoji:'🧰', desc:'Complete atelier set' },
      { id:'scissors',  label:'Scissors & Blades', emoji:'✂️', desc:'Precision cut'      },
      { id:'threads',   label:'Threads & Yarn',   emoji:'🧵', desc:'Premium quality'    },
      { id:'measuring', label:'Measuring Tools',  emoji:'📏', desc:'Accurate tools'     },
    ],
    subs: [
      {id:'all',icon:'◈',label:'All'},
      {id:'machines',icon:'⚙',label:'Tailoring Kit'},
      {id:'scissors',icon:'✂',label:'Scissors'},
      {id:'threads',icon:'〇',label:'Threads'},
      {id:'needles',icon:'↑',label:'Needles'},
      {id:'measuring',icon:'↔',label:'Measuring'},
    ],
  },
  fashion: {
    title: 'Define Your', titleAccent: 'Style.',
    titleLine2: "Women's Fashion Collection",
    sub: 'Curated fashion for the modern woman. Elegance meets everyday comfort.',
    grad: 'linear-gradient(135deg, #134676 0%, #17548C 45%, #1E66AA 80%, #2574BD 100%)',
    accentColor: '#60A5FA',
    illustration: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=640&auto=format&fit=crop&q=80',
    illustrationAlt: 'Women fashion',
    collections: [
      { id:'dresses',     label:'Dresses',          emoji:'👗', desc:'Latest trends'    },
      { id:'tops',        label:'Tops & Blouses',   emoji:'👚', desc:'Casual & formal' },
      { id:'ethnic',      label:'Ethnic Wear',      emoji:'🥻', desc:'Traditional beauty'},
      { id:'accessories', label:'Accessories',      emoji:'👜', desc:'Complete the look'},
    ],
    subs: [
      {id:'all',icon:'◈',label:'All'},
      {id:'dresses',icon:'♛',label:'Dresses'},
      {id:'tops',icon:'△',label:'Tops'},
      {id:'bottoms',icon:'▽',label:'Bottoms'},
      {id:'ethnic',icon:'✦',label:'Ethnic'},
      {id:'accessories',icon:'◇',label:'Accessories'},
    ],
  },
};

/* ─── Variants ────────────────────────────────────────────── */
const fu = {hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{duration:.55,ease:[.22,1,.36,1]}}};
const fl = {hidden:{opacity:0,x:-24},visible:{opacity:1,x:0,transition:{duration:.55,ease:[.22,1,.36,1]}}};
const sg = {visible:{transition:{staggerChildren:.08}}};
const sc = {hidden:{opacity:0,scale:.95},visible:{opacity:1,scale:1,transition:{duration:.5,ease:[.22,1,.36,1]}}};

/* ─── Section ─────────────────────────────────────────────── */
function Reveal({ children, style={}, v=fu }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={v} style={style}>
      {children}
    </motion.div>
  );
}
function StaggerReveal({ children, style={} }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={sg} style={style}>
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ────────────────────────────────────── */
function Counter({ value, suffix='' }) {
  const ref    = useRef(null);
  const ok     = useInView(ref, { once:true });
  const [n, setN] = useState(0);
  const num = parseInt(String(value).replace(/[^0-9]/g,'')) || 0;
  useEffect(() => {
    if (!ok) return;
    let cur = 0; const steps = 40; const inc = num / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= num) { setN(num); clearInterval(t); } else setN(Math.floor(cur));
    }, 1400 / steps);
    return () => clearInterval(t);
  }, [ok, num]);
  return <span ref={ref}>{num >= 1000 ? n.toLocaleString('en-IN') : n}{suffix}</span>;
}

/* ─── Deal Timer ──────────────────────────────────────────── */
function DealTimer() {
  const [time, setTime] = useState({ h:4, m:32, s:17 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(p => {
        let {h,m,s} = p;
        s--; if (s < 0) { s=59; m--; } if (m < 0) { m=59; h--; } if (h < 0) h=0;
        return {h,m,s};
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2,'0');
  return (
    <div style={{display:'flex',alignItems:'center',gap:'6px'}} className="flash-deal-timer-wrap">
      {[time.h, time.m, time.s].map((v,i) => (
        <span key={i} style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <div className="flash-timer-card" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
            color: 'white',
            fontWeight: 900,
            fontSize: '16px',
            padding: '6px 10px',
            borderRadius: '10px',
            minWidth: '40px',
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            letterSpacing: '0.5px'
          }}>
            <span className={i === 2 ? 'flash-timer-sec' : ''}>{pad(v)}</span>
          </div>
          {i < 2 && <span style={{fontWeight:900,fontSize:'16px',color:'rgba(255,255,255,0.7)',animation:'timerColonPulse 1s infinite'}}>:</span>}
        </span>
      ))}
    </div>
  );
}

/* ─── Product Mini Card (for carousels) ───────────────────── */
function MiniCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  if (!product || !product.id) return null;

  const inWL = isInWishlist(product.id);
  const { badge: customBadge, discount_tag: customDisc } = parseProductTags(product);

  // Badge config maps known keywords to styled badges
  const badgeConfig = {
    sale:       { bg: 'linear-gradient(135deg, #FF3B30, #FF6B8B)', color: '#fff', label: 'SALE'       },
    bestseller: { bg: 'linear-gradient(135deg, #FF9500, #FFCC00)', color: '#fff', label: 'BESTSELLER' },
    new:        { bg: 'linear-gradient(135deg, #30D158, #34C759)', color: '#fff', label: 'NEW'        },
    hot:        { bg: 'linear-gradient(135deg, #AF52DE, #5856D6)', color: '#fff', label: 'HOT'        }
  };
  // If customBadge matches a key, use config; otherwise use the raw label (already may have emoji)
  const badgeKey = (customBadge || '').toLowerCase().replace(/[^a-z]/g, '');
  const badge = customBadge
    ? (badgeConfig[badgeKey] || { bg:'linear-gradient(135deg, #1A1A2E, #0F3460)', color:'#fff', label: customBadge })
    : null;

  const pPrice = Number(product.price || 0);
  const pOrig = Number(product.original_price || 0);
  const disc = pOrig > pPrice && pOrig > 0
    ? Math.round((1 - pPrice / pOrig) * 100) : null;
  const imgUrl = getProductImage(product);

  return (
    <Link to={`/product/${product.id}`}
      style={{textDecoration:'none',display:'flex',flexDirection:'column',minWidth:'210px',maxWidth:'210px',flexShrink:0,height:'100%'}}>
      <motion.div
        whileHover={{
          y: -10,
          scale: 1.02,
          boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.16), 0 0 20px rgba(255, 255, 255, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.95)'
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between'
        }}>
        <div style={{position:'relative',height:'150px',background:'rgba(245, 247, 250, 0.8)',overflow:'hidden',margin:'6px 6px 0 6px',borderRadius:'18px',flexShrink:0}}>
          <img src={imgUrl} alt={product.name || 'Product'}
            style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'18px'}}
            onError={e=>{e.target.src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';}}/>
          {/* Badge tag on home page cards only */}
          {badge && (
            <div style={{position:'absolute',top:'8px',left:'8px',background:badge.bg,
              color:badge.color,fontSize:'9px',fontWeight:800,padding:'3px 9px',
              borderRadius:'9999px',display:'flex',alignItems:'center',gap:'3px',
              boxShadow:'0 2px 8px rgba(0,0,0,.08)',border:'1px solid rgba(255,255,255,.6)',
              maxWidth:'75%', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
              {badge.label}
            </div>
          )}
          <button onClick={e=>{e.preventDefault();inWL?removeFromWishlist(product.id):addToWishlist(product);}}
            style={{position:'absolute',bottom:'8px',right:'8px',width:'32px',height:'32px',
              borderRadius:'9999px',background:'rgba(255,255,255,.9)',backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,.9)',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 10px rgba(0,0,0,.08)'}}>
            <Heart size={13} fill={inWL?'#E94560':'none'} color={inWL?'#E94560':'#555'}/>
          </button>
        </div>
        <div style={{padding:'12px 14px 14px',flex:1,display:'flex',flexDirection:'column',justify:'space-between'}}>
          <div>
            <p style={{fontSize:'13px',fontWeight:700,color:'#0F172A',marginBottom:'4px',
              overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',lineHeight:1.3,minHeight:'36px'}}>
              {product.name}
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'8px',minHeight:'20px',flexWrap:'wrap'}}>
              <span style={{fontSize:'15px',fontWeight:900,color:'#0F172A'}}>₹{pPrice.toFixed(0)}</span>
              {pOrig > pPrice &&
                <span style={{fontSize:'11px',color:'#94A3B8',textDecoration:'line-through'}}>
                  ₹{pOrig.toFixed(0)}
                </span>}
              {(customDisc || disc) && (
                <span style={{fontSize:'10px',fontWeight:700,color:'#388E3C'}}>
                  {customDisc || `-${disc}% off`}
                </span>
              )}
            </div>
          </div>
          <button onClick={e=>{e.preventDefault();addToCart(product,1);}}
            style={{width:'100%',padding:'8px',borderRadius:'9999px',
              background:'linear-gradient(135deg,#1A1A2E,#0F3460)',color:'white',
              fontWeight:800,fontSize:'11px',border:'none',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',
              boxShadow:'0 4px 14px rgba(26,26,46,.25)',marginTop:'auto'}}>
            <ShoppingCart size={12}/> Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Horizontal carousel ─────────────────────────────────── */
function Carousel({ children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({left: dir * 220, behavior:'smooth'});
  };
  return (
    <div className="carousel-outer" style={{position:'relative', overflow:'hidden'}}>
      <button onClick={()=>scroll(-1)}
        className="carousel-arrow carousel-arrow-left"
        style={{position:'absolute',left:'4px',top:'50%',transform:'translateY(-50%)',
          width:'36px',height:'36px',borderRadius:'9999px',background:'rgba(255,255,255,.95)',
          backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.9)',
          boxShadow:'0 4px 16px rgba(0,0,0,.15)',
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,flexShrink:0}}>
        <ChevronLeft size={16} color="#475569"/>
      </button>
      <div ref={ref} style={{display:'flex',gap:'16px',overflowX:'auto',alignItems:'stretch',
        padding:'6px 48px 16px',
        scrollbarWidth:'none',msOverflowStyle:'none'}}>
        {children}
      </div>
      <button onClick={()=>scroll(1)}
        className="carousel-arrow carousel-arrow-right"
        style={{position:'absolute',right:'4px',top:'50%',transform:'translateY(-50%)',
          width:'36px',height:'36px',borderRadius:'9999px',background:'rgba(255,255,255,.95)',
          backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.9)',
          boxShadow:'0 4px 16px rgba(0,0,0,.15)',
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,flexShrink:0}}>
        <ChevronRight size={16} color="#475569"/>
      </button>
    </div>
  );
}

/* ─── Collection Card ─────────────────────────────────────── */
function CollectionCard({ cls='', label, title, count, img, onClick, dark=false }) {
  return (
    <Reveal style={{ display:'contents' }}>
      <motion.div className={`col-card ${cls}`}
        whileHover={{
          y: -8,
          scale: 1.01,
          boxShadow: '0 24px 50px -10px rgba(0,0,0,.35), 0 0 20px rgba(255,255,255,.2)',
          borderColor: 'rgba(255, 255, 255, 0.45)'
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClick}
        style={{ position:'relative', overflow:'hidden', borderRadius:'28px',
          cursor:'pointer', background:'#1A1A2E',
          boxShadow:'0 8px 32px rgba(0,0,0,.12)', border:'1px solid rgba(255,255,255,.15)' }}>

        <motion.div whileHover={{ scale:1.06 }}
          transition={{ duration:.5, ease:[0.16, 1, 0.3, 1] }}
          style={{ position:'absolute', inset:0 }}>
          <img src={img} alt={title} loading="lazy"
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            onError={e => { e.target.style.display='none'; }}/>
        </motion.div>

        {/* Overlay removed per user request */}

        <div className="col-card-padding" style={{ position:'absolute', inset:0, padding:'18px 20px',
          display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'6px' }}>
            {label && (
              <span className="col-card-label" style={{ fontSize:'10px', fontWeight:800, letterSpacing:'0.6px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textTransform:'uppercase', color:'rgba(255, 255, 255, 0.95)',
                background:'rgba(255, 255, 255, 0.22)',
                backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
                padding:'5px 12px', borderRadius:'9999px',
                border:'1px solid rgba(255, 255, 255, 0.45)',
                boxShadow:'0 4px 16px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.6)',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'70%' }}>{label}</span>
            )}
            {count && <span className="col-card-count" style={{ fontSize:'11px', fontWeight:800, fontFamily: "'Plus Jakarta Sans', sans-serif", color:'rgba(255, 255, 255, 0.95)', whiteSpace:'nowrap' }}>{count}</span>}
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'8px' }}>
            <h3 className="col-card-title" style={{ fontSize:'clamp(15px,1.9vw,22px)', fontWeight:700,
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
              color: '#FFFFFF',
              letterSpacing:'-.025em', lineHeight:1.15, margin:0, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{title}</h3>
            <motion.div whileHover={{ x:4, scale:1.1 }}
              style={{ width:'36px', height:'36px', borderRadius:'9999px', flexShrink:0,
                background: 'rgba(255, 255, 255, 0.22)',
                backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border: '1px solid rgba(255, 255, 255, 0.45)',
                boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
              <ArrowRight size={15} color="#FFFFFF"/>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ─── Main Home Component ─────────────────────────────────── */
export default function Home() {
  const { activeCategory, setActiveCategory, cmsData, cmsDraft, addToCart } = useApp();
  const [searchParams]          = useSearchParams();
  const searchQuery              = searchParams.get('q') || '';
  const isPreviewMode            = searchParams.get('preview') === 'draft';
  const activeCms                = isPreviewMode ? (cmsDraft || cmsData) : cmsData;

  const [sortBy,           setSortBy]           = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [products, setProducts]       = useState([]);
  const [loading,  setLoading]        = useState(true);
  const [sub,      setSub]            = useState('all');
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashDeals,  setFlashDeals]  = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const productsRef = useRef(null);
  const filterRef   = useRef(null);

  // Dynamic CMS resolution — grad & accentColor are ALWAYS taken from CONTENT
  // (never CMS/localStorage) so each tab has its fixed identity:
  //   tailoring = lavender  |  fashion = dark navy
  const cmsHero = activeCms?.hero?.[activeCategory] || CONTENT[activeCategory];
  const c = {
    ...CONTENT[activeCategory],
    title: cmsHero.title || CONTENT[activeCategory].title,
    titleAccent: cmsHero.titleAccent || CONTENT[activeCategory].titleAccent,
    titleLine2: cmsHero.titleLine2 || CONTENT[activeCategory].titleLine2,
    sub: cmsHero.sub || CONTENT[activeCategory].sub,
    // grad and accentColor are LOCKED to CONTENT — CMS cannot change them
    grad: CONTENT[activeCategory].grad,
    accentColor: CONTENT[activeCategory].accentColor,
    illustration: cmsHero.illustration || CONTENT[activeCategory].illustration,
    badgeText: cmsHero.badgeText || 'New Collection 2026',
    btn1Text: cmsHero.btn1Text || 'Shop Now',
    btn2Text: cmsHero.btn2Text || 'Explore',
    collections: activeCms?.collections?.[activeCategory] || CONTENT[activeCategory].collections,
  };
  // true when hero background is dark (fashion = dark navy)
  const isDark = activeCategory === 'fashion';

  // SEO Update
  useEffect(() => {
    if (activeCms?.seo?.metaTitle) document.title = activeCms.seo.metaTitle;
  }, [activeCms]);

  useEffect(() => { setSub('all'); }, [activeCategory]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let q = supabase.from('products').select('*')
          .eq('category', activeCategory).eq('active', true);
        if (sub !== 'all')      q = q.eq('sub_category', sub);
        if (searchQuery.trim()) q = q.ilike('name', `%${searchQuery.trim()}%`);
        const { data }   = await q.order('created_at', { ascending: false });
        setProducts(data || []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [activeCategory, sub, searchQuery]);

  // Fetch featured sections
  useEffect(() => {
    (async () => {
      try {
        const [n, b, f] = await Promise.all([
          supabase.from('products').select('*').eq('category', activeCategory).eq('active', true).order('created_at',{ascending:false}).limit(8),
          supabase.from('products').select('*').eq('category', activeCategory).eq('active', true).order('price',{ascending:false}).limit(8),
          supabase.from('products').select('*').eq('category', activeCategory).eq('active', true).not('original_price', 'is', null).order('created_at',{ascending:false}).limit(12),
        ]);
        setNewArrivals(n.data || []);
        setBestSellers(b.data || []);
        setFlashDeals((f.data || []).filter(p => Number(p.original_price) > Number(p.price)));
      } catch(err) { console.error('Featured fetch error:', err); }
    })();
  }, [activeCategory]);

  // Track recently viewed
  useEffect(() => {
    try {
      const rv = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
      if (rv.length > 0) {
        supabase.from('products').select('*').in('id', rv.slice(0,6))
          .then(({ data }) => setRecentlyViewed(data || []));
      }
    } catch(e) {}
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior:'smooth', block:'start' });

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh' }}>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <div className="hero-container-wrap hero-compact" style={{ background:c.grad, position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', justifyContent:'center', transition:'background .6s ease',
        marginTop: '-1px', borderTop: 'none' }}>

        {/* ── Tailoring: 100% full-bleed hero image (desktop) ── */}
        {!isDark && (
          <div className="sh-desktop-bg" style={{position:'absolute',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
            <img src={`${c.illustration}?v=2560`} alt={c.illustrationAlt}
              style={{width:'100%',height:'100%',objectFit:'cover',
                objectPosition:'right center',display:'block',userSelect:'none',
                imageRendering:'-webkit-optimize-contrast'}}
              onError={e=>{e.target.src='/images/tailoring_hero.jpg';}}
            />
          </div>
        )}

        <div className="sh-container hero-inner-wrap" style={{paddingTop:'28px',paddingBottom:'30px',position:'relative',zIndex:1}}>
          <div className="hero-combined-wrapper" style={{position:'relative',width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:'32px',maxWidth:'100%'}}>

            {/* LEFT — Hero Text Content */}
            <motion.div className="hero-content-box" style={{maxWidth:'440px',minWidth:'300px',zIndex:2,flex:'0 0 42%'}} initial="hidden" animate="visible" variants={sg}>
              {/* Badge */}
              <motion.div variants={fu} style={{marginBottom:'20px'}}>
                <AnimatePresence mode="wait">
                  <motion.span key={activeCategory}
                    initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:10}} transition={{duration:.3}}
                    style={{display:'inline-flex',alignItems:'center',gap:'7px',
                      padding:'7px 18px',borderRadius:'99px',
                      background: isDark ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.75)',
                      backdropFilter:'blur(12px)',
                      WebkitBackdropFilter:'blur(12px)',
                      border: isDark ? '1px solid rgba(255,255,255,.2)' : '1px solid rgba(139,115,168,.25)',
                      boxShadow: isDark ? '0 4px 16px rgba(0,0,0,.12)' : '0 4px 16px rgba(107,79,138,.08)',
                      fontSize:'11px',fontWeight:800,
                      color: isDark ? 'rgba(255,255,255,.9)' : '#4A3563',
                      letterSpacing:'1.2px',textTransform:'uppercase'}}>
                    <Sparkles size={13} strokeWidth={2.5} color={isDark ? 'rgba(255,255,255,.8)' : '#6B4F8A'}/> New Collection 2026
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div key={`h-${activeCategory}`}
                  initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-24}} transition={{duration:.45,ease:[.22,1,.36,1]}}>
                  <h1 style={{fontSize:'clamp(38px,6vw,68px)',
                    fontWeight: isDark ? 900 : 700,
                    fontFamily: isDark ? 'inherit' : "'Playfair Display', Georgia, serif",
                    color: isDark ? 'rgba(255,255,255,.95)' : '#252329',
                    lineHeight:1.05,
                    letterSpacing: isDark ? '-2.5px' : '-0.8px',
                    margin:0}}>
                    {c.title}
                  </h1>
                  <h1 style={{fontSize:'clamp(38px,6vw,68px)',
                    fontWeight: isDark ? 900 : 700,
                    fontFamily: isDark ? 'inherit' : "'Playfair Display', Georgia, serif",
                    color: isDark ? c.accentColor : '#634780',
                    lineHeight:1.05,
                    letterSpacing: isDark ? '-2.5px' : '-0.8px',
                    marginBottom:'8px',transition:'color .6s'}}>
                    {c.titleAccent}
                  </h1>
                  <p style={{fontSize:'clamp(15px,1.9vw,18px)',fontWeight:700,
                    color: isDark ? 'rgba(255,255,255,.55)' : '#3E3846',
                    letterSpacing:'-.2px',marginBottom:'16px'}}>
                    {c.titleLine2}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p key={`sub-${activeCategory}`}
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  transition={{duration:.4,delay:.1}}
                  style={{fontSize:'clamp(13px,1.5vw,15px)',
                    color: isDark ? 'rgba(255,255,255,.6)' : '#554E60',
                    maxWidth:'440px',lineHeight:1.75,marginBottom:'32px',fontWeight:400}}>
                  {c.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <motion.div variants={fu} style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'36px'}}>
                <motion.button onClick={() => scrollTo(productsRef)}
                  whileHover={{scale:1.04,boxShadow:'0 12px 32px rgba(37,35,41,.28)'}}
                  whileTap={{scale:.97}}
                  style={{display:'inline-flex',alignItems:'center',gap:'9px',padding:'14px 30px',
                    borderRadius:'14px',
                    background: isDark ? 'white' : '#252329',
                    color: isDark ? '#0A2540' : '#FAF8F4',
                    fontSize:'14px',fontWeight:800,border:'none',cursor:'pointer',
                    boxShadow:'0 8px 24px rgba(37,35,41,.22)'}}>
                  <Package size={16} strokeWidth={2.5} color={isDark ? '#0A2540' : '#FAF8F4'}/> Shop Now
                </motion.button>
                <motion.button onClick={() => scrollTo(filterRef)}
                  whileHover={{scale:1.04}}
                  whileTap={{scale:.97}}
                  style={{display:'inline-flex',alignItems:'center',gap:'9px',padding:'14px 24px',
                    borderRadius:'14px',
                    background: isDark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.75)',
                    backdropFilter:'blur(12px)',
                    WebkitBackdropFilter:'blur(12px)',
                    border: isDark ? '1.5px solid rgba(255,255,255,.25)' : '1.5px solid #8C789F',
                    color: isDark ? 'white' : '#252329',
                    fontSize:'14px',fontWeight:800,cursor:'pointer',
                    boxShadow:'0 4px 16px rgba(107,79,138,.08)'}}>
                  Explore
                  <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                    <ArrowRight size={16} strokeWidth={2.5} color={isDark ? 'white' : '#252329'}/>
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fu} style={{display:'flex',gap:'18px',flexWrap:'wrap'}}>
                {[
                  {icon:Truck,     text:'Fast Delivery'},
                  {icon:Shield,    text:'Secure Pay'},
                  {icon:BadgeCheck,text:'100% Genuine'},
                ].map(({icon:Icon,text})=>(
                  <div key={text} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <Icon size={14} strokeWidth={2.2} color={c.accentColor}/>
                    <span style={{fontSize:'12px',fontWeight:700,color: isDark ? 'rgba(255,255,255,.7)' : '#4A4354'}}>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Photo Column (hero-image-column) */}
            <AnimatePresence mode="wait">
              <motion.div key={`illus-${activeCategory}`}
                className="hero-image-column"
                initial={{opacity:0,scale:.95,y:12}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:.95,y:-12}} transition={{duration:.5,ease:[.22,1,.36,1]}}
                style={{position:'relative',flex:'1 1 auto',minWidth:0,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:'48px',boxSizing:'border-box'}}>
                {isDark ? (
                  <div className="hero-image-collage" style={{
                    position: 'relative',
                    width: '760px',
                    height: '500px',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                    overflow: 'visible',
                    margin: '0',
                    flex: 'none',
                  }}>

                    {/* ① CARD 1 — NAVY FLORAL DRESS (255px × 355px) */}
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 1,
                        left: '0px', top: '0px',
                        width: '255px', height: '355px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
                      }}
                    >
                      <img src="/images/fashion_photo_1.jpg" alt="Navy Floral Dress"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                    {/* ② CARD 2 — LAVENDER/PINK OUTFIT (278px × 225px) */}
                    <motion.div
                      initial={{ opacity: 0, y: -60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 1,
                        left: '265px', top: '0px',
                        width: '278px', height: '225px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 14px 32px rgba(0,0,0,0.18)',
                      }}
                    >
                      <img src="/images/fashion_photo_2.jpg" alt="Lavender Outfit"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                    {/* ③ CARD 3 — BEIGE BLAZER + JEANS (200px × 360px) */}
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 1,
                        left: '555px', top: '40px',
                        width: '200px', height: '360px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 14px 38px rgba(0,0,0,0.22)',
                      }}
                    >
                      <img src="/images/fashion_photo_3.jpg" alt="Beige Blazer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                    {/* ④ CARD 4 — CREAM/WHITE DRESS (195px × 242px) */}
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 2,
                        left: '228px', top: '240px',
                        width: '195px', height: '242px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 16px 42px rgba(0,0,0,0.22)',
                      }}
                    >
                      <img src="/images/fashion_photo_4.jpg" alt="Cream Dress"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                    {/* ⑤ CARD 5 — LIGHT GREEN DRESS (175px × 137px) */}
                    <motion.div
                      initial={{ opacity: 0, x: -40, y: 40 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 3,
                        left: '43px', top: '345px',
                        width: '175px', height: '137px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
                      }}
                    >
                      <img src="/images/fashion_photo_5.jpg" alt="Green Dress"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                    {/* ⑥ CARD 6 — PINK DRESS (160px × 180px) */}
                    <motion.div
                      initial={{ opacity: 0, x: 40, y: 40 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02, zIndex: 20 }}
                      style={{
                        position: 'absolute', zIndex: 3,
                        left: '425px', top: '300px',
                        width: '160px', height: '180px',
                        borderRadius: '26px', overflow: 'hidden', boxSizing: 'border-box',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
                      }}
                    >
                      <img src="/images/fashion_photo_6.jpg" alt="Pink Dress"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </motion.div>

                  </div>
                  ) : (
                    /* Mobile Tailoring Photo Card — Crisp 4K photo block for mobile screens */
                    <div className="sh-mobile-only" style={{
                      width:'100%',
                      marginTop:'20px',
                      borderRadius:'24px',
                      overflow:'hidden',
                      boxShadow:'0 16px 40px -8px rgba(107,79,138,0.22)',
                      border:'1.5px solid rgba(255,255,255,0.6)'
                    }}>
                      <img src={c.illustration} alt={c.illustrationAlt}
                        style={{width:'100%',height:'auto',display:'block',userSelect:'none'}}
                        onError={e=>{e.target.src='/images/tailoring_hero.png';}}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        {/* Stats bar */}
        <div className="hero-stats-bar" style={{
          background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.65)',
          backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
          borderTop: isDark ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255,255,255,.8)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(139,115,168,.15)'}}>
          <div className="sh-container" style={{padding:'14px 0'}}>
            <div className="hero-stats-inner" style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:'10px 16px'}}>
              {[
                {icon:Star,   val:'4.9', suf:' ★', label:'Rating',   isStatic:true},
                {icon:Package,val:500,   suf:'+',  label:'Products',  isStatic:false},
                {icon:Users,  val:2400,  suf:'+',  label:'Customers', isStatic:false},
                {icon:Truck,  val:null,  suf:'',   label:'Pan India Delivery', isStatic:true},
              ].map(({icon:Icon,val,suf,label,isStatic})=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:'7px',flexShrink:0}}>
                  <Icon size={14} strokeWidth={2.2} color={c.accentColor}/>
                  <span style={{fontSize:'14px',fontWeight:900,
                    color: isDark ? 'white' : '#252329',whiteSpace:'nowrap'}}>
                    {isStatic
                      ? (val === null ? null : val + suf)
                      : <><Counter value={val} suffix={suf}/></>}
                  </span>
                  {val !== null && <span style={{fontSize:'12px',fontWeight:600,
                    color: isDark ? 'rgba(255,255,255,.45)' : '#635B70',whiteSpace:'nowrap'}}>{label}</span>}
                  {val === null && <span style={{fontSize:'14px',fontWeight:900,
                    color: isDark ? 'white' : '#252329',whiteSpace:'nowrap'}}>{label}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div animate={{y:[0,7,0]}} transition={{duration:2,repeat:Infinity}}
          onClick={() => scrollTo(filterRef)}
          style={{position:'absolute',bottom:'64px',left:'50%',transform:'translateX(-50%)',
            cursor:'pointer',zIndex:1,opacity:0.6,
            display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
          <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'1.5px',
            textTransform:'uppercase',
            color: isDark ? 'rgba(255,255,255,.5)' : '#6B4F8A'}}>scroll</span>
          <ChevronDown size={18} strokeWidth={2} color={isDark ? 'rgba(255,255,255,.5)' : '#6B4F8A'}/>
        </motion.div>
      </div>

      {/* ══ FLASH DEALS (if any discounted products) ═════════ */}
      {flashDeals.length > 0 && (
        <div style={{background:'linear-gradient(135deg,#1A1A2E,#0F3460)',padding:'80px 0'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap'}}>
                  <div className="flash-deals-badge-glow" style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
                    color:'white',fontSize:'11px',fontWeight:900,
                    padding:'7px 16px',borderRadius:'9999px',display:'flex',alignItems:'center',
                    gap:'6px', letterSpacing:'1px', textTransform:'uppercase'
                  }}>
                    <Zap size={14} fill="white" className="zap-flash-icon"/> FLASH DEALS
                  </div>
                  <DealTimer/>
                </div>
                <span style={{fontSize:'12px',fontWeight:700,color:'rgba(255,255,255,.5)'}}>
                  Limited time offers
                </span>
              </div>
            </Reveal>
            <Carousel>
              {flashDeals.map(p => (
                <MiniCard key={p.id} product={p}
                  badge={{label:'SALE',icon:'🔥',bg:'#FEF2F2',color:'#EF4444'}}/>
              ))}
            </Carousel>
          </div>
        </div>
      )}


      {/* ══ FEATURED COLLECTIONS ════════════════════════════ */}
      <div className="collections-section" style={{padding:'48px 0 32px',background:'#FAFAFA'}}>
        <div className="sh-container">
          <Reveal>
            <div style={{marginBottom:'20px'}}>
              <p style={{fontSize:'11px',fontWeight:700,color:'#8E8E93',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'4px'}}>
                {activeCategory==='tailoring'?'Browse by category':'Shop by Style'}
              </p>
              <h2 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:900,color:'#0A0A0A',letterSpacing:'-1px'}}>
                {activeCategory==='tailoring'?'Our Collections':'Find Your Look'}
              </h2>
            </div>
          </Reveal>

          {activeCategory==='tailoring' ? (
            <div className="collections-grid">
              <CollectionCard cls="cg-featured" label="Featured"  title="Tailoring Kit"    count="12 items"  img="/images/collections/sewing_machines.png" onClick={()=>{setSub('machines');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-med"      label="Precision" title="Scissors"         count="8 items"   img="/images/collections/scissors.png" onClick={()=>{setSub('scissors');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Accuracy"  title="Measuring"        count="6 items"   img="/images/collections/measuring.png" onClick={()=>{setSub('measuring');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-wide"     label="Premium"   title="Presser Feet"     count="20+ items" img="/images/collections/all_tools.png" onClick={()=>{setSub('all');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Essential" title="Needles"          count="15+ types" img="/images/collections/needles.png" onClick={()=>{setSub('needles');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Shop All"  title="Threads & Yarn"   count=""          img="/images/collections/threads.png" onClick={()=>{setSub('threads');scrollTo(productsRef);}} dark/>
            </div>
          ) : (
            <div className="collections-grid">
              <CollectionCard cls="cg-featured" label="New Season"  title="Dresses"          count="25+ items" img="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&auto=format&fit=crop&q=80"  onClick={()=>{setSub('dresses');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-med"      label="Trending"    title="Tops & Blouses"   count="18 items"  img="https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=80"   onClick={()=>{setSub('tops');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Comfort"     title="Bottoms"          count="12 items"  img="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&auto=format&fit=crop&q=80"  onClick={()=>{setSub('bottoms');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-wide"     label="Heritage"    title="Ethnic Wear"      count="30+ items" img="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80"  onClick={()=>{setSub('ethnic');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Complete"    title="Accessories"      count="20+ items" img="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&auto=format&fit=crop&q=80"  onClick={()=>{setSub('accessories');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Shop All"    title="All Fashion"      count=""          img="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80"  onClick={()=>{setSub('all');scrollTo(productsRef);}} dark/>
            </div>
          )}
        </div>
      </div>


      {/* ══ NEW ARRIVALS ════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <div className="new-arrivals-section" style={{padding:'48px 0 24px',background:'#F8F9FA'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                <div style={{background:'#1A1A2E',color:'white',fontSize:'10px',fontWeight:900,
                  padding:'4px 10px',borderRadius:'6px',letterSpacing:'1px',
                  animation:'pulse 2s infinite'}}>NEW</div>
                <h2 style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:900,color:'#0A0A0A',
                  letterSpacing:'-0.5px'}}>New Arrivals</h2>
              </div>
            </Reveal>
            <Carousel>
              {newArrivals.map(p => (
                <MiniCard key={p.id} product={p}
                  badge={{label:'NEW',icon:'✨',bg:'#F0FDF4',color:'#16A34A'}}/>
              ))}
            </Carousel>
          </div>
        </div>
      )}

      {/* ══ ALL PRODUCTS ════════════════════════════════════ */}
      <div ref={productsRef} className="sh-container products-section-container" style={{padding:'48px 0 0'}}>
        {/* Category Filter Bar */}
        <div ref={filterRef} style={{
          background:'rgba(255,255,255,0.92)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          border:'1px solid #E2E8F0', borderRadius:'16px', padding:'4px 8px', marginBottom:'16px',
          position:'sticky', top:'60px', zIndex:40, boxShadow:'0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <CategoryFilter categories={c.subs} selected={sub} onSelect={setSub}/>
        </div>

        <Reveal>
          {searchQuery && (
            <div style={{ marginBottom:'12px' }}>
              <h2 style={{ fontSize:'20px', fontWeight:800, color:'#0A0A0A', margin:0 }}>
                Results for "{searchQuery}"
              </h2>
            </div>
          )}

          {/* Interactive Glass Sort Controls */}
          {!loading && products.length > 0 && (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'rgba(255,255,255,0.76)', backdropFilter:'blur(20px)',
              WebkitBackdropFilter:'blur(20px)',
              border:'1px solid rgba(255,255,255,0.9)', borderRadius:'9999px',
              padding:'6px 14px', marginBottom:'24px', flexWrap:'wrap', gap:'8px',
              boxShadow:'0 4px 16px rgba(15,23,42,0.04)'
            }}>
              <div className="sh-scroll-hide" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:700, color:'#475569', overflowX:'auto' }}>
                <ArrowUpDown size={14} color="#E94560" style={{ flexShrink: 0 }} />
                <span style={{ flexShrink: 0 }}>Sort:</span>
                {[
                  ['featured', 'Featured'],
                  ['price-low', 'Price: Low to High'],
                  ['price-high', 'Price: High to Low'],
                  ['rating', 'Top Rated']
                ].map(([val, label]) => (
                  <button key={val} onClick={() => setSortBy(val)}
                    style={{
                      padding:'5px 13px', borderRadius:'9999px', fontSize:'12px', fontWeight:800,
                      background: sortBy === val ? 'linear-gradient(135deg, #1A1A2E, #0F3460)' : 'transparent',
                      color: sortBy === val ? 'white' : '#64748B',
                      border: 'none', cursor:'pointer', transition:'all .25s ease', flexShrink: 0
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {loading && (
          <div className="sh-grid-products">
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{borderRadius:'20px',overflow:'hidden',background:'white',boxShadow:'var(--shadow-sm)'}}>
                <div className="sh-skel" style={{height:'200px',borderRadius:0}}/>
                <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
                  <div className="sh-skel" style={{height:'13px',width:'80%'}}/>
                  <div className="sh-skel" style={{height:'11px',width:'50%'}}/>
                  <div className="sh-skel" style={{height:'18px',width:'38%',marginTop:'4px'}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <StaggerReveal>
            <div className="sh-grid-products">
              {[...products].sort((a, b) => {
                if (sortBy === 'price-low') return a.price - b.price;
                if (sortBy === 'price-high') return b.price - a.price;
                if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
                return 0;
              }).map(p => (
                <motion.div key={p.id} variants={sc} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <ProductCard product={p} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </div>
          </StaggerReveal>
        )}

        {!loading && products.length === 0 && (
          <Reveal>
            <div style={{textAlign:'center',padding:'80px 20px'}}>
              <Scissors size={48} strokeWidth={1} color="#D0D0D0" style={{margin:'0 auto 20px'}}/>
              <h3 style={{fontSize:'20px',fontWeight:800,color:'#0A0A0A',marginBottom:'8px'}}>
                {searchQuery?`No results for "${searchQuery}"`:'No products yet'}
              </h3>
              <p style={{color:'#8E8E93',fontSize:'14px'}}>
                {searchQuery?'Try a different search term':'Check back soon for new arrivals'}
              </p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ══ BEST SELLERS / TOP PICKS ════════════════════════════════════ */}
      {bestSellers.length > 0 && !searchQuery && (
        <div className="top-picks-section" style={{padding:'48px 0 24px',background:'white',marginTop:'48px'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                <div style={{background:'linear-gradient(135deg,#F59E0B,#D97706)',color:'white',
                  fontSize:'10px',fontWeight:900,padding:'4px 10px',borderRadius:'6px',
                  display:'flex',alignItems:'center',gap:'4px'}}>
                  <TrendingUp size={11}/> BEST SELLERS
                </div>
                <h2 style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:900,color:'#0A0A0A',
                  letterSpacing:'-0.5px'}}>Top Picks</h2>
              </div>
            </Reveal>
            <Carousel>
              {bestSellers.map(p => (
                <MiniCard key={p.id} product={p}
                  badge={{label:'TOP',icon:'⭐',bg:'#FFFBEB',color:'#D97706'}}/>
              ))}
            </Carousel>
          </div>
        </div>
      )}

      {/* ══ RECENTLY VIEWED ═════════════════════════════════ */}
      {recentlyViewed.length > 0 && (
        <div style={{padding:'88px 0',background:'#F8F9FA'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'28px'}}>
                <Clock size={18} color="#8E8E93"/>
                <h2 style={{fontSize:'clamp(18px,3vw,24px)',fontWeight:900,color:'#0A0A0A',
                  letterSpacing:'-0.5px'}}>Recently Viewed</h2>
              </div>
            </Reveal>
            <Carousel>
              {recentlyViewed.map(p => <MiniCard key={p.id} product={p}/>)}
            </Carousel>
          </div>
        </div>
      )}

      {/* ══ BOTTOM PADDING FOR MOBILE NAV ══════════════════ */}
      <div style={{height:'32px'}}/>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.7} }

        /* Hero responsive */
        @media (max-width: 768px) {
          .hero-combined-wrapper { flex-direction: column !important; gap: 24px !important; }
          .hero-content-box { flex: 1 1 100% !important; max-width: 100% !important; text-align: center !important; }
          .hero-image-column { padding-right: 0 !important; justify-content: center !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-illustration { display: none !important; }
        }
        @media (min-width: 769px) { .hero-illustration { display: flex !important; } }

        /* Desktop collage uniform scaling */
        @media (min-width: 769px) and (max-width: 1199px) {
          .hero-image-collage { transform: scale(0.72) !important; transform-origin: right center !important; }
        }
        @media (min-width: 1200px) and (max-width: 1399px) {
          .hero-image-collage { transform: scale(0.82) !important; transform-origin: right center !important; }
        }
        @media (min-width: 1400px) and (max-width: 1599px) {
          .hero-image-collage { transform: scale(0.95) !important; transform-origin: right center !important; }
        }
        @media (min-width: 1600px) {
          .hero-image-collage { transform: scale(1) !important; transform-origin: right center !important; }
        }

        /* ── Carousel: arrows inside, no overflow ── */
        .carousel-outer { overflow: hidden !important; }
        @media (max-width: 767px) {
          .carousel-arrow { width: 30px !important; height: 30px !important; }
          .carousel-outer > div { padding-left: 40px !important; padding-right: 40px !important; }
        }
        @media (min-width: 768px) {
          .carousel-arrow-left  { left: -4px !important; }
          .carousel-arrow-right { right: -4px !important; }
        }

        /* ── Hero stats — 2×2 grid on 360px and below ── */
        @media (max-width: 360px) {
          .hero-stats-inner {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            justify-items: start !important;
          }
        }

        /* ── Collections Grid ────────────────────────── */
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 150px;
          gap: 10px;
        }

        /* Desktop layout */
        .col-card { min-height: 130px; }
        .cg-featured { grid-column: span 5; grid-row: span 2; }
        .cg-med      { grid-column: span 4; grid-row: span 1; }
        .cg-small    { grid-column: span 3; grid-row: span 1; }
        .cg-wide     { grid-column: span 7; grid-row: span 1; }

        /* Tablet */
        @media (max-width: 900px) and (min-width: 561px) {
          .collections-grid { grid-auto-rows: 130px; gap: 8px; }
          .cg-featured { grid-column: span 6; grid-row: span 2; }
          .cg-med      { grid-column: span 6; grid-row: span 1; }
          .cg-small    { grid-column: span 4; grid-row: span 1; }
          .cg-wide     { grid-column: span 8; grid-row: span 1; }
        }

        /* Mobile */
        @media (max-width: 560px) {
          .collections-grid {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: 120px;
            gap: 8px;
          }
          .cg-featured { grid-column: 1 / -1; grid-row: span 1; }
          .cg-med      { grid-column: span 1; grid-row: span 1; }
          .cg-small    { grid-column: span 1; grid-row: span 1; }
          .cg-wide     { grid-column: 1 / -1; grid-row: span 1; }
        }
      `}</style>

      {/* Quick View Glass Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
