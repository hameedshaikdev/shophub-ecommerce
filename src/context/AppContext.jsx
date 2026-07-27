import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AppContext = createContext(null);

// ── Hook ────────────────────────────────────────────────────────────────────
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState('tailoring');
  const [cart,           setCart]           = useState([]);
  const [wishlist,       setWishlist]       = useState([]);
  const [user,           setUser]           = useState(null);
  const [loading,        setLoading]        = useState(true);

  // Load cart + wishlist from localStorage
  useEffect(() => {
    try {
      const c = localStorage.getItem('cart');
      const w = localStorage.getItem('wishlist');
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { localStorage.setItem('cart',     JSON.stringify(cart));    }, [cart]);
  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // Auth — handles page refresh, Google OAuth redirect, normal login
  useEffect(() => {
    // onAuthStateChange fires first with the exchanged session when PKCE
    // is used — including the INITIAL_SESSION event on every page load.
    // We rely solely on this listener to set user + clear loading.
    // getSession() is only used as a quick synchronous check to avoid
    // a blank flash on normal refreshes (non-OAuth pages).

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // INITIAL_SESSION fires on every mount (normal refresh or post-OAuth)
        if (event === 'INITIAL_SESSION') {
          setUser(session?.user ?? null);
          setLoading(false);
          return;
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
          setLoading(false);
          return;
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Safety net: if INITIAL_SESSION hasn't fired after 3 s, stop blocking
    const fallback = setTimeout(() => setLoading(false), 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  // Cart
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { ...product, quantity }];
    });
  };
  const removeFromCart     = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart          = ()   => setCart([]);
  const updateCartQuantity = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const getCartTotal = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getCartCount = () => cart.reduce((t, i) => t + i.quantity, 0);

  // Wishlist
  const addToWishlist      = (p)  => setWishlist(prev => prev.find(i => i.id === p.id) ? prev : [...prev, p]);
  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(i => i.id !== id));
  const isInWishlist       = (id) => wishlist.some(i => i.id === id);

  const value = {
    activeCategory, setActiveCategory,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartCount,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist,
    user, setUser, loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
