import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';

const Field = ({ label, name, type='text', placeholder, icon: Icon, value, onChange, right }) => (
  <div>
    <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{label}</label>
    <div style={{ position:'relative' }}>
      <Icon size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
      <input name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder}
        style={{ width:'100%', padding:'13px 14px 13px 42px', paddingRight: right ? '44px' : '14px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontWeight:500, color:'var(--text)', fontFamily:'inherit', outline:'none', transition:'border .2s' }}
        onFocus={e => e.target.style.borderColor='var(--primary)'}
        onBlur={e => e.target.style.borderColor='#e5e7eb'} />
      {right}
    </div>
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]             = useState({ fullName:'', email:'', phone:'', password:'', confirm:'' });
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const onSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.fullName, phone: form.phone } },
      });
      if (error) throw error;
      navigate('/login');
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg)' }}>

      {/* ── Left panel ── */}
      <div style={{ flex:'0 0 44%', background:'linear-gradient(160deg,#831843 0%,#9d174d 60%,#db2777 100%)', display:'none', alignItems:'center', justifyContent:'center', padding:'64px', position:'relative', overflow:'hidden' }} id="signup-panel">
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,.06)', top:-60, right:-60, filter:'blur(40px)' }} />
        <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.05)', bottom:80, left:40, filter:'blur(30px)' }} />
        <div style={{ position:'relative', color:'white', textAlign:'center' }}>
          <div style={{ fontSize:'64px', marginBottom:'24px' }}>✨</div>
          <h2 style={{ fontSize:'36px', fontWeight:900, marginBottom:'16px', lineHeight:1.2 }}>Join<br/>ShopHub</h2>
          <p style={{ opacity:.8, fontSize:'16px', lineHeight:1.7, marginBottom:'40px' }}>
            Create an account and enjoy<br/>exclusive deals & fast delivery
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {['Free to join','Exclusive member deals','Order tracking','Easy returns'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', borderRadius:'12px', padding:'10px 16px', fontSize:'14px', fontWeight:600 }}>
                <span style={{ color:'#86efac' }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:'420px' }}>
          <Link to="/" style={{ display:'inline-block', fontSize:'26px', fontWeight:900, background:'linear-gradient(135deg,#FC8019,#FF9F1C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'32px' }}>
            ShopHub
          </Link>
          <h1 style={{ fontSize:'30px', fontWeight:900, color:'var(--text)', marginBottom:'6px', letterSpacing:'-.5px' }}>Create account</h1>
          <p style={{ color:'var(--text-2)', marginBottom:'32px', fontSize:'15px' }}>Start your shopping journey today</p>

          <div style={{ background:'white', borderRadius:'28px', padding:'36px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' }}>
            <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {error && (
                <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'12px', padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--danger)' }}>
                  {error}
                </div>
              )}

              <Field label="Full Name"     name="fullName" placeholder="John Doe"           icon={User}  value={form.fullName} onChange={onChange} />
              <Field label="Email Address" name="email"    placeholder="you@example.com"    icon={Mail}  value={form.email}    onChange={onChange} type="email" />
              <Field label="Phone Number"  name="phone"    placeholder="+91 98765 43210"    icon={Phone} value={form.phone}    onChange={onChange} type="tel" />

              {/* Password */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={onChange} required placeholder="••••••••" minLength={6}
                    style={{ width:'100%', padding:'13px 44px 13px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none', transition:'border .2s' }}
                    onFocus={e => e.target.style.borderColor='var(--primary)'}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                    {showPwd ? <EyeOff size={16} color="var(--text-3)" /> : <Eye size={16} color="var(--text-3)" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input name="confirm" type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={onChange} required placeholder="••••••••"
                    style={{ width:'100%', padding:'13px 44px 13px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none', transition:'border .2s' }}
                    onFocus={e => e.target.style.borderColor='var(--primary)'}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                    {showConfirm ? <EyeOff size={16} color="var(--text-3)" /> : <Eye size={16} color="var(--text-3)" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="sh-btn"
                style={{ width:'100%', justifyContent:'center', marginTop:'4px', opacity: loading ? .6 : 1 }}>
                {loading ? 'Creating account…' : <>Create Account <ArrowRight size={15} /></>}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text-2)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:900px) { #signup-panel { display:flex !important; } }
      `}</style>
    </div>
  );
}
