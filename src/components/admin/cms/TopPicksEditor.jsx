import { useState } from 'react';
import { Star, Check, Search, Settings } from 'lucide-react';

export default function TopPicksEditor({ topPicksData = {}, products = [], onChange }) {
  const [productSearch, setProductSearch] = useState('');
  const picks = topPicksData || {};

  const update = (field, value) => {
    onChange?.({ ...picks, [field]: value });
  };

  const selectedIds = picks.selectedProductIds || [];

  const toggleProduct = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id];
    update('selectedProductIds', next);
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="#F59E0B" /> Top Picks & Featured Products Manager
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Highlight best-sellers and curated items for customers</p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Section Active</span>
          <input
            type="checkbox"
            checked={picks.enabled ?? true}
            onChange={e => update('enabled', e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#F59E0B', cursor: 'pointer' }}
          />
        </label>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Section Content Settings</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Title</label>
            <input
              type="text"
              value={picks.title || ''}
              onChange={e => update('title', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Subtitle</label>
            <input
              type="text"
              value={picks.subtitle || ''}
              onChange={e => update('subtitle', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Max Items Displayed</label>
            <input
              type="number"
              value={picks.maxDisplay || 6}
              onChange={e => update('maxDisplay', parseInt(e.target.value) || 6)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Handpick Top Products ({selectedIds.length} Selected)
          </h4>
          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          {filteredProducts.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleProduct(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                  borderRadius: '10px', border: isSelected ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                  background: isSelected ? '#FEF3C7' : '#F8FAFC', cursor: 'pointer'
                }}
              >
                <img src={p.image_url} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 800 }}>₹{p.price}</div>
                </div>
                {isSelected && <Check size={14} color="#D97706" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
