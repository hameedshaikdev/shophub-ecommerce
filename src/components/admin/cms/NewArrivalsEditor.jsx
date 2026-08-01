import { useState } from 'react';
import { Sparkles, Grid, SlidersHorizontal, Check, Search } from 'lucide-react';

export default function NewArrivalsEditor({ newArrivalsData = {}, products = [], onChange }) {
  const [productSearch, setProductSearch] = useState('');
  const arrivals = newArrivalsData || {};

  const update = (field, value) => {
    onChange?.({ ...arrivals, [field]: value });
  };

  const selectedIds = arrivals.selectedProductIds || [];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
      {/* Enable Toggle & Header */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#2563EB" /> New Arrivals Section Manager
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Configure dynamic product feeds, display styles, and card features</p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Section Active</span>
          <input
            type="checkbox"
            checked={arrivals.enabled ?? true}
            onChange={e => update('enabled', e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Main Settings */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Section Content & Header</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Section Title</label>
            <input
              type="text"
              value={arrivals.title || ''}
              onChange={e => update('title', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Subtitle</label>
            <input
              type="text"
              value={arrivals.subtitle || ''}
              onChange={e => update('subtitle', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Selection Mode</label>
            <select
              value={arrivals.mode || 'auto'}
              onChange={e => update('mode', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            >
              <option value="auto">Automatic (Latest Created Products)</option>
              <option value="manual">Manual Selection (Custom Handpicked)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Max Products Displayed</label>
            <input
              type="number"
              value={arrivals.maxDisplay || 8}
              onChange={e => update('maxDisplay', parseInt(e.target.value) || 8)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            { key: 'showBadges', label: 'Show New Badges' },
            { key: 'showRatings', label: 'Show Star Ratings' },
            { key: 'showQuickView', label: 'Show Quick View Button' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer', background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <input
                type="checkbox"
                checked={arrivals[key] ?? true}
                onChange={e => update(key, e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Manual Selection Grid if Manual Mode */}
      {arrivals.mode === 'manual' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Manual Product Picker ({selectedIds.length} Selected)
            </h4>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {filteredProducts.map(p => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                    borderRadius: '10px', border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    background: isSelected ? '#EFF6FF' : '#F8FAFC', cursor: 'pointer'
                  }}
                >
                  <img src={p.image_url} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#059669' }}>₹{p.price}</div>
                  </div>
                  {isSelected && <Check size={14} color="#2563EB" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
