import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

export default function BannersEditor({ bannersData = [], onChange }) {
  const banners = bannersData || [];

  const handleAddBanner = () => {
    const newBanner = {
      id: 'banner-' + Date.now(),
      title: 'New Promotional Banner',
      subtitle: 'Special offer description text here',
      btnText: 'Claim Offer',
      btnLink: '#products',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      active: true,
      position: 'middle',
    };
    onChange?.([...banners, newBanner]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = banners.map(b => b.id === id ? { ...b, [field]: value } : b);
    onChange?.(updated);
  };

  const handleDelete = (id) => {
    onChange?.(banners.filter(b => b.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Homepage Promotional Banners</h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Manage campaign promotional banners placed between homepage sections</p>
        </div>

        <button
          onClick={handleAddBanner}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', borderRadius: '12px', background: '#2563EB', color: '#FFF',
            fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add Promotional Banner
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {banners.map(banner => (
          <div
            key={banner.id}
            style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '14px', opacity: banner.active ? 1 : 0.6
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Banner Title</label>
                <input
                  type="text"
                  value={banner.title || ''}
                  onChange={e => handleUpdate(banner.id, 'title', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Subtitle</label>
                <input
                  type="text"
                  value={banner.subtitle || ''}
                  onChange={e => handleUpdate(banner.id, 'subtitle', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Button Text</label>
                <input
                  type="text"
                  value={banner.btnText || ''}
                  onChange={e => handleUpdate(banner.id, 'btnText', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Banner Image URL</label>
                <input
                  type="text"
                  value={banner.imageUrl || ''}
                  onChange={e => handleUpdate(banner.id, 'imageUrl', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px', borderTop: '1px border #F1F5F9' }}>
              <button
                onClick={() => handleUpdate(banner.id, 'active', !banner.active)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
              >
                {banner.active ? <Eye size={14} color="#059669" /> : <EyeOff size={14} color="#94A3B8" />}
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
              >
                <Trash2 size={14} color="#DC2626" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
