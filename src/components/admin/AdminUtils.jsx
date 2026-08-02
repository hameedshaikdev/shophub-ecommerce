import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Package, ShoppingBag, Command,
  CheckCircle, AlertCircle, Info, XCircle, Loader2,
  Trash2, AlertTriangle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════════ */
let toastFn = null;
export function setToastHandler(fn) { toastFn = fn; }
export function toast(msg, type = 'success', duration = 3000) {
  if (toastFn) toastFn({ msg, type, duration, id: Date.now() });
}

const TOAST_ICONS = {
  success: <CheckCircle size={16} color="#16A34A" />,
  error:   <XCircle    size={16} color="#EF4444" />,
  warning: <AlertCircle size={16} color="#F59E0B" />,
  info:    <Info        size={16} color="#3B82F6" />,
  loading: <Loader2     size={16} color="#8E8E93" style={{ animation:'spin .8s linear infinite' }} />,
};
const TOAST_COLORS = {
  success:'#F0FDF4', error:'#FEF2F2', warning:'#FFFBEB', info:'#EFF6FF', loading:'#F8FAFC',
};
const TOAST_BORDERS = {
  success:'#BBF7D0', error:'#FECACA', warning:'#FDE68A', info:'#BFDBFE', loading:'#E2E8F0',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastHandler(t => {
      setToasts(prev => [...prev.slice(-4), t]);
      if (t.type !== 'loading') {
        setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), t.duration || 3000);
      }
    });
  }, []);

  return (
    <div style={{ position:'fixed', bottom:'90px', right:'16px', zIndex:9999,
      display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity:0, x:40, scale:.95 }}
            animate={{ opacity:1, x:0, scale:1 }}
            exit={{ opacity:0, x:40, scale:.95 }}
            transition={{ duration:.25, ease:[.22,1,.36,1] }}
            style={{ display:'flex', alignItems:'center', gap:'10px',
              padding:'12px 16px', borderRadius:'12px', maxWidth:'320px',
              background:TOAST_COLORS[t.type]||'#F8FAFC',
              border:`1px solid ${TOAST_BORDERS[t.type]||'#E2E8F0'}`,
              boxShadow:'0 4px 20px rgba(0,0,0,.10)',
              pointerEvents:'all', cursor:'default' }}>
            {TOAST_ICONS[t.type]}
            <span style={{ fontSize:'13px', fontWeight:600, color:'#0A0A0A', flex:1 }}>{t.msg}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
              style={{ background:'none', border:'none', cursor:'pointer',
                display:'flex', color:'#8E8E93', padding:0 }}>
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
═══════════════════════════════════════════════════════════ */
let confirmFn = null;
export function setConfirmHandler(fn) { confirmFn = fn; }
export function confirm(opts) {
  return new Promise(resolve => {
    if (confirmFn) confirmFn({ ...opts, resolve });
  });
}

export function ConfirmDialog() {
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    setConfirmHandler(d => setDialog(d));
  }, []);

  if (!dialog) return null;

  const handle = (ok) => {
    dialog.resolve(ok);
    setDialog(null);
  };

  const isDanger = dialog.type === 'danger';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)',
          zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'24px', backdropFilter:'blur(4px)' }}
        onClick={e => e.target===e.currentTarget && handle(false)}>
        <motion.div initial={{ scale:.92, opacity:0 }}
          animate={{ scale:1, opacity:1 }}
          exit={{ scale:.92, opacity:0 }}
          transition={{ duration:.2, ease:[.22,1,.36,1] }}
          style={{ background:'white', borderRadius:'20px', padding:'28px',
            maxWidth:'380px', width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,.18)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'20px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', flexShrink:0,
              background:isDanger?'#FEF2F2':'#FFFBEB',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isDanger
                ? <Trash2 size={20} color="#EF4444" />
                : <AlertTriangle size={20} color="#F59E0B" />}
            </div>
            <div>
              <p style={{ fontSize:'16px', fontWeight:800, color:'#0A0A0A',
                marginBottom:'6px' }}>{dialog.title || 'Are you sure?'}</p>
              <p style={{ fontSize:'13px', color:'#555', lineHeight:1.6 }}>
                {dialog.message || 'This action cannot be undone.'}
              </p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => handle(false)}
              style={{ flex:1, padding:'11px', borderRadius:'12px', background:'#F4F4F8',
                color:'#555', fontWeight:700, fontSize:'14px',
                border:'none', cursor:'pointer' }}>
              Cancel
            </button>
            <button onClick={() => handle(true)}
              style={{ flex:1, padding:'11px', borderRadius:'12px',
                background:isDanger?'#EF4444':'#F59E0B',
                color:'white', fontWeight:800, fontSize:'14px',
                border:'none', cursor:'pointer' }}>
              {dialog.confirm || 'Confirm'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMMAND PALETTE (Ctrl+K)
═══════════════════════════════════════════════════════════ */
export function CommandPalette({ orders=[], products=[], onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredOrders = orders.filter(o =>
    o.id?.toLowerCase().includes(query.toLowerCase()) ||
    o.shipping_address?.fullName?.toLowerCase().includes(query.toLowerCase()) ||
    o.shipping_address?.phone?.includes(query)
  ).slice(0, 5);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const hasResults = filteredOrders.length > 0 || filteredProducts.length > 0;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)',
        zIndex:9000, display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'80px 24px', backdropFilter:'blur(4px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ scale:.95, opacity:0, y:-20 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:.95, opacity:0, y:-20 }}
        transition={{ duration:.2, ease:[.22,1,.36,1] }}
        style={{ background:'white', borderRadius:'20px', width:'100%', maxWidth:'560px',
          boxShadow:'0 32px 80px rgba(0,0,0,.2)', overflow:'hidden' }}>

        {/* Search input */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px',
          padding:'16px 20px', borderBottom:'1px solid #F0F0F0' }}>
          <Search size={18} color="#8E8E93" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search orders, products, customers..."
            style={{ flex:1, border:'none', outline:'none', fontSize:'15px',
              fontFamily:'inherit', color:'#0A0A0A', background:'none' }} />
          {query && (
            <button onClick={() => setQuery('')}
              style={{ background:'none', border:'none', cursor:'pointer',
                display:'flex', color:'#8E8E93' }}>
              <X size={16} />
            </button>
          )}
          <button onClick={onClose}
            title="Close Search (or ESC)"
            aria-label="Close"
            style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              width:'30px', height:'30px', borderRadius:'50%',
              background:'#F1F5F9', border:'1px solid #E2E8F0',
              color:'#475569', cursor:'pointer', flexShrink:0,
              transition:'all .15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#F1F5F9'; e.currentTarget.style.color='#475569'; }}>
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight:'360px', overflowY:'auto' }}>
          {!query && (
            <div style={{ padding:'32px', textAlign:'center' }}>
              <Command size={32} color="#E2E8F0" style={{ margin:'0 auto 12px' }} />
              <p style={{ fontSize:'14px', color:'#8E8E93', fontWeight:600 }}>
                Type to search orders, products...
              </p>
              <p style={{ fontSize:'12px', color:'#C0C0C0', marginTop:'6px' }}>
                Press <kbd style={{ padding:'2px 6px', borderRadius:'4px', background:'#F4F4F8',
                  border:'1px solid #E2E8F0', fontSize:'11px' }}>Ctrl+K</kbd> anytime to open
              </p>
            </div>
          )}

          {query && !hasResults && (
            <div style={{ padding:'32px', textAlign:'center' }}>
              <p style={{ fontSize:'14px', color:'#8E8E93' }}>No results for "{query}"</p>
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div style={{ padding:'8px 0' }}>
              <p style={{ fontSize:'11px', fontWeight:700, color:'#8E8E93', textTransform:'uppercase',
                letterSpacing:'1px', padding:'8px 20px' }}>Orders</p>
              {filteredOrders.map(o => (
                <div key={o.id}
                  style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 20px',
                    cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'8px',
                    background:'#EFF6FF', display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0 }}>
                    <ShoppingBag size={14} color="#2563EB" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A' }}>
                      #{o.id.slice(0,8).toUpperCase()}
                    </p>
                    <p style={{ fontSize:'12px', color:'#8E8E93', truncate:true }}>
                      {o.shipping_address?.fullName} · ₹{o.total_amount?.toFixed(0)}
                    </p>
                  </div>
                  <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 8px',
                    borderRadius:'6px', background:'#F4F4F8', color:'#555' }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div style={{ padding:'8px 0' }}>
              <p style={{ fontSize:'11px', fontWeight:700, color:'#8E8E93', textTransform:'uppercase',
                letterSpacing:'1px', padding:'8px 20px' }}>Products</p>
              {filteredProducts.map(p => (
                <div key={p.id}
                  style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 20px',
                    cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'8px',
                    overflow:'hidden', background:'#F4F4F8', flexShrink:0 }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <Package size={16} color="#8E8E93"
                          style={{ margin:'8px' }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize:'12px', color:'#8E8E93' }}>
                      ₹{p.price} · {p.category}
                    </p>
                  </div>
                  <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 8px',
                    borderRadius:'6px',
                    background:p.active?'#F0FDF4':'#FEF2F2',
                    color:p.active?'#16A34A':'#EF4444' }}>
                    {p.active?'Active':'Hidden'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:'10px 20px', borderTop:'1px solid #F0F0F0',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <kbd style={{ padding:'2px 7px', borderRadius:'5px', background:'#F4F4F8',
                fontSize:'11px', fontWeight:700, color:'#555', border:'1px solid #E2E8F0' }}>↑↓</kbd>
              <span style={{ fontSize:'11px', color:'#8E8E93' }}>Navigate</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <kbd style={{ padding:'2px 7px', borderRadius:'5px', background:'#F4F4F8',
                fontSize:'11px', fontWeight:700, color:'#555', border:'1px solid #E2E8F0' }}>↵</kbd>
              <span style={{ fontSize:'11px', color:'#8E8E93' }}>Open</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            display:'flex', alignItems:'center', gap:'4px', padding:'5px 12px',
            borderRadius:'8px', background:'#FEF2F2', border:'1px solid #FCA5A5',
            color:'#DC2626', fontSize:'12px', fontWeight:800, cursor:'pointer'
          }}>
            <X size={14} /> Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKELETON LOADER
