import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';
import SEO from '../components/common/SEO';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useApp();
  const redirect = searchParams.get('redirect') || '/';

  const [form,         setForm]         = useState({ email:'', password:'' });
  const [showPwd,      setShowPwd]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [googleLoad,   setGoogleLoad]   = useState(false);
  const [error,        setError]        = useState('');
  const [forgotMode,   setForgotMode]   = useState(false);
  const [forgotEmail,  setForgotEmail]  = useState('');
  const [forgotSent,   setForgotSent]   = useState(false);
  const [forgotLoad,   setForgotLoad]   = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // ── Email / Password Login ───────────────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      if (error) throw error;
      setUser(data.user);
      navigate(redirect);
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Wrong email or password. Please try again.'
        : err.message);
    } finally { setLoading(false); }
  };

  // ── Google Sign In ───────────────────────────────────────────────────────
  const onGoogle = async () => {
    setGoogleLoad(true); setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoad(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────────────────────
  const onForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) { setError('Please enter your email address.'); return; }
    setForgotLoad(true); setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail.trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (error) throw error;
      setForgotSent(true);
    } catch (err) {
      setError(err.message);
    } finally { setForgotLoad(false); }
  };

  // ── Forgot Password Screen ───────────────────────────────────────────────
  if (forgotMode) {
    return (
      <div style={{ flex:'1 0 auto', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'40px 20px', width:'100%', boxSizing:'border-box' }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>
          <button onClick={() => { setForgotMode(false); setForgotSent(false); setError(''); }}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', color:'var(--text-2)', fontSize:'14px', fontWeight:700, marginBottom:'24px' }}>
            ← Back to Login
          </button>

          <div style={{ background:'white', borderRadius:'28px', padding:'36px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' }}>
            {forgotSent ? (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>📧</div>
                <h2 style={{ fontSize:'22px', fontWeight:900, color:'var(--text)', marginBottom:'8px' }}>Check Your Email!</h2>
                <p style={{ color:'var(--text-2)', fontSize:'14px', lineHeight:1.7, marginBottom:'24px' }}>
                  We sent a password reset link to<br/>
                  <strong style={{ color:'var(--text)' }}>{forgotEmail}</strong>
                </p>
                <p style={{ fontSize:'13px', color:'var(--text-3)', marginBottom:'20px' }}>
                  Didn't receive it? Check spam folder or try again.
                </p>
                <button onClick={() => setForgotSent(false)}
                  style={{ width:'100%', padding:'13px', borderRadius:'14px', background:'var(--primary-grad)', color:'white', fontWeight:800, fontSize:'15px', border:'none', cursor:'pointer' }}>
                  Resend Email
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔑</div>
                <h2 style={{ fontSize:'22px', fontWeight:900, color:'var(--text)', marginBottom:'6px' }}>Forgot Password?</h2>
                <p style={{ color:'var(--text-2)', fontSize:'14px', marginBottom:'24px', lineHeight:1.6 }}>
                  No worries! Enter your email and we'll send you a reset link instantly.
                </p>

                {error && (
                  <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'12px', padding:'10px 14px', fontSize:'13px', fontWeight:600, color:'#DC2626', marginBottom:'16px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={onForgotSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  <div>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
                      Your Email Address
                    </label>
                    <div style={{ position:'relative' }}>
                      <Mail size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                      <input
                        type="email" value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com" required
                        style={{ width:'100%', padding:'13px 14px 13px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
                        onFocus={e => e.target.style.borderColor='var(--primary)'}
                        onBlur={e => e.target.style.borderColor='#e5e7eb'}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoad}
                    style={{ padding:'13px', borderRadius:'14px', background:'var(--primary-grad)', color:'white', fontWeight:800, fontSize:'15px', border:'none', cursor:'pointer', opacity:forgotLoad?.6:1 }}>
                    {forgotLoad ? 'Sending...' : 'Send Reset Link 📧'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main Login Screen ────────────────────────────────────────────────────
  return (
    <div style={{ flex:'1 0 auto', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'40px 20px', width:'100%', boxSizing:'border-box' }}>
      <SEO title="Sign In | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/login" />
      <div style={{ width:'100%', maxWidth:'420px' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <Link to="/" style={{ fontSize:'28px', fontWeight:900, background:'var(--primary-grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', textDecoration:'none' }}>
            AS HUB
          </Link>
          <p style={{ color:'var(--text-3)', fontSize:'13px', marginTop:'4px' }}>Quality Tailoring & Fashion</p>
        </div>

        <div style={{ background:'white', borderRadius:'28px', padding:'28px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' }}>
          <h1 style={{ fontSize:'22px', fontWeight:900, color:'var(--text)', marginBottom:'4px', textAlign:'center' }}>Welcome Back 👋</h1>
          <p style={{ color:'var(--text-2)', fontSize:'13px', marginBottom:'24px', textAlign:'center' }}>Sign in to continue shopping</p>

          {error && (
            <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'12px', padding:'10px 14px', fontSize:'13px', fontWeight:600, color:'#DC2626', marginBottom:'16px' }}>
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button onClick={onGoogle} disabled={googleLoad}
            style={{ width:'100%', padding:'13px', borderRadius:'14px', background:'white', border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', fontSize:'14px', fontWeight:700, color:'var(--text)', boxShadow:'var(--shadow-xs)', marginBottom:'16px', transition:'all .2s', opacity:googleLoad?.7:1 }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#94A3B8'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#E2E8F0'}>
            {/* Google G logo */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {googleLoad ? 'Opening Google...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
            <div style={{ flex:1, height:'1px', background:'#E2E8F0' }} />
            <span style={{ fontSize:'12px', color:'var(--text-3)', fontWeight:600 }}>or sign in with email</span>
            <div style={{ flex:1, height:'1px', background:'#E2E8F0' }} />
          </div>

          {/* Email Login Form */}
          <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'7px' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                <input name="email" type="email" value={form.email} onChange={onChange} required
                  placeholder="you@example.com"
                  style={{ width:'100%', padding:'12px 14px 12px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--primary)'}
                  onBlur={e => e.target.style.borderColor='#e5e7eb'} />
              </div>
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>Password</label>
                <button type="button" onClick={() => setForgotMode(true)}
                  style={{ fontSize:'12px', fontWeight:700, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                <input name="password" type={showPwd?'text':'password'} value={form.password} onChange={onChange} required
                  placeholder="••••••••"
                  style={{ width:'100%', padding:'12px 44px 12px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--primary)'}
                  onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0, margin:0 }}>
                  {showPwd ? <EyeOff size={16} color="var(--text-3)"/> : <Eye size={16} color="var(--text-3)"/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="sh-btn"
              style={{ width:'100%', justifyContent:'center', padding:'13px', opacity:loading?.6:1 }}>
              {loading ? 'Signing in…' : <><span>Sign In</span> <ArrowRight size={16}/></>}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'13px', color:'var(--text-2)' }}>
            New customer?{' '}
            <Link to="/signup" style={{ color:'var(--primary)', fontWeight:800, textDecoration:'none' }}>
              Create account — it's free!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
