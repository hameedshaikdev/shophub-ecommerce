import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MessageCircle, RefreshCw, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import SEO from '../components/common/SEO';

const SHOP_WA = '917013942909';

const STEPS = [
  { key:'pending_payment',   label:'Order Placed',         emoji:'📋' },
  { key:'payment_submitted', label:'Payment Submitted',    emoji:'💸' },
  { key:'payment_verified',  label:'Payment Verified',     emoji:'✅' },
  { key:'confirmed',         label:'Order Confirmed',      emoji:'🎉' },
  { key:'preparing',         label:'Preparing Order',      emoji:'📦' },
  { key:'shipped',           label:'Shipped',              emoji:'🚚' },
  { key:'delivered',         label:'Delivered',            emoji:'🏠' },
];

const PAYMENT_LABELS = {
  pending:   { label:'Awaiting Payment',      color:'#F59E0B', bg:'#FFFBEB' },
  submitted: { label:'Verifying Payment ⏳',  color:'#3B82F6', bg:'#EFF6FF' },
  verified:  { label:'Payment Verified ✅',   color:'#16A34A', bg:'#F0FDF4' },
  rejected:  { label:'Payment Rejected ❌',   color:'#EF4444', bg:'#FEF2F2' },
};

function stepIndex(status) {
  const i = STEPS.findIndex(s => s.key === status);
  return i === -1 ? 0 : i;
}

