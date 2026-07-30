import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Scissors, Package, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';

const CONTENT = {
  tailoring: {
    title:'Craft with Precision', titleAccent:'Professional Tailoring Tools',
    sub:'Engineered for craftsmen who demand the best. Every stitch, perfected.',
    grad:'linear-gradient(160deg,#1A0533 0%,#3D0F6B 50%,#1A0533 100%)',
    accentColor:'#C084FC',
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
    title:'Wear Your Story', titleAccent:"Women's Fashion Collection",
    sub:'Curated styles for the modern woman. Elegance meets everyday comfort.',
    grad:'linear-gradient(160deg,#0A2540 0%,#1A4A7A 50%,#0A2540 100%)',
    accentColor:'#60A5FA',
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

const fadeUp  = {hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{duration:.55,ease:[.22,1,.36,1]}}};
const stagger = {visible:{transition:{staggerChildren:.08}}};
const scaleIn = {hidden:{opacity:0,scale:.96},visible:{opacity:1,scale:1,transition:{duration:.5,ease:[.22,1,.36,1]}}};

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

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <div style={{ background:c.grad, position:'relative', overflow:'hidden', paddingBottom:'56px' }}>

        <motion.div animate={{ scale:[1,1.15,1], opacity:[.4,.7,.4] }}
          transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%',
            background:`radial-gradient(circle, ${c.accentColor}30 0%, transparent 68%)`,
            top:'-150px', right:'-120px', pointerEvents:'none' }} />

        <motion.div animate={{ scale:[1,1.2,1], opacity:[.25,.5,.25] }}
          transition={{ duration:12, repeat:Infinity, ease:'easeInOut', delay:3 }}
          style={{ position:'absolute', width:'320px', height:'320px', borderRadius:'50%',
            background:`radial-gradient(circle, ${c.accentColor}25 0%, transparent 68%)`,
            bottom:'-100px', left:'-80px', pointerEvents:'none' }} />

        <div className="sh-container" style={{ paddingTop:'52px', position:'relative', zIndex:1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={fadeUp} style={{ marginBottom:'18px' }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:'7px',
                padding:'6px 16px', borderRadius:'99px',
                background:'rgba(255,255,255,.12)', backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,.18)',
                fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,.9)',
                letterSpacing:'1px', textTransform:'uppercase' }}>
                <Sparkles size={12} strokeWidth={2} /> New Collection 2026
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize:'clamp(30px,5.5vw,56px)',
              fontWeight:900, color:'white', lineHeight:1.1,
              letterSpacing:'-1.5px', marginBottom:'16px', maxWidth:'620px' }}>
              {c.title}<br/>
              <span style={{ color:c.accentColor, display:'block', marginTop:'4px' }}>
                {c.titleAccent}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize:'clamp(14px,1.8vw,16px)',
              color:'rgba(255,255,255,.68)', maxWidth:'460px',
              lineHeight:1.75, marginBottom:'36px' }}>
              {c.sub}
            </motion.p>

            <motion.div variants={fadeUp}
              style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'48px' }}>
              <motion.button onClick={scrollToProducts}
                whileHover={{ scale:1.03, boxShadow:'0 10px 32px rgba(0,0,0,.3)' }}
                whileTap={{ scale:.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  padding:'14px 28px', borderRadius:'12px', background:'white',
                  color:'#0A0A0A', fontSize:'14px', fontWeight:800,
                  border:'none', cursor:'pointer',
                  boxShadow:'0 4px 20px rgba(0,0,0,.25)' }}>
                <Package size={16} strokeWidth={2} /> Shop Now
              </motion.button>

              <motion.button onClick={scrollToFilter}
                whileHover={{ scale:1.03, background:'rgba(255,255,255,.22)' }}
                whileTap={{ scale:.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  padding:'14px 24px', borderRadius:'12px',
                  background:'rgba(255,255,255,.12)', backdropFilter:'blur(10px)',
                  border:'1px solid rgba(255,255,255,.22)',
                  color:'white', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>
                Explore Collection <ArrowRight size={16} strokeWidth={2} />
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display:'flex', gap:'36px', flexWrap:'wrap' }}>
              {[{num:'500+',label:'Products'},{num:'2,000+',label:'Happy Customers'},{num:'4.9 ★',label:'Average Rating'}]
                .map(({ num, label }) => (
                  <div key={label}>
                    <p style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:900, color:'white', lineHeight:1 }}>{num}</p>
                    <p style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', marginTop:'4px' }}>{label}</p>
                  </div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        <motion.div animate={{ y:[0,6,0] }} transition={{ duration:2, repeat:Infinity }}
          onClick={scrollToFilter}
          style={{ position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)',
            cursor:'pointer', color:'rgba(255,255,255,.4)', zIndex:1 }}>
          <ChevronDown size={24} strokeWidth={1.5} />
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
                {activeCategory === 'tailoring' ? 'Tailoring' : "Women's Fashion"}
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

    </div>
  );
}
