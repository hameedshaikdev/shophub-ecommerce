import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../config/supabase';

const TAILORING_BG = 'linear-gradient(180deg,#2D1250 0%,#4A1572 60%,#3B0F6B 100%)';
const FASHION_BG   = 'linear-gradient(180deg,#B8D4F0 0%,#DCEEFF 100%)';

export default function Header() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === '/';
  const { activeCategory, setActiveCategory, getCartCount, user, setUser } = useApp();
  const [q, setQ]               = useState('');
  const [open, setOpen]         = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef                 = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeCategory);
  }, [activeCategory]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); navigate('/'); setDropdown(false);
  };

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sh-header">
      <div className="sh-container">
        <nav className="sh-navbar">

          {/* ── Logo ── */}
          <Link to="/" className="sh-logo" style={{ marginRight: '24px' }}>ShopHub</Link>

          {/* ── Nav Links ── */}
          <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
            {[['/', 'Home'], ['/about', 'About']].map(([p, l]) => (
              <Link key={p} to={p}
                className={`sh-nav-link${location.pathname === p ? ' active' : ''}`}>{l}</Link>
            ))}
          </div>

          {/* ── Search Bar (center, flex grows) ── */}
          <form onSubmit={search} style={{ flex:1, maxWidth:'420px', margin:'0 20px' }}>
            <div className="sh-search-wrap" style={{ width:'100%' }}>
              <Search size={17} color="var(--text-3)" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={activeCategory === 'tailoring' ? 'Search tailoring tools…' : 'Search fashion items…'}
              />
            </div>
          </form>

          {/* ── Action Icons ── */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
            {user ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" className="sh-icon-btn" title="Wishlist">
                  <Heart size={18} color="var(--text-2)" />
                </Link>

                {/* Cart */}
                <Link to="/cart" className="sh-icon-btn" title="Cart" style={{ position:'relative' }}>
                  <ShoppingCart size={18} color="var(--text-2)" />
                  {getCartCount() > 0 && (
                    <span className="sh-badge">{getCartCount() > 9 ? '9+' : getCartCount()}</span>
                  )}
                </Link>

                {/* User dropdown */}
                <div style={{ position:'relative' }} ref={dropRef}>
                  <button className="sh-icon-btn" onClick={() => setDropdown(!dropdown)} title="Account">
                    <User size={18} color="var(--text-2)" />
                  </button>
                  {dropdown && (
                    <div className="sh-surface" style={{
                      position:'absolute', right:0, top:'calc(100% + 10px)',
                      width:'210px', overflow:'hidden', zIndex:300,
                      animation:'sh-scaleIn .2s var(--spring)'
                    }}>
                      {/* User info */}
                      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', background:'#fafafa' }}>
                        <p style={{ fontSize:'13px', fontWeight:800, color:'var(--text)' }}>
                          {user.user_metadata?.full_name || 'My Account'}
                        </p>
                        <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{user.email}</p>
                      </div>

                      {[['My Profile','/profile'],['My Orders','/orders'],['Wishlist','/wishlist'],['Cart','/cart']].map(([l, p]) => (
                        <Link key={p} to={p} onClick={() => setDropdown(false)}
                          style={{ display:'block', padding:'11px 16px', fontSize:'14px', fontWeight:600, color:'var(--text)', borderBottom:'1px solid var(--border)' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          {l}
                        </Link>
                      ))}

                      {user.email === 'as.businezzz@gmail.com' && (
                        <Link to="/admin" onClick={() => setDropdown(false)}
                          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 16px', fontSize:'14px', fontWeight:700, color:'var(--purple)', borderBottom:'1px solid var(--border)' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          <Shield size={14} /> Admin Panel
                        </Link>
                      )}

                      <button onClick={logout}
                        style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'11px 16px', fontSize:'14px', fontWeight:700, color:'var(--danger)', background:'none' }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Show cart icon even for guests */}
                <Link to="/cart" className="sh-icon-btn" title="Cart" style={{ position:'relative' }}>
                  <ShoppingCart size={18} color="var(--text-2)" />
                  {getCartCount() > 0 && (
                    <span className="sh-badge">{getCartCount() > 9 ? '9+' : getCartCount()}</span>
                  )}
                </Link>
                <Link to="/login" className="sh-btn sh-btn-sm">Login</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="sh-icon-btn"
              onClick={() => setOpen(!open)}
              style={{ display:'none' }}
              id="sh-hamburger"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Search ── */}
        <div id="sh-mobile-search" style={{ paddingBottom:'12px', display:'none' }}>
          <form onSubmit={search}>
            <div className="sh-search-wrap" style={{ maxWidth:'100%' }}>
              <Search size={17} color="var(--text-3)" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={activeCategory === 'tailoring' ? 'Search tailoring tools…' : 'Search fashion items…'}
              />
            </div>
          </form>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {open && (
        <div style={{ background:'white', borderTop:'1px solid var(--border)', padding:'12px 0' }}>
          <div className="sh-container" style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
            {[['/', 'Home'], ['/about', 'About']].map(([p, l]) => (
              <Link key={p} to={p} onClick={() => setOpen(false)}
                style={{ padding:'12px 16px', borderRadius:'12px', fontWeight:600, fontSize:'15px',
                  color: location.pathname === p ? 'var(--primary)' : 'var(--text)',
                  background: location.pathname === p ? 'rgba(252,128,25,.06)' : 'transparent' }}>
                {l}
              </Link>
            ))}
            {user ? (
              <>
                {[['My Profile','/profile'],['My Orders','/orders'],['Wishlist','/wishlist']].map(([l, p]) => (
                  <Link key={p} to={p} onClick={() => setOpen(false)}
                    style={{ padding:'12px 16px', borderRadius:'12px', fontWeight:600, fontSize:'15px', color:'var(--text)' }}>
                    {l}
                  </Link>
                ))}
                <button onClick={logout}
                  style={{ padding:'12px 16px', borderRadius:'12px', fontWeight:700, fontSize:'15px', color:'var(--danger)', background:'none', textAlign:'left', border:'none', cursor:'pointer' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="sh-btn"
                style={{ margin:'8px 0', justifyContent:'center' }}>
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Category Switcher (home only) ── */}
      {isHome && (
        <div className="sh-switcher-wrap"
          style={{ background: activeCategory === 'tailoring' ? TAILORING_BG : FASHION_BG }}>
          <div className="sh-container" style={{ display:'flex', justifyContent:'center', paddingBottom:'20px' }}>
            <div className="sh-switcher">
              {[
                { id:'tailoring', label:'Tailoring Tools', emoji:'🪡' },
                { id:'fashion',   label:"Women's Fashion", emoji:'👗' },
              ].map(cat => (
                <button key={cat.id}
                  className={`sh-switcher-btn${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={activeCategory === cat.id ? {
                    color: cat.id === 'tailoring' ? '#4A1572' : '#1a6fc4'
                  } : {}}>
                  <span className="sh-switcher-emoji">{cat.emoji}</span>
                  <span className="sh-switcher-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive CSS injected via style tag ── */}
      <style>{`
        @media (max-width: 768px) {
          #sh-hamburger  { display: flex !important; }
          #sh-mobile-search { display: block !important; }
        }
        @media (min-width: 769px) {
          #sh-hamburger  { display: none !important; }
          #sh-mobile-search { display: none !important; }
        }
      `}</style>
    </header>
  );
}
