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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* CMS Master Top Controls Bar */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Homepage Content Manager</h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Manage all dynamic storefront sections in real time</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Undo / Redo */}
          <button
            onClick={undoCms}
            disabled={!canUndo}
            title="Undo Edit"
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}
          >
            <Undo size={15} />
          </button>
          <button
            onClick={redoCms}
            disabled={!canRedo}
            title="Redo Edit"
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.4 }}
          >
            <Redo size={15} />
          </button>

          {/* Live Preview Button */}
          <button
            onClick={() => setShowPreviewModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '10px', border: '1px solid #2563EB', background: '#EFF6FF',
              color: '#2563EB', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Eye size={15} /> Live Preview
          </button>

          {/* Discard */}
          <button
            onClick={handleDiscard}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFFFFF',
              color: '#64748B', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} /> Discard
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 22px', borderRadius: '10px', border: 'none', background: '#059669',
              color: '#FFFFFF', fontSize: '13px', fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
            }}
          >
            <Send size={15} /> {saving ? 'Publishing...' : 'Publish Live'}
          </button>
        </div>
      </div>

      {/* Main CMS Layout (Sidebar Nav + Active Section View) */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }} className="cms-main-grid">
        {/* Sidebar Nav */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content' }}>
          <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SECTIONS LIST
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: active ? '#0F172A' : 'transparent',
                  color: active ? '#FFFFFF' : '#475569',
                  fontWeight: active ? 800 : 600,
                  fontSize: '13px', transition: 'all 0.15s'
                }}
              >
                <Icon size={16} color={active ? '#FFFFFF' : '#64748B'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Editor Body */}
        <div>
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
