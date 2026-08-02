import { useState, useEffect } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

export default function CmsLivePreviewModal({ draftData, onClose }) {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const widthMap = {
    desktop: '100%',
    tablet: '768px',
    mobile: isMobileScreen ? '100%' : '375px',
  };

  const heightMap = {
    desktop: '100%',
    tablet: '90%',
    mobile: isMobileScreen ? '100%' : '667px',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobileScreen ? '0' : '16px'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        width: '100%', maxWidth: '1200px', background: '#1E293B', borderRadius: isMobileScreen ? '0' : '16px 16px 0 0',
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#FFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>⚡ Live Preview</span>
          <span style={{ fontSize: '10px', background: '#2563EB', padding: '2px 6px', borderRadius: '99px', fontWeight: 700 }}>DRAFT MODE</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Viewport Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: '#0F172A', padding: '3px', borderRadius: '8px', overflowX: 'auto' }}>
            <button
              onClick={() => setViewport('desktop')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: viewport === 'desktop' ? '#2563EB' : 'transparent', color: '#FFF',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700
              }}
            >
              <Monitor size={13} /> Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: viewport === 'tablet' ? '#2563EB' : 'transparent', color: '#FFF',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700
              }}
            >
              <Tablet size={13} /> Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: viewport === 'mobile' ? '#2563EB' : 'transparent', color: '#FFF',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700
              }}
            >
              <Smartphone size={13} /> Mobile
            </button>
          </div>

          <button
            onClick={() => setRefreshKey(Date.now())}
            title="Refresh Preview"
            style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)', color: '#FFF', fontSize: '11px', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>

          <a
            href="/?preview=draft"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Draft in New Tab"
            style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)', color: '#FFF', fontSize: '11px', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none'
            }}
          >
            <ExternalLink size={13} /> Open Tab
          </a>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div style={{
        flex: 1, width: '100%', maxWidth: '1200px', background: '#090D16',
        borderRadius: isMobileScreen ? '0' : '0 0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: (viewport === 'desktop' || isMobileScreen) ? '0' : '16px'
      }}>
        <div style={{
          width: widthMap[viewport],
          height: heightMap[viewport],
          maxWidth: '100%',
          maxHeight: '100%',
          background: 'transparent',
          borderRadius: (viewport === 'desktop' || isMobileScreen) ? '0' : '20px',
          boxShadow: (viewport === 'desktop' || isMobileScreen) ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 8px #1E293B',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out'
        }}>
          <iframe
            key={refreshKey}
            src={`/?preview=draft&t=${refreshKey}`}
            title="Homepage Live Preview"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}
