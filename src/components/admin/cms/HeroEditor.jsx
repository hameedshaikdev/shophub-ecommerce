import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Layers, Settings, Sparkles, Image as ImageIcon, ArrowUp, ArrowDown, Copy } from 'lucide-react';

export default function HeroEditor({ heroData = {}, onChange }) {
  const [activeTab, setActiveTab] = useState('tailoring');
  const [showCarouselSettings, setShowCarouselSettings] = useState(false);

  const hero = heroData || {};
  const currentHero = hero[activeTab] || {};
  const slides = hero.slides || [];
  const carouselSettings = hero.carouselSettings || { autoplay: true, slideDuration: 5000, transitionStyle: 'fade' };

  const updateCurrentHero = (field, value) => {
    const updatedTab = { ...currentHero, [field]: value };
    onChange?.({
      ...hero,
      [activeTab]: updatedTab,
    });
  };

  const updateCarouselSettings = (field, value) => {
    onChange?.({
      ...hero,
      carouselSettings: { ...carouselSettings, [field]: value }
    });
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: 'slide-' + Date.now(),
      title: 'New Headline',
      titleAccent: 'Accent',
      titleLine2: 'Collection Sub-headline',
      sub: 'Subtitle description here...',
      illustration: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800',
      badgeText: 'New 2026',
      btn1Text: 'Shop Now',
      btn1Link: '#products',
      active: true,
      category: activeTab,
    };
    onChange?.({
      ...hero,
      slides: [...slides, newSlide],
    });
  };

  const handleUpdateSlide = (id, field, value) => {
    const updated = slides.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange?.({ ...hero, slides: updated });
  };

  const handleDeleteSlide = (id) => {
    const updated = slides.filter(s => s.id !== id);
    onChange?.({ ...hero, slides: updated });
  };

  const handleDuplicateSlide = (slide) => {
    const dup = { ...slide, id: 'slide-' + Date.now(), title: slide.title + ' (Copy)' };
    onChange?.({ ...hero, slides: [...slides, dup] });
  };

  const handleMoveSlide = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const list = [...slides];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    onChange?.({ ...hero, slides: list });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Category Tab Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '14px 16px', borderRadius: '16px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => setActiveTab('tailoring')}
            style={{
              padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center',
              background: activeTab === 'tailoring' ? 'linear-gradient(135deg, #1A0533, #3D0F6B)' : '#F1F5F9',
              color: activeTab === 'tailoring' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'tailoring' ? '0 4px 14px rgba(61,15,107,0.3)' : 'none'
            }}
          >
            🪡 Tailoring Tools Hero
          </button>
          <button
            onClick={() => setActiveTab('fashion')}
            style={{
              padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center',
              background: activeTab === 'fashion' ? 'linear-gradient(135deg, #0A2540, #1A4A7A)' : '#F1F5F9',
              color: activeTab === 'fashion' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'fashion' ? '0 4px 14px rgba(10,37,64,0.3)' : 'none'
            }}
          >
            👗 Women Fashion Hero
          </button>
        </div>

        <button
          onClick={() => setShowCarouselSettings(!showCarouselSettings)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px', borderRadius: '9px', background: '#F8FAFC', border: '1px solid #CBD5E1',
            fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#334155', flexShrink: 0
          }}
        >
          <Settings size={14} /> Carousel Settings
        </button>
      </div>

      {/* Carousel Global Settings */}
      {showCarouselSettings && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>⚙️ Hero Carousel Settings</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
              Autoplay Slides
              <select
                value={carouselSettings.autoplay ? 'true' : 'false'}
                onChange={e => updateCarouselSettings('autoplay', e.target.value === 'true')}
                style={{ width: '100%', marginTop: '4px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </label>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
              Slide Duration (ms)
              <input
                type="number"
                value={carouselSettings.slideDuration}
                onChange={e => updateCarouselSettings('slideDuration', parseInt(e.target.value) || 5000)}
                style={{ width: '100%', marginTop: '4px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              />
            </label>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
              Transition Effect
              <select
                value={carouselSettings.transitionStyle}
                onChange={e => updateCarouselSettings('transitionStyle', e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              >
                <option value="fade">Smooth Fade</option>
                <option value="slide">Horizontal Slide</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Main Content Form */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          Hero Section Options ({activeTab.toUpperCase()})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Main Title</label>
            <input
              type="text"
              value={currentHero.title || ''}
              onChange={e => updateCurrentHero('title', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Accent Highlight Title</label>
            <input
              type="text"
              value={currentHero.titleAccent || ''}
              onChange={e => updateCurrentHero('titleAccent', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Category Sub-line</label>
            <input
              type="text"
              value={currentHero.titleLine2 || ''}
              onChange={e => updateCurrentHero('titleLine2', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Badge Pill Text</label>
            <input
              type="text"
              value={currentHero.badgeText || ''}
              onChange={e => updateCurrentHero('badgeText', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Hero Description Subtitle</label>
          <textarea
            rows={2}
            value={currentHero.sub || ''}
            onChange={e => updateCurrentHero('sub', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Hero Photo URL</label>
            <input
              type="text"
              value={currentHero.illustration || ''}
              onChange={e => updateCurrentHero('illustration', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Background Gradient CSS</label>
            <input
              type="text"
              value={currentHero.grad || ''}
              onChange={e => updateCurrentHero('grad', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Accent Glow Color (HEX)</label>
            <input
              type="text"
              value={currentHero.accentColor || ''}
              onChange={e => updateCurrentHero('accentColor', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Multiple Hero Slides List */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            📸 Hero Slides Manager ({slides.length} Slides)
          </h3>
          <button
            onClick={handleAddSlide}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px', background: '#2563EB', color: '#FFF',
              fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer'
            }}
          >
            <Plus size={14} /> Add Slide
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                borderRadius: '12px', border: '1px solid #E2E8F0', background: slide.active ? '#F8FAFC' : '#F1F5F9',
                opacity: slide.active ? 1 : 0.6, flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => handleMoveSlide(idx, -1)} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}><ArrowUp size={13} /></button>
                <button onClick={() => handleMoveSlide(idx, 1)} disabled={idx === slides.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: idx === slides.length - 1 ? 0.3 : 1 }}><ArrowDown size={13} /></button>
              </div>

              <img
                src={slide.illustration}
                alt=""
                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={e => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    style={{ fontWeight: 800, fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '3px 6px', flex: 1, minWidth: 0, boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    value={slide.titleAccent}
                    onChange={e => handleUpdateSlide(slide.id, 'titleAccent', e.target.value)}
                    style={{ fontWeight: 800, fontSize: '12px', color: '#2563EB', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '3px 6px', flex: 1, minWidth: 0, boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Cat: {slide.category || 'all'}</div>
              </div>

              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                <button
                  onClick={() => handleUpdateSlide(slide.id, 'active', !slide.active)}
                  title={slide.active ? 'Hide Slide' : 'Show Slide'}
                  style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  {slide.active ? <Eye size={13} color="#059669" /> : <EyeOff size={13} color="#94A3B8" />}
                </button>
                <button
                  onClick={() => handleDuplicateSlide(slide)}
                  title="Duplicate Slide"
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  <Copy size={14} color="#3B82F6" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  title="Delete Slide"
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  <Trash2 size={14} color="#DC2626" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
