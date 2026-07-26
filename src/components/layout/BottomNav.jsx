import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const location = useLocation();
  const { getCartCount, user } = useApp();

  const items = [
    { to: '/',                             icon: Home,         label: 'Home'    },
    { to: '/cart',     badge: getCartCount(), icon: ShoppingCart, label: 'Cart'    },
    { to: '/wishlist',                     icon: Heart,        label: 'Saved'   },
    { to: user ? '/profile' : '/login',    icon: User,         label: user ? 'Me' : 'Login' },
  ];

  return (
    <nav className="sh-bottom-nav" style={{ display:'flex' }}>
      {items.map(({ to, icon: Icon, label, badge }) => {
        const active = location.pathname === to;
        return (
          <Link key={to} to={to}
            className={`sh-bnav-item${active ? ' active' : ''}`}>
            <div style={{ position:'relative' }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              {badge > 0 && (
                <span className="sh-badge" style={{ top:'-6px', right:'-8px' }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span>{label}</span>
            {active && <span className="sh-bnav-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
