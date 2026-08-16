import { useState, useEffect } from 'react';
import { Save, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { toast } from './AdminUtils';

/* ── Platform config ─────────────────────────────────────── */
const PLATFORMS = [
  {
    key: 'instagram_tailoring',
    label: 'Instagram – Tailoring',
    sub: '@as_tailoring_tools_textiles',
    url: 'https://www.instagram.com/as_tailoring_tools_textiles',
    countLabel: 'Followers',
    ic: '#E1306C',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ borderRadius: '10px' }}>
        <defs>
          <linearGradient id="ig-fill-mgr-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="24" height="24" rx="6.5" ry="6.5" fill="url(#ig-fill-mgr-1)" />
        <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.8" ry="3.8" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.3" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="16.1" cy="7.9" r="0.9" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    key: 'instagram_fashion',
    label: 'Instagram – Fashion',
    sub: '@asma_label.in',
    url: 'https://www.instagram.com/asma_label.in',
    countLabel: 'Followers',
    ic: '#E1306C',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ borderRadius: '10px' }}>
        <defs>
          <linearGradient id="ig-fill-mgr-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="24" height="24" rx="6.5" ry="6.5" fill="url(#ig-fill-mgr-2)" />
        <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.8" ry="3.8" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.3" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="16.1" cy="7.9" r="0.9" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    sub: '@astailoringtoolstextiles',
    url: 'https://youtube.com/@astailoringtoolstextiles',
    countLabel: 'Subscribers',
    ic: '#DC2626',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ borderRadius: '10px' }}>
        <rect width="24" height="24" rx="6.5" fill="#FF0000" />
        <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    sub: 'AS textile & tailoring',
    url: 'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr',
    countLabel: 'Followers',
    ic: '#1877F2',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ borderRadius: '10px' }}>
        <circle cx="12" cy="12" r="12" fill="#1877F2"/>
        <path d="M13.67 19.5V12.65H16.02L16.37 9.94H13.67V8.21C13.67 7.42 13.89 6.89 15.02 6.89L16.46 6.89V4.46C15.82 4.37 15.18 4.33 14.54 4.33C12.64 4.33 11.34 5.49 11.34 7.62V9.94H9V12.65H11.34V19.5H13.67Z" fill="#FFFFFF"/>
      </svg>
    ),
  },
];

/* ── Default fallback counts while DB isn't set up yet ───── */
const DEFAULTS = {
  instagram_tailoring: 0,
  instagram_fashion:   0,
  youtube:             0,
  facebook:            0,
};

export default function SocialMediaManager() {
  const [counts, setCounts]   = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [dbReady, setDbReady] = useState(true); // assume table exists

  /* ── Fetch from DB ─────────────────────────────────────── */
  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_media_stats')
        .select('platform, followers');

      if (error) {
        // Table might not exist yet
        if (error.code === '42P01') { setDbReady(false); }
        else { throw error; }
      } else if (data) {
        const map = { ...DEFAULTS };
        data.forEach(row => { map[row.platform] = row.followers; });
        setCounts(map);
      }
    } catch (err) {
      console.error(err);
      toast('Could not load stats: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  /* ── Save to DB ────────────────────────────────────────── */
  async function handleSave() {
    setSaving(true);
    try {
      const ops = PLATFORMS.map(p =>
        supabase
          .from('social_media_stats')
          .update({ followers: parseInt(counts[p.key]) || 0, updated_at: new Date().toISOString() })
          .eq('platform', p.key)
      );
      const results = await Promise.all(ops);
      const err = results.find(r => r.error);
      if (err) throw err.error;
      toast('Social media stats saved!', 'success');
    } catch (err) {
      console.error(err);
      toast('Save failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  const S = {
    width: '100%', padding: '10px 12px', borderRadius: '10px',
    border: '1.5px solid #E2E8F0', fontSize: '15px', fontFamily: 'inherit',
    fontWeight: 800, color: '#0F172A', outline: 'none', boxSizing: 'border-box',
    background: 'white',
  };

  /* ── DB not set up yet ─────────────────────────────────── */
  if (!dbReady) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '16px', padding: '20px' }}>
          <p style={{ fontSize: '15px', fontWeight: 800, color: '#C2410C', marginBottom: '8px' }}>
            Database table not set up yet
          </p>
          <p style={{ fontSize: '13px', color: '#9A3412', lineHeight: 1.7, marginBottom: '12px' }}>
            Run the SQL file <strong>database-social-media.sql</strong> in your Supabase dashboard first.
          </p>
          <ol style={{ fontSize: '13px', color: '#9A3412', lineHeight: 2, paddingLeft: '20px' }}>
            <li>Go to supabase.com/dashboard → your project</li>
            <li>Click <strong>SQL Editor</strong> → New Query</li>
            <li>Paste contents of <code>database-social-media.sql</code></li>
            <li>Click <strong>Run</strong></li>
            <li>Come back here and refresh</li>
          </ol>
          <button onClick={fetchStats}
            style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '10px', background: '#1A1A2E', color: 'white', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Main UI ───────────────────────────────────────────── */
  return (
    <div style={{ padding: '20px 16px', maxWidth: '860px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
          Social Media Stats
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Enter your current real follower/subscriber counts. They update instantly on the About page.
        </p>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {PLATFORMS.map(p => (
          <div key={p.key} style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>

            {/* Platform header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{p.label}</p>
                <p style={{ fontSize: '11px', color: p.ic, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.sub}</p>
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ color: '#94A3B8', display: 'flex', flexShrink: 0 }}
                title="Open profile">
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Count input */}
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: '6px' }}>
              {p.countLabel}
            </label>
            <input
              type="number"
              min="0"
              value={loading ? '' : counts[p.key]}
              onChange={e => setCounts(prev => ({ ...prev, [p.key]: e.target.value }))}
              placeholder={loading ? 'Loading...' : 'e.g. 2500'}
              disabled={loading}
              style={S}
            />

            {/* Live preview */}
            {!loading && counts[p.key] > 0 && (
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', margin: '6px 0 0' }}>
                Displays as: <strong style={{ color: '#0F172A' }}>
                  {counts[p.key] >= 1000
                    ? `${(counts[p.key] / 1000).toFixed(1)}K+`
                    : `${counts[p.key]}+`}
                </strong>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button onClick={fetchStats} disabled={loading || saving}
          style={{ padding: '11px 18px', borderRadius: '10px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: (loading || saving) ? 0.5 : 1 }}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>

        <button onClick={handleSave} disabled={loading || saving}
          style={{ padding: '11px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800,
            background: (loading || saving) ? '#E2E8F0' : 'linear-gradient(135deg,#1A1A2E,#0F3460)',
            color: (loading || saving) ? '#94A3B8' : 'white',
            boxShadow: (loading || saving) ? 'none' : '0 4px 14px rgba(26,26,46,.2)',
            opacity: (loading || saving) ? 0.7 : 1 }}>
          <Save size={14} />
          {saving ? 'Saving...' : 'Save to Website'}
        </button>
      </div>

      {/* Tip */}
      <div style={{ marginTop: '20px', padding: '14px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px' }}>
        <p style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 700, margin: '0 0 4px' }}>How to use</p>
        <p style={{ fontSize: '12px', color: '#3B82F6', margin: 0, lineHeight: 1.7 }}>
          Open each social media account, check the current follower/subscriber number, type it above, then click <strong>Save to Website</strong>.
          The About page updates immediately for all visitors. Do this whenever your numbers grow.
        </p>
      </div>
    </div>
  );
}
