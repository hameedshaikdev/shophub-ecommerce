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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('tailoring')}
            style={{
              padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer',
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
              padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer',
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
            padding: '8px 14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1',
            fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#334155'
          }}
        >
          <Settings size={15} /> Carousel Speed & Transition Settings
        </button>
      </div>

      {/* Carousel Global Settings */}
      {showCarouselSettings && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>⚙️ Hero Carousel Settings</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Autoplay Slides
              <select
                value={carouselSettings.autoplay ? 'true' : 'false'}
                onChange={e => updateCarouselSettings('autoplay', e.target.value === 'true')}
                style={{ width: '100%', marginTop: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </label>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Slide Duration (ms)
              <input
                type="number"
                value={carouselSettings.slideDuration}
                onChange={e => updateCarouselSettings('slideDuration', parseInt(e.target.value) || 5000)}
                style={{ width: '100%', marginTop: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              />
            </label>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Transition Effect
              <select
                value={carouselSettings.transitionStyle}
                onChange={e => updateCarouselSettings('transitionStyle', e.target.value)}
                style={{ width: '100%', marginTop: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              >
                <option value="fade">Smooth Fade</option>
                <option value="slide">Horizontal Slide</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Main Content Form */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
          Hero Section Options ({activeTab.toUpperCase()})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Hero Main Title (e.g. Master Your)</label>
            <input
              type="text"
              value={currentHero.title || ''}
              onChange={e => updateCurrentHero('title', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Accent Highlight Title (e.g. Craft.)</label>
            <input
              type="text"
              value={currentHero.titleAccent || ''}
              onChange={e => updateCurrentHero('titleAccent', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Category Sub-line</label>
            <input
              type="text"
              value={currentHero.titleLine2 || ''}
              onChange={e => updateCurrentHero('titleLine2', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Badge Pill Text</label>
            <input
              type="text"
              value={currentHero.badgeText || ''}
              onChange={e => updateCurrentHero('badgeText', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Hero Description Subtitle</label>
          <textarea
            rows={2}
            value={currentHero.sub || ''}
            onChange={e => updateCurrentHero('sub', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Hero Photo URL</label>
            <input
              type="text"
              value={currentHero.illustration || ''}
              onChange={e => updateCurrentHero('illustration', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Background Gradient CSS</label>
            <input
              type="text"
              value={currentHero.grad || ''}
              onChange={e => updateCurrentHero('grad', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Accent Glow Color (HEX)</label>
            <input
              type="text"
              value={currentHero.accentColor || ''}
              onChange={e => updateCurrentHero('accentColor', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* Multiple Hero Slides List */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            📸 Hero Slides Manager ({slides.length} Slides)
          </h3>
          <button
            onClick={handleAddSlide}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px', background: '#2563EB', color: '#FFF',
              fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer'
            }}
          >
            <Plus size={15} /> Add New Slide
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '12px', border: '1px solid #E2E8F0', background: slide.active ? '#F8FAFC' : '#F1F5F9',
                opacity: slide.active ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button onClick={() => handleMoveSlide(idx, -1)} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}><ArrowUp size={14} /></button>
                <button onClick={() => handleMoveSlide(idx, 1)} disabled={idx === slides.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: idx === slides.length - 1 ? 0.3 : 1 }}><ArrowDown size={14} /></button>
              </div>

              <img
                src={slide.illustration}
                alt=""
                style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=100'; }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={e => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    style={{ fontWeight: 800, fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px 8px' }}
                  />
                  <input
                    type="text"
                    value={slide.titleAccent}
                    onChange={e => handleUpdateSlide(slide.id, 'titleAccent', e.target.value)}
                    style={{ fontWeight: 800, fontSize: '13px', color: '#2563EB', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px 8px' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Category: {slide.category || 'all'}</div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleUpdateSlide(slide.id, 'active', !slide.active)}
                  title={slide.active ? 'Hide Slide' : 'Show Slide'}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}
                >
                  {slide.active ? <Eye size={14} color="#059669" /> : <EyeOff size={14} color="#94A3B8" />}
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
