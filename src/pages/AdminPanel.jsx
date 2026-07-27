import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, MessageCircle, Phone, CheckCircle, XCircle,
  Plus, Edit2, Trash2, Eye, LogOut, Upload, X, Save,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';

const ADMIN_EMAIL = 'as.businezzz@gmail.com';
const ORDER_TABS = [
  { key:'payment_submitted', label:'Verify',    emoji:'🔍', color:'#3B82F6' },
  { key:'confirmed',         label:'Confirmed', emoji:'✅', color:'#16A34A' },
  { key:'preparing',         label:'Preparing', emoji:'📦', color:'#F59E0B' },
  { key:'shipped',           label:'Shipped',   emoji:'🚚', color:'#8B5CF6' },
  { key:'delivered',         label:'Delivered', emoji:'🏠', color:'#6B7280' },
  { key:'payment_rejected',  label:'Rejected',  emoji:'❌', color:'#EF4444' },
];
const MAIN_TABS = [
  { key:'orders',   label:'Orders',   emoji:'📋' },
  { key:'products', label:'Products', emoji:'🛍️' },
];

/* ─── Product Form Modal ──────────────────────────────────── */
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    category: product?.category || 'tailoring',
    sub_category: product?.sub_category || '',
    unit: product?.unit || '',
    stock: product?.stock || '',
    image_url: product?.image_url || '',
    images: product?.images || [],
    video_links: product?.video_links || [],
    active: product?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  async function uploadImage(file) {
    const ext  = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleMainImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image_url: url }));
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  }

  async function handleAdditionalImages(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setForm(f => ({ ...f, images: [...(f.images||[]), ...urls] }));
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  }

  function removeImage(index) {
    setForm(f => ({ ...f, images: f.images.filter((_,i) => i !== index) }));
  }

  function addVideoLink() {
    if (!newVideoUrl.trim()) return;
    const link = { title: newVideoTitle.trim() || 'Tutorial Video', url: newVideoUrl.trim() };
    setForm(f => ({ ...f, video_links: [...(f.video_links||[]), link] }));
    setNewVideoTitle('');
    setNewVideoUrl('');
  }

  function removeVideoLink(index) {
    setForm(f => ({ ...f, video_links: f.video_links.filter((_,i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) { alert('Name and price are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price:          parseFloat(form.price) || 0,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock:          form.stock ? parseInt(form.stock) : null,
      };
      if (isEdit) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      onSave();
    } catch (err) { alert('Error saving product: ' + err.message); }
    finally { setSaving(false); }
  }

  const inp = {
    width:'100%', padding:'10px 12px', borderRadius:'10px',
    border:'1.5px solid #E2E8F0', fontSize:'14px',
    fontFamily:'inherit', outline:'none', boxSizing:'border-box',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)',
      zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'white', borderRadius:'24px 24px 0 0',
        width:'100%', maxWidth:'600px', maxHeight:'92vh',
        overflowY:'auto', padding:'24px 20px 48px' }}>

        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:900, color:'var(--text)' }}>
            {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button onClick={onClose} style={{ padding:'8px', borderRadius:'10px',
            background:'#F1F5F9', border:'none', cursor:'pointer', display:'flex' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* ── Main Image ── */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
              display:'block', marginBottom:'8px' }}>
              📸 Main Product Image
            </label>
            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
              {form.image_url && (
                <img src={form.image_url} alt="main"
                  style={{ width:'72px', height:'72px', borderRadius:'12px',
                    objectFit:'cover', border:'2px solid var(--primary)',
                    flexShrink:0 }} />
              )}
              <label style={{ flex:1, padding:'14px', borderRadius:'12px',
                border:'2px dashed #E2E8F0', textAlign:'center', cursor:'pointer',
                fontSize:'13px', fontWeight:700, color:'var(--text-2)',
                background:'#F8FAFC' }}>
                {uploading ? '⏳ Uploading...' : '📸 Upload Main Image'}
                <input type="file" accept="image/*" style={{ display:'none' }}
                  onChange={handleMainImage} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* ── Additional Images ── */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
              display:'block', marginBottom:'8px' }}>
              🖼️ Additional Images <span style={{ fontWeight:500 }}>(multiple allowed)</span>
            </label>
            {form.images?.length > 0 && (
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'10px' }}>
                {form.images.map((url, i) => (
                  <div key={i} style={{ position:'relative' }}>
                    <img src={url} alt={`img-${i}`}
                      style={{ width:'64px', height:'64px', borderRadius:'10px',
                        objectFit:'cover', border:'1.5px solid var(--border)' }} />
                    <button type="button" onClick={() => removeImage(i)}
                      style={{ position:'absolute', top:'-6px', right:'-6px',
                        width:'20px', height:'20px', borderRadius:'50%',
                        background:'#EF4444', color:'white', border:'none',
                        cursor:'pointer', display:'flex', alignItems:'center',
                        justifyContent:'center', fontSize:'12px', fontWeight:900 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label style={{ display:'flex', alignItems:'center', justifyContent:'center',
              gap:'8px', padding:'12px', borderRadius:'12px',
              border:'2px dashed #E2E8F0', cursor:'pointer', fontSize:'13px',
              fontWeight:700, color:'var(--text-2)', background:'#F8FAFC' }}>
              {uploading ? '⏳ Uploading...' : '➕ Add More Images (select multiple)'}
              <input type="file" accept="image/*" multiple style={{ display:'none' }}
                onChange={handleAdditionalImages} disabled={uploading} />
            </label>
          </div>

          {/* ── Product name ── */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
              display:'block', marginBottom:'6px' }}>Product Name *</label>
            <input value={form.name}
              onChange={e => setForm(f=>({...f,name:e.target.value}))}
              placeholder="e.g. Professional Sewing Machine" required style={inp} />
          </div>

          {/* ── Description ── */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
              display:'block', marginBottom:'6px' }}>Description</label>
            <textarea value={form.description}
              onChange={e => setForm(f=>({...f,description:e.target.value}))}
              placeholder="Product description..."
              rows={3} style={{ ...inp, resize:'vertical' }} />
          </div>

          {/* ── Price ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Price (₹) *</label>
              <input type="number" value={form.price} min="0" step="0.01"
                onChange={e => setForm(f=>({...f,price:e.target.value}))}
                placeholder="999" required style={inp} />
            </div>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Original Price (₹)</label>
              <input type="number" value={form.original_price} min="0" step="0.01"
                onChange={e => setForm(f=>({...f,original_price:e.target.value}))}
                placeholder="1299" style={inp} />
            </div>
          </div>

          {/* ── Category ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Category *</label>
              <select value={form.category}
                onChange={e => setForm(f=>({...f,category:e.target.value,sub_category:''}))}
                style={inp}>
                <option value="tailoring">🪡 Tailoring Tools</option>
                <option value="fashion">👗 Women's Fashion</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Sub Category</label>
              <select value={form.sub_category}
                onChange={e => setForm(f=>({...f,sub_category:e.target.value}))}
                style={inp}>
                <option value="">Select...</option>
                {(form.category === 'tailoring'
                  ? ['machines','scissors','threads','needles','measuring','other']
                  : ['dresses','tops','bottoms','ethnic','accessories','other']
                ).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* ── Unit + Stock ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Unit</label>
              <input value={form.unit}
                onChange={e => setForm(f=>({...f,unit:e.target.value}))}
                placeholder="e.g. 1 piece, 500g" style={inp} />
            </div>
            <div>
              <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
                display:'block', marginBottom:'6px' }}>Stock</label>
              <input type="number" value={form.stock} min="0"
                onChange={e => setForm(f=>({...f,stock:e.target.value}))}
                placeholder="100" style={inp} />
            </div>
          </div>

          {/* ── Video Links ── */}
          <div>
            <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)',
              display:'block', marginBottom:'8px' }}>
              🎬 Video Tutorial / Installation Links
            </label>
            {form.video_links?.map((v, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px',
                background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'10px',
                padding:'8px 12px', marginBottom:'8px' }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'12px', fontWeight:800, color:'#15803D' }}>
                    🎬 {v.title}
                  </p>
                  <p style={{ fontSize:'11px', color:'#16A34A',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {v.url}
                  </p>
                </div>
                <button type="button" onClick={() => removeVideoLink(i)}
                  style={{ padding:'4px', borderRadius:'8px', background:'#FEF2F2',
                    border:'none', cursor:'pointer', display:'flex',
                    color:'#EF4444', fontWeight:900 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px',
              background:'#F8FAFC', borderRadius:'12px', padding:'12px',
              border:'1.5px dashed #E2E8F0' }}>
              <input value={newVideoTitle}
                onChange={e => setNewVideoTitle(e.target.value)}
                placeholder="Video title (e.g. Installation Guide)"
                style={{ ...inp, background:'white' }} />
              <div style={{ display:'flex', gap:'8px' }}>
                <input value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  placeholder="YouTube / video URL"
                  style={{ ...inp, flex:1, background:'white' }} />
                <button type="button" onClick={addVideoLink}
                  style={{ padding:'10px 16px', borderRadius:'10px',
                    background:'#16A34A', color:'white', fontWeight:800,
                    fontSize:'13px', border:'none', cursor:'pointer',
                    whiteSpace:'nowrap' }}>
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* ── Active toggle ── */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px',
            background:'#F8FAFC', borderRadius:'12px', padding:'12px' }}>
            <input type="checkbox" id="active" checked={form.active}
              onChange={e => setForm(f=>({...f,active:e.target.checked}))}
              style={{ width:'18px', height:'18px', cursor:'pointer' }} />
            <label htmlFor="active" style={{ fontSize:'14px', fontWeight:700,
              color:'var(--text)', cursor:'pointer' }}>
              Active — visible to customers
            </label>
          </div>

          {/* ── Submit ── */}
          <div style={{ display:'flex', gap:'10px', paddingBottom:'12px' }}>
            <button type="submit" disabled={saving}
              style={{ flex:1, padding:'14px', borderRadius:'14px',
                background: saving ? '#E2E8F0' : 'var(--primary-grad)',
                color: saving ? '#94A3B8' : 'white',
                fontWeight:900, fontSize:'15px', border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <Save size={18} />
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose}
              style={{ padding:'14px 20px', borderRadius:'14px',
                background:'#F1F5F9', color:'var(--text-2)',
                fontWeight:700, fontSize:'15px', border:'none', cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Order Card ──────────────────────────────────────────── */
function OrderCard({ order, onConfirm, onReject, onStatus, confirming }) {
  const [open,   setOpen]   = useState(false);
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState('');
  const addr = order.shipping_address || {};
  const isPending = order.payment_status === 'submitted';

  function waCustomer(msg) {
    window.open(`https://wa.me/91${addr.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div style={{ background:'white', borderRadius:'16px', border:'1px solid var(--border)',
      boxShadow:'var(--shadow-sm)', overflow:'hidden', marginBottom:'12px' }}>

      {/* Header */}
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <p style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>
              {addr.fullName || 'Unknown'}
            </p>
            <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px' }}>
              #{order.id.slice(0,8).toUpperCase()} · {new Date(order.submitted_at || order.created_at)
                .toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
            </p>
          </div>
          <p style={{ fontSize:'20px', fontWeight:900, color:'var(--primary)' }}>
            ₹{order.total_amount?.toFixed(0)}
          </p>
        </div>
        <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'6px' }}>
          {order.items?.map(i=>`${i.name} ×${i.quantity}`).join(', ')}
        </p>
        {order.utr && (
          <div style={{ marginTop:'8px', display:'inline-flex', alignItems:'center',
            gap:'6px', background:'#F0FDF4', border:'1px solid #BBF7D0',
            borderRadius:'8px', padding:'4px 10px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'#16A34A' }}>
              UTR: {order.utr}
            </p>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div style={{ padding:'10px 16px', display:'flex', gap:'8px', flexWrap:'wrap' }}>
        {order.screenshot_url && (
          <a href={order.screenshot_url} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'5px',
              padding:'6px 12px', borderRadius:'10px', background:'#EFF6FF',
              color:'#1D4ED8', fontSize:'12px', fontWeight:700, textDecoration:'none' }}>
            <Eye size={13} /> Screenshot
          </a>
        )}
        <button onClick={() => setOpen(!open)}
          style={{ display:'flex', alignItems:'center', gap:'5px',
            padding:'6px 12px', borderRadius:'10px', background:'#F8FAFC',
            color:'var(--text-2)', fontSize:'12px', fontWeight:700,
            border:'none', cursor:'pointer' }}>
          {open ? '▲ Less' : '▼ Details'}
        </button>
      </div>

      {/* Expanded details */}
      {open && (
        <div style={{ padding:'0 16px 14px', display:'flex',
          flexDirection:'column', gap:'10px' }}>
          <div style={{ background:'#F8FAFC', borderRadius:'12px', padding:'12px' }}>
            <p style={{ fontSize:'11px', fontWeight:700, color:'var(--text-3)',
              textTransform:'uppercase', marginBottom:'6px' }}>Delivery Address</p>
            <p style={{ fontSize:'13px', color:'var(--text)', lineHeight:1.7 }}>
              {addr.houseNo}, {addr.streetArea}<br/>
              Near {addr.landmark}<br/>
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
          </div>
          <div style={{ background:'#F8FAFC', borderRadius:'12px', padding:'12px' }}>
            <p style={{ fontSize:'11px', fontWeight:700, color:'var(--text-3)',
              textTransform:'uppercase', marginBottom:'8px' }}>Items</p>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between',
                fontSize:'13px', marginBottom:'4px' }}>
                <span style={{ color:'var(--text-2)' }}>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight:700 }}>₹{(item.price*item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid var(--border)', marginTop:'6px',
              paddingTop:'6px', display:'flex', justifyContent:'space-between',
              fontWeight:900, fontSize:'14px' }}>
              <span>Total</span>
              <span style={{ color:'var(--primary)' }}>₹{order.total_amount?.toFixed(0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm / Reject */}
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)',
        display:'flex', flexDirection:'column', gap:'10px' }}>

        {isPending && !reject && (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => onConfirm(order)} disabled={confirming}
              style={{ flex:1, padding:'12px', borderRadius:'12px',
                background: confirming ? '#E2E8F0' : 'linear-gradient(135deg,#16A34A,#15803D)',
                color: confirming ? '#94A3B8' : 'white', fontWeight:900,
                fontSize:'14px', border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <CheckCircle size={16} />
              {confirming ? 'Confirming...' : '✅ Confirm Payment'}
            </button>
            <button onClick={() => setReject(true)}
              style={{ flex:1, padding:'12px', borderRadius:'12px',
                background:'#FEF2F2', color:'#EF4444', fontWeight:900,
                fontSize:'14px', border:'1px solid #FECACA', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}

        {reject && (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <input value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Rejection reason (e.g. Payment not received)"
              style={{ width:'100%', padding:'10px 14px', borderRadius:'10px',
                border:'1.5px solid #FECACA', fontSize:'13px',
                fontFamily:'inherit', outline:'none', background:'#FEF2F2' }} />
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => { onReject(order, reason); setReject(false); }}
                style={{ flex:1, padding:'11px', borderRadius:'12px',
                  background:'#EF4444', color:'white', fontWeight:900,
                  fontSize:'14px', border:'none', cursor:'pointer' }}>
                Confirm Reject
              </button>
              <button onClick={() => { setReject(false); setReason(''); }}
                style={{ flex:1, padding:'11px', borderRadius:'12px',
                  background:'#F8FAFC', color:'var(--text-2)', fontWeight:700,
                  fontSize:'14px', border:'1px solid var(--border)', cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status changer */}
        {['confirmed','preparing','shipped'].includes(order.status) && (
          <select value={order.status}
            onChange={e => onStatus(order.id, e.target.value)}
            style={{ width:'100%', padding:'10px 14px', borderRadius:'12px',
              border:'1.5px solid var(--border)', fontSize:'13px',
              fontFamily:'inherit', background:'white', fontWeight:700 }}>
            <option value="confirmed">✅ Confirmed</option>
            <option value="preparing">📦 Preparing</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">🏠 Delivered</option>
          </select>
        )}

        {/* Contact */}
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => waCustomer(
            `Hello ${addr.fullName}, your order #${order.id.slice(0,8).toUpperCase()} from AS HUB has been confirmed! We will process and ship it soon.`
          )} style={{ flex:1, padding:'10px', borderRadius:'12px',
            background:'#F0FDF4', color:'#16A34A', fontWeight:800,
            fontSize:'13px', border:'1px solid #BBF7D0', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <MessageCircle size={14} /> WhatsApp
          </button>
          <a href={`tel:+91${addr.phone}`}
            style={{ flex:1, padding:'10px', borderRadius:'12px',
              background:'#EFF6FF', color:'#1D4ED8', fontWeight:800,
              fontSize:'13px', border:'1px solid #BFDBFE', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              gap:'6px', textDecoration:'none' }}>
            <Phone size={14} /> Call
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const [mainTab,    setMainTab]    = useState('orders');
  const [orderTab,   setOrderTab]   = useState('payment_submitted');
  const [orders,     setOrders]     = useState([]);
  const [products,   setProducts]   = useState([]);
  const [counts,     setCounts]     = useState({});
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [modal,      setModal]      = useState(null); // null | 'add' | product obj
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('all');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return; }
  }, [user]);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    if (mainTab === 'orders') { fetchOrders(); fetchCounts(); }
    if (mainTab === 'products') fetchProducts();
  }, [mainTab, orderTab]);

  // Realtime
  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    const ch = supabase.channel('admin-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'orders' },
        () => { if (mainTab === 'orders') { fetchOrders(); fetchCounts(); } })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [mainTab, orderTab]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let q = supabase.from('orders').select('*').order('created_at',{ascending:false});
      if (orderTab === 'payment_submitted') q = q.eq('payment_status','submitted');
      else if (orderTab === 'payment_rejected') q = q.eq('payment_status','rejected');
      else q = q.eq('status', orderTab);
      const { data, error } = await q;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function fetchCounts() {
    try {
      const { data } = await supabase.from('orders').select('status,payment_status');
      if (!data) return;
      const c = {};
      data.forEach(o => {
        if (o.payment_status === 'submitted') c.payment_submitted = (c.payment_submitted||0)+1;
        else if (o.payment_status === 'rejected') c.payment_rejected = (c.payment_rejected||0)+1;
        else c[o.status] = (c[o.status]||0)+1;
      });
      setCounts(c);
    } catch (err) { console.error(err); }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products')
        .select('*').order('created_at',{ascending:false});
      if (error) throw error;
      setProducts(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleConfirm(order) {
    setConfirming(order.id);
    try {
      await supabase.from('orders').update({
        payment_status: 'verified',
        status:         'confirmed',
        verified_by:    user.email,
        verified_at:    new Date().toISOString(),
      }).eq('id', order.id);
      const addr = order.shipping_address || {};
      const msg  = `Payment Verified — AS HUB\n\nDear ${addr.fullName},\n\nYour payment of ₹${order.total_amount?.toFixed(0)} for Order #${order.id.slice(0,8).toUpperCase()} has been verified.\n\nYour order is confirmed and will be prepared shortly!\n\nThank you for shopping with AS HUB!`;
      window.open(`https://wa.me/91${addr.phone}?text=${encodeURIComponent(msg)}`, '_blank');
      fetchOrders(); fetchCounts();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setConfirming(null); }
  }

  async function handleReject(order, reason) {
    try {
      await supabase.from('orders').update({
        payment_status:   'rejected',
        status:           'payment_rejected',
        rejection_reason: reason || 'Payment not verified',
      }).eq('id', order.id);
      const addr = order.shipping_address || {};
      const msg  = `Payment Failed — AS HUB\n\nDear ${addr.fullName},\n\nWe could not verify your payment for Order #${order.id.slice(0,8).toUpperCase()}.\n\nReason: ${reason || 'Payment not received'}\n\nPlease contact us or retry payment.`;
      window.open(`https://wa.me/91${addr.phone}?text=${encodeURIComponent(msg)}`, '_blank');
      fetchOrders(); fetchCounts();
    } catch (err) { alert('Error: ' + err.message); }
  }

  async function handleStatus(id, status) {
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
      fetchOrders(); fetchCounts();
    } catch (err) { alert('Error: ' + err.message); }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    } catch (err) { alert('Error: ' + err.message); }
  }

  async function handleToggleActive(product) {
    try {
      await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
      fetchProducts();
    } catch (err) { alert('Error: ' + err.message); }
  }

  function handleLogout() {
    supabase.auth.signOut();
    setUser(null);
    navigate('/');
  }

  if (!user || user.email !== ADMIN_EMAIL) return null;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F0F4F8', paddingBottom:'80px' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#FC8019,#FF9F1C)',
        padding:'14px 16px', position:'sticky', top:0, zIndex:50,
        boxShadow:'0 4px 20px rgba(252,128,25,.3)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ fontSize:'17px', fontWeight:900, color:'white' }}>AS HUB Admin</p>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,.8)' }}>{user.email}</p>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            {mainTab === 'orders' && (
              <button onClick={fetchOrders}
                style={{ padding:'8px', borderRadius:'10px',
                  background:'rgba(255,255,255,.2)', border:'none',
                  cursor:'pointer', display:'flex' }}>
                <RefreshCw size={18} color="white" />
              </button>
            )}
            <button onClick={handleLogout}
              style={{ padding:'8px', borderRadius:'10px',
                background:'rgba(255,255,255,.2)', border:'none',
                cursor:'pointer', display:'flex' }}>
              <LogOut size={18} color="white" />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'16px' }}>

        {/* Main tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
          {MAIN_TABS.map(t => (
            <button key={t.key} onClick={() => setMainTab(t.key)}
              style={{ flex:1, padding:'12px', borderRadius:'14px', fontWeight:900,
                fontSize:'14px', border:'none', cursor:'pointer',
                background: mainTab === t.key ? 'var(--primary)' : 'white',
                color:      mainTab === t.key ? 'white' : 'var(--text-2)',
                boxShadow:  mainTab === t.key ? '0 4px 14px rgba(252,128,25,.35)' : 'var(--shadow-xs)' }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* ══ ORDERS SECTION ══ */}
        {mainTab === 'orders' && (
          <>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
              gap:'10px', marginBottom:'16px' }}>
              {[
                { l:'Pending',   v:counts.payment_submitted||0, c:'#3B82F6' },
                { l:'Confirmed', v:(counts.confirmed||0)+(counts.preparing||0), c:'#16A34A' },
                { l:'Shipped',   v:counts.shipped||0, c:'#8B5CF6' },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ background:'white', borderRadius:'14px',
                  padding:'14px', textAlign:'center', boxShadow:'var(--shadow-xs)',
                  border:`2px solid ${v>0?c+'33':'var(--border)'}` }}>
                  <p style={{ fontSize:'28px', fontWeight:900, color:v>0?c:'#94A3B8' }}>{v}</p>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'var(--text-3)',
                    textTransform:'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>

            {/* Order tabs */}
            <div style={{ display:'flex', gap:'6px', overflowX:'auto',
              paddingBottom:'4px', marginBottom:'16px' }}>
              {ORDER_TABS.map(t => (
                <button key={t.key} onClick={() => setOrderTab(t.key)}
                  style={{ display:'flex', alignItems:'center', gap:'4px',
                    padding:'8px 14px', borderRadius:'12px', whiteSpace:'nowrap',
                    fontWeight:800, fontSize:'13px', border:'none', cursor:'pointer',
                    flexShrink:0, transition:'all .2s',
                    background: orderTab === t.key ? t.color : 'white',
                    color:      orderTab === t.key ? 'white' : 'var(--text-2)',
                    boxShadow:  orderTab === t.key
                      ? `0 4px 12px ${t.color}44` : 'var(--shadow-xs)' }}>
                  {t.emoji} {t.label}
                  {counts[t.key] > 0 && (
                    <span style={{ background: orderTab===t.key?'rgba(255,255,255,.3)':t.color,
                      color:'white', fontSize:'10px', fontWeight:900,
                      borderRadius:'99px', padding:'1px 7px' }}>
                      {counts[t.key] > 99 ? '99+' : counts[t.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Order list */}
            {loading ? (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <div style={{ width:'36px', height:'36px', border:'3px solid #E2E8F0',
                  borderTop:'3px solid var(--primary)', borderRadius:'50%',
                  animation:'spin .8s linear infinite', margin:'0 auto 12px' }} />
                <p style={{ color:'var(--text-2)', fontWeight:600 }}>Loading...</p>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'white',
                borderRadius:'20px', border:'1px solid var(--border)' }}>
                <p style={{ fontSize:'48px', marginBottom:'10px' }}>
                  {ORDER_TABS.find(t=>t.key===orderTab)?.emoji}
                </p>
                <p style={{ fontSize:'16px', fontWeight:900, color:'var(--text)' }}>
                  No orders here
                </p>
              </div>
            ) : (
              orders.map(o => (
                <OrderCard key={o.id} order={o}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onStatus={handleStatus}
                  confirming={confirming === o.id} />
              ))
            )}
          </>
        )}

        {/* ══ PRODUCTS SECTION ══ */}
        {mainTab === 'products' && (
          <>
            {/* Toolbar */}
            <div style={{ display:'flex', gap:'10px', marginBottom:'16px',
              flexWrap:'wrap', alignItems:'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search products..."
                style={{ flex:1, minWidth:'160px', padding:'10px 14px',
                  borderRadius:'12px', border:'1.5px solid var(--border)',
                  fontSize:'14px', fontFamily:'inherit', outline:'none',
                  background:'white' }} />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ padding:'10px 14px', borderRadius:'12px',
                  border:'1.5px solid var(--border)', fontSize:'14px',
                  fontFamily:'inherit', background:'white', fontWeight:700 }}>
                <option value="all">All Categories</option>
                <option value="tailoring">🪡 Tailoring</option>
                <option value="fashion">👗 Fashion</option>
              </select>
              <button onClick={() => setModal('add')}
                style={{ display:'flex', alignItems:'center', gap:'6px',
                  padding:'10px 18px', borderRadius:'12px',
                  background:'var(--primary-grad)', color:'white',
                  fontWeight:900, fontSize:'14px', border:'none', cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(252,128,25,.35)', whiteSpace:'nowrap' }}>
                <Plus size={18} /> Add Product
              </button>
            </div>

            {/* Stats strip */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'14px',
              flexWrap:'wrap' }}>
              {[
                { l:'Total',    v:products.length,                              c:'#6B7280' },
                { l:'Active',   v:products.filter(p=>p.active).length,          c:'#16A34A' },
                { l:'Tailoring',v:products.filter(p=>p.category==='tailoring').length, c:'#3B82F6' },
                { l:'Fashion',  v:products.filter(p=>p.category==='fashion').length,   c:'#EC4899' },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ background:'white', borderRadius:'12px',
                  padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px',
                  boxShadow:'var(--shadow-xs)', border:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'18px', fontWeight:900, color:c }}>{v}</span>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-3)' }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Product grid */}
            {loading ? (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <div style={{ width:'36px', height:'36px', border:'3px solid #E2E8F0',
                  borderTop:'3px solid var(--primary)', borderRadius:'50%',
                  animation:'spin .8s linear infinite', margin:'0 auto 12px' }} />
                <p style={{ color:'var(--text-2)', fontWeight:600 }}>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'white',
                borderRadius:'20px', border:'1px solid var(--border)' }}>
                <p style={{ fontSize:'48px', marginBottom:'10px' }}>🛍️</p>
                <p style={{ fontSize:'16px', fontWeight:900, color:'var(--text)',
                  marginBottom:'6px' }}>No products found</p>
                <button onClick={() => setModal('add')}
                  style={{ padding:'12px 24px', borderRadius:'12px',
                    background:'var(--primary-grad)', color:'white',
                    fontWeight:900, border:'none', cursor:'pointer' }}>
                  Add First Product
                </button>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',
                gap:'12px' }}>
                {filteredProducts.map(p => (
                  <div key={p.id} style={{ background:'white', borderRadius:'16px',
                    border:'1px solid var(--border)', overflow:'hidden',
                    boxShadow:'var(--shadow-xs)',
                    opacity: p.active ? 1 : 0.6 }}>
                    <div style={{ position:'relative', aspectRatio:'1',
                      background:'#F8FAFC' }}>
                      <img src={p.image_url || 'https://placehold.co/160x160?text=?'}
                        alt={p.name} style={{ width:'100%', height:'100%',
                          objectFit:'cover' }} />
                      {!p.active && (
                        <div style={{ position:'absolute', top:'6px', left:'6px',
                          background:'#EF4444', color:'white', fontSize:'9px',
                          fontWeight:900, padding:'2px 8px', borderRadius:'99px' }}>
                          HIDDEN
                        </div>
                      )}
                      {p.original_price > p.price && (
                        <div style={{ position:'absolute', top:'6px', right:'6px',
                          background:'#FC8019', color:'white', fontSize:'9px',
                          fontWeight:900, padding:'2px 8px', borderRadius:'99px' }}>
                          {Math.round((1-p.price/p.original_price)*100)}% OFF
                        </div>
                      )}
                    </div>
                    <div style={{ padding:'10px 10px 12px' }}>
                      <p style={{ fontSize:'12px', fontWeight:800, color:'var(--text)',
                        marginBottom:'2px', lineHeight:1.3,
                        display:'-webkit-box', WebkitLineClamp:2,
                        WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', marginBottom:'6px' }}>
                        {p.category} · {p.sub_category || '—'}
                      </p>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'4px',
                        marginBottom:'8px' }}>
                        <span style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>
                          ₹{p.price}
                        </span>
                        {p.original_price > p.price && (
                          <span style={{ fontSize:'11px', color:'var(--text-3)',
                            textDecoration:'line-through' }}>
                            ₹{p.original_price}
                          </span>
                        )}
                      </div>
                      {p.stock !== null && (
                        <p style={{ fontSize:'11px', fontWeight:700,
                          color: p.stock === 0 ? '#EF4444' : p.stock < 10 ? '#F59E0B' : '#16A34A',
                          marginBottom:'8px' }}>
                          {p.stock === 0 ? 'Out of stock'
                            : p.stock < 10 ? `Only ${p.stock} left`
                            : `${p.stock} in stock`}
                        </p>
                      )}
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => setModal(p)}
                          style={{ flex:1, padding:'7px', borderRadius:'10px',
                            background:'#EFF6FF', color:'#1D4ED8', fontWeight:800,
                            fontSize:'12px', border:'none', cursor:'pointer',
                            display:'flex', alignItems:'center',
                            justifyContent:'center', gap:'4px' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleToggleActive(p)}
                          style={{ flex:1, padding:'7px', borderRadius:'10px',
                            background: p.active ? '#FEF3C7' : '#F0FDF4',
                            color: p.active ? '#92400E' : '#15803D',
                            fontWeight:800, fontSize:'12px',
                            border:'none', cursor:'pointer' }}>
                          {p.active ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding:'7px', borderRadius:'10px',
                            background:'#FEF2F2', color:'#EF4444',
                            fontWeight:800, fontSize:'12px',
                            border:'none', cursor:'pointer',
                            display:'flex', alignItems:'center' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchProducts(); }}
        />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
