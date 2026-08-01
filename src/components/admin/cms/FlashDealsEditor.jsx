import { useState } from 'react';
import { Zap, Clock, Package, Check, X, Search, Settings, RefreshCw, Trash2, Plus } from 'lucide-react';

export default function FlashDealsEditor({ flashDealsData = {}, products = [], onChange }) {
  const [productSearch, setProductSearch] = useState('');
  const flash = flashDealsData || {};

  const updateFlash = (field, value) => {
    onChange?.({ ...flash, [field]: value });
  };

  const selectedIds = flash.selectedProductIds || [];

  const toggleProductSelection = (productId) => {
    let next;
    if (selectedIds.includes(productId)) {
      next = selectedIds.filter(id => id !== productId);
    } else {
      next = [...selectedIds, productId];
    }
    updateFlash('selectedProductIds', next);
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const resetTimer = () => {
    const newEnd = new Date(Date.now() + 86400000 * 3).toISOString();
    updateFlash('endTime', newEnd);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Enable Toggle */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', borderRadius: '16px', padding: '24px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Zap size={16} /> Flash Sale Campaign Control
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 4px 0' }}>Configure Flash Deals & Countdown Timer</h3>
          <p style={{ fontSize: '13px', color: '#A5B4FC', margin: 0 }}>Set campaign timer, pick promotional items, and adjust section layout</p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer' }}>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>Campaign Active</span>
          <input
            type="checkbox"
            checked={flash.enabled ?? true}
            onChange={e => updateFlash('enabled', e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Countdown Timer Config */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#2563EB" /> Countdown Timer Settings
          </h4>
          <button
            onClick={resetTimer}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC',
              fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#334155'
            }}
          >
            <RefreshCw size={12} /> Reset (+3 Days)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Section Title</label>
            <input
              type="text"
              value={flash.title || ''}
              onChange={e => updateFlash('title', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Subtitle</label>
            <input
              type="text"
              value={flash.subtitle || ''}
              onChange={e => updateFlash('subtitle', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Target End Date & Time</label>
            <input
              type="datetime-local"
              value={flash.endTime ? new Date(flash.endTime).toISOString().slice(0, 16) : ''}
              onChange={e => updateFlash('endTime', new Date(e.target.value).toISOString())}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Section Controls & Badges */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={16} color="#2563EB" /> Display Controls & Badges
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { key: 'showDiscount', label: 'Show Discount %' },
            { key: 'showStock', label: 'Show Stock Level' },
            { key: 'showRatings', label: 'Show Rating Stars' },
            { key: 'showQuickView', label: 'Show Quick View Button' },
            { key: 'showAddToCart', label: 'Show Add to Cart' },
            { key: 'sliderEnabled', label: 'Enable Horizontal Slider' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer', background: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <input
                type="checkbox"
                checked={flash[key] ?? true}
                onChange={e => updateFlash(key, e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#2563EB' }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Product Selector */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              📦 Select Flash Deal Products ({selectedIds.length} Selected)
            </h4>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>Click products below to toggle flash sale participation</p>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
          {filteredProducts.map(prod => {
            const isSelected = selectedIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => toggleProductSelection(prod.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                  borderRadius: '10px', border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  background: isSelected ? '#EFF6FF' : '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>₹{prod.price}</div>
                </div>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '6px', border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                  background: isSelected ? '#2563EB' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                }}>
                  {isSelected && <Check size={13} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
