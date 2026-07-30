import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, MessageCircle, Phone, CheckCircle, XCircle,
  Plus, Edit2, Trash2, Eye, LogOut, Upload, X, Save,
  ShoppingBag, Package, Truck, Users, TrendingUp, Bell,
  Search, Filter, BarChart2, Settings, ChevronRight,
  AlertCircle, Clock, DollarSign, ArrowUpRight,
  Download, Command, Printer,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';
import {
  ToastContainer, ConfirmDialog, CommandPalette,
  OrderSkeleton, ProductSkeleton, EmptyState,
  RevenueWidgets, InventoryAlerts, DateFilterBar,
  exportOrdersCSV, exportProductsCSV,
  toast, confirm,
} from '../components/admin/AdminUtils';

const ADMIN_EMAIL = 'as.businezzz@gmail.com';
const ORDER_TABS = [
  { key:'all_pending',       label:'All New',   color:'#F59E0B' },
  { key:'payment_submitted', label:'Verify',    color:'#3B82F6' },
  { key:'confirmed',         label:'Confirmed', color:'#16A34A' },
  { key:'preparing',         label:'Preparing', color:'#8B5CF6' },
  { key:'shipped',           label:'Shipped',   color:'#0369A1' },
  { key:'delivered',         label:'Delivered', color:'#6B7280' },
  { key:'payment_rejected',  label:'Rejected',  color:'#EF4444' },
];
const MAIN_TABS = [
  { key:'orders',   label:'Orders',   icon:ShoppingBag },
  { key:'products', label:'Products', icon:Package },
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
        toast('Product updated successfully!', 'success');
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        toast('Product added successfully!', 'success');
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

/* ─── Print Shipping Label ────────────────────────────────── */
function printShippingLabel(order) {
  const addr  = order.shipping_address || {};
  const items = (order.items || []).map(i => `${i.name} × ${i.quantity} = ₹${(i.price*i.quantity).toFixed(0)}`).join('\n');
  const html  = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shipping Label - #${order.id.slice(0,8).toUpperCase()}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; background: white; }
        .page { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }

        /* Header */
        .header { display:flex; justify-content:space-between; align-items:center;
          border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
        .brand { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
        .order-id { font-size: 14px; font-weight: 700; color: #333; }
        .barcode-area { text-align: right; }
        .barcode-text { font-family: monospace; font-size: 18px; font-weight: 900;
          letter-spacing: 4px; border: 2px solid #000; padding: 6px 12px; display: inline-block; }

        /* Boxes */
        .box { border: 2px solid #000; border-radius: 6px; padding: 14px; margin-bottom: 14px; }
        .box-title { font-size: 10px; font-weight: 900; text-transform: uppercase;
          letter-spacing: 1.5px; color: #666; margin-bottom: 8px; }
        .address-name { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
        .address-phone { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .address-line { font-size: 14px; line-height: 1.6; color: #333; }
        .address-pincode { font-size: 22px; font-weight: 900; margin-top: 8px;
          letter-spacing: 2px; }

        /* From section */
        .from-box { background: #f8f8f8; border: 1.5px solid #ccc; }
        .from-name { font-size: 17px; font-weight: 800; margin-bottom: 6px; }
        .from-detail { font-size: 13px; color: #333; line-height: 1.8; }

        /* Items */
        .items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .items-table th { background: #000; color: white; padding: 6px 10px;
          text-align: left; font-size: 11px; text-transform: uppercase; }
        .items-table td { padding: 7px 10px; border-bottom: 1px solid #eee; }
        .items-table tr:last-child td { border-bottom: none; }
        .total-row td { font-weight: 900; font-size: 14px; background: #f8f8f8; }

        /* Payment badge */
        .payment-badge { display: inline-block; background: #000; color: white;
          font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 4px;
          text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }

        /* Footer */
        .footer { border-top: 2px dashed #999; padding-top: 12px; margin-top: 14px;
          display: flex; justify-content: space-between; align-items: center; }
        .footer-text { font-size: 11px; color: #666; }
        .handle-care { font-size: 11px; font-weight: 700; border: 1.5px solid #000;
          padding: 4px 10px; border-radius: 4px; }

        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="page">

        <!-- Print button (hidden when printing) -->
        <div class="no-print" style="text-align:right; margin-bottom:16px;">
          <button onclick="window.print()" style="padding:10px 24px; background:#000;
            color:white; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer;">
            🖨️ Print Label
          </button>
        </div>

        <!-- Header -->
        <div class="header">
          <div>
            <div class="brand">AS HUB</div>
            <div style="font-size:11px; color:#666; margin-top:2px;">Ph: 7013942909 | as.businezzz@gmail.com</div>
          </div>
          <div class="barcode-area">
            <div class="barcode-text">#${order.id.slice(0,8).toUpperCase()}</div>
            <div style="font-size:11px; color:#666; margin-top:4px;">
              ${new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>

        <!-- TO: Deliver To -->
        <div class="box">
          <div class="box-title">📦 Deliver To</div>
          <div class="address-name">${addr.fullName || 'N/A'}</div>
          <div class="address-phone">📞 +91 ${addr.phone || 'N/A'}</div>
          <div class="address-line">
            ${addr.houseNo || ''}, ${addr.streetArea || ''}<br/>
            Near ${addr.landmark || 'N/A'}<br/>
            ${addr.city || ''}, ${addr.state || ''}
          </div>
          <div class="address-pincode">PIN: ${addr.pincode || 'N/A'}</div>
          ${addr.email ? `<div style="font-size:12px;color:#555;margin-top:6px;">✉ ${addr.email}</div>` : ''}
        </div>

        <!-- FROM: Sender Address -->
        <div class="box from-box">
          <div class="box-title">From</div>
          <div class="from-name">Shaik Asmath (AS HUB)</div>
          <div class="from-detail">
            D.No. 25-2-1709,<br/>
            Pragathi Nagar, Podalkur Road,<br/>
            Nellore, Andhra Pradesh - 524004<br/>
            Ph: 7013942909
          </div>
        </div>

        <!-- Items -->
        <div class="box">
          <div class="box-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align:right">Qty</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items||[]).map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td style="text-align:right">${i.quantity}</td>
                  <td style="text-align:right">₹${(i.price*i.quantity).toFixed(0)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total Amount</td>
                <td style="text-align:right">₹${order.total_amount?.toFixed(0)}</td>
              </tr>
            </tbody>
          </table>
          <div class="payment-badge">✓ Paid via UPI</div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-text">
            Order ID: ${order.id.slice(0,8).toUpperCase()} | 
            Date: ${new Date(order.created_at).toLocaleDateString('en-IN')} |
            Status: ${order.status?.toUpperCase()}
          </div>
          <div class="handle-care">HANDLE WITH CARE</div>
        </div>

      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=700,height=900');
  win.document.write(html);
  win.document.close();
  win.focus();
}

/* ─── Order Card ──────────────────────────────────────────── */
function OrderCard({ order, onConfirm, onReject, onStatus, onDelete, confirming }) {
  const [open,   setOpen]   = useState(false);
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState('');
  const addr = order.shipping_address || {};
  const isPending = order.payment_status === 'submitted' || order.status === 'pending_payment';

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
          <button onClick={() => printShippingLabel(order)}
            title="Print Shipping Label"
            style={{ padding:'10px 14px', borderRadius:'12px',
              background:'#1A1A2E', color:'white', fontWeight:800,
              fontSize:'13px', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <Printer size={14} /> Print
          </button>
          <button onClick={() => onDelete(order.id)}
            style={{ padding:'10px 14px', borderRadius:'12px',
              background:'#FEF2F2', color:'#EF4444', fontWeight:800,
              fontSize:'13px', border:'1px solid #FECACA', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Trash2 size={14} />
          </button>
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
  const [orderTab,   setOrderTab]   = useState('all_pending');
  const [orders,     setOrders]     = useState([]);
  const [products,   setProducts]   = useState([]);
  const [counts,     setCounts]     = useState({});
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [modal,      setModal]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('all');
  const [cmdOpen,    setCmdOpen]    = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [allOrders,  setAllOrders]  = useState([]);

  // Ctrl+K command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
      if (orderTab === 'all_pending') {
        q = q.in('status', ['pending_payment','payment_submitted']);
      } else if (orderTab === 'payment_submitted') {
        q = q.eq('payment_status','submitted');
      } else if (orderTab === 'payment_rejected') {
        q = q.eq('payment_status','rejected');
      } else {
        q = q.eq('status', orderTab);
      }
      const { data, error } = await q;
      if (error) throw error;

      // Apply date filter
      let filtered = data || [];
      if (dateFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(o => {
          const d = new Date(o.created_at);
          if (dateFilter === 'today') return d.toDateString() === now.toDateString();
          if (dateFilter === 'week') {
            const weekAgo = new Date(now - 7*24*60*60*1000);
            return d >= weekAgo;
          }
          if (dateFilter === 'month') return d.getMonth() === now.getMonth();
          return true;
        });
      }

      setOrders(filtered);
    } catch (err) { console.error(err); toast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  }

  // Also fetch all orders for revenue widgets
  useEffect(() => {
    supabase.from('orders').select('*').then(({ data }) => {
      if (data) setAllOrders(data);
    });
  }, []);

  async function fetchCounts() {
    try {
      const { data } = await supabase.from('orders').select('status,payment_status');
      if (!data) return;
      const c = {};
      data.forEach(o => {
        // All new/pending orders (pending_payment + payment_submitted)
        if (['pending_payment','payment_submitted'].includes(o.status)) {
          c.all_pending = (c.all_pending||0)+1;
        }
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
      toast('Payment confirmed! WhatsApp sent to customer.', 'success');
      fetchOrders(); fetchCounts();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
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
      toast('Order rejected. Customer notified.', 'warning');
      fetchOrders(); fetchCounts();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  }

  async function handleStatus(id, status) {
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
      toast(`Status updated to ${status}`, 'success');
      fetchOrders(); fetchCounts();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  }

  async function handleDeleteOrder(id) {
    if (!window.confirm('Delete this order permanently? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      fetchOrders(); fetchCounts();
    } catch (err) { alert('Error deleting order: ' + err.message); }
  }

  // Group orders by month
  function groupByMonth(orders) {
    const groups = {};
    orders.forEach(o => {
      const d    = new Date(o.created_at);
      const key  = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label = d.toLocaleDateString('en-IN', { month:'long', year:'numeric' });
      if (!groups[key]) groups[key] = { label, orders:[], total:0 };
      groups[key].orders.push(o);
      groups[key].total += o.total_amount || 0;
    });
    return Object.values(groups).sort((a,b) => b.label.localeCompare(a.label));
  }

  // Count orders placed this month
  const thisMonth = new Date().toLocaleDateString('en-IN',{ month:'long', year:'numeric' });
  const thisMonthCount = orders.filter(o =>
    new Date(o.created_at).toLocaleDateString('en-IN',{ month:'long', year:'numeric' }) === thisMonth
  ).length;

  async function handleDeleteProduct(id) {
    const ok = await confirm({ title:'Delete Product', message:'This product will be permanently removed. This cannot be undone.', confirm:'Delete', type:'danger' });
    if (!ok) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
      toast('Product deleted', 'success');
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  }

  async function handleDeleteOrder(id) {
    const ok = await confirm({ title:'Delete Order', message:'This order will be permanently deleted.', confirm:'Delete', type:'danger' });
    if (!ok) return;
    try {
      await supabase.from('orders').delete().eq('id', id);
      fetchOrders(); fetchCounts();
      toast('Order deleted', 'success');
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  }

  async function handleToggleActive(product) {
    try {
      await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
      fetchProducts();
      toast(product.active ? 'Product hidden' : 'Product visible', 'success');
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  }

  async function handleLogout() {
    const ok = await confirm({ title:'Sign Out', message:'Are you sure you want to sign out?', confirm:'Sign Out', type:'warning' });
    if (!ok) return;
    supabase.auth.signOut();
    setUser(null);
    navigate('/');
  }

  // Notifications (derived from data)
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_notif_read') || '[]'); } catch { return []; }
  });

  const notifications = [
    ...orders.filter(o => o.payment_status === 'submitted').slice(0,3).map(o => ({
      id: `pay_${o.id}`, type:'payment', color:'#3B82F6', bg:'#EFF6FF',
      title:'Payment Submitted', body:`#${o.id.slice(0,8).toUpperCase()} — ₹${o.total_amount?.toFixed(0)} awaiting verification`,
    })),
    ...products.filter(p => p.stock !== null && p.stock <= 5 && p.stock > 0).slice(0,2).map(p => ({
      id: `stock_${p.id}`, type:'stock', color:'#F59E0B', bg:'#FFFBEB',
      title:'Low Stock Alert', body:`${p.name} — only ${p.stock} left`,
    })),
    ...products.filter(p => p.stock === 0).slice(0,2).map(p => ({
      id: `oos_${p.id}`, type:'outofstock', color:'#EF4444', bg:'#FEF2F2',
      title:'Out of Stock', body:`${p.name} is out of stock`,
    })),
  ];
  const unreadCount = notifications.filter(n => !notifRead.includes(n.id)).length;

  function markAllRead() {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('admin_notif_read', JSON.stringify(ids));
    setNotifRead(ids);
  }

  // Bulk selection
  const [selected, setSelected] = useState([]);
  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const selectAll = () => setSelected(orders.map(o=>o.id));
  const clearSelection = () => setSelected([]);

  async function bulkConfirm() {
    const ok = await confirm({ title:`Confirm ${selected.length} orders?`, message:'This will mark all selected payments as verified.', confirm:'Confirm All' });
    if (!ok) return;
    for (const id of selected) {
      const order = orders.find(o=>o.id===id);
      if (order) await handleConfirmSilent(order);
    }
    clearSelection(); fetchOrders(); fetchCounts();
    toast(`${selected.length} orders confirmed`, 'success');
  }

  async function handleConfirmSilent(order) {
    try {
      await supabase.from('orders').update({ payment_status:'verified', status:'confirmed', verified_by:user.email, verified_at:new Date().toISOString() }).eq('id', order.id);
    } catch(err) { console.error(err); }
  }

  async function bulkDelete() {
    const ok = await confirm({ title:`Delete ${selected.length} orders?`, message:'This action cannot be undone.', confirm:'Delete All', type:'danger' });
    if (!ok) return;
    for (const id of selected) {
      await supabase.from('orders').delete().eq('id', id);
    }
    clearSelection(); fetchOrders(); fetchCounts();
    toast(`${selected.length} orders deleted`, 'success');
  }

  function bulkExport() {
    const sel = orders.filter(o => selected.includes(o.id));
    exportOrdersCSV(sel.length > 0 ? sel : orders);
  }

  if (!user || user.email !== ADMIN_EMAIL) return null;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', paddingBottom:'80px' }}>

      {/* ── Premium Header ── */}
      <div style={{ background:'white', borderBottom:'1px solid #E8E8EE',
        padding:'0 24px', position:'sticky', top:0, zIndex:50,
        boxShadow:'0 1px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          height:'64px' }}>
          {/* Left — logo + title */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px',
              background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <BarChart2 size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize:'15px', fontWeight:800, color:'#0A0A0A', lineHeight:1 }}>
                AS HUB Admin
              </p>
              <p style={{ fontSize:'11px', color:'#8E8E93', marginTop:'2px' }}>
                {new Date().toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'})}
              </p>
            </div>
          </div>

          {/* Right — actions */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>

            {/* Ctrl+K Search */}
            <button onClick={() => setCmdOpen(true)}
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px',
                borderRadius:'10px', background:'#F4F4F8', border:'1px solid #E8E8EE',
                cursor:'pointer', fontSize:'12px', color:'#8E8E93', fontWeight:600 }}>
              <Search size={14} />
              <span className="sh-desktop-only">Search...</span>
              <kbd style={{ padding:'2px 6px', borderRadius:'4px', background:'white',
                border:'1px solid #E2E8F0', fontSize:'10px', fontWeight:700, color:'#8E8E93' }}>
                ⌘K
              </kbd>
            </button>

            {/* Notifications bell */}
            <div style={{ position:'relative' }}>
              <button onClick={() => setNotifOpen(o=>!o)}
                style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#F4F4F8',
                  border:'none', cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center', position:'relative' }}>
                <Bell size={16} color="#555" />
                {unreadCount > 0 && (
                  <span style={{ position:'absolute', top:'6px', right:'6px',
                    width:'8px', height:'8px', borderRadius:'50%',
                    background:'#EF4444', border:'2px solid white' }} />
                )}
              </button>
              {notifOpen && (
                <div style={{ position:'absolute', right:0, top:'44px', width:'320px',
                  background:'white', borderRadius:'16px', border:'1px solid #E8E8EE',
                  boxShadow:'0 12px 40px rgba(0,0,0,.12)', zIndex:200, overflow:'hidden' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'14px 16px', borderBottom:'1px solid #F0F0F0' }}>
                    <p style={{ fontSize:'14px', fontWeight:800, color:'#0A0A0A' }}>
                      Notifications {unreadCount > 0 && <span style={{ background:'#EF4444',
                        color:'white', fontSize:'10px', fontWeight:800, borderRadius:'99px',
                        padding:'1px 7px', marginLeft:'6px' }}>{unreadCount}</span>}
                    </p>
                    <button onClick={markAllRead}
                      style={{ background:'none', border:'none', cursor:'pointer',
                        fontSize:'11px', fontWeight:700, color:'#3B82F6' }}>
                      Mark all read
                    </button>
                  </div>
                  <div style={{ maxHeight:'280px', overflowY:'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding:'32px', textAlign:'center' }}>
                        <Bell size={24} color="#E2E8F0" style={{ margin:'0 auto 8px' }} />
                        <p style={{ fontSize:'13px', color:'#8E8E93' }}>No notifications</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{ display:'flex', gap:'12px', padding:'12px 16px',
                        background:notifRead.includes(n.id)?'white':'#FAFAFA',
                        borderBottom:'1px solid #F8F8F8' }}>
                        <div style={{ width:'8px', height:'8px', borderRadius:'50%',
                          background:n.color, marginTop:'5px', flexShrink:0 }} />
                        <div>
                          <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A' }}>{n.title}</p>
                          <p style={{ fontSize:'12px', color:'#8E8E93', marginTop:'2px' }}>{n.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Session status */}
            <div style={{ display:'flex', alignItems:'center', gap:'5px',
              padding:'5px 10px', borderRadius:'8px', background:'#F0FDF4',
              border:'1px solid #BBF7D0' }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                background:'#16A34A' }} />
              <span style={{ fontSize:'11px', fontWeight:700, color:'#16A34A' }}>Live</span>
            </div>

            {mainTab === 'orders' && (
              <button onClick={fetchOrders}
                style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#F4F4F8',
                  border:'none', cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center' }}
                title="Refresh (Ctrl+R)">
                <RefreshCw size={16} color="#555" />
              </button>
            )}

            <div style={{ width:'1px', height:'24px', background:'#E8E8EE' }} />
            <div style={{ display:'flex', alignItems:'center', gap:'10px',
              padding:'6px 12px', borderRadius:'12px', background:'#F4F4F8' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%',
                background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'12px', fontWeight:800, color:'white' }}>
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div className="sh-desktop-only">
                <p style={{ fontSize:'12px', fontWeight:700, color:'#0A0A0A', lineHeight:1 }}>Admin</p>
                <p style={{ fontSize:'10px', color:'#8E8E93', marginTop:'1px' }}>
                  {user.email?.split('@')[0]}
                </p>
              </div>
            </div>
            <button onClick={handleLogout}
              style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#FEF2F2',
                border:'1px solid #FECACA', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center' }} title="Sign Out">
              <LogOut size={16} color="#EF4444" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast + Confirm + Command Palette */}
      <ToastContainer />
      <ConfirmDialog />
      {cmdOpen && (
        <CommandPalette
          orders={allOrders}
          products={products}
          onClose={() => setCmdOpen(false)}
        />
      )}

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px 16px' }}>

        {/* Main tabs */}
        <div style={{ display:'flex', gap:'4px', marginBottom:'24px',
          background:'#F4F4F8', padding:'4px', borderRadius:'14px',
          width:'fit-content' }}>
          {MAIN_TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setMainTab(t.key)}
                style={{ display:'flex', alignItems:'center', gap:'7px',
                  padding:'8px 20px', borderRadius:'10px', fontWeight:700,
                  fontSize:'13px', border:'none', cursor:'pointer',
                  transition:'all .2s',
                  background: mainTab === t.key ? 'white' : 'transparent',
                  color: mainTab === t.key ? '#0A0A0A' : '#8E8E93',
                  boxShadow: mainTab === t.key ? '0 2px 8px rgba(0,0,0,.08)' : 'none' }}>
                <Icon size={15} strokeWidth={2} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ══ ORDERS SECTION ══ */}
        {mainTab === 'orders' && (
          <>
            {/* Revenue Widgets */}
            <RevenueWidgets orders={allOrders} />

            {/* Inventory Alerts */}
            <InventoryAlerts products={products} />

            {/* Date Filter */}
            <DateFilterBar active={dateFilter} onChange={v => { setDateFilter(v); }} />

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
              gap:'12px', marginBottom:'16px' }}>
              {[
                { l:'New Orders',  v:counts.all_pending||0,                       c:'#F59E0B', bg:'#FFFBEB', icon:AlertCircle },
                { l:'Confirmed',   v:(counts.confirmed||0)+(counts.preparing||0), c:'#16A34A', bg:'#F0FDF4', icon:CheckCircle },
                { l:'Shipped',     v:counts.shipped||0,                           c:'#2563EB', bg:'#EFF6FF', icon:Truck },
                { l:'Delivered',   v:counts.delivered||0,                         c:'#7C3AED', bg:'#F5F3FF', icon:Package },
              ].map(({ l, v, c, bg, icon:Icon }) => (
                <div key={l} style={{ background:'white', borderRadius:'16px',
                  padding:'16px 18px', border:`1px solid ${v>0?c+'22':'#F0F0F0'}`,
                  boxShadow:'0 2px 8px rgba(0,0,0,.04)',
                  borderTop:`3px solid ${v>0?c:'#F0F0F0'}` }}>
                  <div style={{ display:'flex', alignItems:'center',
                    justifyContent:'space-between', marginBottom:'10px' }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'10px',
                      background:bg, display:'flex', alignItems:'center',
                      justifyContent:'center' }}>
                      <Icon size={16} strokeWidth={2} color={c} />
                    </div>
                    {v > 0 && <ArrowUpRight size={14} color={c} />}
                  </div>
                  <p style={{ fontSize:'26px', fontWeight:900, color:v>0?c:'#C0C0C0',
                    lineHeight:1, marginBottom:'4px' }}>{v}</p>
                  <p style={{ fontSize:'11px', fontWeight:600, color:'#8E8E93',
                    textTransform:'uppercase', letterSpacing:'.5px' }}>{l}</p>
                </div>
              ))}
            </div>

            {/* Order tabs */}
            <div style={{ display:'flex', gap:'6px', overflowX:'auto',
              paddingBottom:'4px', marginBottom:'20px' }}>
              {ORDER_TABS.map(t => (
                <button key={t.key} onClick={() => setOrderTab(t.key)}
                  style={{ display:'flex', alignItems:'center', gap:'6px',
                    padding:'7px 14px', borderRadius:'8px', whiteSpace:'nowrap',
                    fontWeight:700, fontSize:'12px', border:'none', cursor:'pointer',
                    flexShrink:0, transition:'all .2s',
                    background: orderTab === t.key ? t.color : 'white',
                    color: orderTab === t.key ? 'white' : '#555',
                    boxShadow: orderTab === t.key
                      ? `0 4px 12px ${t.color}44` : '0 1px 4px rgba(0,0,0,.06)' }}>
                  {t.label}
                  {counts[t.key] > 0 && (
                    <span style={{ background: orderTab===t.key?'rgba(255,255,255,.3)':t.color+'22',
                      color: orderTab===t.key?'white':t.color,
                      fontSize:'10px', fontWeight:800, borderRadius:'6px', padding:'1px 6px' }}>
                      {counts[t.key] > 99 ? '99+' : counts[t.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Bulk actions bar */}
            {selected.length > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap',
                padding:'12px 16px', background:'#1A1A2E', borderRadius:'12px',
                marginBottom:'12px' }}>
                <span style={{ fontSize:'13px', fontWeight:800, color:'white' }}>
                  {selected.length} selected
                </span>
                <div style={{ flex:1 }} />
                <button onClick={bulkConfirm}
                  style={{ padding:'7px 14px', borderRadius:'8px', background:'#16A34A',
                    color:'white', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                  Confirm All
                </button>
                <button onClick={bulkExport}
                  style={{ padding:'7px 14px', borderRadius:'8px', background:'#2563EB',
                    color:'white', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                  Export CSV
                </button>
                <button onClick={bulkDelete}
                  style={{ padding:'7px 14px', borderRadius:'8px', background:'#EF4444',
                    color:'white', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                  Delete All
                </button>
                <button onClick={clearSelection}
                  style={{ padding:'7px 14px', borderRadius:'8px', background:'rgba(255,255,255,.15)',
                    color:'white', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                  Clear
                </button>
              </div>
            )}

            {/* Select all toggle */}
            {orders.length > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                <input type="checkbox"
                  checked={selected.length === orders.length && orders.length > 0}
                  onChange={e => e.target.checked ? selectAll() : clearSelection()}
                  style={{ width:'15px', height:'15px', cursor:'pointer' }} />
                <span style={{ fontSize:'12px', fontWeight:600, color:'#8E8E93' }}>
                  Select all {orders.length} orders
                </span>
                <button onClick={() => { exportOrdersCSV(orders); }}
                  style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px',
                    padding:'6px 12px', borderRadius:'8px', background:'white',
                    border:'1px solid #E2E8F0', fontSize:'12px', fontWeight:700,
                    color:'#555', cursor:'pointer' }}>
                  <Download size={13} /> Export CSV
                </button>
              </div>
            )}

            {/* Order list */}
            {loading ? (
              <div>
                {[...Array(3)].map((_,i) => <OrderSkeleton key={i} />)}
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No orders here"
                desc="No orders found for the selected filter. Try changing the date range or status tab."
              />
            ) : (
              <>
                {/* This month summary */}
                <div style={{ background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
                  borderRadius:'16px', padding:'14px 18px', marginBottom:'16px',
                  display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ color:'rgba(255,255,255,.6)', fontSize:'12px', fontWeight:700 }}>
                      {thisMonth}
                    </p>
                    <p style={{ color:'white', fontSize:'20px', fontWeight:900 }}>
                      {thisMonthCount} order{thisMonthCount !== 1 ? 's' : ''} this month
                    </p>
                  </div>
                  <BarChart2 size={28} color="rgba(255,255,255,.3)" />
                </div>

                {/* Month-wise grouped orders */}
                {groupByMonth(orders).map(group => (
                  <div key={group.label} style={{ marginBottom:'8px' }}>
                    {/* Month header */}
                    <div style={{ display:'flex', alignItems:'center',
                      justifyContent:'space-between', padding:'10px 4px',
                      marginBottom:'8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ width:'4px', height:'20px', borderRadius:'99px',
                          background:'var(--primary)' }} />
                        <p style={{ fontSize:'15px', fontWeight:900, color:'var(--text)' }}>
                          {group.label}
                        </p>
                        <span style={{ background:'var(--primary)', color:'white',
                          fontSize:'11px', fontWeight:800, borderRadius:'99px',
                          padding:'2px 9px' }}>
                          {group.orders.length}
                        </span>
                      </div>
                      <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text-2)' }}>
                        ₹{group.total.toFixed(0)} total
                      </p>
                    </div>

                    {/* Orders in this month */}
                    {group.orders.map(o => (
                      <div key={o.id} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                        <input type="checkbox"
                          checked={selected.includes(o.id)}
                          onChange={() => toggleSelect(o.id)}
                          style={{ width:'16px', height:'16px', marginTop:'18px',
                            cursor:'pointer', flexShrink:0, accentColor:'#1A1A2E' }} />
                        <div style={{ flex:1 }}>
                          <OrderCard order={o}
                            onConfirm={handleConfirm}
                            onReject={handleReject}
                            onStatus={handleStatus}
                            onDelete={handleDeleteOrder}
                            confirming={confirming === o.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </>
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
              <button onClick={() => exportProductsCSV(products)}
                style={{ display:'flex', alignItems:'center', gap:'6px',
                  padding:'10px 14px', borderRadius:'12px', background:'white',
                  border:'1px solid #E2E8F0', color:'#555', fontSize:'13px',
                  fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                <Download size={15} /> Export
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
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'12px' }}>
                {[...Array(6)].map((_,i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products found"
                desc={search ? `No products match "${search}"` : "Add your first product to get started"}
                action="Add Product"
                onAction={() => setModal('add')}
              />
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
