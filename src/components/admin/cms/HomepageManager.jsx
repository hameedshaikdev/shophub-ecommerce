import { useState } from 'react';
import {
  Sparkles, Zap, Grid, Star, Image as ImageIcon,
  Globe, FileText, Save, Send, RotateCcw, Eye,
  CheckCircle, ArrowLeft, Undo, Redo, Layers
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import HeroEditor from './HeroEditor';
import FlashDealsEditor from './FlashDealsEditor';
import CollectionsEditor from './CollectionsEditor';
import NewArrivalsEditor from './NewArrivalsEditor';
import TopPicksEditor from './TopPicksEditor';
import BannersEditor from './BannersEditor';
import FooterEditor from './FooterEditor';
import SeoEditor from './SeoEditor';
import MediaLibrary from './MediaLibrary';
import CmsLivePreviewModal from './CmsLivePreviewModal';
import { toast } from '../AdminUtils';

export default function HomepageManager({ products = [] }) {
  const {
    cmsData, cmsDraft, updateCmsDraft, publishCms, resetCmsDraft,
    undoCms, redoCms, canUndo, canRedo
  } = useApp();

  const [activeSection, setActiveSection] = useState('hero');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const navItems = [
    { key: 'hero', label: 'Hero Section', icon: Sparkles },
    { key: 'flash', label: 'Flash Deals', icon: Zap },
    { key: 'collections', label: 'Collections', icon: Grid },
    { key: 'arrivals', label: 'New Arrivals', icon: Sparkles },
    { key: 'picks', label: 'Top Picks', icon: Star },
    { key: 'banners', label: 'Promo Banners', icon: Layers },
    { key: 'footer', label: 'Footer Content', icon: FileText },
    { key: 'seo', label: 'SEO & Social', icon: Globe },
    { key: 'media', label: 'Media Library', icon: ImageIcon },
  ];

  const handleSaveDraft = () => {
    toast('Draft saved locally', 'success');
  };

  const handlePublish = async () => {
    setSaving(true);
    await publishCms();
    setSaving(false);
    toast('Homepage CMS Published Successfully!', 'success');
  };

  const handleDiscard = () => {
    resetCmsDraft();
    toast('Discarded draft changes', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* CMS Master Top Controls Bar */}
      <div
        className="cms-top-bar"
        style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
          padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', flexWrap: 'wrap'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flexShrink: 0 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>Homepage CMS</h2>
            <p style={{ fontSize: '10px', color: '#64748B', margin: '1px 0 0 0' }}>Dynamic Storefront Editor</p>
          </div>
        </div>

        {/* Action buttons — horizontal scroll row on mobile */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', flexShrink: 0, maxWidth: '100%' }}>
          {/* Undo / Redo */}
          <button
            onClick={undoCms}
            disabled={!canUndo}
            title="Undo Edit"
            style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}
          >
            <Undo size={14} />
          </button>
          <button
            onClick={redoCms}
            disabled={!canRedo}
            title="Redo Edit"
            style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.4 }}
          >
            <Redo size={14} />
          </button>

          {/* Live Preview Button */}
          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '8px 12px', borderRadius: '9px', border: '1px solid #2563EB', background: '#EFF6FF',
              color: '#2563EB', fontSize: '12px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Eye size={14} /> Preview
          </button>

          {/* Discard */}
          <button
            onClick={handleDiscard}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '8px 12px', borderRadius: '9px', border: '1px solid #E2E8F0', background: '#FFFFFF',
              color: '#64748B', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Discard
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '8px 14px', borderRadius: '9px', border: 'none', background: '#059669',
              color: '#FFFFFF', fontSize: '12px', fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(5,150,105,0.25)', flexShrink: 0, whiteSpace: 'nowrap'
            }}
          >
            <Send size={14} /> {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main CMS Layout (Sidebar Nav + Active Section View) */}
      <div className="cms-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', width: '100%', overflowX: 'hidden' }}>
        {/* Sidebar Nav — Desktop: vertical column / Mobile: horizontal scrollable pill row */}
        <div className="cms-sidebar-nav" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content', position: 'relative' }}>
          <div className="admin-kbd-hide" style={{ padding: '6px 10px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SECTIONS LIST
          </div>
          {/* Scrollable inner — CSS converts to flex-row on mobile */}
          <div className="cms-sidebar-inner" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: active ? '#0F172A' : 'transparent',
                    color: active ? '#FFFFFF' : '#475569',
                    fontWeight: active ? 800 : 600,
                    fontSize: '12px', transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0
                  }}
                >
                  <Icon size={15} color={active ? '#FFFFFF' : '#64748B'} style={{ flexShrink: 0 }} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Body */}
        <div style={{ width: '100%', minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
          {activeSection === 'hero' && (
            <HeroEditor
              heroData={cmsDraft.hero}
              onChange={val => updateCmsDraft({ hero: val })}
            />
          )}

          {activeSection === 'flash' && (
            <FlashDealsEditor
              flashDealsData={cmsDraft.flashDeals}
              products={products}
              onChange={val => updateCmsDraft({ flashDeals: val })}
            />
          )}

          {activeSection === 'collections' && (
            <CollectionsEditor
              collectionsData={cmsDraft.collections}
              onChange={val => updateCmsDraft({ collections: val })}
            />
          )}

          {activeSection === 'arrivals' && (
            <NewArrivalsEditor
              newArrivalsData={cmsDraft.newArrivals}
              products={products}
              onChange={val => updateCmsDraft({ newArrivals: val })}
            />
          )}

          {activeSection === 'picks' && (
            <TopPicksEditor
              topPicksData={cmsDraft.topPicks}
              products={products}
              onChange={val => updateCmsDraft({ topPicks: val })}
            />
          )}

          {activeSection === 'banners' && (
            <BannersEditor
              bannersData={cmsDraft.banners}
              onChange={val => updateCmsDraft({ banners: val })}
            />
          )}

          {activeSection === 'footer' && (
            <FooterEditor
              footerData={cmsDraft.footer}
              onChange={val => updateCmsDraft({ footer: val })}
            />
          )}

          {activeSection === 'seo' && (
            <SeoEditor
              seoData={cmsDraft.seo}
              onChange={val => updateCmsDraft({ seo: val })}
            />
          )}

          {activeSection === 'media' && (
            <MediaLibrary
              mediaList={cmsDraft.mediaLibrary}
              onUpdateMedia={val => updateCmsDraft({ mediaLibrary: val })}
            />
          )}
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <CmsLivePreviewModal
          draftData={cmsDraft}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
