import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

// This page handles the OAuth redirect from Google
// Supabase sends the user back here with a code in the URL
export default function AuthCallback() {
  const navigate  = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL query params
        const params   = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
        const code     = params.get('code') || hashParams.get('code');
        const errorMsg = params.get('error_description') || hashParams.get('error_description');

        if (errorMsg) {
          setError(errorMsg);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (data?.session) {
            // Session established — redirect to home
            navigate('/', { replace: true });
            return;
          }
        }

        // Fallback: check if session was already set (implicit flow)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/', { replace: true });
        } else {
          // No session — something went wrong
          setError('Login failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Login failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      gap: '16px',
    }}>
      <div style={{
        fontSize: '36px',
        fontWeight: 900,
        background: 'linear-gradient(135deg,#FC8019,#FF9F1C)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        AS HUB
      </div>

      {error ? (
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
          <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '8px' }}>{error}</p>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Redirecting to login...</p>
        </div>
      ) : (
        <>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid #E2E8F0',
            borderTop: '3px solid #FC8019',
            borderRadius: '50%',
            animation: 'spin .8s linear infinite',
          }} />
          <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
            Signing you in...
          </p>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
