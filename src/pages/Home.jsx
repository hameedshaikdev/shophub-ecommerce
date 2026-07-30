import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Scissors, Package, Sparkles, ArrowRight, ChevronDown, Star, Truck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';

/* ─── Content config ──────────────────────────────────────── */
const CONTENT = {
  tailoring: {
    title:'Craft with',
    titleAccent:'Precision.',
    titleLine2:'Professional Tailoring Tools',
    sub:'Engineered for craftsmen who demand the best. Every stitch, perfected.',
    grad:'linear-gradient(160deg,#1A0533 0%,#3D0F6B 50%,#1A0533 100%)',
    accentColor:'#C084FC',
    illustration:'https://cdn-icons-png.flaticon.com/512/3124/3124828.png',
    illustrationAlt:'Professional sewing machine',
    subs:[
      {id:'all',icon:'◈',label:'All'},
      {id:'machines',icon:'⚙',label:'Machines'},
      {id:'scissors',icon:'✂',label:'Scissors'},
      {id:'threads',icon:'〇',label:'Threads'},
      {id:'needles',icon:'↑',label:'Needles'},
      {id:'measuring',icon:'↔',label:'Measuring'},
    ],
  },
  fashion:{
    title:'Wear',
    titleAccent:'Your Story.',
    titleLine2:"Women's Fashion Collection",
    sub:'Curated styles for the modern woman. Elegance meets everyday comfort.',
    grad:'linear-gradient(160deg,#0A2540 0%,#1A4A7A 50%,#0A2540 100%)',
    accentColor:'#60A5FA',
    illustration:'https://cdn-icons-png.flaticon.com/512/3050/3050070.png',
    illustrationAlt:'Women fashion collection',
    subs:[
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
const fadeUp  = {hidden:{opacity:0,y:32},visible:{opacity:1,y:0,transition:{duration:.6,ease:[.22,1,.36,1]}}};
const fadeIn  = {hidden:{opacity:0},visible:{opacity:1,transition:{duration:.5}}};
const stagger = {visible:{transition:{staggerChildren:.09}}};
const scaleIn = {hidden:{opacity:0,scale:.95},visible:{opacity:1,scale:1,transition:{duration:.5,ease:[.22,1,.36,1]}}};

/* ─── Animated counter ────────────────────────────────────── */
function Counter({ target, suffix='' }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g,''));
    const duration = 1500;
    const steps = 40;
    const inc = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const formatted = target.includes(',')
    ? count.toLocaleString('en-IN')
    : count.toString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

/* ─── Section wrapper ─────────────────────────────────────── */
function Section({ children, style={} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });
  return (
    <motion.section ref={ref} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} variants={stagger} style={style}>
      {children}
    </motion.section>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Home() {
  const { activeCategory } = useApp();
  const [searchParams]          = useSearchParams();
  const searchQuery              = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sub,      setSub]      = useState('all');

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
        const { data, error }   = await q.order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [activeCategory, sub, searchQuery]);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });
  const scrollToFilter   = () => filterRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>

      {/* ══ HERO — Split Layout ═══════════════════════════════ */}
      <div style={{ background:c.grad, position:'relative', overflow:'hidden',
        paddingBottom:'64px', transition:'background 0.6s ease' }}>

        {/* Background decorative elements */}
        <motion.div animate={{ scale:[1,1.2,1], opacity:[.3,.55,.3], rotate:[0,5,0] }}
          transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%',
            background:`radial-gradient(circle, ${c.accentColor}28 0%, transparent 65%)`,
            top:'-200px', right:'-150px', pointerEvents:'none' }} />

        <motion.div animate={{ scale:[1,1.15,1], opacity:[.2,.4,.2] }}
          transition={{ duration:13, repeat:Infinity, ease:'easeInOut', delay:4 }}
          style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
            background:`radial-gradient(circle, ${c.accentColor}20 0%, transparent 65%)`,
            bottom:'-120px', left:'-100px', pointerEvents:'none' }} />

        {/* Floating dots decoration */}
        {[
          {top:'15%',left:'8%',size:5,delay:0},
          {top:'60%',left:'5%',size:3,delay:1},
          {top:'30%',right:'12%',size:4,delay:2},
          {top:'70%',right:'8%',size:6,delay:.5},
          {top:'45%',left:'15%',size:3,delay:1.5},
        ].map((dot, i) => (
          <motion.div key={i}
            animate={{ y:[-6,6,-6], opacity:[.4,.8,.4] }}
            transition={{ duration:3+i, repeat:Infinity, delay:dot.delay }}
            style={{ position:'absolute', top:dot.top, left:dot.left, right:dot.right,
              width:`${dot.size}px`, height:`${dot.size}px`, borderRadius:'50%',
              background:`${c.accentColor}80`, pointerEvents:'none' }} />
        ))}

        <div className="sh-container" style={{ paddingTop:'56px', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid',
            gridTemplateColumns:'1fr minmax(0,420px)',
            gap:'40px', alignItems:'center' }}
            className="hero-grid">

            {/* Left: Text content */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>

              {/* Badge */}
              <motion.div variants={fadeUp} style={{ marginBottom:'20px' }}>
                <AnimatePresence mode="wait">
                  <motion.span key={activeCategory}
                    initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:10 }} transition={{ duration:.3 }}
                    style={{ display:'inline-flex', alignItems:'center', gap:'7px',
                      padding:'7px 18px', borderRadius:'99px',
                      background:'rgba(255,255,255,.13)', backdropFilter:'blur(12px)',
                      border:'1px solid rgba(255,255,255,.2)',
                      fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,.9)',
                      letterSpacing:'1.2px', textTransform:'uppercase' }}>
                    <Sparkles size={12} strokeWidth={2.5} /> New Collection 2026
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div key={`title-${activeCategory}`}
                  initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-24 }} transition={{ duration:.45, ease:[.22,1,.36,1] }}>
                  <h1 style={{ fontSize:'clamp(32px,5.5vw,60px)', fontWeight:900,
                    color:'white', lineHeight:1.05, letterSpacing:'-2px',
                    marginBottom:'8px' }}>
                    {c.title}
                  </h1>
                  <h1 style={{ fontSize:'clamp(32px,5.5vw,60px)', fontWeight:900,
                    color:c.accentColor, lineHeight:1.05, letterSpacing:'-2px',
                    marginBottom:'8px', transition:'color .6s' }}>
                    {c.titleAccent}
                  </h1>
                  <h2 style={{ fontSize:'clamp(15px,2vw,20px)', fontWeight:500,
                    color:'rgba(255,255,255,.55)', lineHeight:1.2,
                    letterSpacing:'-0.3px', marginBottom:'20px' }}>
                    {c.titleLine2}
                  </h2>
                </motion.div>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p key={`sub-${activeCategory}`}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:.4, delay:.1 }}
                  style={{ fontSize:'clamp(14px,1.6vw,16px)',
                    color:'rgba(255,255,255,.62)', maxWidth:'440px',
                    lineHeight:1.8, marginBottom:'36px' }}>
                  {c.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp}
                style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'52px' }}>
                <motion.button onClick={scrollToProducts}
                  whileHover={{ scale:1.04, boxShadow:'0 12px 36px rgba(0,0,0,.35)' }}
                  whileTap={{ scale:.97 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'9px',
                    padding:'15px 32px', borderRadius:'14px', background:'white',
                    color:'#0A0A0A', fontSize:'14px', fontWeight:800,
                    border:'none', cursor:'pointer',
                    boxShadow:'0 4px 24px rgba(0,0,0,.28)',
                    letterSpacing:'-.1px', transition:'box-shadow .3s' }}>
                  <Package size={17} strokeWidth={2.5} />
                  Shop Now
                </motion.button>

                <motion.button onClick={scrollToFilter}
                  whileHover={{ scale:1.04, background:'rgba(255,255,255,.2)' }}
                  whileTap={{ scale:.97 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'9px',
                    padding:'15px 26px', borderRadius:'14px',
                    background:'rgba(255,255,255,.12)', backdropFilter:'blur(12px)',
                    border:'1.5px solid rgba(255,255,255,.25)',
                    color:'white', fontSize:'14px', fontWeight:700,
                    cursor:'pointer', transition:'background .25s' }}>
                  Explore Collection
                  <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Stats row with animated counters */}
              <motion.div variants={fadeUp}
                style={{ display:'flex', gap:'28px', flexWrap:'wrap' }}>
                {[
                  { icon:Star,    num:'4.9', suffix:' ★', label:'Average Rating' },
                  { icon:Package, num:'500', suffix:'+',  label:'Products' },
                  { icon:Users,   num:'2000',suffix:'+',  label:'Happy Customers' },
                  { icon:Truck,   num:'Pan India', suffix:'', label:'Delivery' },
                ].map(({ icon:Icon, num, suffix, label }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'10px',
                      background:'rgba(255,255,255,.12)', display:'flex',
                      alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={16} strokeWidth={1.8} color={c.accentColor} />
                    </div>
                    <div>
                      <p style={{ fontSize:'clamp(16px,2vw,20px)', fontWeight:900,
                        color:'white', lineHeight:1 }}>
                        {num === 'Pan India' ? 'Pan India' : (
                          <><Counter target={`${num}`} />{suffix}</>
                        )}
                      </p>
                      <p style={{ fontSize:'11px', color:'rgba(255,255,255,.45)',
                        marginTop:'3px', fontWeight:500 }}>{label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

            </motion.div>

            {/* Right: Illustration */}
            <div className="hero-illustration" style={{ display:'flex',
              alignItems:'center', justifyContent:'center',
              position:'relative', minHeight:'300px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={`illus-${activeCategory}`}
                  initial={{ opacity:0, scale:.85, y:20 }}
                  animate={{ opacity:1, scale:1, y:0 }}
                  exit={{ opacity:0, scale:.85, y:-20 }}
                  transition={{ duration:.6, ease:[.22,1,.36,1] }}
                  style={{ position:'relative', display:'flex',
                    alignItems:'center', justifyContent:'center' }}>

                  {/* Glow behind illustration */}
                  <div style={{ position:'absolute', width:'280px', height:'280px',
                    borderRadius:'50%', background:`${c.accentColor}25`,
                    filter:'blur(40px)', transform:'translateY(10px)' }} />

                  {/* Floating illustration */}
                  <motion.img
                    src={c.illustration}
                    alt={c.illustrationAlt}
                    animate={{ y:[-8,8,-8], rotate:[-1,1,-1] }}
                    transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                    style={{ width:'clamp(200px,28vw,340px)', height:'auto',
                      objectFit:'contain', position:'relative', zIndex:1,
                      filter:`drop-shadow(0 20px 48px ${c.accentColor}50)`,
                      userSelect:'none', pointerEvents:'none' }}
                  />

                  {/* Decorative ring */}
                  <motion.div
                    animate={{ rotate:360 }}
                    transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                    style={{ position:'absolute', width:'320px', height:'320px',
                      borderRadius:'50%', border:`1.5px dashed ${c.accentColor}30`,
                      pointerEvents:'none' }} />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y:[0,7,0] }} transition={{ duration:2, repeat:Infinity }}
          onClick={scrollToFilter}
          style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)',
            cursor:'pointer', color:'rgba(255,255,255,.35)', zIndex:1,
            display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
          <span style={{ fontSize:'10px', fontWeight:600, letterSpacing:'1px',
            textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>Scroll</span>
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* ══ CATEGORY FILTER ══════════════════════════════════ */}
      <div ref={filterRef} style={{ background:'white', borderBottom:'1px solid #E2E8F0' }}>
        <CategoryFilter categories={c.subs} selected={sub} onSelect={setSub} />
      </div>

      {/* ══ PRODUCTS ═════════════════════════════════════════ */}
      <div ref={productsRef} className="sh-container" style={{ padding:'44px 0 0' }}>
        <Section>
          <motion.div variants={fadeUp}
            style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
              marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'1.5px', color:'#8E8E93', marginBottom:'6px' }}>
                {activeCategory === 'tailoring' ? 'Tailoring Collection' : "Women's Fashion"}
              </p>
              <h2 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900,
                color:'var(--text)', letterSpacing:'-0.5px', lineHeight:1.1 }}>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : sub === 'all'
                    ? (activeCategory==='tailoring' ? 'All Tailoring Tools' : 'All Fashion Items')
                    : c.subs.find(s=>s.id===sub)?.label}
              </h2>
            </div>
            {!loading && (
              <p style={{ fontSize:'13px', color:'#8E8E93', fontWeight:600 }}>
                {products.length} item{products.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {loading && (
            <div className="sh-grid-products">
              {[...Array(8)].map((_,i) => (
                <div key={i} style={{ borderRadius:'20px', overflow:'hidden',
                  background:'white', boxShadow:'var(--shadow-sm)' }}>
                  <div className="sh-skel" style={{ height:'200px', borderRadius:0 }} />
                  <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
                    <div className="sh-skel" style={{ height:'13px', width:'80%' }} />
                    <div className="sh-skel" style={{ height:'11px', width:'50%' }} />
                    <div className="sh-skel" style={{ height:'18px', width:'38%', marginTop:'4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <motion.div variants={stagger} className="sh-grid-products">
              {products.map(p => (
                <motion.div key={p.id} variants={scaleIn}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && products.length === 0 && (
            <motion.div variants={fadeUp} style={{ textAlign:'center', padding:'80px 20px' }}>
              <Scissors size={48} strokeWidth={1} color="#D0D0D0"
                style={{ margin:'0 auto 20px' }} />
              <h3 style={{ fontSize:'20px', fontWeight:800, color:'var(--text)', marginBottom:'8px' }}>
                {searchQuery ? `No results for "${searchQuery}"` : 'No products yet'}
              </h3>
              <p style={{ color:'#8E8E93', fontSize:'14px' }}>
                {searchQuery ? 'Try a different search term' : 'Check back soon for new arrivals'}
              </p>
            </motion.div>
          )}
        </Section>
      </div>

      {/* Hero responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .hero-illustration {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .hero-illustration {
            display: flex !important;
          }
        }
      `}</style>

    </div>
  );
}
