import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Scissors, Package, Sparkles, ArrowRight, ChevronDown,
  Star, Truck, Users, Shield, Heart, ShoppingCart,
  Zap, TrendingUp, ChevronLeft, ChevronRight, Clock,
  Eye, BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';

/* ─── Content ─────────────────────────────────────────────── */
const CONTENT = {
  tailoring: {
    title: 'Master Your', titleAccent: 'Craft.',
    titleLine2: 'Professional Tailoring Tools',
    sub: 'Premium tools engineered for craftsmen who demand the best. Every stitch, perfected.',
    grad: 'linear-gradient(160deg,#1A0533 0%,#3D0F6B 50%,#1A0533 100%)',
    accentColor: '#C084FC',
    illustration: 'https://cdn-icons-png.flaticon.com/512/3124/3124828.png',
    illustrationAlt: 'Professional sewing machine',
    collections: [
      { id:'machines',  label:'Sewing Machines',  emoji:'🪡', desc:'Professional grade' },
      { id:'scissors',  label:'Scissors & Blades', emoji:'✂️', desc:'Precision cut'      },
      { id:'threads',   label:'Threads & Yarn',   emoji:'🧵', desc:'Premium quality'    },
      { id:'measuring', label:'Measuring Tools',  emoji:'📏', desc:'Accurate tools'     },
    ],
    subs: [
      {id:'all',icon:'◈',label:'All'},
      {id:'machines',icon:'⚙',label:'Machines'},
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
    grad: 'linear-gradient(160deg,#0A2540 0%,#1A4A7A 50%,#0A2540 100%)',
    accentColor: '#60A5FA',
    illustration: 'https://cdn-icons-png.flaticon.com/512/3050/3050070.png',
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
    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
      {[time.h, time.m, time.s].map((v,i) => (
        <span key={i} style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <span style={{background:'#1A1A2E',color:'white',fontWeight:900,fontSize:'18px',
            padding:'6px 10px',borderRadius:'8px',minWidth:'44px',textAlign:'center',
            fontFamily:'monospace'}}>
            {pad(v)}
          </span>
          {i < 2 && <span style={{fontWeight:900,fontSize:'18px',color:'#1A1A2E'}}>:</span>}
        </span>
      ))}
    </div>
  );
}

/* ─── Product Mini Card (for carousels) ───────────────────── */
function MiniCard({ product, badge }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const inWL = isInWishlist(product.id);
  const disc = product.original_price > product.price
    ? Math.round((1-product.price/product.original_price)*100) : null;
  return (
    <Link to={`/product/${product.id}`}
      style={{textDecoration:'none',display:'block',minWidth:'200px',maxWidth:'200px',flexShrink:0}}>
      <motion.div whileHover={{y:-4,boxShadow:'0 12px 32px rgba(0,0,0,.10)'}}
        style={{background:'white',borderRadius:'16px',overflow:'hidden',
          border:'1px solid #F0F0F0',boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>
        <div style={{position:'relative',height:'160px',background:'#F8F9FA',overflow:'hidden'}}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name}
                style={{width:'100%',height:'100%',objectFit:'cover'}}
                onError={e=>{e.target.style.display='none';}}/>
            : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',
                justifyContent:'center',background:'linear-gradient(135deg,#F4F6F8,#EBEDF0)'}}>
                <Package size={28} strokeWidth={1} color="#C8CDD5"/>
              </div>}
          {badge && (
            <div style={{position:'absolute',top:'8px',left:'8px',background:badge.bg,
              color:badge.color,fontSize:'9px',fontWeight:800,padding:'3px 8px',
              borderRadius:'6px',display:'flex',alignItems:'center',gap:'3px'}}>
              {badge.icon} {badge.label}
            </div>
          )}
          {disc && (
            <div style={{position:'absolute',top:'8px',right:'8px',background:'#EF4444',
              color:'white',fontSize:'9px',fontWeight:800,padding:'3px 7px',borderRadius:'5px'}}>
              -{disc}%
            </div>
          )}
          <button onClick={e=>{e.preventDefault();inWL?removeFromWishlist(product.id):addToWishlist(product);}}
            style={{position:'absolute',bottom:'8px',right:'8px',width:'30px',height:'30px',
              borderRadius:'50%',background:'rgba(255,255,255,.9)',border:'none',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Heart size={13} fill={inWL?'#EF4444':'none'} color={inWL?'#EF4444':'#555'}/>
          </button>
        </div>
        <div style={{padding:'10px 12px 12px'}}>
          <p style={{fontSize:'12px',fontWeight:700,color:'#0A0A0A',marginBottom:'3px',
            overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
            {product.name}
          </p>
          <div style={{display:'flex',alignItems:'baseline',gap:'5px',marginBottom:'6px'}}>
            <span style={{fontSize:'14px',fontWeight:900,color:'#0A0A0A'}}>₹{product.price}</span>
            {product.original_price>product.price &&
              <span style={{fontSize:'11px',color:'#C0C0C0',textDecoration:'line-through'}}>
                ₹{product.original_price}
              </span>}
          </div>
          <button onClick={e=>{e.preventDefault();addToCart(product,1);}}
            style={{width:'100%',padding:'7px',borderRadius:'8px',
              background:'linear-gradient(135deg,#1A1A2E,#0F3460)',color:'white',
              fontWeight:700,fontSize:'11px',border:'none',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
            <ShoppingCart size={11}/> Add to Cart
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
    <div style={{position:'relative'}}>
      <button onClick={()=>scroll(-1)}
        style={{position:'absolute',left:'-16px',top:'50%',transform:'translateY(-50%)',
          width:'36px',height:'36px',borderRadius:'50%',background:'white',
          border:'1px solid #E2E8F0',boxShadow:'0 2px 12px rgba(0,0,0,.1)',
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
        <ChevronLeft size={18} color="#555"/>
      </button>
      <div ref={ref} style={{display:'flex',gap:'14px',overflowX:'auto',paddingBottom:'8px',
        scrollbarWidth:'none',msOverflowStyle:'none',padding:'4px 8px 12px'}}>
        {children}
      </div>
      <button onClick={()=>scroll(1)}
        style={{position:'absolute',right:'-16px',top:'50%',transform:'translateY(-50%)',
          width:'36px',height:'36px',borderRadius:'50%',background:'white',
          border:'1px solid #E2E8F0',boxShadow:'0 2px 12px rgba(0,0,0,.1)',
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
        <ChevronRight size={18} color="#555"/>
      </button>
    </div>
  );
}

/* ─── Collection Card ─────────────────────────────────────── */
function CollectionCard({ cls='', label, title, count, img, onClick, dark=false }) {
  return (
    <Reveal style={{ display:'contents' }}>
      <motion.div className={`col-card ${cls}`}
        whileHover={{ y:-3, boxShadow:'0 20px 60px rgba(0,0,0,.18)' }}
        onClick={onClick}
        style={{ position:'relative', overflow:'hidden', borderRadius:'20px',
          cursor:'pointer', background:'#1A1A2E',
          boxShadow:'0 4px 16px rgba(0,0,0,.10)', border:'1px solid rgba(0,0,0,.05)' }}>

        <motion.div whileHover={{ scale:1.07 }}
          transition={{ duration:.6, ease:[.22,1,.36,1] }}
          style={{ position:'absolute', inset:0 }}>
          <img src={img} alt={title} loading="lazy"
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            onError={e => { e.target.style.display='none'; }}/>
        </motion.div>

        <div style={{ position:'absolute', inset:0,
          background: dark
            ? 'linear-gradient(180deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,.8) 100%)'
            : 'linear-gradient(180deg,rgba(0,0,0,.0) 25%,rgba(0,0,0,.75) 100%)' }}/>

        <div style={{ position:'absolute', inset:0, padding:'16px 18px',
          display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            {label && (
              <span style={{ fontSize:'9px', fontWeight:800, letterSpacing:'1.2px',
                textTransform:'uppercase', color:'rgba(255,255,255,.8)',
                background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)',
                padding:'3px 10px', borderRadius:'99px',
                border:'1px solid rgba(255,255,255,.2)' }}>{label}</span>
            )}
            {count && <span style={{ fontSize:'10px', fontWeight:600, color:'rgba(255,255,255,.55)' }}>{count}</span>}
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'8px' }}>
            <h3 style={{ fontSize:'clamp(14px,1.6vw,19px)', fontWeight:900, color:'white',
              letterSpacing:'-.3px', lineHeight:1.1 }}>{title}</h3>
            <motion.div whileHover={{ x:3 }}
              style={{ width:'30px', height:'30px', borderRadius:'50%', flexShrink:0,
                background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(255,255,255,.25)' }}>
              <ArrowRight size={13} color="white"/>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ─── Main Home Component ─────────────────────────────────── */
export default function Home() {
  const { activeCategory, addToCart } = useApp();
  const [searchParams]          = useSearchParams();
  const searchQuery              = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sub,      setSub]      = useState('all');
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashDeals,  setFlashDeals]  = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const productsRef = useRef(null);
  const filterRef   = useRef(null);
  const c = CONTENT[activeCategory];

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
      const base = supabase.from('products').select('*')
        .eq('category', activeCategory).eq('active', true);
      const [n, b, f] = await Promise.all([
        base.order('created_at',{ascending:false}).limit(8),
        base.order('price',{ascending:false}).limit(8),
        base.gt('original_price', 'price').order('created_at',{ascending:false}).limit(6),
      ]);
      setNewArrivals(n.data || []);
      setBestSellers(b.data || []);
      setFlashDeals((f.data||[]).filter(p=>p.original_price>p.price));
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

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <div style={{ background:c.grad, position:'relative', overflow:'hidden', minHeight:'520px',
        display:'flex', alignItems:'center', transition:'background .6s ease' }}>

        {/* Glows */}
        <motion.div animate={{scale:[1,1.2,1],opacity:[.3,.55,.3]}}
          transition={{duration:10,repeat:Infinity,ease:'easeInOut'}}
          style={{position:'absolute',width:'600px',height:'600px',borderRadius:'50%',
            background:`radial-gradient(circle,${c.accentColor}28 0%,transparent 65%)`,
            top:'-200px',right:'-150px',pointerEvents:'none'}}/>
        <motion.div animate={{scale:[1,1.15,1],opacity:[.15,.35,.15]}}
          transition={{duration:13,repeat:Infinity,ease:'easeInOut',delay:4}}
          style={{position:'absolute',width:'400px',height:'400px',borderRadius:'50%',
            background:`radial-gradient(circle,${c.accentColor}20 0%,transparent 65%)`,
            bottom:'-120px',left:'-100px',pointerEvents:'none'}}/>
        {/* Floating dots */}
        {[{top:'20%',left:'6%',s:4,d:0},{top:'65%',left:'4%',s:3,d:1.2},
          {top:'35%',right:'10%',s:5,d:2},{top:'75%',right:'6%',s:3,d:.5}].map((dot,i)=>(
          <motion.div key={i} animate={{y:[-6,6,-6],opacity:[.35,.7,.35]}}
            transition={{duration:3+i,repeat:Infinity,delay:dot.d}}
            style={{position:'absolute',top:dot.top,left:dot.left,right:dot.right,
              width:`${dot.s}px`,height:`${dot.s}px`,borderRadius:'50%',
              background:`${c.accentColor}80`,pointerEvents:'none'}}/>
        ))}

        <div className="sh-container" style={{paddingTop:'48px',paddingBottom:'48px',position:'relative',zIndex:1,width:'100%'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}
            className="hero-grid">

            {/* LEFT */}
            <motion.div initial="hidden" animate="visible" variants={sg}>
              {/* Badge */}
              <motion.div variants={fu} style={{marginBottom:'20px'}}>
                <AnimatePresence mode="wait">
                  <motion.span key={activeCategory}
                    initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:10}} transition={{duration:.3}}
                    style={{display:'inline-flex',alignItems:'center',gap:'7px',
                      padding:'6px 16px',borderRadius:'99px',
                      background:'rgba(255,255,255,.13)',backdropFilter:'blur(12px)',
                      border:'1px solid rgba(255,255,255,.2)',
                      fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,.9)',
                      letterSpacing:'1.2px',textTransform:'uppercase'}}>
                    <Sparkles size={12} strokeWidth={2.5}/> New Collection 2026
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div key={`h-${activeCategory}`}
                  initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-24}} transition={{duration:.45,ease:[.22,1,.36,1]}}>
                  <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:900,color:'white',
                    lineHeight:1.02,letterSpacing:'-2.5px',margin:0}}>
                    {c.title}
                  </h1>
                  <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:900,
                    color:c.accentColor,lineHeight:1.02,letterSpacing:'-2.5px',
                    marginBottom:'8px',transition:'color .6s'}}>
                    {c.titleAccent}
                  </h1>
                  <p style={{fontSize:'clamp(14px,1.8vw,17px)',fontWeight:400,
                    color:'rgba(255,255,255,.5)',letterSpacing:'-.2px',marginBottom:'16px'}}>
                    {c.titleLine2}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p key={`sub-${activeCategory}`}
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  transition={{duration:.4,delay:.1}}
                  style={{fontSize:'clamp(13px,1.5vw,15px)',color:'rgba(255,255,255,.6)',
                    maxWidth:'420px',lineHeight:1.8,marginBottom:'32px'}}>
                  {c.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <motion.div variants={fu} style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'36px'}}>
                <motion.button onClick={() => scrollTo(productsRef)}
                  whileHover={{scale:1.04,boxShadow:'0 12px 36px rgba(0,0,0,.35)'}}
                  whileTap={{scale:.97}}
                  style={{display:'inline-flex',alignItems:'center',gap:'9px',padding:'14px 30px',
                    borderRadius:'14px',background:'white',color:'#0A0A0A',
                    fontSize:'14px',fontWeight:800,border:'none',cursor:'pointer',
                    boxShadow:'0 4px 24px rgba(0,0,0,.28)'}}>
                  <Package size={16} strokeWidth={2.5}/> Shop Now
                </motion.button>
                <motion.button onClick={() => scrollTo(filterRef)}
                  whileHover={{scale:1.04,background:'rgba(255,255,255,.2)'}}
                  whileTap={{scale:.97}}
                  style={{display:'inline-flex',alignItems:'center',gap:'9px',padding:'14px 24px',
                    borderRadius:'14px',background:'rgba(255,255,255,.12)',backdropFilter:'blur(12px)',
                    border:'1.5px solid rgba(255,255,255,.25)',color:'white',
                    fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
                  Explore
                  <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}}>
                    <ArrowRight size={16} strokeWidth={2.5}/>
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fu} style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                {[
                  {icon:Truck,   text:'Free Delivery'},
                  {icon:Shield,  text:'Secure Pay'},
                  {icon:BadgeCheck,text:'100% Genuine'},
                ].map(({icon:Icon,text})=>(
                  <div key={text} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <Icon size={13} strokeWidth={2} color={c.accentColor}/>
                    <span style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,.55)'}}>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Illustration */}
            <div className="hero-illustration" style={{display:'flex',alignItems:'center',
              justifyContent:'center',position:'relative',minHeight:'320px'}}>
              <AnimatePresence mode="wait">
                <motion.div key={`illus-${activeCategory}`}
                  initial={{opacity:0,scale:.85,y:20}} animate={{opacity:1,scale:1,y:0}}
                  exit={{opacity:0,scale:.85,y:-20}} transition={{duration:.6,ease:[.22,1,.36,1]}}
                  style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{position:'absolute',width:'300px',height:'300px',borderRadius:'50%',
                    background:`${c.accentColor}22`,filter:'blur(48px)',transform:'translateY(10px)'}}/>
                  <motion.img src={c.illustration} alt={c.illustrationAlt}
                    animate={{y:[-10,10,-10],rotate:[-1.5,1.5,-1.5]}}
                    transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}}
                    style={{width:'clamp(200px,26vw,320px)',height:'auto',objectFit:'contain',
                      position:'relative',zIndex:1,
                      filter:`drop-shadow(0 24px 56px ${c.accentColor}55)`,
                      userSelect:'none',pointerEvents:'none'}}/>
                  <motion.div animate={{rotate:360}} transition={{duration:22,repeat:Infinity,ease:'linear'}}
                    style={{position:'absolute',width:'340px',height:'340px',borderRadius:'50%',
                      border:`1.5px dashed ${c.accentColor}28`,pointerEvents:'none'}}/>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Stats bar */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,
          background:'rgba(0,0,0,.25)',backdropFilter:'blur(12px)',
          borderTop:`1px solid rgba(255,255,255,.08)`}}>
          <div className="sh-container" style={{padding:'14px 0'}}>
            <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:'12px'}}>
              {[
                {icon:Star,   val:'4.9', suf:' ★', label:'Rating',   isStatic:true},
                {icon:Package,val:500,   suf:'+',  label:'Products',  isStatic:false},
                {icon:Users,  val:2000,  suf:'+',  label:'Customers', isStatic:false},
                {icon:Truck,  val:null,  suf:'',   label:'Pan India Delivery', isStatic:true},
              ].map(({icon:Icon,val,suf,label,isStatic})=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <Icon size={14} strokeWidth={2} color={c.accentColor}/>
                  <span style={{fontSize:'14px',fontWeight:900,color:'white'}}>
                    {isStatic
                      ? (val === null ? null : val + suf)
                      : <><Counter value={val} suffix={suf}/></>}
                  </span>
                  {val !== null && <span style={{fontSize:'11px',color:'rgba(255,255,255,.45)'}}>{label}</span>}
                  {val === null && <span style={{fontSize:'14px',fontWeight:900,color:'white'}}>{label}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div animate={{y:[0,7,0]}} transition={{duration:2,repeat:Infinity}}
          onClick={() => scrollTo(filterRef)}
          style={{position:'absolute',bottom:'60px',left:'50%',transform:'translateX(-50%)',
            cursor:'pointer',color:'rgba(255,255,255,.3)',zIndex:1,
            display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
          <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'1.5px',
            textTransform:'uppercase',color:'rgba(255,255,255,.3)'}}>scroll</span>
          <ChevronDown size={18} strokeWidth={1.5}/>
        </motion.div>
      </div>

      {/* ══ CATEGORY FILTER ══════════════════════════════════ */}
      <div ref={filterRef} style={{background:'white',borderBottom:'1px solid #E2E8F0',
        position:'sticky',top:'56px',zIndex:40,boxShadow:'0 2px 8px rgba(0,0,0,.04)'}}>
        <CategoryFilter categories={c.subs} selected={sub} onSelect={setSub}/>
      </div>

      {/* ══ FLASH DEALS (if any discounted products) ═════════ */}
      {flashDeals.length > 0 && (
        <div style={{background:'linear-gradient(135deg,#1A1A2E,#0F3460)',padding:'32px 0'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{background:'#EF4444',color:'white',fontSize:'11px',fontWeight:900,
                    padding:'5px 12px',borderRadius:'8px',display:'flex',alignItems:'center',
                    gap:'5px',animation:'pulse 1.5s infinite'}}>
                    <Zap size={12} fill="white"/> FLASH DEALS
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
      <div style={{padding:'56px 0',background:'#FAFAFA'}}>
        <div className="sh-container">
          <Reveal>
            <div style={{marginBottom:'28px'}}>
              <p style={{fontSize:'11px',fontWeight:700,color:'#8E8E93',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'6px'}}>
                {activeCategory==='tailoring'?'Browse by category':'Shop by Style'}
              </p>
              <h2 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:900,color:'#0A0A0A',letterSpacing:'-1px'}}>
                {activeCategory==='tailoring'?'Our Collections':'Find Your Look'}
              </h2>
            </div>
          </Reveal>

          {activeCategory==='tailoring' ? (
            <div className="collections-grid">
              <CollectionCard cls="cg-featured" label="Featured"  title="Sewing Machines"  count="12 items"  img="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&auto=format&fit=crop&q=80" onClick={()=>{setSub('machines');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-med"      label="Precision" title="Scissors"         count="8 items"   img="https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=500&auto=format&fit=crop&q=80" onClick={()=>{setSub('scissors');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Accuracy"  title="Measuring"        count="6 items"   img="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&auto=format&fit=crop&q=80" onClick={()=>{setSub('measuring');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-wide"     label="Premium"   title="Threads & Yarn"   count="20+ items" img="https://images.unsplash.com/photo-1617606002806-94e279c22567?w=700&auto=format&fit=crop&q=80" onClick={()=>{setSub('threads');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Essential" title="Needles"          count="15+ types" img="https://images.unsplash.com/photo-1594498258009-2e2bde84459e?w=400&auto=format&fit=crop&q=80" onClick={()=>{setSub('needles');scrollTo(productsRef);}}/>
              <CollectionCard cls="cg-small"    label="Shop All"  title="All Tools"        count=""          img="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&auto=format&fit=crop&q=80" onClick={()=>{setSub('all');scrollTo(productsRef);}} dark/>
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
        <div style={{padding:'48px 0',background:'#F8F9FA'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
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
      <div ref={productsRef} className="sh-container" style={{padding:'56px 0 0'}}>
        <Reveal>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',
            marginBottom:'28px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <p style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',
                letterSpacing:'1.5px',color:'#8E8E93',marginBottom:'6px'}}>
                {activeCategory==='tailoring'?'Tailoring Collection':"Women's Fashion"}
              </p>
              <h2 style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:900,color:'#0A0A0A',
                letterSpacing:'-0.5px',lineHeight:1.1}}>
                {searchQuery ? `Results for "${searchQuery}"`
                  : sub==='all'
                    ? (activeCategory==='tailoring'?'All Tailoring Tools':'All Fashion Items')
                    : c.subs.find(s=>s.id===sub)?.label}
              </h2>
            </div>
            {!loading && (
              <p style={{fontSize:'13px',color:'#8E8E93',fontWeight:600}}>
                {products.length} item{products.length!==1?'s':''}
              </p>
            )}
          </div>
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
              {products.map(p => (
                <motion.div key={p.id} variants={sc}>
                  <ProductCard product={p}/>
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

      {/* ══ BEST SELLERS ════════════════════════════════════ */}
      {bestSellers.length > 0 && !searchQuery && (
        <div style={{padding:'56px 0',background:'white',marginTop:'56px'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
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
        <div style={{padding:'48px 0',background:'#F8F9FA'}}>
          <div className="sh-container">
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'24px'}}>
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
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-illustration { display: none !important; }
        }
        @media (min-width: 769px) { .hero-illustration { display: flex !important; } }

        /* ── Collections Grid ────────────────────────── */
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 200px;
          gap: 12px;
        }

        /* Desktop layout */
        .col-card { min-height: 180px; }
        .cg-featured { grid-column: span 5; grid-row: span 2; }
        .cg-med      { grid-column: span 4; grid-row: span 1; }
        .cg-small    { grid-column: span 3; grid-row: span 1; }
        .cg-wide     { grid-column: span 7; grid-row: span 1; }

        /* Tablet */
        @media (max-width: 900px) and (min-width: 561px) {
          .collections-grid { grid-auto-rows: 170px; gap: 10px; }
          .cg-featured { grid-column: span 6; grid-row: span 2; }
          .cg-med      { grid-column: span 6; grid-row: span 1; }
          .cg-small    { grid-column: span 4; grid-row: span 1; }
          .cg-wide     { grid-column: span 8; grid-row: span 1; }
        }

        /* Mobile */
        @media (max-width: 560px) {
          .collections-grid {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: 160px;
            gap: 8px;
          }
          .cg-featured { grid-column: 1 / -1; grid-row: span 1; }
          .cg-med      { grid-column: span 1; grid-row: span 1; }
          .cg-small    { grid-column: span 1; grid-row: span 1; }
          .cg-wide     { grid-column: 1 / -1; grid-row: span 1; }
        }
      `}</style>
    </div>
  );
}
