import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Package, Heart, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

const ADMIN_EMAIL = 'as.businezzz@gmail.com';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useApp();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const initial     = (user.user_metadata?.full_name || user.email).charAt(0).toUpperCase();
  const name        = user.user_metadata?.full_name || 'User';
  const phone       = user.user_metadata?.phone;
  const memberSince = new Date(user.created_at).toLocaleDateString('en-IN',
    { month:'long', year:'numeric' });

  const menuItems = [
    { icon:Package, label:'My Orders',   sub:'Track & manage orders', path:'/orders',   color:'#3B82F6', bg:'#EFF6FF' },
    { icon:Heart,   label:'My Wishlist', sub:'Saved items',           path:'/wishlist', color:'#EF4444', bg:'#FEF2F2' },
    ...(user.email === ADMIN_EMAIL
      ? [{ icon:Shield, label:'Admin Panel', sub:'Manage products & orders', path:'/admin', color:'#FC8019', bg:'#FFF7ED' }]
      : []),
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'80px' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#FC8019,#FF9F1C)', padding:'36px 24px 32px' }}>
        <div className="container-center" style={{ maxWidth:'680px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{
              width:'64px', height:'64px', borderRadius:'20px', flexShrink:0,
              background:'rgba(255,255,255,.25)', backdropFilter:'blur(10px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'28px', fontWeight:900, color:'white',
              border:'2px solid rgba(255,255,255,.3)',
            }}>
              {initial}
            </div>
            <div>
              <h1 style={{ fontSize:'22px', fontWeight:900, color:'white', marginBottom:'4px' }}>
                {name}
              </h1>
              <p style={{ color:'rgba(255,255,255,.8)', fontSize:'13px' }}>{user.email}</p>
              <p style={{ color:'rgba(255,255,255,.6)', fontSize:'12px', marginTop:'2px' }}>
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-center" style={{ maxWidth:'680px', padding:'16px' }}>

        {/* Account details */}
        <div style={{ background:'white', borderRadius:'20px', overflow:'hidden',
          boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', marginBottom:'12px' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>Account Details</h2>
          </div>
          {[
            { label:'Email', value: user.email },
            ...(phone ? [{ label:'Phone', value: phone }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', padding:'14px 20px',
              borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-3)' }}>{label}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background:'white', borderRadius:'20px', overflow:'hidden',
          boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', marginBottom:'12px' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>My Activity</h2>
          </div>
          {menuItems.map(({ icon:Icon, label, sub, path, color, bg }) => (
            <Link key={path} to={path}
              style={{ display:'flex', alignItems:'center', gap:'14px',
                padding:'14px 20px', textDecoration:'none',
                borderBottom:'1px solid var(--border)', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background='white'}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:bg,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'14px', fontWeight:800, color:'var(--text)', marginBottom:'2px' }}>{label}</p>
                <p style={{ fontSize:'12px', color:'var(--text-3)' }}>{sub}</p>
              </div>
              <ChevronRight size={18} color="var(--text-3)" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ width:'100%', display:'flex', alignItems:'center',
            justifyContent:'center', gap:'10px', padding:'15px',
            borderRadius:'16px', background:'white', color:'#EF4444',
            fontWeight:800, fontSize:'15px', border:'1.5px solid #FECACA',
            cursor:'pointer', boxShadow:'var(--shadow-xs)', transition:'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background='#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background='white'}>
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
