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
        padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#FFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800 }}>⚡ Live CMS Preview</span>
          <span style={{ fontSize: '11px', background: '#2563EB', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>UNPUBLISHED DRAFT</span>
        </div>

        {/* Viewport Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: '#0F172A', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setViewport('desktop')}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: viewport === 'desktop' ? '#2563EB' : 'transparent', color: '#FFF',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700
            }}
          >
            <Monitor size={14} /> Desktop (1280px)
          </button>
          <button
            onClick={() => setViewport('tablet')}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: viewport === 'tablet' ? '#2563EB' : 'transparent', color: '#FFF',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700
            }}
          >
            <Tablet size={14} /> Tablet (768px)
          </button>
          <button
            onClick={() => setViewport('mobile')}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: viewport === 'mobile' ? '#2563EB' : 'transparent', color: '#FFF',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700
            }}
          >
            <Smartphone size={14} /> Mobile (375px)
          </button>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={18} />
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
