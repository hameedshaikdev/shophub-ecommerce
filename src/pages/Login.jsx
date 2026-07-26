import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useApp();
  const [form, setForm]         = useState({ email:'', password:'' });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const redirect = searchParams.get('redirect') || '/';

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const onSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      setUser(data.user); navigate(redirect);
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg)' }}>

      {/* ── Left decorative panel ── */}
      <div style={{ flex:'0 0 44%', background:'linear-gradient(160deg,#2D1250 0%,#4A1572 60%,#6d28d9 100%)', display:'none', alignItems:'center', justifyContent:'center', padding:'64px', position:'relative', overflow:'hidden' }} id="login-panel">
        {/* blobs */}
        <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,.06)', top:-80, right:-80, filter:'blur(40px)' }} />
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.05)', bottom:60, left:40, filter:'blur(30px)' }} />

        <div style={{ position:'relative', color:'white', textAlign:'center' }}>
          <div style={{ fontSize:'64px', marginBottom:'24px' }}>🛍️</div>
          <h2 style={{ fontSize:'36px', fontWeight:900, marginBottom:'16px', lineHeight:1.2 }}>Welcome to<br/>ShopHub</h2>
          <p style={{ opacity:.8, fontSize:'16px', lineHeight:1.7, marginBottom:'40px' }}>
            Quality tailoring tools &<br/>trendy women's fashion
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {['1000+ Products','5000+ Customers','Free Delivery','24/7 Support'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', borderRadius:'12px', padding:'10px 16px', fontSize:'14px', fontWeight:600 }}>
                <span style={{ color:'#86efac' }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:'420px' }}>

          <Link to="/" style={{ display:'inline-block', fontSize:'26px', fontWeight:900, background:'linear-gradient(135deg,#FC8019,#FF9F1C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'32px' }}>
            ShopHub
          </Link>

          <h1 style={{ fontSize:'30px', fontWeight:900, color:'var(--text)', marginBottom:'6px', letterSpacing:'-.5px' }}>Welcome back</h1>
          <p style={{ color:'var(--text-2)', marginBottom:'32px', fontSize:'15px' }}>Sign in to continue shopping</p>

          <div style={{ background:'white', borderRadius:'28px', padding:'36px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' }}>
            <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

              {error && (
                <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'12px', padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--danger)' }}>
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <Mail size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                  <input name="email" type="email" value={form.email} onChange={onChange} required
                    placeholder="you@example.com"
                    style={{ width:'100%', padding:'13px 14px 13px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontWeight:500, color:'var(--text)', fontFamily:'inherit', outline:'none', transition:'border .2s' }}
                    onFocus={e => e.target.style.borderColor='var(--primary)'}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                  <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={onChange} required
                    placeholder="••••••••"
                    style={{ width:'100%', padding:'13px 44px 13px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontWeight:500, color:'var(--text)', fontFamily:'inherit', outline:'none', transition:'border .2s' }}
                    onFocus={e => e.target.style.borderColor='var(--primary)'}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:'0', display:'flex' }}>
                    {showPwd ? <EyeOff size={16} color="var(--text-3)" /> : <Eye size={16} color="var(--text-3)" />}
                  </button>
                </div>
                <div style={{ textAlign:'right', marginTop:'8px' }}>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--primary)', cursor:'pointer' }}>Forgot password?</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="sh-btn"
                style={{ width:'100%', justifyContent:'center', marginTop:'4px', opacity: loading ? .6 : 1 }}>
                {loading ? 'Signing in…' : <>Sign In <ArrowRight size={15} /></>}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text-2)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Create account</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:900px) { #login-panel { display:flex !important; } }
      `}</style>
    </div>
  );
}
