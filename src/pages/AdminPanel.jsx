import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart2,
  LogOut, Search, Bell, RefreshCw, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, MessageCircle, Phone, Truck,
  Plus, Edit2, Trash2, Eye, X, Save, Upload,
  AlertTriangle, AlertCircle, Download, Printer,
  Menu, Settings, TrendingUp, ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';
import {
  ToastContainer, ConfirmDialog, CommandPalette,
  OrderSkeleton, ProductSkeleton, EmptyState,
  exportOrdersCSV, exportProductsCSV,
  toast, confirm,
} from '../components/admin/AdminUtils';

const ADMIN_EMAIL = 'as.businezzz@gmail.com';

const NAV = [
  { key:'dashboard', label:'Dashboard', icon:LayoutDashboard },
  { key:'orders',    label:'Orders',    icon:ShoppingBag },
  { key:'products',  label:'Products',  icon:Package },
];

const ORDER_STATUS = [
  { key:'all_pending',       label:'All New',   color:'#F59E0B' },
  { key:'payment_submitted', label:'Verify',    color:'#3B82F6' },
  { key:'confirmed',         label:'Confirmed', color:'#16A34A' },
  { key:'preparing',         label:'Preparing', color:'#8B5CF6' },
  { key:'shipped',           label:'Shipped',   color:'#0369A1' },
  { key:'delivered',         label:'Delivered', color:'#6B7280' },
  { key:'payment_rejected',  label:'Rejected',  color:'#EF4444' },
];

/* ── Print Label ──────────────────────────────────────────── */
function printShippingLabel(order) {
  const addr = order.shipping_address || {};
  const html = `<!DOCTYPE html><html><head><title>Label #${order.id.slice(0,8).toUpperCase()}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:20px}
  .wrap{max-width:580px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:12px;margin-bottom:14px}
  .brand{font-size:22px;font-weight:900}.oid{font-family:monospace;font-size:16px;font-weight:900;border:2px solid #000;padding:5px 10px}
  .box{border:2px solid #000;border-radius:6px;padding:14px;margin-bottom:12px}
  .lbl{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:7px}
  .name{font-size:20px;font-weight:900;margin-bottom:4px}.ph{font-size:15px;font-weight:700;margin-bottom:8px}
  .addr{font-size:14px;line-height:1.65;color:#333}.pin{font-size:22px;font-weight:900;margin-top:8px;letter-spacing:2px}
  .from{background:#f8f8f8;border:1.5px solid #ccc}.fn{font-size:16px;font-weight:800;margin-bottom:5px}
  .fd{font-size:13px;color:#333;line-height:1.75}table{width:100%;border-collapse:collapse;font-size:13px}
  th{background:#000;color:white;padding:6px 10px;text-align:left;font-size:11px;text-transform:uppercase}
  td{padding:7px 10px;border-bottom:1px solid #eee}.tot td{font-weight:900;background:#f8f8f8}
  .badge{display:inline-block;background:#000;color:white;font-size:11px;font-weight:900;padding:4px 12px;border-radius:4px;margin-top:8px}
  .foot{border-top:2px dashed #999;padding-top:12px;margin-top:12px;display:flex;justify-content:space-between;font-size:11px}
  .care{border:1.5px solid #000;padding:4px 10px;border-radius:4px;font-weight:700}
  @media print{.np{display:none!important}}</style></head><body>
  <div class="wrap">
  <div class="np" style="text-align:right;margin-bottom:14px"><button onclick="window.print()" style="padding:10px 24px;background:#000;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">🖨 Print Label</button></div>
  <div class="header"><div><div class="brand">AS HUB</div><div style="font-size:11px;color:#666;margin-top:2px">Ph: 7013942909 | as.businezzz@gmail.com</div></div>
  <div class="oid">#${order.id.slice(0,8).toUpperCase()}<div style="font-size:11px;color:#666;font-weight:400;text-align:right;margin-top:3px">${new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div></div></div>
  <div class="box"><div class="lbl">📦 Deliver To</div><div class="name">${addr.fullName||'N/A'}</div>
  <div class="ph">📞 +91 ${addr.phone||'N/A'}</div>
  <div class="addr">${addr.houseNo||''}, ${addr.streetArea||''}<br>Near ${addr.landmark||'N/A'}<br>${addr.city||''}, ${addr.state||''}</div>
  <div class="pin">PIN: ${addr.pincode||'N/A'}</div>${addr.email?`<div style="font-size:12px;color:#555;margin-top:6px">✉ ${addr.email}</div>`:''}</div>
  <div class="box from"><div class="lbl">From</div><div class="fn">Shaik Asmath (AS HUB)</div>
  <div class="fd">D.No. 25-2-1709,<br>Pragathi Nagar, Podalkur Road,<br>Nellore, Andhra Pradesh - 524004<br>Ph: 7013942909</div></div>
  <div class="box"><div class="lbl">Items</div><table><thead><tr><th>Product</th><th style="text-align:right">Qty</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>${(order.items||[]).map(i=>`<tr><td>${i.name}</td><td style="text-align:right">${i.quantity}</td><td style="text-align:right">₹${(i.price*i.quantity).toFixed(0)}</td></tr>`).join('')}
  <tr class="tot"><td colspan="2">Total</td><td style="text-align:right">₹${order.total_amount?.toFixed(0)}</td></tr></tbody></table>
  <div class="badge">✓ Paid via UPI</div></div>
  <div class="foot"><span>Order: ${order.id.slice(0,8).toUpperCase()} | ${new Date(order.created_at).toLocaleDateString('en-IN')} | ${order.status?.toUpperCase()}</span><span class="care">HANDLE WITH CARE</span></div>
  </div></body></html>`;
  const w = window.open('','_blank','width=700,height=900');
  w.document.write(html); w.document.close(); w.focus();
}