═══════════════════════════════════════════════════════════ */
export function Skeleton({ width='100%', height='14px', radius='8px', style={} }) {
  return (
    <div style={{ width, height, borderRadius:radius, background:'#F0F0F0',
      animation:'shimmer 1.5s infinite', ...style }}>
      <style>{`
        @keyframes shimmer {
          0%   { background: #F0F0F0; }
          50%  { background: #E0E0E0; }
          100% { background: #F0F0F0; }
        }
      `}</style>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div style={{ background:'white', borderRadius:'16px', padding:'16px',
      border:'1px solid #F0F0F0', marginBottom:'12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <Skeleton width="140px" height="16px" />
          <Skeleton width="100px" height="12px" />
        </div>
        <Skeleton width="60px" height="24px" radius="8px" />
      </div>
      <Skeleton width="80%" height="12px" style={{ marginBottom:'8px' }} />
      <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
        <Skeleton width="80px" height="32px" radius="10px" />
        <Skeleton width="80px" height="32px" radius="10px" />
        <Skeleton width="80px" height="32px" radius="10px" />
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div style={{ background:'white', borderRadius:'16px', overflow:'hidden',
      border:'1px solid #F0F0F0' }}>
      <Skeleton width="100%" height="160px" radius="0" />
      <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>
        <Skeleton height="14px" width="85%" />
        <Skeleton height="12px" width="55%" />
        <Skeleton height="18px" width="40%" />
        <div style={{ display:'flex', gap:'6px' }}>
          <Skeleton height="28px" width="60px" radius="8px" />
          <Skeleton height="28px" width="50px" radius="8px" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════ */
export function EmptyState({ icon:Icon, title, desc, action, onAction }) {
  return (
    <div style={{ background:'white', borderRadius:'20px', padding:'60px 32px',
      textAlign:'center', border:'1px dashed #E2E8F0' }}>
      <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'#F4F4F8',
        display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 20px' }}>
        {Icon && <Icon size={28} strokeWidth={1.5} color="#C0C0C0" />}
      </div>
      <p style={{ fontSize:'17px', fontWeight:800, color:'#0A0A0A', marginBottom:'8px' }}>{title}</p>
      <p style={{ fontSize:'13px', color:'#8E8E93', lineHeight:1.65,
        marginBottom:'24px', maxWidth:'280px', margin:'0 auto 24px' }}>{desc}</p>
      {action && (
        <button onClick={onAction}
          style={{ padding:'10px 24px', borderRadius:'12px',
            background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
            color:'white', fontWeight:700, fontSize:'14px',
            border:'none', cursor:'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVENUE WIDGETS
═══════════════════════════════════════════════════════════ */
export function RevenueWidgets({ orders=[] }) {
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();

  const todayRevenue = orders
    .filter(o => new Date(o.created_at).toDateString() === today && o.payment_status === 'verified')
    .reduce((s, o) => s + (o.total_amount||0), 0);

  const monthRevenue = orders
    .filter(o => new Date(o.created_at).getMonth() === thisMonth && o.payment_status === 'verified')
    .reduce((s, o) => s + (o.total_amount||0), 0);

  const totalRevenue = orders
    .filter(o => o.payment_status === 'verified')
    .reduce((s, o) => s + (o.total_amount||0), 0);

  const avgOrder = orders.length > 0
    ? (totalRevenue / Math.max(orders.filter(o=>o.payment_status==='verified').length, 1))
    : 0;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',
      gap:'10px', marginBottom:'20px' }}>
      {[
        { label:"Today's Revenue",   value:`₹${todayRevenue.toFixed(0)}`,   color:'#16A34A', bg:'#F0FDF4' },
        { label:'Monthly Revenue',   value:`₹${monthRevenue.toFixed(0)}`,   color:'#2563EB', bg:'#EFF6FF' },
        { label:'Total Revenue',     value:`₹${totalRevenue.toFixed(0)}`,   color:'#7C3AED', bg:'#F5F3FF' },
        { label:'Avg Order Value',   value:`₹${avgOrder.toFixed(0)}`,       color:'#D97706', bg:'#FFFBEB' },
      ].map(({ label, value, color, bg }) => (
        <div key={label} style={{ background:'white', borderRadius:'14px',
          padding:'14px 16px', border:'1px solid #F0F0F0',
          boxShadow:'0 1px 6px rgba(0,0,0,.04)' }}>
          <p style={{ fontSize:'11px', fontWeight:600, color:'#8E8E93',
            textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'6px' }}>{label}</p>
          <p style={{ fontSize:'20px', fontWeight:900, color, lineHeight:1 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INVENTORY ALERTS
═══════════════════════════════════════════════════════════ */
export function InventoryAlerts({ products=[] }) {
  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock   = products.filter(p => p.stock > 0 && p.stock <= 5);

  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  return (
    <div style={{ background:'white', borderRadius:'16px', padding:'16px',
      border:'1px solid #FECACA', marginBottom:'16px',
      boxShadow:'0 2px 8px rgba(239,68,68,.08)' }}>
      <p style={{ fontSize:'13px', fontWeight:800, color:'#DC2626',
        marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}>
        <AlertTriangle size={15} /> Inventory Alerts
      </p>
      {outOfStock.length > 0 && (
        <p style={{ fontSize:'12px', color:'#EF4444', marginBottom:'4px' }}>
          🔴 {outOfStock.length} product{outOfStock.length>1?'s':''} out of stock:
          {' '}<strong>{outOfStock.slice(0,2).map(p=>p.name).join(', ')}{outOfStock.length>2?'...':''}</strong>
        </p>
      )}
      {lowStock.length > 0 && (
        <p style={{ fontSize:'12px', color:'#F59E0B' }}>
          🟡 {lowStock.length} product{lowStock.length>1?'s':''} low on stock (≤5 left)
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATE FILTER BAR
═══════════════════════════════════════════════════════════ */
export function DateFilterBar({ active, onChange }) {
  const FILTERS = [
    { key:'all',   label:'All Time' },
    { key:'today', label:'Today' },
    { key:'week',  label:'This Week' },
    { key:'month', label:'This Month' },
  ];
  return (
    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
      {FILTERS.map(f => (
        <button key={f.key} onClick={() => onChange(f.key)}
          style={{ padding:'5px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:600,
            border:`1px solid ${active===f.key?'#1A1A2E':'#E2E8F0'}`,
            background:active===f.key?'#1A1A2E':'white',
            color:active===f.key?'white':'#555',
            cursor:'pointer', transition:'all .15s' }}>
          {f.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT CSV
═══════════════════════════════════════════════════════════ */
export function exportOrdersCSV(orders) {
  const headers = ['Order ID','Customer','Phone','Email','Items','Total','Status','Payment','Date'];
  const rows = orders.map(o => [
    o.id.slice(0,8).toUpperCase(),
    o.shipping_address?.fullName || '',
    o.shipping_address?.phone || '',
    o.shipping_address?.email || '',
    o.items?.map(i=>`${i.name}x${i.quantity}`).join('; ') || '',
    o.total_amount?.toFixed(0) || '0',
    o.status || '',
    o.payment_status || '',
    new Date(o.created_at).toLocaleDateString('en-IN'),
  ]);

  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Orders exported successfully!', 'success');
}

export function exportProductsCSV(products) {
  const headers = ['Name','Category','Sub Category','Price','Original Price','Stock','Status'];
  const rows = products.map(p => [
    p.name, p.category, p.sub_category||'',
    p.price, p.original_price||'', p.stock||'',
    p.active?'Active':'Hidden',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `products_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Products exported successfully!', 'success');
}
