import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import SEO from '../components/common/SEO';

export default function ResetPassword() {
  const navigate  = useNavigate();
  const [password, setPassword]   = useState('');
  const [confirm,  setConfirm]    = useState('');
  const [showPwd,  setShowPwd]    = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState('');
  const [success,  setSuccess]    = useState(false);

  useEffect(() => {
    // Supabase puts the token in the URL hash when user clicks reset link
    const hash = window.location.hash;
    if (!hash.includes('access_token') && !hash.includes('type=recovery')) {
      navigate('/login');
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true); setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#F0FDF4', border:'3px solid #16A34A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <CheckCircle size={36} color="#16A34A" />
          </div>
          <h2 style={{ fontSize:'22px', fontWeight:900, color:'var(--text)', marginBottom:'8px' }}>Password Updated! 🎉</h2>
          <p style={{ color:'var(--text-2)', fontSize:'14px' }}>Taking you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
      <SEO title="Reset Password | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/reset-password" />
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ fontSize:'40px', marginBottom:'8px' }}>🔐</div>
          <h1 style={{ fontSize:'22px', fontWeight:900, color:'var(--text)' }}>Set New Password</h1>
        </div>

        <div style={{ background:'white', borderRadius:'24px', padding:'28px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,.07)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'12px', padding:'10px 14px', fontSize:'13px', fontWeight:600, color:'#DC2626', marginBottom:'16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'7px' }}>New Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                <input type={showPwd?'text':'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 6 characters"
                  style={{ width:'100%', padding:'12px 44px 12px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--primary)'}
                  onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                  {showPwd ? <EyeOff size={16} color="var(--text-3)"/> : <Eye size={16} color="var(--text-3)"/>}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'7px' }}>Confirm Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="var(--text-3)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  placeholder="Repeat password"
                  style={{ width:'100%', padding:'12px 14px 12px 42px', borderRadius:'14px', border:'1.5px solid #e5e7eb', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--primary)'}
                  onBlur={e => e.target.style.borderColor='#e5e7eb'} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="sh-btn"
              style={{ width:'100%', justifyContent:'center', padding:'13px', opacity:loading?.6:1 }}>
              {loading ? 'Updating...' : 'Update Password ✓'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
