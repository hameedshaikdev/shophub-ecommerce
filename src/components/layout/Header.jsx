import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Shield, Menu, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../config/supabase';

const TAILORING_BG = 'linear-gradient(180deg,#2D1250 0%,#4A1572 60%,#3B0F6B 100%)';
const FASHION_BG   = 'linear-gradient(180deg,#B8D4F0 0%,#DCEEFF 100%)';

const CATS = [
  { id:'tailoring', label:'Tailoring Tools', emoji:'🪡' },
  { id:'fashion',   label:"Women's Fashion", emoji:'👗' },
];

/* ── Sliding switcher ── */
function SwitcherPills({ activeCategory, setActiveCategory }) {
  const containerRef = useRef(null);
  const btn0Ref      = useRef(null);
  const btn1Ref      = useRef(null);
  const btnRefs      = [btn0Ref, btn1Ref];
  const [slider, setSlider] = useState({ left:5, width:100 });

  // Recalculate slider position whenever active changes or on mount
  useEffect(() => {
    const idx = CATS.findIndex(c => c.id === activeCategory);
    const btn = btnRefs[idx]?.current;
    const wrap = containerRef.current;
    if (!btn || !wrap) return;
    const wRect = wrap.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setSlider({
      left:  bRect.left - wRect.left,
      width: bRect.width,
    });
  }, [activeCategory]);

  return (
    <div ref={containerRef} className="sh-switcher">
      {/* The white sliding pill */}
      <div className="sh-switcher-slider" style={{ left: slider.left, width: slider.width }} />

      {CATS.map((cat, i) => (
        <button
          key={cat.id}
          ref={btnRefs[i]}
          className={`sh-switcher-btn${activeCategory === cat.id ? ' active' : ''}`}
          onClick={() => setActiveCategory(cat.id)}>
          <span className="sh-switcher-emoji">{cat.emoji}</span>
          <span className="sh-switcher-label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === '/';
  const { activeCategory, setActiveCategory, getCartCount, user, setUser } = useApp();
  const [q,        setQ]        = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [drawer,   setDrawer]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawer(false); }, [location.pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); navigate('/'); setDropdown(false); setDrawer(false);
  };

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/?q=${encodeURIComponent(q)}`); setQ(''); }
  };

  return (
    <>
      <header className="sh-header">
        <div className="sh-container">
          <nav className="sh-navbar" style={{ display:'flex', alignItems:'center', gap:'8px' }}>

            {/* ── Logo ── */}
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px',
              flexShrink:0, flex:1, textDecoration:'none' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'50%',
                border:'1.5px solid #1A1A2E', overflow:'hidden', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/logo.png" alt="AS HUB"
                  style={{ width:'140%', height:'140%', objectFit:'cover',
                    objectPosition:'center' }}
                  onError={e => { e.target.style.display='none'; }} />
              </div>
              <span style={{ fontSize:'18px', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.5px' }}>AS HUB</span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="sh-desktop-only" style={{ display:'flex', gap:'4px', alignItems:'center' }}>
              {[['/', 'Home'], ['/about', 'About']].map(([p, l]) => (
                <Link key={p} to={p}
                  className={`sh-nav-link${location.pathname === p ? ' active' : ''}`}>{l}
                </Link>
              ))}
            </div>

            {/* ── Search: inline on mobile (flex:1), desktop version separate ── */}
            {/* Desktop search */}
            <form onSubmit={search} className="sh-desktop-only" style={{ flex:1, maxWidth:'360px', margin:'0 12px' }}>
              <div className="sh-search-wrap">
                <Search size={17} color="var(--text-3)" />
                <input value={q} onChange={e => setQ(e.target.value)}
                  placeholder={activeCategory === 'tailoring' ? 'Search tailoring tools…' : 'Search fashion…'} />
              </div>
            </form>

            {/* Mobile search — inline in navbar */}
            <form onSubmit={search} className="sh-mobile-search-inline sh-mobile-only" style={{ flex:1 }}>
              <div className="sh-search-wrap" style={{ width:'100%', height:'36px', borderRadius:'99px', padding:'0 12px' }}>
                <Search size={15} color="var(--text-3)" />
                <input value={q} onChange={e => setQ(e.target.value)}
                  placeholder={activeCategory === 'tailoring' ? 'Search…' : 'Search…'}
                  style={{ fontSize:'13px' }} />
              </div>
            </form>

            {/* ── Actions ── */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>

              {user ? (
                <>
                  {/* Cart — desktop only (mobile has bottom nav) */}
                  <Link to="/cart" className="sh-icon-btn sh-desktop-only" title="Cart" style={{ position:'relative' }}>
                    <ShoppingCart size={18} color="var(--text-2)" />
                    {getCartCount() > 0 && (
                      <span className="sh-badge">{getCartCount() > 9 ? '9+' : getCartCount()}</span>
                    )}
                  </Link>

                  {/* Profile dropdown — desktop */}
                  <div className="sh-desktop-only" style={{ position:'relative' }} ref={dropRef}>
                    <button className="sh-icon-btn" onClick={() => setDropdown(!dropdown)}>
                      <User size={18} color="var(--text-2)" />
                    </button>
                    {dropdown && (
                      <div className="sh-surface" style={{
                        position:'absolute', right:0, top:'calc(100% + 10px)',
                        width:'210px', overflow:'hidden', zIndex:300,
                        animation:'sh-scaleIn .2s var(--spring)'
                      }}>
                        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', background:'#fafafa' }}>
                          <p style={{ fontSize:'13px', fontWeight:800, color:'var(--text)' }}>
                            {user.user_metadata?.full_name || 'My Account'}
                          </p>
                          <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{user.email}</p>
                        </div>
                        {[['My Profile','/profile'],['My Orders','/orders'],['Wishlist','/wishlist']].map(([l, p]) => (
                          <Link key={p} to={p} onClick={() => setDropdown(false)}
                            style={{ display:'block', padding:'11px 16px', fontSize:'14px', fontWeight:600, color:'var(--text)', borderBottom:'1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                            onMouseLeave={e => e.currentTarget.style.background='white'}>
                            {l}
                          </Link>
                        ))}
                        {user.email === 'as.businezzz@gmail.com' && (
                          <Link to="/admin" onClick={() => setDropdown(false)}
                            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 16px', fontSize:'14px', fontWeight:700, color:'var(--primary)', borderBottom:'1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                            onMouseLeave={e => e.currentTarget.style.background='white'}>
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={logout}
                          style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'11px 16px', fontSize:'14px', fontWeight:700, color:'#ef4444', background:'none' }}>
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="sh-btn sh-btn-sm sh-desktop-only">Login</Link>
              )}

              {/* Hamburger — mobile only */}
              <button className="sh-icon-btn sh-mobile-only" onClick={() => setDrawer(true)}>
                <Menu size={20} color="var(--text-2)" />
              </button>
            </div>
          </nav>

          {/* Mobile search below nav — hidden, search is now inline */}
        </div>

        {/* ── Category Switcher (home only) ── */}
        {isHome && (
          <div className="sh-switcher-wrap"
            style={{ background: activeCategory === 'tailoring' ? TAILORING_BG : FASHION_BG }}>
            <div className="sh-container" style={{ display:'flex', justifyContent:'center', paddingBottom:'20px' }}>
              <SwitcherPills
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
          </div>
        )}
      </header>

      {/* ══ Mobile Side Drawer ══════════════════════════════════════════════ */}
      {drawer && (
        <>
          {/* Backdrop */}
          <div onClick={() => setDrawer(false)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,.5)',
            zIndex:1000, backdropFilter:'blur(4px)'
          }} />

          {/* Drawer panel */}
          <div style={{
            position:'fixed', top:0, right:0, bottom:0, width:'78vw', maxWidth:'320px',
            background:'white', zIndex:1001, overflowY:'auto',
            boxShadow:'-8px 0 40px rgba(0,0,0,.18)',
            animation:'sh-slideIn .3s var(--spring)'
          }}>
            {/* Drawer header logo */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <img src="/logo.png" alt="AS HUB"
                  style={{ width:'36px', height:'36px', borderRadius:'50%',
                    objectFit:'cover', objectPosition:'center 20%',
                    border:'1.5px solid #E2E8F0' }} />
                <div>
                  {user ? (
                    <>
                      <p style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>
                        {user.user_metadata?.full_name || 'Welcome!'}
                      </p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{user.email}</p>
                    </>
                  ) : (
                    <p style={{ fontSize:'17px', fontWeight:900, color:'var(--text)' }}>AS HUB</p>
                  )}
                </div>
              </div>
              <button onClick={() => setDrawer(false)} style={{ padding:'8px', borderRadius:'12px', background:'var(--secondary)' }}>
                <X size={20} color="var(--text-2)" />
              </button>
            </div>

            {/* User avatar if logged in */}
            {user && (
              <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px', background:'#fafafa', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'var(--primary-grad)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:'20px' }}>
                  {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:'15px', color:'var(--text)' }}>{user.user_metadata?.full_name || 'User'}</p>
                  <p style={{ fontSize:'12px', color:'var(--text-3)' }}>View Profile</p>
                </div>
              </div>
            )}

            {/* Nav items */}
            <div style={{ padding:'8px 0' }}>
              {[
                { to:'/', label:'🏠 Home' },
                { to:'/about', label:'ℹ️ About' },
                ...(user ? [
                  { to:'/profile', label:'👤 My Profile' },
                  { to:'/orders',  label:'📦 My Orders' },
                  { to:'/wishlist',label:'❤️ Wishlist' },
                  { to:'/cart',    label:`🛒 Cart${getCartCount() > 0 ? ` (${getCartCount()})` : ''}` },
                ] : []),
                ...(user?.email === 'as.businezzz@gmail.com' ? [{ to:'/admin', label:'🛡️ Admin Panel', admin:true }] : []),
              ].map(({ to, label, admin }) => (
                <Link key={to} to={to}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', fontSize:'15px', fontWeight:700, color: admin ? 'var(--primary)' : 'var(--text)', borderBottom:'1px solid #f5f5f5' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f9f9f9'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  {label}
                  <ChevronRight size={16} color="var(--text-3)" />
                </Link>
              ))}
            </div>

            {/* Bottom buttons */}
            <div style={{ padding:'16px 20px', marginTop:'auto', borderTop:'1px solid var(--border)' }}>
              {user ? (
                <button onClick={logout}
                  style={{ width:'100%', padding:'14px', borderRadius:'16px', background:'#FEF2F2', color:'#EF4444', fontWeight:800, fontSize:'15px', border:'1px solid #FECACA' }}>
                  Sign Out
                </button>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  <Link to="/login"
                    style={{ display:'block', textAlign:'center', padding:'14px', borderRadius:'16px', background:'var(--primary-grad)', color:'white', fontWeight:800, fontSize:'15px' }}>
                    Login
                  </Link>
                  <Link to="/signup"
                    style={{ display:'block', textAlign:'center', padding:'14px', borderRadius:'16px', border:'1.5px solid var(--primary)', color:'var(--primary)', fontWeight:800, fontSize:'15px' }}>
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        .sh-mobile-only  { display: flex !important; }
        .sh-desktop-only { display: none !important; }
        @media(min-width: 768px) {
          .sh-mobile-only  { display: none !important; }
          .sh-desktop-only { display: flex !important; }
        }

        /* ── Mobile header — single row: logo | search | menu ── */
        @media(max-width: 767px) {
          .sh-navbar {
            height: 56px !important;
            gap: 10px !important;
          }
          .sh-logo { font-size: 20px !important; }

          /* Mobile search: inline in navbar, flex:1 */
          .sh-mobile-search-inline {
            flex: 1;
            display: flex !important;
            align-items: center;
          }
          .sh-mobile-search-inline .sh-search-wrap {
            width: 100% !important;
            height: 36px !important;
            border-radius: 99px !important;
            padding: 0 12px !important;
          }
          /* Hide the below-nav search div on mobile */
          .sh-mobile-search-below {
            display: none !important;
          }
        }

        @keyframes sh-slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
