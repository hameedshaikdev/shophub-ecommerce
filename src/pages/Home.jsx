import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';

const CONTENT = {
  tailoring: {
    title: 'Professional Tailoring Tools',
    sub: 'Everything a tailor needs — precision crafted',
    emoji: '🪡',
    grad: 'linear-gradient(180deg,#2D1250 0%,#4A1572 60%,#3B0F6B 100%)',
    heroTextColor: 'white',
    subs: [
      { id:'all',       label:'All',       icon:'📦' },
      { id:'machines',  label:'Machines',  icon:'🪡' },
      { id:'scissors',  label:'Scissors',  icon:'✂️' },
      { id:'threads',   label:'Threads',   icon:'🧵' },
      { id:'needles',   label:'Needles',   icon:'📌' },
      { id:'measuring', label:'Measuring', icon:'📏' },
    ],
  },
  fashion: {
    title: "Women's Fashion",
    sub: 'Elegant styles for every occasion',
    emoji: '👗',
    grad: 'linear-gradient(180deg,#B8D4F0 0%,#DCEEFF 100%)',
    heroTextColor: '#1a3a5c',
    subs: [
      { id:'all',         label:'All',         icon:'👗' },
      { id:'dresses',     label:'Dresses',     icon:'👗' },
      { id:'tops',        label:'Tops',        icon:'👚' },
      { id:'bottoms',     label:'Bottoms',     icon:'👖' },
      { id:'ethnic',      label:'Ethnic',      icon:'🥻' },
      { id:'accessories', label:'Accessories', icon:'👜' },
    ],
  },
};

export default function Home() {
  const { activeCategory } = useApp();
  const [searchParams]            = useSearchParams();
  const searchQuery                = searchParams.get('q') || '';
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [sub,      setSub]        = useState('all');

  const c = CONTENT[activeCategory];

  useEffect(() => { setSub('all'); }, [activeCategory]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let q = supabase.from('products').select('*')
          .eq('category', activeCategory).eq('active', true);
        if (sub !== 'all') q = q.eq('sub_category', sub);
        // Apply search filter if query exists
        if (searchQuery.trim()) {
          q = q.ilike('name', `%${searchQuery.trim()}%`);
        }
        const { data, error } = await q.order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [activeCategory, sub, searchQuery]);

  return (
    <div style={{ background:'var(--bg)' }}>

      {/* Hero */}
      <div style={{ background: c.grad, paddingBottom:'28px' }}>
        <div className="sh-container" style={{ paddingTop:'32px' }}>
          <div className="sh-hero" style={{
            background: activeCategory === 'tailoring'
              ? 'rgba(255,255,255,.08)'
              : 'rgba(255,255,255,.45)',
            backdropFilter:'blur(2px)',
            border: activeCategory === 'tailoring'
              ? '1px solid rgba(255,255,255,.15)'
              : '1px solid rgba(255,255,255,.7)'
          }}>
            {/* blobs */}
            <div className="sh-hero-blob sh-blob-anim" style={{
              width:220, height:220,
              background: activeCategory==='tailoring' ? 'rgba(255,255,255,.08)' : 'rgba(100,160,255,.2)',
              top:-60, right:80
            }} />
            <div className="sh-hero-blob sh-blob-anim" style={{
              width:140, height:140,
              background: activeCategory==='tailoring' ? 'rgba(255,255,255,.05)' : 'rgba(80,140,220,.15)',
              bottom:-40, left:40, animationDelay:'3s'
            }} />

            <div className="sh-hero-content sh-fade-up">
              <div className="sh-hero-tag" style={{
                background: activeCategory==='tailoring' ? 'rgba(255,255,255,.15)' : 'rgba(26,108,196,.12)',
                color: c.heroTextColor,
                border: activeCategory==='tailoring' ? '1px solid rgba(255,255,255,.25)' : '1px solid rgba(26,108,196,.2)'
              }}>✨ New Arrivals</div>
              <h1 className="sh-hero-title" style={{ color: c.heroTextColor }}>{c.title}</h1>
              <p className="sh-hero-sub" style={{ color: activeCategory==='tailoring' ? 'rgba(255,255,255,.8)' : 'rgba(26,60,100,.7)' }}>{c.sub}</p>
              <div className="sh-hero-badges">
                {['🚚 Free Delivery','🔒 Secure Pay','↩️ Easy Returns'].map(b => (
                  <span key={b} className="sh-hero-badge" style={{
                    background: activeCategory==='tailoring' ? 'rgba(255,255,255,.15)' : 'rgba(26,108,196,.1)',
                    color: c.heroTextColor,
                    border: activeCategory==='tailoring' ? '1px solid rgba(255,255,255,.2)' : '1px solid rgba(26,108,196,.15)'
                  }}>{b}</span>
                ))}
              </div>
            </div>
            <div className="sh-hero-emoji">{c.emoji}</div>
          </div>
        </div>
      </div>

      {/* Sub-category filter */}
      <CategoryFilter categories={c.subs} selected={sub} onSelect={setSub} />

      {/* Products */}
      <div className="sh-container sh-section" style={{ paddingTop:'32px' }}>
        <div className="sh-section-header">
          <h2 className="sh-section-title">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : sub === 'all' ? 'All Products' : c.subs.find(s=>s.id===sub)?.label}
          </h2>
          {!loading && <span className="sh-section-count">{products.length} items</span>}
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="sh-grid-products">
            {[...Array(10)].map((_,i) => (
              <div key={i} style={{ borderRadius:'24px', overflow:'hidden', background:'white', boxShadow:'var(--shadow-sm)' }}>
                <div className="sh-skel" style={{ height:'180px', borderRadius:0 }} />
                <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:'8px' }}>
                  <div className="sh-skel" style={{ height:'13px', width:'85%' }} />
                  <div className="sh-skel" style={{ height:'11px', width:'55%' }} />
                  <div className="sh-skel" style={{ height:'18px', width:'40%', marginTop:'4px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="sh-grid-products">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="sh-empty sh-scale-in">
            <div className="sh-empty-icon">🔍</div>
            <h3 className="sh-empty-title">
              {searchQuery ? `No results for "${searchQuery}"` : 'No products yet'}
            </h3>
            <p className="sh-empty-sub">
              {searchQuery ? 'Try a different search term' : 'Check back soon for new arrivals'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