/* ── Product Modal ────────────────────────────────────────── */
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name: product?.name||'', description: product?.description||'',
    price: product?.price||'', original_price: product?.original_price||'',
    category: product?.category||'tailoring', sub_category: product?.sub_category||'',
    unit: product?.unit||'', stock: product?.stock||'',
    image_url: product?.image_url||'', images: product?.images||[],
    video_links: product?.video_links||[], active: product?.active??true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newVT, setNewVT] = useState(''); const [newVU, setNewVU] = useState('');

  async function upload(file) {
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert:true });
    if (error) throw error;
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }
  async function handleMainImg(e) {
    const f = e.target.files[0]; if (!f) return; setUploading(true);
    try { const url = await upload(f); setForm(p=>({...p,image_url:url})); } catch(e){alert('Upload failed')} finally{setUploading(false);}
  }
  async function handleMoreImgs(e) {
    const files = Array.from(e.target.files); if (!files.length) return; setUploading(true);
    try { const urls=await Promise.all(files.map(upload)); setForm(p=>({...p,images:[...(p.images||[]),...urls]})); } catch(e){alert('Upload failed')} finally{setUploading(false);}
  }
  async function handleSubmit(e) {
    e.preventDefault(); if (!form.name||!form.price){alert('Name and price required');return;}
    setSaving(true);
    try {
      const payload={...form,price:parseFloat(form.price)||0,original_price:form.original_price?parseFloat(form.original_price):null,stock:form.stock?parseInt(form.stock):null};
      if (isEdit) { const {error}=await supabase.from('products').update(payload).eq('id',product.id); if(error)throw error; toast('Product updated!','success'); }
      else { const {error}=await supabase.from('products').insert([payload]); if(error)throw error; toast('Product added!','success'); }
      onSave();
    } catch(err){toast('Error: '+err.message,'error');} finally{setSaving(false);}
  }

  const S = {width:'100%',padding:'9px 12px',borderRadius:'10px',border:'1.5px solid #E2E8F0',fontSize:'13px',fontFamily:'inherit',outline:'none',boxSizing:'border-box'};

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center',backdropFilter:'blur(4px)'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:30,stiffness:300}}
        style={{background:'white',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto',padding:'20px 20px 40px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <h2 style={{fontSize:'16px',fontWeight:800,color:'#0A0A0A'}}>{isEdit?'Edit Product':'Add Product'}</h2>
          <button onClick={onClose} style={{background:'#F4F4F8',border:'none',cursor:'pointer',borderRadius:'8px',padding:'6px',display:'flex'}}><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {/* Image upload */}
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            {form.image_url && <img src={form.image_url} alt="img" style={{width:'56px',height:'56px',borderRadius:'10px',objectFit:'cover',border:'1px solid #E2E8F0',flexShrink:0}}/>}
            <label style={{flex:1,padding:'10px',borderRadius:'10px',border:'2px dashed #E2E8F0',textAlign:'center',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#8E8E93'}}>
              {uploading?'Uploading...':'📸 Main Image'}<input type="file" accept="image/*" style={{display:'none'}} onChange={handleMainImg} disabled={uploading}/>
            </label>
          </div>
          <div><input placeholder="Product Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required style={S}/></div>
          <textarea placeholder="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2} style={{...S,resize:'vertical'}}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <input type="number" placeholder="Price ₹ *" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} required style={S}/>
            <input type="number" placeholder="Original ₹" value={form.original_price} onChange={e=>setForm(p=>({...p,original_price:e.target.value}))} style={S}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value,sub_category:''}))} style={S}>
              <option value="tailoring">🪡 Tailoring</option>
              <option value="fashion">👗 Fashion</option>
            </select>
            <select value={form.sub_category} onChange={e=>setForm(p=>({...p,sub_category:e.target.value}))} style={S}>
              <option value="">Sub category</option>
              {(form.category==='tailoring'?['machines','scissors','threads','needles','measuring','other']:['dresses','tops','bottoms','ethnic','accessories','other']).map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <input placeholder="Unit (e.g. 1 piece)" value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} style={S}/>
            <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))} style={S}/>
          </div>
          {/* Video links */}
          <div>
            <p style={{fontSize:'11px',fontWeight:700,color:'#8E8E93',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'}}>Video Links</p>
            {form.video_links?.map((v,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 10px',background:'#F0FDF4',borderRadius:'8px',marginBottom:'6px'}}>
                <span style={{fontSize:'12px',fontWeight:600,color:'#16A34A',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.title}</span>
                <button type="button" onClick={()=>setForm(p=>({...p,video_links:p.video_links.filter((_,j)=>j!==i)}))} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',display:'flex'}}><X size={12}/></button>
              </div>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:'6px',padding:'10px',background:'#F8FAFC',borderRadius:'10px',border:'1px dashed #E2E8F0'}}>
              <input value={newVT} onChange={e=>setNewVT(e.target.value)} placeholder="Video title" style={S}/>
              <div style={{display:'flex',gap:'6px'}}>
                <input value={newVU} onChange={e=>setNewVU(e.target.value)} placeholder="YouTube URL" style={{...S,flex:1}}/>
                <button type="button" onClick={()=>{if(!newVU)return;setForm(p=>({...p,video_links:[...(p.video_links||[]),{title:newVT||'Tutorial',url:newVU}]}));setNewVT('');setNewVU('');}}
                  style={{padding:'9px 14px',borderRadius:'8px',background:'#16A34A',color:'white',fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>+Add</button>
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 12px',background:'#F8FAFC',borderRadius:'10px'}}>
            <input type="checkbox" id="active" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} style={{width:'16px',height:'16px',cursor:'pointer'}}/>
            <label htmlFor="active" style={{fontSize:'13px',fontWeight:600,color:'#333',cursor:'pointer'}}>Visible to customers</label>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button type="submit" disabled={saving} style={{flex:1,padding:'12px',borderRadius:'12px',background:saving?'#E2E8F0':'linear-gradient(135deg,#1A1A2E,#0F3460)',color:saving?'#94A3B8':'white',fontWeight:800,fontSize:'14px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              <Save size={15}/>{saving?'Saving...':isEdit?'Update':'Add Product'}
            </button>
            <button type="button" onClick={onClose} style={{padding:'12px 18px',borderRadius:'12px',background:'#F4F4F8',color:'#555',fontWeight:700,fontSize:'14px',border:'none',cursor:'pointer'}}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ── Order Card ───────────────────────────────────────────── */
function OrderCard({ order, onConfirm, onReject, onStatus, onDelete, confirming, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [rejectBox, setRejectBox] = useState(false);
  const [reason, setReason] = useState('');
  const addr = order.shipping_address || {};
  const isPending = order.payment_status === 'submitted';

  const STATUS_COLOR = { pending_payment:'#F59E0B', payment_submitted:'#3B82F6', confirmed:'#16A34A', preparing:'#8B5CF6', shipped:'#0369A1', delivered:'#6B7280', payment_rejected:'#EF4444' };
  const statusColor = STATUS_COLOR[order.status] || '#8E8E93';

  function waMsg(msg) { window.open(`https://wa.me/91${addr.phone}?text=${encodeURIComponent(msg)}`, '_blank'); }

  return (
    <div style={{ background:'white', borderRadius:'14px', border:'1px solid #F0F0F0', boxShadow:'0 1px 6px rgba(0,0,0,.05)', marginBottom:'10px', overflow:'hidden', transition:'box-shadow .2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 6px rgba(0,0,0,.05)'}>

      {/* Card header row */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px' }}>
        <input type="checkbox" checked={selected} onChange={onSelect}
          style={{ width:'15px', height:'15px', cursor:'pointer', accentColor:'#1A1A2E', flexShrink:0 }} />

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
            <span style={{ fontSize:'13px', fontWeight:800, color:'#0A0A0A', fontFamily:'monospace' }}>
              #{order.id.slice(0,8).toUpperCase()}
            </span>
            <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'99px',
              background:`${statusColor}18`, color:statusColor }}>
              {order.status?.replace(/_/g,' ').toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize:'12px', color:'#555', fontWeight:600 }}>
            {addr.fullName} · +91 {addr.phone}
          </p>
          <p style={{ fontSize:'11px', color:'#8E8E93', marginTop:'1px' }}>
            {order.items?.map(i=>`${i.name} ×${i.quantity}`).join(', ')}
          </p>
        </div>

        <div style={{ textAlign:'right', flexShrink:0 }}>
          <p style={{ fontSize:'16px', fontWeight:900, color:'#0A0A0A' }}>₹{order.total_amount?.toFixed(0)}</p>
          <p style={{ fontSize:'10px', color:'#8E8E93', marginTop:'2px' }}>
            {new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
          </p>
        </div>

        <button onClick={() => setOpen(!open)}
          style={{ width:'28px', height:'28px', borderRadius:'8px', background:'#F4F4F8',
            border:'none', cursor:'pointer', display:'flex', alignItems:'center',
            justifyContent:'center', flexShrink:0, transition:'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background='#E8E8EE'}
          onMouseLeave={e => e.currentTarget.style.background='#F4F4F8'}>
          <ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'none', transition:'transform .2s' }} />
        </button>
      </div>

      {/* Expanded details */}
      {open && (
        <div style={{ borderTop:'1px solid #F8F8F8', padding:'12px 14px',
          display:'flex', flexDirection:'column', gap:'10px' }}>

          {/* Order timeline */}
          <div style={{ background:'#F8FAFC', borderRadius:'10px', padding:'10px 12px' }}>
            <p style={{ fontSize:'10px', fontWeight:700, color:'#8E8E93', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'10px' }}>Order Timeline</p>
            {(() => {
              const STAGES = [
                { key:'pending_payment',   label:'Order Placed',      color:'#8E8E93' },
                { key:'payment_submitted', label:'Payment Submitted',  color:'#3B82F6' },
                { key:'confirmed',         label:'Payment Verified',   color:'#16A34A' },
                { key:'preparing',         label:'Preparing Order',    color:'#8B5CF6' },
                { key:'shipped',           label:'Shipped',            color:'#0369A1' },
                { key:'delivered',         label:'Delivered',          color:'#059669' },
              ];
              const currentIdx = STAGES.findIndex(s => s.key === order.status);
              return STAGES.map((stage, i) => {
                const done   = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={stage.key} style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom: i<STAGES.length-1?'8px':'0' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:'18px', height:'18px', borderRadius:'50%', flexShrink:0,
                        background: done ? stage.color : '#E2E8F0',
                        border: active ? `3px solid ${stage.color}` : 'none',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {done && !active && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'white' }}/>}
                      </div>
                      {i < STAGES.length-1 && <div style={{ width:'2px', height:'16px', background: i<currentIdx?stage.color:'#E2E8F0', marginTop:'2px' }}/>}
                    </div>
                    <div style={{ paddingTop:'1px' }}>
                      <p style={{ fontSize:'12px', fontWeight: active?800:600, color: done?'#0A0A0A':'#C0C0C0', lineHeight:1 }}>{stage.label}</p>
                      {active && <p style={{ fontSize:'10px', color:stage.color, marginTop:'2px', fontWeight:700 }}>Current Status</p>}
                      {done && !active && order.verified_at && stage.key==='confirmed' && (
                        <p style={{ fontSize:'10px', color:'#8E8E93', marginTop:'1px' }}>{new Date(order.verified_at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Address */}
          <div style={{ background:'#F8FAFC', borderRadius:'10px', padding:'10px 12px' }}>
            <p style={{ fontSize:'10px', fontWeight:700, color:'#8E8E93', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'6px' }}>Delivery Address</p>
            <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A' }}>{addr.fullName}</p>
            <p style={{ fontSize:'12px', color:'#555', lineHeight:1.65, marginTop:'3px' }}>
              {addr.houseNo}, {addr.streetArea}<br/>Near {addr.landmark}<br/>
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
          </div>

          {/* Items */}
          <div style={{ background:'#F8FAFC', borderRadius:'10px', padding:'10px 12px' }}>
            <p style={{ fontSize:'10px', fontWeight:700, color:'#8E8E93', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'6px' }}>Items</p>
            {order.items?.map((item,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
                <span style={{ color:'#555' }}>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight:700 }}>₹{(item.price*item.quantity).toFixed(0)}</span>
              </div>
            ))}
            {order.utr && <p style={{ fontSize:'11px', color:'#16A34A', fontWeight:700, marginTop:'6px' }}>UTR: {order.utr}</p>}
            {order.screenshot_url && (
              <a href={order.screenshot_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:'11px', color:'#3B82F6', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'4px', marginTop:'4px', textDecoration:'none' }}>
                <Eye size={11}/> View Screenshot
              </a>
            )}
          </div>

          {/* Confirm / Reject */}
          {isPending && !rejectBox && (
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => onConfirm(order)} disabled={confirming}
                style={{ flex:1, padding:'10px', borderRadius:'10px', background:confirming?'#E2E8F0':'#16A34A', color:confirming?'#94A3B8':'white', fontWeight:800, fontSize:'13px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                <CheckCircle size={14}/>{confirming?'...':'Confirm Payment'}
              </button>
              <button onClick={() => setRejectBox(true)}
                style={{ flex:1, padding:'10px', borderRadius:'10px', background:'#FEF2F2', color:'#EF4444', fontWeight:800, fontSize:'13px', border:'1px solid #FECACA', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                <XCircle size={14}/>Reject
              </button>
            </div>
          )}

          {rejectBox && (
            <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
              <input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Rejection reason..."
                style={{ width:'100%', padding:'9px 12px', borderRadius:'10px', border:'1.5px solid #FECACA', fontSize:'12px', fontFamily:'inherit', outline:'none', background:'#FEF2F2' }} />
              <div style={{ display:'flex', gap:'7px' }}>
                <button onClick={() => { onReject(order, reason); setRejectBox(false); }}
                  style={{ flex:1, padding:'10px', borderRadius:'10px', background:'#EF4444', color:'white', fontWeight:800, fontSize:'13px', border:'none', cursor:'pointer' }}>
                  Confirm Reject
                </button>
                <button onClick={() => { setRejectBox(false); setReason(''); }}
                  style={{ flex:1, padding:'10px', borderRadius:'10px', background:'#F4F4F8', color:'#555', fontWeight:700, fontSize:'13px', border:'none', cursor:'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status changer */}
          {['confirmed','preparing','shipped'].includes(order.status) && (
            <select value={order.status} onChange={e => onStatus(order.id, e.target.value)}
              style={{ width:'100%', padding:'9px 12px', borderRadius:'10px', border:'1.5px solid #E2E8F0', fontSize:'12px', fontFamily:'inherit', background:'white', fontWeight:700 }}>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          )}

          {/* Actions row */}
          <div style={{ display:'flex', gap:'7px' }}>
            <button onClick={() => waMsg(`Hello ${addr.fullName}, your order #${order.id.slice(0,8).toUpperCase()} status: ${order.status}. Thank you for shopping with AS HUB!`)}
              style={{ flex:1, padding:'8px', borderRadius:'10px', background:'#F0FDF4', color:'#16A34A', fontWeight:700, fontSize:'12px', border:'1px solid #BBF7D0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
              <MessageCircle size={13}/> WhatsApp
            </button>
            <a href={`tel:+91${addr.phone}`}
              style={{ flex:1, padding:'8px', borderRadius:'10px', background:'#EFF6FF', color:'#2563EB', fontWeight:700, fontSize:'12px', border:'1px solid #BFDBFE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', textDecoration:'none' }}>
              <Phone size={13}/> Call
            </a>
            <button onClick={() => printShippingLabel(order)}
              style={{ padding:'8px 12px', borderRadius:'10px', background:'#1A1A2E', color:'white', fontWeight:700, fontSize:'12px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
              <Printer size={13}/> Print
            </button>
            <button onClick={() => onDelete(order.id)}
              style={{ padding:'8px 12px', borderRadius:'10px', background:'#FEF2F2', color:'#EF4444', fontWeight:700, fontSize:'12px', border:'1px solid #FECACA', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Trash2 size={13}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Quick Actions FAB ────────────────────────────────────── */
function QuickActions({ onAddProduct, onExportOrders, onRefresh }) {
  const [open, setOpen] = useState(false);
  const ACTIONS = [
    { label:'Add Product',   icon:Plus,       action:onAddProduct,   color:'#1A1A2E' },
    { label:'Export Orders', icon:Download,   action:onExportOrders, color:'#2563EB' },
    { label:'Refresh',       icon:RefreshCw,  action:onRefresh,      color:'#16A34A' },
  ];
  return (
    <div style={{ position:'fixed', bottom:'24px', right:'20px', zIndex:500, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
      <AnimatePresence>
        {open && ACTIONS.map((a, i) => (
          <motion.button key={a.label}
            initial={{ opacity:0, y:10, scale:.8 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:10, scale:.8 }}
            transition={{ delay: i*.05, duration:.2 }}
            onClick={() => { a.action(); setOpen(false); }}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', borderRadius:'12px',
              background:'white', border:'1px solid #E2E8F0', cursor:'pointer',
              boxShadow:'0 4px 16px rgba(0,0,0,.12)', fontSize:'12px', fontWeight:700, color:'#0A0A0A' }}>
            <a.icon size={14} color={a.color} />
            {a.label}
          </motion.button>
        ))}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale:1.08 }} whileTap={{ scale:.95 }}
        onClick={() => setOpen(o => !o)}
        style={{ width:'44px', height:'44px', borderRadius:'50%',
          background:'linear-gradient(135deg,#1A1A2E,#0F3460)', color:'white',
          border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(26,26,46,.4)' }}>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration:.2 }}>
          <Plus size={20} />
        </motion.div>
      </motion.button>
    </div>
  );
}

/* ── Main Admin Panel ─────────────────────────────────────── */
export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  /* ── state ── */
  const [page,       setPage]       = useState('orders');   // orders | products
  const [orderTab,   setOrderTab]   = useState('all_pending');
  const [orders,     setOrders]     = useState([]);
  const [allOrders,  setAllOrders]  = useState([]);
  const [products,   setProducts]   = useState([]);
  const [counts,     setCounts]     = useState({});
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [modal,      setModal]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [cmdOpen,    setCmdOpen]    = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [selected,   setSelected]   = useState([]);
  const [sideOpen,   setSideOpen]   = useState(() => {
    try { return localStorage.getItem('admin_sidebar') !== 'false'; } catch { return true; }
  });
  const [notifRead, setNotifRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_notif_read') || '[]'); } catch { return []; }
  });

  /* ── guards ── */
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return; }
  }, [user]);

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); setCmdOpen(o=>!o); }
      if (e.key==='Escape') { setCmdOpen(false); setNotifOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── sidebar persist ── */
  useEffect(() => {
    localStorage.setItem('admin_sidebar', sideOpen);
  }, [sideOpen]);

  /* ── data fetching ── */
  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    if (page === 'orders' || page === 'dashboard') { fetchOrders(); fetchCounts(); }
    if (page === 'products' || page === 'dashboard' || page === 'more') fetchProducts();
  }, [page, orderTab, dateFilter]);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    supabase.from('orders').select('*').then(({ data }) => { if (data) setAllOrders(data); });
  }, []);

  /* ── realtime ── */
  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    const ch = supabase.channel('admin-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'orders' }, () => { fetchOrders(); fetchCounts(); })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [orderTab, dateFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let q = supabase.from('orders').select('*').order('created_at',{ascending:false});
      if (orderTab==='all_pending') q = q.in('status',['pending_payment','payment_submitted']);
      else if (orderTab==='payment_submitted') q = q.eq('payment_status','submitted');
      else if (orderTab==='payment_rejected') q = q.eq('payment_status','rejected');
      else q = q.eq('status', orderTab);
      const { data, error } = await q; if (error) throw error;
      let filtered = data || [];
      if (dateFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(o => {
          const d = new Date(o.created_at);
          if (dateFilter==='today') return d.toDateString()===now.toDateString();
          if (dateFilter==='week') return d >= new Date(now-7*86400000);
          if (dateFilter==='month') return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
          return true;
        });
      }
      setOrders(filtered);
    } catch(err) { toast('Failed to load orders','error'); }
    finally { setLoading(false); }
  }

  async function fetchCounts() {
    const { data } = await supabase.from('orders').select('status,payment_status');
    if (!data) return;
    const c = {};
    data.forEach(o => {
      if (['pending_payment','payment_submitted'].includes(o.status)) c.all_pending=(c.all_pending||0)+1;
      if (o.payment_status==='submitted') c.payment_submitted=(c.payment_submitted||0)+1;
      else if (o.payment_status==='rejected') c.payment_rejected=(c.payment_rejected||0)+1;
      else c[o.status]=(c[o.status]||0)+1;
    });
    setCounts(c);
  }

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false});
    if (!error) setProducts(data||[]);
    setLoading(false);
  }

  async function handleConfirm(order) {
    setConfirming(order.id);
    try {
      await supabase.from('orders').update({ payment_status:'verified', status:'confirmed', verified_by:user.email, verified_at:new Date().toISOString() }).eq('id',order.id);
      const a = order.shipping_address||{};
      window.open(`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Payment Verified — AS HUB\n\nDear ${a.fullName},\n\nYour payment of ₹${order.total_amount?.toFixed(0)} for Order #${order.id.slice(0,8).toUpperCase()} has been verified!\n\nThank you for shopping with AS HUB!`)}`, '_blank');
      toast('Payment confirmed!','success');
      fetchOrders(); fetchCounts();
    } catch(err) { toast('Error: '+err.message,'error'); }
    finally { setConfirming(null); }
  }

  async function handleReject(order, reason) {
    try {
      await supabase.from('orders').update({ payment_status:'rejected', status:'payment_rejected', rejection_reason:reason||'Payment not verified' }).eq('id',order.id);
      const a = order.shipping_address||{};
      window.open(`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Payment Failed — AS HUB\n\nDear ${a.fullName},\n\nWe could not verify your payment for Order #${order.id.slice(0,8).toUpperCase()}.\n\nReason: ${reason||'Payment not received'}\n\nPlease contact us or retry.`)}`, '_blank');
      toast('Order rejected','warning');
      fetchOrders(); fetchCounts();
    } catch(err) { toast('Error: '+err.message,'error'); }
  }

  async function handleStatus(id, status) {
    try {
      await supabase.from('orders').update({ status }).eq('id',id);
      toast(`Status → ${status}`,'success');
      fetchOrders(); fetchCounts();
    } catch(err) { toast('Error: '+err.message,'error'); }
  }

  async function handleDeleteOrder(id) {
    const ok = await confirm({ title:'Delete Order', message:'This order will be permanently deleted.', confirm:'Delete', type:'danger' });
    if (!ok) return;
    await supabase.from('orders').delete().eq('id',id);
    toast('Order deleted','success'); fetchOrders(); fetchCounts();
  }

  async function handleDeleteProduct(id) {
    const ok = await confirm({ title:'Delete Product', message:'Product will be permanently removed.', confirm:'Delete', type:'danger' });
    if (!ok) return;
    await supabase.from('products').delete().eq('id',id);
    toast('Product deleted','success'); fetchProducts();
  }

  async function handleToggleActive(product) {
    await supabase.from('products').update({ active:!product.active }).eq('id',product.id);
    toast(product.active?'Product hidden':'Product visible','success'); fetchProducts();
  }

  async function handleLogout() {
    const ok = await confirm({ title:'Sign Out', message:'Are you sure you want to sign out?', confirm:'Sign Out' });
    if (!ok) return;
    supabase.auth.signOut(); setUser(null); navigate('/');
  }

  /* ── notifications ── */
  const notifications = [
    ...orders.filter(o=>o.payment_status==='submitted').slice(0,3).map(o=>({ id:`p_${o.id}`, color:'#3B82F6', title:'Payment Submitted', body:`#${o.id.slice(0,8).toUpperCase()} — ₹${o.total_amount?.toFixed(0)}` })),
    ...products.filter(p=>p.stock===0).slice(0,2).map(p=>({ id:`oos_${p.id}`, color:'#EF4444', title:'Out of Stock', body:p.name })),
    ...products.filter(p=>p.stock>0&&p.stock<=5).slice(0,2).map(p=>({ id:`ls_${p.id}`, color:'#F59E0B', title:'Low Stock', body:`${p.name} — ${p.stock} left` })),
  ];
  const unread = notifications.filter(n=>!notifRead.includes(n.id)).length;

  /* ── bulk ── */
  const toggleSelect = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const selectAll = () => setSelected(orders.map(o=>o.id));
  const clearSel = () => setSelected([]);
  async function bulkConfirm() {
    const ok = await confirm({ title:`Confirm ${selected.length} orders?`, message:'Will mark all as verified.', confirm:'Confirm All' });
    if (!ok) return;
    for (const id of selected) {
      const o = orders.find(x=>x.id===id);
      if (o) await supabase.from('orders').update({ payment_status:'verified', status:'confirmed', verified_by:user.email, verified_at:new Date().toISOString() }).eq('id',id);
    }
    clearSel(); fetchOrders(); fetchCounts(); toast(`${selected.length} orders confirmed`,'success');
  }
  async function bulkDelete() {
    const ok = await confirm({ title:`Delete ${selected.length} orders?`, message:'Cannot be undone.', confirm:'Delete All', type:'danger' });
    if (!ok) return;
    for (const id of selected) await supabase.from('orders').delete().eq('id',id);
    clearSel(); fetchOrders(); fetchCounts(); toast(`${selected.length} orders deleted`,'success');
  }

  function bulkPrint() {
    const toPrint = selected.length > 0
      ? orders.filter(o => selected.includes(o.id))
      : [];
    if (toPrint.length === 0) { toast('Select orders to print', 'warning'); return; }

    const pages = toPrint.map((order, idx) => {
      const a = order.shipping_address || {};
      const items = (order.items||[]).map(i =>
        `<tr><td>${i.name}</td><td align="right">${i.quantity}</td><td align="right">₹${(i.price*i.quantity).toFixed(0)}</td></tr>`
      ).join('');
      return `
        ${idx > 0 ? '<div class="pb"></div>' : ''}
        <div class="wrap">
          <div class="hdr">
            <div><div class="brand">AS HUB</div><div class="contact">Ph: 7013942909 | as.businezzz@gmail.com</div></div>
            <div class="oid">#${order.id.slice(0,8).toUpperCase()}<br/><span style="font-size:9px;font-weight:400">${new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
          </div>
          <div class="box"><div class="lbl">Deliver To</div>
            <div class="nm">${a.fullName||'N/A'}</div>
            <div class="ph">+91 ${a.phone||'N/A'}</div>
            <div class="ad">${a.houseNo||''}, ${a.streetArea||''}<br/>Near ${a.landmark||''}<br/>${a.city||''}, ${a.state||''}</div>
            <div class="pin">PIN: ${a.pincode||''}</div></div>
          <div class="box from"><div class="lbl">From</div>
            <div class="fn">Shaik Asmath (AS HUB)</div>
            <div class="fd">D.No. 25-2-1709, Pragathi Nagar, Podalkur Road,<br/>Nellore, Andhra Pradesh - 524004 | Ph: 7013942909</div></div>
          <div class="box"><div class="lbl">Items</div>
            <table><thead><tr><th>Product</th><th>Qty</th><th>Amount</th></tr></thead>
            <tbody>${items}<tr class="tot"><td colspan="2">Total</td><td>₹${order.total_amount?.toFixed(0)}</td></tr></tbody></table>
            <span class="badge">✓ Paid via UPI</span></div>
          <div class="ft"><span>#${order.id.slice(0,8).toUpperCase()} | ${new Date(order.created_at).toLocaleDateString('en-IN')} | ${(order.status||'').toUpperCase()}</span><span class="care">HANDLE WITH CARE</span></div>
        </div>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><title>${toPrint.length} Shipping Label${toPrint.length>1?'s':''}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif}
    .np{text-align:center;padding:14px;background:#f4f4f8;margin-bottom:12px}
    .wrap{max-width:580px;margin:0 auto;padding:18px}
    .pb{page-break-after:always;height:24px}
    .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:10px;margin-bottom:12px}
    .brand{font-size:20px;font-weight:900}.contact{font-size:10px;color:#666;margin-top:2px}
    .oid{font-family:monospace;font-size:13px;font-weight:900;border:2px solid #000;padding:4px 8px;text-align:right}
    .box{border:2px solid #000;border-radius:5px;padding:11px;margin-bottom:9px}
    .from{background:#f8f8f8;border:1.5px solid #ccc}
    .lbl{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:5px}
    .nm{font-size:18px;font-weight:900;margin-bottom:2px}.ph{font-size:13px;font-weight:700;margin-bottom:5px}
    .ad{font-size:12px;line-height:1.6;color:#333}.pin{font-size:18px;font-weight:900;margin-top:6px;letter-spacing:2px}
    .fn{font-size:14px;font-weight:800;margin-bottom:3px}.fd{font-size:11px;color:#333;line-height:1.7}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#000;color:#fff;padding:5px 8px;font-size:9px;text-transform:uppercase;text-align:left}
    td{padding:5px 8px;border-bottom:1px solid #eee}.tot td{font-weight:900;background:#f8f8f8}
    .badge{display:inline-block;background:#000;color:#fff;font-size:9px;font-weight:900;padding:3px 9px;border-radius:3px;margin-top:6px}
    .ft{border-top:2px dashed #999;padding-top:9px;margin-top:9px;display:flex;justify-content:space-between;font-size:9px}
    .care{border:1px solid #000;padding:2px 7px;border-radius:3px;font-weight:700}
    @media print{.np{display:none!important}}</style></head>
    <body>
    <div class="np"><strong>📦 ${toPrint.length} Shipping Label${toPrint.length>1?'s':''}</strong>
    <button onclick="window.print()" style="margin-left:12px;padding:9px 22px;background:#1A1A2E;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">🖨 Print All</button></div>
    ${pages}</body></html>`;

    const w = window.open('','_blank','width=760,height=900');
    w.document.write(html); w.document.close(); w.focus();
    toast(`${toPrint.length} label${toPrint.length>1?'s':''} ready to print`, 'success');
  }

  /* ── derived ── */
  const filteredProducts = products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter==='all' || p.category===catFilter;
    return ms && mc;
  });

  const today = new Date().toDateString();
  const todayOrders  = allOrders.filter(o=>new Date(o.created_at).toDateString()===today).length;
  const todayRevenue = allOrders.filter(o=>new Date(o.created_at).toDateString()===today&&o.payment_status==='verified').reduce((s,o)=>s+(o.total_amount||0),0);
  const monthRevenue = allOrders.filter(o=>{ const d=new Date(o.created_at); const n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()&&o.payment_status==='verified'; }).reduce((s,o)=>s+(o.total_amount||0),0);
  const lowStock = products.filter(p=>p.stock!==null&&p.stock<=5).length;

  const thisMonth = new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  const thisMonthCount = orders.filter(o=>new Date(o.created_at).toLocaleDateString('en-IN',{month:'long',year:'numeric'})===thisMonth).length;

  function groupByMonth(orders) {
    const g = {};
    orders.forEach(o => {
      const d=new Date(o.created_at);
      const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label=d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
      if (!g[k]) g[k]={label,orders:[],total:0};
      g[k].orders.push(o); g[k].total+=o.total_amount||0;
    });
    return Object.values(g).sort((a,b)=>b.label.localeCompare(a.label));
  }

  if (!user||user.email!==ADMIN_EMAIL) return null;

  /* ── STYLE CONSTANTS ── */
  const BG = '#F6F8FA';
  const SIDEBAR_W = sideOpen ? 220 : 60;

  return (
    <div style={{ minHeight:'100vh', background:BG, display:'flex', flexDirection:'column' }}>
      <ToastContainer />
      <ConfirmDialog />
      {cmdOpen && <CommandPalette orders={allOrders} products={products} onClose={()=>setCmdOpen(false)} />}

      {/* ── TOP NAV ───────────────────────────────────────── */}
      <header style={{ background:'white', borderBottom:'1px solid #E8E8EE',
        height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', position:'sticky', top:0, zIndex:100,
        boxShadow:'0 1px 8px rgba(0,0,0,.05)', flexShrink:0 }}>

        {/* Left */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px',
            background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <BarChart2 size={15} color="white" />
          </div>
          <span style={{ fontSize:'14px', fontWeight:800, color:'#0A0A0A' }}>AS HUB</span>
        </div>

        {/* Center search */}
        <button onClick={()=>setCmdOpen(true)}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 12px',
            borderRadius:'10px', background:'#F4F4F8', border:'1px solid #E8E8EE',
            cursor:'pointer', fontSize:'12px', color:'#8E8E93', fontWeight:600,
            flex:1, maxWidth:'220px', margin:'0 10px' }}>
          <Search size={13} />
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Search... (⌘K)</span>
        </button>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {/* Notif */}
          <div style={{ position:'relative' }}>
            <button onClick={()=>setNotifOpen(o=>!o)}
              style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#F4F4F8',
                border:'none', cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', position:'relative' }}>
              <Bell size={15} color="#555" />
              {unread > 0 && <span style={{ position:'absolute', top:'5px', right:'5px',
                width:'7px', height:'7px', borderRadius:'50%',
                background:'#EF4444', border:'2px solid white' }} />}
            </button>
            {notifOpen && (
              <div style={{ position:'absolute', right:0, top:'40px', width:'300px',
                background:'white', borderRadius:'14px', border:'1px solid #E8E8EE',
                boxShadow:'0 8px 32px rgba(0,0,0,.12)', zIndex:200, overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'12px 14px', borderBottom:'1px solid #F0F0F0' }}>
                  <p style={{ fontSize:'13px', fontWeight:800, color:'#0A0A0A' }}>Notifications {unread>0 && <span style={{ background:'#EF4444', color:'white', fontSize:'9px', fontWeight:800, borderRadius:'99px', padding:'1px 6px', marginLeft:'4px' }}>{unread}</span>}</p>
                  <button onClick={()=>{ const ids=notifications.map(n=>n.id); localStorage.setItem('admin_notif_read',JSON.stringify(ids)); setNotifRead(ids); setNotifOpen(false); }}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:700, color:'#3B82F6' }}>Mark all read</button>
                </div>
                <div style={{ maxHeight:'240px', overflowY:'auto' }}>
                  {notifications.length===0 ? (
                    <div style={{ padding:'24px', textAlign:'center' }}>
                      <Bell size={20} color="#E2E8F0" style={{ margin:'0 auto 8px' }}/>
                      <p style={{ fontSize:'12px', color:'#8E8E93' }}>No notifications</p>
                    </div>
                  ) : notifications.map(n=>(
                    <div key={n.id} style={{ display:'flex', gap:'10px', padding:'10px 14px', borderBottom:'1px solid #F8F8F8', background:notifRead.includes(n.id)?'white':'#FAFAFA' }}>
                      <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:n.color, marginTop:'4px', flexShrink:0 }}/>
                      <div><p style={{ fontSize:'12px', fontWeight:700, color:'#0A0A0A' }}>{n.title}</p><p style={{ fontSize:'11px', color:'#8E8E93', marginTop:'1px' }}>{n.body}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div style={{ width:'28px', height:'28px', borderRadius:'50%',
            background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'11px', fontWeight:900, color:'white', flexShrink:0 }}>
            {user.email?.[0]?.toUpperCase()}
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#FEF2F2',
              border:'1px solid #FECACA', cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center' }}>
            <LogOut size={14} color="#EF4444" />
          </button>
        </div>
      </header>

      {/* ── BODY: TABS + CONTENT (no sidebar) ────────────── */}
      <div style={{ flex:1, minHeight:0 }}>

        {/* Tab switcher */}
        <div style={{ background:'white', borderBottom:'1px solid #E8E8EE', padding:'10px 16px', overflowX:'auto' }}>
          <div style={{ display:'flex', gap:'4px', background:'#F4F4F8', padding:'4px', borderRadius:'14px', width:'max-content', minWidth:'100%' }}>
            {[
              { key:'orders',    label:'Orders',    icon:ShoppingBag },
              { key:'products',  label:'Products',  icon:Package },
              { key:'more',      label:'More',      icon:Settings },
            ].map(({ key, label, icon:Icon }) => (
              <button key={key} onClick={() => setPage(key)}
                style={{ display:'flex', alignItems:'center', gap:'6px',
                  padding:'8px 18px', borderRadius:'10px', fontWeight:700,
                  fontSize:'13px', border:'none', cursor:'pointer', transition:'all .2s',
                  background: page===key ? 'white' : 'transparent',
                  color: page===key ? '#0A0A0A' : '#8E8E93',
                  boxShadow: page===key ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
                  whiteSpace:'nowrap', flexShrink:0 }}>
                <Icon size={14} strokeWidth={2} />
                {label}
                {key==='orders' && counts.all_pending > 0 && (
                  <span style={{ background:'#EF4444', color:'white', fontSize:'9px',
                    fontWeight:800, borderRadius:'99px', padding:'1px 5px',
                    minWidth:'16px', textAlign:'center' }}>
                    {counts.all_pending > 9 ? '9+' : counts.all_pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main style={{ padding:'20px 16px', maxWidth:'1200px', margin:'0 auto' }}>

          {/* ── DASHBOARD ── */}
          {page==='dashboard' && (
            <div>
              <h1 style={{fontSize:'20px',fontWeight:900,color:'#0A0A0A',marginBottom:'20px'}}>Dashboard</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px',marginBottom:'24px'}}>
                {[
                  {label:"Today's Orders",value:todayOrders,color:'#3B82F6',bg:'#EFF6FF',icon:ShoppingBag},
                  {label:'Pending',value:counts.all_pending||0,color:'#F59E0B',bg:'#FFFBEB',icon:AlertCircle},
                  {label:"Today's Revenue",value:`₹${todayRevenue.toFixed(0)}`,color:'#16A34A',bg:'#F0FDF4',icon:TrendingUp},
                  {label:'Monthly Revenue',value:`₹${monthRevenue.toFixed(0)}`,color:'#7C3AED',bg:'#F5F3FF',icon:BarChart2},
                  {label:'Products',value:products.length,color:'#0369A1',bg:'#EFF6FF',icon:Package},
                  {label:'Low Stock',value:lowStock,color:'#EF4444',bg:'#FEF2F2',icon:AlertTriangle},
                ].map(({label,value,color,bg,icon:Icon})=>(
                  <div key={label} style={{background:'white',borderRadius:'14px',padding:'14px',border:'1px solid #F0F0F0',boxShadow:'0 1px 6px rgba(0,0,0,.04)',borderTop:`3px solid ${color}`,transition:'transform .2s,box-shadow .2s',cursor:'default'}}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.08)';}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 1px 6px rgba(0,0,0,.04)';}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'8px',background:bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}>
                      <Icon size={16} strokeWidth={2} color={color}/>
                    </div>
                    <p style={{fontSize:'20px',fontWeight:900,color,lineHeight:1,marginBottom:'4px'}}>{value}</p>
                    <p style={{fontSize:'11px',fontWeight:600,color:'#8E8E93',textTransform:'uppercase',letterSpacing:'.4px'}}>{label}</p>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'12px'}}>
                <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid #F0F0F0'}}>
                  <p style={{fontSize:'13px',fontWeight:800,color:'#0A0A0A',marginBottom:'12px'}}>Recent Orders</p>
                  {allOrders.slice(0,5).map(o=>(
                    <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #F8F8F8'}}>
                      <div><p style={{fontSize:'12px',fontWeight:700,color:'#0A0A0A'}}>#{o.id.slice(0,8).toUpperCase()}</p><p style={{fontSize:'11px',color:'#8E8E93'}}>{o.shipping_address?.fullName}</p></div>
                      <span style={{fontSize:'13px',fontWeight:900,color:'#0A0A0A'}}>₹{o.total_amount?.toFixed(0)}</span>
                    </div>
                  ))}
                  {allOrders.length===0&&<p style={{fontSize:'12px',color:'#8E8E93',textAlign:'center',padding:'16px'}}>No orders yet</p>}
                </div>
                <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid #F0F0F0'}}>
                  <p style={{fontSize:'13px',fontWeight:800,color:'#0A0A0A',marginBottom:'12px'}}>Inventory Alerts</p>
                  {products.filter(p=>p.stock!==null&&p.stock<=5).slice(0,6).map(p=>(
                    <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F8F8F8'}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:'#0A0A0A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'180px'}}>{p.name}</p>
                      <span style={{fontSize:'11px',fontWeight:800,padding:'2px 8px',borderRadius:'6px',background:p.stock===0?'#FEF2F2':'#FFFBEB',color:p.stock===0?'#EF4444':'#F59E0B',flexShrink:0}}>{p.stock===0?'Out':'Low:'+p.stock}</span>
                    </div>
                  ))}
                  {products.filter(p=>p.stock!==null&&p.stock<=5).length===0&&<p style={{fontSize:'12px',color:'#8E8E93',textAlign:'center',padding:'16px'}}>All products in stock ✓</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {page==='orders' && (
            <div className="page-enter">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px',flexWrap:'wrap',gap:'10px'}}>
                <h1 style={{fontSize:'18px',fontWeight:900,color:'#0A0A0A'}}>Orders</h1>
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                  {/* Date filter pills */}
                  {['all','today','week','month'].map(f=>(
                    <button key={f} onClick={()=>setDateFilter(f)}
                      style={{padding:'5px 12px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',transition:'all .15s',
                        border:`1px solid ${dateFilter===f?'#1A1A2E':'#E2E8F0'}`,
                        background:dateFilter===f?'#1A1A2E':'white',
                        color:dateFilter===f?'white':'#555'}}>
                      {f==='all'?'All':f==='today'?'Today':f==='week'?'Week':'Month'}
                    </button>
                  ))}
                  <button onClick={()=>exportOrdersCSV(selected.length>0?orders.filter(o=>selected.includes(o.id)):orders)}
                    style={{display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',borderRadius:'8px',background:'white',border:'1px solid #E2E8F0',color:'#555',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>
                    <Download size={13}/> Export
                  </button>
                  <button onClick={fetchOrders}
                    style={{width:'32px',height:'32px',borderRadius:'8px',background:'white',border:'1px solid #E2E8F0',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <RefreshCw size={14} color="#555"/>
                  </button>
                </div>
              </div>

              {/* Order status tabs */}
              <div style={{display:'flex',gap:'5px',overflowX:'auto',paddingBottom:'4px',marginBottom:'14px'}}>
                {ORDER_STATUS.map(t=>(
                  <button key={t.key} onClick={()=>{setOrderTab(t.key);setSelected([]);}}
                    style={{display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',borderRadius:'8px',whiteSpace:'nowrap',
                      fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer',flexShrink:0,transition:'all .15s',
                      background:orderTab===t.key?t.color:'white',
                      color:orderTab===t.key?'white':'#555',
                      boxShadow:orderTab===t.key?`0 3px 10px ${t.color}44`:'0 1px 4px rgba(0,0,0,.06)'}}>
                    {t.label}
                    {counts[t.key]>0&&<span style={{background:orderTab===t.key?'rgba(255,255,255,.3)':t.color+'22',color:orderTab===t.key?'white':t.color,fontSize:'10px',fontWeight:800,borderRadius:'5px',padding:'1px 5px'}}>{counts[t.key]>99?'99+':counts[t.key]}</span>}
                  </button>
                ))}
              </div>

              {/* Bulk bar */}
              {selected.length>0&&(
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap',padding:'10px 14px',background:'#1A1A2E',borderRadius:'10px',marginBottom:'10px'}}>
                  <span style={{fontSize:'12px',fontWeight:800,color:'white'}}>{selected.length} selected</span>
                  <div style={{flex:1}}/>
                  <button onClick={bulkConfirm} style={{padding:'6px 12px',borderRadius:'7px',background:'#16A34A',color:'white',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>Confirm</button>
                  <button onClick={()=>{exportOrdersCSV(orders.filter(o=>selected.includes(o.id)));}} style={{padding:'6px 12px',borderRadius:'7px',background:'#3B82F6',color:'white',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>Export</button>
                  <button onClick={bulkPrint} style={{padding:'6px 12px',borderRadius:'7px',background:'white',color:'#1A1A2E',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px'}}><Printer size={12}/>Print Labels</button>
                  <button onClick={bulkDelete} style={{padding:'6px 12px',borderRadius:'7px',background:'#EF4444',color:'white',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>Delete</button>
                  <button onClick={clearSel} style={{padding:'6px 12px',borderRadius:'7px',background:'rgba(255,255,255,.15)',color:'white',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>Clear</button>
                </div>
              )}

              {/* Select all */}
              {orders.length>0&&!loading&&(
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px',padding:'0 2px'}}>
                  <input type="checkbox" checked={selected.length===orders.length} onChange={e=>e.target.checked?selectAll():clearSel()} style={{width:'14px',height:'14px',cursor:'pointer'}}/>
                  <span style={{fontSize:'11px',color:'#8E8E93',fontWeight:600}}>Select all {orders.length}</span>
                  <span style={{marginLeft:'auto',fontSize:'11px',color:'#8E8E93'}}>{thisMonthCount} this month</span>
                </div>
              )}

              {/* Orders list */}
              {loading ? (
                <div>{[...Array(4)].map((_,i)=><OrderSkeleton key={i}/>)}</div>
              ) : orders.length===0 ? (
                <EmptyState icon={ShoppingBag} title="No orders" desc="No orders found for the selected filter."/>
              ) : (
                groupByMonth(orders).map(group=>(
                  <div key={group.label} style={{marginBottom:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 2px',marginBottom:'6px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div style={{width:'3px',height:'16px',borderRadius:'99px',background:'#1A1A2E'}}/>
                        <p style={{fontSize:'13px',fontWeight:800,color:'#0A0A0A'}}>{group.label}</p>
                        <span style={{background:'#F4F4F8',color:'#555',fontSize:'10px',fontWeight:800,borderRadius:'6px',padding:'2px 7px'}}>{group.orders.length}</span>
                      </div>
                      <p style={{fontSize:'12px',fontWeight:700,color:'#8E8E93'}}>₹{group.total.toFixed(0)}</p>
                    </div>
                    {group.orders.map(o=>(
                      <OrderCard key={o.id} order={o}
                        onConfirm={handleConfirm} onReject={handleReject}
                        onStatus={handleStatus} onDelete={handleDeleteOrder}
                        confirming={confirming===o.id}
                        selected={selected.includes(o.id)}
                        onSelect={()=>toggleSelect(o.id)}/>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {page==='products' && (
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px',flexWrap:'wrap',gap:'10px'}}>
                <h1 style={{fontSize:'18px',fontWeight:900,color:'#0A0A0A'}}>Products</h1>
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
                    style={{padding:'7px 12px',borderRadius:'10px',border:'1.5px solid #E2E8F0',fontSize:'13px',fontFamily:'inherit',outline:'none',background:'white',width:'180px'}}
                    onFocus={e=>e.target.style.borderColor='#1A1A2E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                    style={{padding:'7px 12px',borderRadius:'10px',border:'1.5px solid #E2E8F0',fontSize:'13px',fontFamily:'inherit',background:'white',fontWeight:600}}>
                    <option value="all">All</option>
                    <option value="tailoring">Tailoring</option>
                    <option value="fashion">Fashion</option>
                  </select>
                  <button onClick={()=>exportProductsCSV(products)}
                    style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 12px',borderRadius:'10px',background:'white',border:'1.5px solid #E2E8F0',color:'#555',fontSize:'13px',fontWeight:700,cursor:'pointer'}}>
                    <Download size={14}/> Export
                  </button>
                  <button onClick={()=>setModal('add')}
                    style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 16px',borderRadius:'10px',background:'#1A1A2E',color:'white',fontWeight:800,fontSize:'13px',border:'none',cursor:'pointer'}}>
                    <Plus size={15}/> Add
                  </button>
                </div>
              </div>

              {/* Stats strip */}
              <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
                {[{l:'Total',v:products.length,c:'#555'},{l:'Active',v:products.filter(p=>p.active).length,c:'#16A34A'},{l:'Hidden',v:products.filter(p=>!p.active).length,c:'#8E8E93'},{l:'Low Stock',v:products.filter(p=>p.stock!==null&&p.stock<=5).length,c:'#EF4444'}].map(({l,v,c})=>(
                  <div key={l} style={{background:'white',borderRadius:'10px',padding:'8px 14px',border:'1px solid #F0F0F0',display:'flex',alignItems:'center',gap:'6px',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
                    <span style={{fontSize:'16px',fontWeight:900,color:c}}>{v}</span>
                    <span style={{fontSize:'11px',fontWeight:600,color:'#8E8E93'}}>{l}</span>
                  </div>
                ))}
              </div>

              {loading ? (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'12px'}}>
                  {[...Array(6)].map((_,i)=><ProductSkeleton key={i}/>)}
                </div>
              ) : filteredProducts.length===0 ? (
                <EmptyState icon={Package} title="No products" desc={search?`No products match "${search}"`:"Add your first product"} action="Add Product" onAction={()=>setModal('add')}/>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'14px'}}
                  className="product-admin-grid">
                  {filteredProducts.map(p => {
                    const discount = p.original_price > p.price ? Math.round((1-p.price/p.original_price)*100) : null;
                    const stockStatus = p.stock===0 ? {label:'Out of Stock',c:'#EF4444',bg:'#FEF2F2'} : p.stock<=5 ? {label:`Low: ${p.stock}`,c:'#F59E0B',bg:'#FFFBEB'} : {label:`${p.stock} in stock`,c:'#16A34A',bg:'#F0FDF4'};
                    return (
                      <div key={p.id} style={{background:'white',borderRadius:'16px',overflow:'hidden',border:'1px solid #F0F0F0',boxShadow:'0 1px 8px rgba(0,0,0,.05)',opacity:p.active?1:.7,transition:'transform .2s,box-shadow .2s',display:'flex',flexDirection:'column'}}
                        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,.10)';}}
                        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 1px 8px rgba(0,0,0,.05)';}}>

                        {/* Image area */}
                        <div style={{position:'relative',height:'180px',background:'#F8F9FA',overflow:'hidden'}}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name}
                              style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .4s'}}
                              onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}
                            />
                          ) : null}
                          {/* Elegant placeholder */}
                          <div style={{display:p.image_url?'none':'flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',background:'linear-gradient(135deg,#F8F9FA,#EEF0F3)'}}>
                            <Package size={32} strokeWidth={1} color="#C8CDD5"/>
                            <span style={{fontSize:'11px',color:'#C8CDD5',fontWeight:600}}>No Image</span>
                          </div>
                          {/* Badges */}
                          {discount && <div style={{position:'absolute',top:'8px',left:'8px',background:'#EF4444',color:'white',fontSize:'10px',fontWeight:800,padding:'3px 8px',borderRadius:'6px'}}>-{discount}%</div>}
                          {!p.active && <div style={{position:'absolute',top:'8px',right:'8px',background:'rgba(0,0,0,.6)',color:'white',fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'6px'}}>Hidden</div>}
                          {/* Hover overlay with Preview */}
                          <div className="prod-overlay" style={{position:'absolute',inset:0,background:'rgba(0,0,0,.35)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity .2s'}}>
                            <a href={`/product/${p.id}`} target="_blank" rel="noopener noreferrer"
                              style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 14px',borderRadius:'8px',background:'white',color:'#0A0A0A',fontSize:'12px',fontWeight:800,textDecoration:'none'}}>
                              <Eye size={13}/> Preview
                            </a>
                          </div>
                        </div>

                        {/* Info */}
                        <div style={{padding:'12px 14px',flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                          <div>
                            <p style={{fontSize:'13px',fontWeight:800,color:'#0A0A0A',lineHeight:1.35,marginBottom:'3px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.name}</p>
                            <p style={{fontSize:'11px',color:'#8E8E93',fontWeight:500}}>{p.category}{p.sub_category ? ` · ${p.sub_category}` : ''}</p>
                          </div>
                          <div style={{display:'flex',alignItems:'baseline',gap:'5px'}}>
                            <span style={{fontSize:'16px',fontWeight:900,color:'#0A0A0A'}}>₹{p.price}</span>
                            {p.original_price>p.price && <span style={{fontSize:'12px',color:'#C0C0C0',textDecoration:'line-through'}}>₹{p.original_price}</span>}
                          </div>
                          {p.stock!==null && (
                            <div style={{display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:'6px',background:stockStatus.bg,width:'fit-content'}}>
                              <span style={{fontSize:'10px',fontWeight:700,color:stockStatus.c}}>{stockStatus.label}</span>
                            </div>
                          )}
                          {p.unit && <p style={{fontSize:'11px',color:'#8E8E93'}}>{p.unit}</p>}
                        </div>

                        {/* Actions */}
                        <div style={{padding:'0 14px 12px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'}}>
                          <button onClick={()=>setModal(p)}
                            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'7px',borderRadius:'8px',background:'#EFF6FF',color:'#2563EB',fontWeight:700,fontSize:'11px',border:'none',cursor:'pointer'}}>
                            <Edit2 size={11}/> Edit
                          </button>
                          <button onClick={async()=>{
                            const {id:_,...rest}=p;
                            const {error}=await supabase.from('products').insert([{...rest,name:rest.name+' (Copy)',active:false}]);
                            if(!error){toast('Product duplicated','success');fetchProducts();}else toast('Error','error');
                          }} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'7px',borderRadius:'8px',background:'#F5F3FF',color:'#7C3AED',fontWeight:700,fontSize:'11px',border:'none',cursor:'pointer'}}>
                            Duplicate
                          </button>
                          <button onClick={()=>handleToggleActive(p)}
                            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'7px',borderRadius:'8px',background:p.active?'#FFFBEB':'#F0FDF4',color:p.active?'#92400E':'#15803D',fontWeight:700,fontSize:'11px',border:'none',cursor:'pointer'}}>
                            {p.active?'Hide':'Show'}
                          </button>
                          <button onClick={()=>handleDeleteProduct(p.id)}
                            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'7px',borderRadius:'8px',background:'#FEF2F2',color:'#EF4444',fontWeight:700,fontSize:'11px',border:'1px solid #FECACA',cursor:'pointer'}}>
                            <Trash2 size={11}/> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── MORE (Inventory + Reports + Settings) ── */}
          {page==='more' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>

              {/* ── INVENTORY ── */}
              <div>
                <h2 style={{fontSize:'15px',fontWeight:900,color:'#0A0A0A',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}><AlertTriangle size={16} color="#F59E0B"/> Inventory</h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'12px'}}>
                  {/* Out of Stock */}
                  <div style={{background:'white',borderRadius:'14px',padding:'14px',border:'1px solid #FECACA'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#EF4444',marginBottom:'10px'}}>Out of Stock ({products.filter(p=>p.stock===0).length})</p>
                    {products.filter(p=>p.stock===0).slice(0,5).map(p=>(
                      <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #FEF2F2'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#0A0A0A',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:'8px'}}>{p.name}</p>
                        <span style={{fontSize:'10px',fontWeight:800,color:'#EF4444',background:'#FEF2F2',padding:'2px 7px',borderRadius:'5px',flexShrink:0}}>0 left</span>
                      </div>
                    ))}
                    {products.filter(p=>p.stock===0).length===0&&<p style={{fontSize:'12px',color:'#16A34A',fontWeight:700,textAlign:'center',padding:'6px'}}>All stocked ✓</p>}
                  </div>
                  {/* Low Stock */}
                  <div style={{background:'white',borderRadius:'14px',padding:'14px',border:'1px solid #FDE68A'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#F59E0B',marginBottom:'10px'}}>Low Stock ≤5 ({products.filter(p=>p.stock>0&&p.stock<=5).length})</p>
                    {products.filter(p=>p.stock>0&&p.stock<=5).slice(0,5).map(p=>(
                      <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #FFFBEB'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#0A0A0A',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:'8px'}}>{p.name}</p>
                        <span style={{fontSize:'10px',fontWeight:800,color:'#F59E0B',background:'#FFFBEB',padding:'2px 7px',borderRadius:'5px',flexShrink:0}}>{p.stock} left</span>
                      </div>
                    ))}
                    {products.filter(p=>p.stock>0&&p.stock<=5).length===0&&<p style={{fontSize:'12px',color:'#16A34A',fontWeight:700,textAlign:'center',padding:'6px'}}>No low stock ✓</p>}
                  </div>
                  {/* Hidden */}
                  <div style={{background:'white',borderRadius:'14px',padding:'14px',border:'1px solid #E2E8F0'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#555',marginBottom:'10px'}}>Hidden Products ({products.filter(p=>!p.active).length})</p>
                    {products.filter(p=>!p.active).slice(0,5).map(p=>(
                      <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #F8F8F8'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#0A0A0A',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:'8px'}}>{p.name}</p>
                        <button onClick={()=>handleToggleActive(p)} style={{fontSize:'10px',fontWeight:800,color:'#2563EB',background:'#EFF6FF',padding:'2px 8px',borderRadius:'5px',border:'none',cursor:'pointer',flexShrink:0}}>Show</button>
                      </div>
                    ))}
                    {products.filter(p=>!p.active).length===0&&<p style={{fontSize:'12px',color:'#16A34A',fontWeight:700,textAlign:'center',padding:'6px'}}>All visible ✓</p>}
                  </div>
                </div>
              </div>

              {/* ── REPORTS ── */}
              <div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',flexWrap:'wrap',gap:'8px'}}>
                  <h2 style={{fontSize:'15px',fontWeight:900,color:'#0A0A0A',display:'flex',alignItems:'center',gap:'8px'}}><BarChart2 size={16} color="#7C3AED"/> Reports</h2>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    <button onClick={()=>exportOrdersCSV(allOrders)} style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',borderRadius:'8px',background:'#1A1A2E',color:'white',fontSize:'11px',fontWeight:700,border:'none',cursor:'pointer'}}><Download size={12}/> Orders CSV</button>
                    <button onClick={()=>exportProductsCSV(products)} style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',borderRadius:'8px',background:'white',border:'1px solid #E2E8F0',color:'#555',fontSize:'11px',fontWeight:700,cursor:'pointer'}}><Download size={12}/> Products CSV</button>
                    <button onClick={()=>window.print()} style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',borderRadius:'8px',background:'white',border:'1px solid #E2E8F0',color:'#555',fontSize:'11px',fontWeight:700,cursor:'pointer'}}><Printer size={12}/> Print</button>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px',marginBottom:'14px'}}>
                  {[
                    {label:'Total Revenue',value:`₹${allOrders.filter(o=>o.payment_status==='verified').reduce((s,o)=>s+(o.total_amount||0),0).toFixed(0)}`,color:'#16A34A',icon:TrendingUp},
                    {label:'Total Orders',value:allOrders.length,color:'#2563EB',icon:ShoppingBag},
                    {label:'Confirmed',value:allOrders.filter(o=>o.payment_status==='verified').length,color:'#7C3AED',icon:CheckCircle},
                    {label:'Pending',value:allOrders.filter(o=>o.payment_status==='submitted').length,color:'#F59E0B',icon:AlertCircle},
                  ].map(({label,value,color,icon:Icon})=>(
                    <div key={label} style={{background:'white',borderRadius:'12px',padding:'14px',border:'1px solid #F0F0F0',borderTop:`3px solid ${color}`}}>
                      <Icon size={14} color={color} style={{marginBottom:'8px'}}/>
                      <p style={{fontSize:'20px',fontWeight:900,color,lineHeight:1,marginBottom:'4px'}}>{value}</p>
                      <p style={{fontSize:'10px',fontWeight:600,color:'#8E8E93',textTransform:'uppercase',letterSpacing:'.4px'}}>{label}</p>
                    </div>
                  ))}
                </div>
                <div style={{background:'white',borderRadius:'14px',padding:'14px',border:'1px solid #F0F0F0'}}>
                  <p style={{fontSize:'12px',fontWeight:800,color:'#0A0A0A',marginBottom:'10px'}}>Top Products by Orders</p>
                  {(() => {
                    const c={};
                    allOrders.forEach(o=>{(o.items||[]).forEach(i=>{c[i.name]=(c[i.name]||0)+i.quantity;});});
                    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,qty])=>(
                      <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F8F8F8'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#0A0A0A',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:'10px'}}>{name}</p>
                        <span style={{fontSize:'11px',fontWeight:800,color:'#7C3AED',background:'#F5F3FF',padding:'2px 8px',borderRadius:'6px',flexShrink:0}}>{qty} sold</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* ── SETTINGS ── */}
              <div>
                <h2 style={{fontSize:'15px',fontWeight:900,color:'#0A0A0A',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}><Settings size={16} color="#555"/> Settings</h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'12px'}}>
                  <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid #F0F0F0'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#555',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'12px'}}>Business Details</p>
                    {[{l:'Shop Name',v:'AS HUB'},{l:'Owner',v:'Shaik Asmath'},{l:'Email',v:'as.businezzz@gmail.com'},{l:'Phone',v:'+91 70139 42909'}].map(({l,v})=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F8F8F8',gap:'8px'}}>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#8E8E93',flexShrink:0}}>{l}</span>
                        <span style={{fontSize:'12px',fontWeight:700,color:'#0A0A0A',textAlign:'right'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid #F0F0F0'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#555',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'12px'}}>Payment & Contact</p>
                    {[{l:'UPI ID',v:'7995747250@ptyes'},{l:'UPI Name',v:'Shaik Asmath'},{l:'WhatsApp',v:'+91 70139 42909'},{l:'Method',v:'UPI Only'}].map(({l,v})=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F8F8F8',gap:'8px'}}>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#8E8E93',flexShrink:0}}>{l}</span>
                        <span style={{fontSize:'12px',fontWeight:700,color:'#0A0A0A',textAlign:'right'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid #F0F0F0'}}>
                    <p style={{fontSize:'12px',fontWeight:800,color:'#555',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'12px'}}>Address</p>
                    {[{l:'House',v:'D.No. 25-2-1709'},{l:'Area',v:'Pragathi Nagar, Podalkur Rd'},{l:'City',v:'Nellore'},{l:'State',v:'Andhra Pradesh'},{l:'PIN',v:'524004'}].map(({l,v})=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F8F8F8',gap:'8px'}}>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#8E8E93',flexShrink:0}}>{l}</span>
                        <span style={{fontSize:'12px',fontWeight:700,color:'#0A0A0A',textAlign:'right'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal product={modal==='add'?null:modal} onClose={()=>setModal(null)} onSave={()=>{setModal(null);fetchProducts();}}/>
        )}
      </AnimatePresence>

      {/* Floating Quick Actions */}
      <QuickActions
        onAddProduct={() => { setPage('products'); setModal('add'); }}
        onExportOrders={() => exportOrdersCSV(orders)}
        onRefresh={() => { fetchOrders(); fetchCounts(); fetchProducts(); toast('Dashboard refreshed','success'); }}
      />

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .prod-overlay{opacity:0!important} div:hover>.prod-overlay,.prod-card:hover .prod-overlay{opacity:1!important}`}</style>
    </div>
  );
}
