import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Layers, ArrowUp, ArrowDown, Copy, Grid } from 'lucide-react';

export default function CollectionsEditor({ collectionsData = {}, onChange }) {
  const [activeTab, setActiveTab] = useState('tailoring');
  const collections = collectionsData || {};
  const currentList = collections[activeTab] || [];

  const updateList = (newList) => {
    onChange?.({
      ...collections,
      [activeTab]: newList,
    });
  };

  const handleAddCollection = () => {
    const newCol = {
      id: 'col-' + Date.now(),
      label: 'New Collection',
      emoji: '✨',
      desc: 'Collection description',
      active: true,
      image: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=400',
    };
    updateList([...currentList, newCol]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = currentList.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateList(updated);
  };

  const handleDelete = (id) => {
    updateList(currentList.filter(c => c.id !== id));
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentList.length) return;
    const list = [...currentList];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    updateList(list);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '14px 16px', borderRadius: '16px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => setActiveTab('tailoring')}
            style={{
              padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center',
              background: activeTab === 'tailoring' ? 'linear-gradient(135deg, #1A0533, #3D0F6B)' : '#F1F5F9',
              color: activeTab === 'tailoring' ? '#FFFFFF' : '#475569',
            }}
          >
            🪡 Tailoring Collections
          </button>
          <button
            onClick={() => setActiveTab('fashion')}
            style={{
              padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center',
              background: activeTab === 'fashion' ? 'linear-gradient(135deg, #0A2540, #1A4A7A)' : '#F1F5F9',
              color: activeTab === 'fashion' ? '#FFFFFF' : '#475569',
            }}
          >
            👗 Women Fashion Collections
          </button>
        </div>

        <button
          onClick={handleAddCollection}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px', background: '#2563EB', color: '#FFF',
            fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0
          }}
        >
          <Plus size={15} /> Add Card
        </button>
      </div>

      {/* Grid of Collection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '12px' }}>
        {currentList.map((col, idx) => (
          <div
            key={col.id}
            style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px', opacity: col.active ? 1 : 0.6,
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <img
                src={col.image}
                alt={col.label}
                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }}
              />
              <div style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={col.emoji || '✨'}
                  onChange={e => handleUpdate(col.id, 'emoji', e.target.value)}
                  style={{ width: '38px', textAlign: 'center', fontSize: '16px', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '4px' }}
                />
                <input
                  type="text"
                  value={col.label}
                  onChange={e => handleUpdate(col.id, 'label', e.target.value)}
                  style={{ flex: 1, fontWeight: 800, fontSize: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>Subtext Description</label>
              <input
                type="text"
                value={col.desc || ''}
                onChange={e => handleUpdate(col.id, 'desc', e.target.value)}
                style={{ width: '100%', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>Card Image URL</label>
              <input
                type="text"
                value={col.image || ''}
                onChange={e => handleUpdate(col.id, 'image', e.target.value)}
                style={{ width: '100%', fontSize: '11px', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #E2E8F0' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#F8FAFC', cursor: 'pointer' }}><ArrowUp size={13} /></button>
                <button onClick={() => handleMove(idx, 1)} disabled={idx === currentList.length - 1} style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#F8FAFC', cursor: 'pointer' }}><ArrowDown size={13} /></button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleUpdate(col.id, 'active', !col.active)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  {col.active ? <Eye size={14} color="#059669" /> : <EyeOff size={14} color="#94A3B8" />}
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  <Trash2 size={14} color="#DC2626" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
