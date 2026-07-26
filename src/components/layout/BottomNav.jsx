import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User, Grid } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const location = useLocation();
  const { getCartCount, user } = useApp();
  const count = getCartCount();

  const items = [
    { to:'/',                            icon:Home,         label:'Home'                      },
    { to:'/wishlist',                    icon:Heart,        label:'Wishlist'                  },
    { to:'/cart',        badge:count,    icon:ShoppingCart, label:'Cart'                      },
    { to:user?'/profile':'/login',       icon:User,         label:user?'Profile':'Login'      },
  ];

  // Hide on checkout, login, signup pages for cleaner UX
  const hide = ['/checkout', '/login', '/signup'].includes(location.pathname);
  if (hide) return null;

  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0,
      height:'64px',
      background:'rgba(255,255,255,.97)',
      backdropFilter:'blur(24px)',
      borderTop:'1px solid rgba(0,0,0,.07)',
      boxShadow:'0 -4px 24px rgba(0,0,0,.08)',
      display:'flex',
      alignItems:'center',
      justifyContent:'space-around',
      zIndex:998,
      paddingBottom:'env(safe-area-inset-bottom, 0px)',
    }}>
      {items.map(({ to, icon:Icon, label, badge }) => {
        const active = location.pathname === to ||
          (to === '/' && location.pathname === '/');
        return (
          <Link key={to} to={to} style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            gap:'3px', padding:'6px 20px', borderRadius:'16px',
            textDecoration:'none', position:'relative',
            transition:'all .2s',
            color: active ? 'var(--primary)' : '#94A3B8',
            fontWeight: active ? 800 : 600,
            fontSize:'10px',
            flex:1, maxWidth:'80px',
          }}>
            {/* Active indicator dot above icon */}
            {active && (
              <span style={{
                position:'absolute', top:'-1px',
                width:'4px', height:'4px', borderRadius:'50%',
                background:'var(--primary)',
              }} />
            )}

            <div style={{ position:'relative' }}>
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                fill={active && (to === '/wishlist') ? 'var(--primary)' : 'none'}
                color={active ? 'var(--primary)' : '#94A3B8'}
              />
              {badge > 0 && (
                <span style={{
                  position:'absolute', top:'-6px', right:'-8px',
                  background:'#FC8019', color:'white',
                  fontSize:'9px', fontWeight:800,
                  minWidth:'17px', height:'17px', borderRadius:'99px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  padding:'0 3px', border:'2px solid white',
                }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>

            <span style={{ letterSpacing:'.2px' }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
