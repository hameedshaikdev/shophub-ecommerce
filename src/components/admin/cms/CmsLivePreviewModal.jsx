import { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

export default function CmsLivePreviewModal({ draftData, onClose }) {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  const widthMap = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const heightMap = {
    desktop: '100%',
    tablet: '90%',
    mobile: '667px',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        width: '100%', maxWidth: '1200px', background: '#1E293B', borderRadius: '16px 16px 0 0',
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#FFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>⚡ Live Preview</span>
          <span style={{ fontSize: '10px', background: '#2563EB', padding: '2px 6px', borderRadius: '99px', fontWeight: 700 }}>DRAFT</span>
        </div>

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
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: 'auto' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Frame Container */}
      <div style={{
        flex: 1, width: '100%', maxWidth: '1200px', background: '#090D16',
        borderRadius: '0 0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: viewport === 'desktop' ? '0' : '20px'
      }}>
        <div style={{
          width: widthMap[viewport],
          height: heightMap[viewport],
          background: '#FFFFFF',
          borderRadius: viewport === 'desktop' ? '0' : '24px',
          boxShadow: viewport === 'desktop' ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 12px #1E293B',
          overflow: 'auto',
          transition: 'all 0.3s ease-in-out'
        }}>
          <iframe
            src="/"
            title="Homepage Live Preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
