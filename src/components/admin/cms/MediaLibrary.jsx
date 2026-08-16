import { useState } from 'react';
import { Search, Plus, Trash2, Check, Image as ImageIcon, ExternalLink, Filter } from 'lucide-react';

export default function MediaLibrary({ mediaList = [], onSelect, onUpdateMedia }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('general');
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['all', 'tailoring', 'fashion', 'scissors', 'threads', 'general'];

  const safeList = Array.isArray(mediaList) ? mediaList : [];
  const filtered = safeList.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (m.url || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const item = {
        id: 'm-' + Date.now(),
        url: reader.result,
        name: file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Image',
        category: newCat,
        createdAt: new Date().toISOString()
      };
      onUpdateMedia?.([...mediaList, item]);
      setShowAddForm(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!newUrl) return;
    const item = {
      id: 'm-' + Date.now(),
      url: newUrl,
      name: newName || 'Media Asset',
      category: newCat,
      createdAt: new Date().toISOString()
    };
    onUpdateMedia?.([...mediaList, item]);
    setNewUrl('');
    setNewName('');
    setShowAddForm(false);
  };

  const handleDeleteMedia = (id, e) => {
    e.stopPropagation();
    onUpdateMedia?.(mediaList.filter(m => m.id !== id));
  };

  return (
    <div className="media-library-card" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Media & Asset Library</h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Manage product photos, hero banners, and promotional assets</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '12px', background: '#2563EB', color: '#FFFFFF',
            fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add Media Asset
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMedia} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Upload Image from Computer/Phone</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ fontSize: '13px', color: '#475569' }}
            />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: '8px 0' }}>Or Paste Image URL</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '12px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Image URL (Unsplash, CDN, etc.)"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Asset Title / Alt Tag"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
            />
            <select
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
            >
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '12px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', borderRadius: '8px', background: '#059669', color: '#FFF', fontSize: '12px', fontWeight: 700, border: 'none' }}
            >
              Save Asset
            </button>
          </div>
        </form>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>
        <div className="media-library-filter-row" style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <Filter size={14} color="#64748B" style={{ flexShrink: 0 }} />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                background: categoryFilter === cat ? '#0F172A' : '#F1F5F9',
                color: categoryFilter === cat ? '#FFFFFF' : '#475569',
                boxShadow: categoryFilter === cat ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))', gap: '16px' }}>
        {filtered.map(media => {
          const isSelected = selectedId === media.id;
          return (
            <div
              key={media.id}
              onClick={() => {
                setSelectedId(media.id);
                onSelect?.(media.url);
              }}
              style={{
                position: 'relative', borderRadius: '12px', overflow: 'hidden',
                border: isSelected ? '2.5px solid #2563EB' : '1px solid #E2E8F0',
                background: '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s',
                aspectRatio: '1 / 1'
              }}
            >
              <img
                src={media.url}
                alt={media.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=400'; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', opacity: 0.9 }} />
              
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', color: '#FFF' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{media.name}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{media.category}</div>
              </div>

              {isSelected && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#2563EB', color: '#FFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={14} />
                </div>
              )}

              <button
                onClick={(e) => handleDeleteMedia(media.id, e)}
                title="Delete asset"
                style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(220,38,38,0.85)', color: '#FFF', borderRadius: '6px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
