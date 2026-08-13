import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Heart, LogOut, ChevronRight, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import SEO from '../components/common/SEO';

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

  const initial     = (user.user_metadata?.full_name || user.email || 'User').charAt(0).toUpperCase();
  const name        = user.user_metadata?.full_name || 'User';
  const phone       = user.user_metadata?.phone;
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month:'long', year:'numeric' })
    : 'Recent Member';

  const menuItems = [
    { icon:Package, label:'My Orders',   sub:'Track & manage order status', path:'/orders',   color:'#3B82F6', bg:'rgba(59,130,246,0.12)' },
    { icon:Heart,   label:'My Wishlist', sub:'Saved items & favorites',     path:'/wishlist', color:'#E94560', bg:'rgba(233,69,96,0.12)' },
    ...(user.email === ADMIN_EMAIL
      ? [{ icon:Shield, label:'Admin Panel', sub:'Manage products & orders', path:'/admin', color:'#10B981', bg:'rgba(16,185,129,0.12)' }]
      : []),
  ];

  return (
    <div style={{ background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)', minHeight:'100vh', padding:'40px 0 80px' }}>
      <SEO title="My Account | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/profile" />

      {/* Glass Header */}
      <div style={{ background:'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)', padding:'48px 24px 40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-100px', right:'-50px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(233,69,96,0.25) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="sh-container" style={{ maxWidth:'680px', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
            <div style={{
              width:'72px', height:'72px', borderRadius:'20px', flexShrink:0,
              background:'rgba(255,255,255,.2)', backdropFilter:'blur(16px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'32px', fontWeight:900, color:'white',
              border:'2px solid rgba(255,255,255,.4)', boxShadow:'0 8px 24px rgba(0,0,0,0.2)'
            }}>
              {initial}
            </div>
            <div>
              <span style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1.2px', color:'rgba(255,255,255,0.8)', background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:'9999px' }}>
                <Sparkles size={11} style={{ verticalAlign:'middle', marginRight:'4px' }} />
                Member Profile
              </span>
              <h1 style={{ fontSize:'24px', fontWeight:900, color:'white', margin:'6px 0 2px', letterSpacing:'-0.5px' }}>
                {name}
              </h1>
              <p style={{ color:'rgba(255,255,255,.85)', fontSize:'13px', fontWeight:500 }}>{user.email}</p>
              <p style={{ color:'rgba(255,255,255,.6)', fontSize:'11px', marginTop:'2px', fontWeight:500 }}>
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sh-container" style={{ maxWidth:'680px', padding:'24px 16px 0' }}>

        {/* Account details */}
        <div style={{ background:'rgba(255, 255, 255, 0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderRadius:'28px', overflow:'hidden',
          boxShadow:'0 10px 32px rgba(15,23,42,0.06)', border:'1px solid rgba(255, 255, 255, 0.9)', marginBottom:'16px' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(226,232,240,0.8)' }}>
            <h2 style={{ fontSize:'15px', fontWeight:900, color:'#0F172A', letterSpacing:'-0.3px' }}>Account Information</h2>
          </div>
          {[
            { label:'Email Address', value: user.email },
            ...(phone ? [{ label:'Phone Number', value: phone }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', padding:'16px 24px',
              borderBottom:'1px solid rgba(226,232,240,0.6)' }}>
              <span style={{ fontSize:'13px', fontWeight:600, color:'#64748B' }}>{label}</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'#0F172A' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background:'rgba(255, 255, 255, 0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderRadius:'28px', overflow:'hidden',
          boxShadow:'0 10px 32px rgba(15,23,42,0.06)', border:'1px solid rgba(255, 255, 255, 0.9)', marginBottom:'16px' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(226,232,240,0.8)' }}>
            <h2 style={{ fontSize:'15px', fontWeight:900, color:'#0F172A', letterSpacing:'-0.3px' }}>My Activity</h2>
          </div>
          {menuItems.map(({ icon:Icon, label, sub, path, color, bg }) => (
            <Link key={path} to={path}
              style={{ display:'flex', alignItems:'center', gap:'16px',
                padding:'16px 24px', textDecoration:'none',
                borderBottom:'1px solid rgba(226,232,240,0.6)', transition:'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(241,245,249,0.5)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width:'44px', height:'44px', borderRadius:'16px', background:bg,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'14px', fontWeight:800, color:'#0F172A', marginBottom:'2px' }}>{label}</p>
                <p style={{ fontSize:'12px', color:'#64748B', fontWeight:500 }}>{sub}</p>
              </div>
              <ChevronRight size={18} color="#94A3B8" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ width:'100%', display:'flex', alignItems:'center',
            justifyContent:'center', gap:'10px', padding:'16px',
            borderRadius:'9999px', background:'rgba(255,255,255,0.85)', color:'#E94560',
            fontWeight:800, fontSize:'15px', border:'1px solid rgba(233,69,96,0.3)',
            cursor:'pointer', boxShadow:'0 4px 16px rgba(233,69,96,0.1)', transition:'all .25s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(233,69,96,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.85)'}>
          <LogOut size={18} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
