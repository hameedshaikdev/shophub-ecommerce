import { Globe, Share2, Search } from 'lucide-react';

export default function SeoEditor({ seoData = {}, onChange }) {
  const seo = seoData || {};

  const update = (field, value) => {
    onChange?.({ ...seo, [field]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={20} color="#2563EB" /> Search Engine Optimization (SEO) & Social Sharing
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>Configure how AS HUB homepage appears on Google search and social media shares</p>

        {/* Live Search Preview Box */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Google Search Preview</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1D4ED8', textDecoration: 'underline', marginBottom: '4px' }}>
            {seo.metaTitle || 'AS HUB — Premium Tailoring Tools & Women Fashion'}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginBottom: '4px' }}>{seo.canonicalUrl || 'https://ashub.com'}</div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            {seo.metaDescription || 'Shop professional tailoring tools, sewing machines, scissors, threads & premium women fashion online at AS HUB.'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Meta Title Tag</label>
            <input
              type="text"
              value={seo.metaTitle || ''}
              onChange={e => update('metaTitle', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Canonical URL</label>
            <input
              type="text"
              value={seo.canonicalUrl || ''}
              onChange={e => update('canonicalUrl', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Meta Description</label>
          <textarea
            rows={3}
            value={seo.metaDescription || ''}
            onChange={e => update('metaDescription', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>SEO Keywords (Comma Separated)</label>
          <input
            type="text"
            value={seo.keywords || ''}
            onChange={e => update('keywords', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          />
        </div>

        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={16} color="#2563EB" /> Open Graph (WhatsApp, Instagram, Facebook Preview)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>OG Share Title</label>
            <input
              type="text"
              value={seo.ogTitle || ''}
              onChange={e => update('ogTitle', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>OG Social Image URL</label>
            <input
              type="text"
              value={seo.ogImage || ''}
              onChange={e => update('ogImage', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'monospace' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