function ProgressBar({ status }) {
  const current = stepIndex(status);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {STEPS.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={step.key} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
              width:'28px', flexShrink:0 }}>
              <div style={{
                width:'28px', height:'28px', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'13px', fontWeight:900,
                background: done ? '#16A34A' : active ? '#FC8019' : '#E2E8F0',
                color: (done || active) ? 'white' : '#94A3B8',
                boxShadow: active ? '0 0 0 3px rgba(252,128,25,.2)' : 'none',
              }}>
                {done ? '✓' : step.emoji}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width:'2px', height:'24px', marginTop:'2px',
                  background: done ? '#16A34A' : '#E2E8F0' }} />
              )}
            </div>
            <div style={{ paddingTop:'4px', paddingBottom:'20px' }}>
              <p style={{
                fontSize:'13px',
                fontWeight: active ? 900 : done ? 700 : 500,
                color: done ? '#16A34A' : active ? '#FC8019' : '#94A3B8',
              }}>
                {step.label}
              </p>
              {active && status === 'payment_submitted' && (
                <p style={{ fontSize:'11px', color:'#3B82F6', marginTop:'2px' }}>
                  ⏱ Usually verified in under 2 mins
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onDeleteOrder }) {
  const [expanded, setExpanded] = useState(false);
  const addr = order.shipping_address || {};
  const pCfg = PAYMENT_LABELS[order.payment_status] || PAYMENT_LABELS.pending;
  const isRejected = order.payment_status === 'rejected';

  function waContact() {
    const msg =
      `Hello AS HUB! 👋%0A%0A` +
      `I need help with my order.%0A%0A` +
      `🔖 Order ID: %23${order.id.slice(0,8).toUpperCase()}%0A` +
      `💰 Amount: ₹${order.total_amount?.toFixed(0)}%0A` +
      `📋 Status: ${order.status}%0A%0A` +
      `Please assist me.`;
    window.open(`https://wa.me/${SHOP_WA}?text=${msg}`, '_blank');
  }

  return (
    <div style={{ background:'white', borderRadius:'20px',
      border:'1px solid var(--border)', overflow:'hidden',
      boxShadow:'var(--shadow-sm)', marginBottom:'14px' }}>

      {/* Header */}
      <div style={{ padding:'16px',
        borderBottom: expanded ? '1px solid var(--border)' : 'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'flex-start', marginBottom:'10px' }}>
          <div>
            <p style={{ fontSize:'14px', fontWeight:900, color:'var(--text)' }}>
              #{order.id.slice(0,8).toUpperCase()}
            </p>
            <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px' }}>
              {new Date(order.created_at).toLocaleDateString('en-IN',
                { day:'numeric', month:'short', year:'numeric' })}
            </p>
          </div>
          <p style={{ fontSize:'20px', fontWeight:900, color:'var(--primary)' }}>
            ₹{order.total_amount?.toFixed(0)}
          </p>
        </div>

        {/* Payment status pill */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px',
          padding:'5px 12px', borderRadius:'99px',
          background: pCfg.bg, marginBottom:'10px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%',
            background: pCfg.color,
            animation: order.payment_status === 'submitted'
              ? 'pulse 1.5s infinite' : 'none' }} />
          <p style={{ fontSize:'12px', fontWeight:800, color: pCfg.color }}>
            {pCfg.label}
          </p>
        </div>

        {/* Items */}
        <p style={{ fontSize:'13px', color:'var(--text-2)', marginBottom:'12px' }}>
          {order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}
        </p>

        {/* Rejected info */}
        {isRejected && order.rejection_reason && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA',
            borderRadius:'10px', padding:'10px 12px', marginBottom:'12px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'#DC2626' }}>
              ❌ Reason: {order.rejection_reason}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <button onClick={() => setExpanded(!expanded)}
            style={{ flex:1, minWidth:'120px', padding:'10px', borderRadius:'12px',
              background:'#F8FAFC', color:'var(--text-2)', fontWeight:800,
              fontSize:'13px', border:'1px solid var(--border)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            {expanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
            {expanded ? 'Hide Tracking' : 'Track Order'}
          </button>
          <button onClick={waContact}
            style={{ flex:1, minWidth:'120px', padding:'10px', borderRadius:'12px',
              background:'#F0FDF4', color:'#16A34A', fontWeight:800,
              fontSize:'13px', border:'1px solid #BBF7D0', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <MessageCircle size={15}/> WhatsApp
          </button>
          {onDeleteOrder && (
            <button onClick={() => onDeleteOrder(order.id)}
              title="Cancel & Delete Order"
              style={{ padding:'10px 14px', borderRadius:'12px',
                background:'#FEF2F2', color:'#DC2626', fontWeight:800,
                fontSize:'13px', border:'1px solid #FECACA', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <Trash2 size={15}/> Delete
            </button>
          )}
        </div>
      </div>

      {/* Expanded: tracking + details */}
      {expanded && (
        <div style={{ padding:'16px', display:'flex',
          flexDirection:'column', gap:'16px' }}>

          {/* Progress tracker */}
          <div>
            <p style={{ fontSize:'13px', fontWeight:900, color:'var(--text)',
              marginBottom:'16px' }}>📍 Order Tracking</p>
            <ProgressBar status={order.status} />
          </div>

          {/* Delivery address */}
          <div style={{ background:'#F8FAFC', borderRadius:'14px', padding:'14px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'var(--text-3)',
              textTransform:'uppercase', letterSpacing:'.4px', marginBottom:'8px' }}>
              Delivery Address
            </p>
            <p style={{ fontSize:'14px', fontWeight:800, color:'var(--text)',
              marginBottom:'4px' }}>
              {addr.fullName} · +91 {addr.phone}
            </p>
            <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.6 }}>
              {addr.houseNo}, {addr.streetArea}<br/>
              Near {addr.landmark}<br/>
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
          </div>

          {/* Items breakdown */}
          <div style={{ background:'#F8FAFC', borderRadius:'14px', padding:'14px' }}>
            <p style={{ fontSize:'12px', fontWeight:700, color:'var(--text-3)',
              textTransform:'uppercase', letterSpacing:'.4px', marginBottom:'8px' }}>
              Items Ordered
            </p>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', padding:'8px 0',
                borderBottom: i < order.items.length - 1
                  ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <img src={item.image_url || 'https://placehold.co/40x40?text=?'}
                    alt={item.name} style={{ width:'40px', height:'40px',
                      borderRadius:'8px', objectFit:'cover' }} />
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize:'12px', color:'var(--text-3)' }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize:'13px', fontWeight:800 }}>
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between',
              marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border)',
              fontWeight:900, fontSize:'15px' }}>
              <span>Total Paid</span>
              <span style={{ color:'var(--primary)' }}>
                ₹{order.total_amount?.toFixed(0)}
              </span>
            </div>
          </div>

          {isRejected && (
            <a href="/checkout"
              style={{ display:'block', textAlign:'center', padding:'13px',
                borderRadius:'14px', background:'var(--primary-grad)',
                color:'white', fontWeight:900, fontSize:'15px',
                textDecoration:'none' }}>
              🔄 Retry Payment
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const navigate  = useNavigate();
  const { user, loading: authLoading } = useApp();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [user, authLoading]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel('customer-orders')
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'orders',
        filter:`user_id=eq.${user.id}` },
        payload => {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
        })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleDeleteOrder(orderId) {
    if (!window.confirm('Are you sure you want to delete/cancel this order?')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      alert('Failed to delete order: ' + err.message);
    }
  }

  const FILTERS = [
    { key:'all',      label:'All' },
    { key:'active',   label:'Active' },
    { key:'delivered',label:'Delivered' },
  ];

  const filtered = orders.filter(o => {
    if (filter === 'all')       return true;
    if (filter === 'delivered') return o.status === 'delivered';
    if (filter === 'active')    return !['delivered','cancelled','payment_rejected'].includes(o.status);
    return true;
  });

  if (authLoading) return null;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'80px' }}>
      <SEO title="My Orders | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/orders" />
      <div className="container-center" style={{ padding:'20px 16px', maxWidth:'680px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:'20px' }}>
          <div>
            <h1 style={{ fontSize:'24px', fontWeight:900, color:'var(--text)' }}>
              My Orders
            </h1>
            <p style={{ fontSize:'13px', color:'var(--text-3)', marginTop:'2px' }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button onClick={fetchOrders}
            style={{ padding:'10px', borderRadius:'12px', background:'white',
              border:'1px solid var(--border)', cursor:'pointer', display:'flex',
              boxShadow:'var(--shadow-xs)' }}>
            <RefreshCw size={18} color="var(--text-2)" />
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'8px 18px', borderRadius:'99px',
                fontWeight:800, fontSize:'13px', border:'none', cursor:'pointer',
                background: filter === f.key ? 'var(--primary)' : 'white',
                color:      filter === f.key ? 'white' : 'var(--text-2)',
                boxShadow:  filter === f.key
                  ? '0 4px 14px rgba(252,128,25,.35)' : 'var(--shadow-xs)' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'36px', height:'36px', border:'3px solid #E2E8F0',
              borderTop:'3px solid var(--primary)', borderRadius:'50%',
              animation:'spin .8s linear infinite' }} />
            <p style={{ color:'var(--text-2)', fontWeight:600 }}>Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'white',
            borderRadius:'20px', border:'1px solid var(--border)' }}>
            <Package size={56} style={{ color:'#E2E8F0', margin:'0 auto 16px' }} />
            <h3 style={{ fontSize:'18px', fontWeight:900, color:'var(--text)',
              marginBottom:'8px' }}>
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p style={{ fontSize:'14px', color:'var(--text-3)', marginBottom:'20px' }}>
              {filter === 'all' ? 'Start shopping to place your first order!' : ''}
            </p>
            {filter === 'all' && (
              <button onClick={() => navigate('/')}
                style={{ padding:'12px 24px', borderRadius:'14px',
                  background:'var(--primary-grad)', color:'white',
                  fontWeight:900, border:'none', cursor:'pointer' }}>
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          filtered.map(order => <OrderCard key={order.id} order={order} onDeleteOrder={handleDeleteOrder} />)
        )}
      </div>
      <style>{`
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>
    </div>
  );
}
