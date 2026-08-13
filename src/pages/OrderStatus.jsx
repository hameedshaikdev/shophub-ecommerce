import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, MessageCircle, Phone, CheckCircle,
         Clock, XCircle, Package, Truck, Home } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useApp } from '../context/AppContext';

const SHOP_WA = '917013942909';

/* ── Status config ─────────────────────────────────────────── */
const STATUS_STEPS = [
  { key:'pending_payment',    label:'Order Placed',          icon:'📋' },
  { key:'payment_submitted',  label:'Payment Submitted',     icon:'💸' },
  { key:'payment_verified',   label:'Payment Verified',      icon:'✅' },
  { key:'confirmed',          label:'Order Confirmed',       icon:'🎉' },
  { key:'preparing',          label:'Preparing Order',       icon:'📦' },
  { key:'shipped',            label:'Shipped',               icon:'🚚' },
  { key:'delivered',          label:'Delivered',             icon:'🏠' },
];

const PAYMENT_STATUS_CONFIG = {
  pending: {
    color:'#F59E0B', bg:'#FFFBEB', border:'#FDE68A',
    label:'Awaiting Payment', icon:'⏳',
  },
  submitted: {
    color:'#3B82F6', bg:'#EFF6FF', border:'#BFDBFE',
    label:'Payment Submitted — Verification in Progress', icon:'🔍',
  },
  verified: {
    color:'#16A34A', bg:'#F0FDF4', border:'#BBF7D0',
    label:'Payment Verified ✅', icon:'✅',
  },
  rejected: {
    color:'#EF4444', bg:'#FEF2F2', border:'#FECACA',
    label:'Payment Rejected', icon:'❌',
  },
};

function stepIndex(status) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
}

/* ── Progress Tracker component ────────────────────────────── */
function ProgressTracker({ status }) {
  const current = stepIndex(status);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
      {STATUS_STEPS.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const pending = i > current;
        return (
          <div key={step.key} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
            {/* Left: dot + line */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'32px', flexShrink:0 }}>
              <div style={{
                width:'32px', height:'32px', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'14px', fontWeight:900, flexShrink:0,
                background: done   ? '#16A34A'
                          : active ? '#0F172A'
                          : '#E2E8F0',
                color: (done || active) ? 'white' : '#94A3B8',
                boxShadow: active ? '0 0 0 4px rgba(15,23,42,.2)' : 'none',
                transition:'all .4s',
              }}>
                {done ? <CheckCircle size={16} /> : step.icon}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{
                  width:'2px', height:'32px',
                  background: done ? '#16A34A' : '#E2E8F0',
                  transition:'background .4s',
                }} />
              )}
            </div>
            {/* Right: label */}
            <div style={{ paddingTop:'6px', paddingBottom:'24px' }}>
              <p style={{
                fontSize:'14px', fontWeight: active ? 900 : done ? 700 : 600,
                color: done ? '#16A34A' : active ? '#0F172A' : '#94A3B8',
              }}>
                {step.label}
              </p>
              {active && status === 'payment_submitted' && (
                <p style={{ fontSize:'12px', color:'#3B82F6', marginTop:'2px', fontWeight:600 }}>
                  ⏱ Usually verified in under 2 minutes
                </p>
              )}
              {active && status === 'payment_rejected' && (
                <p style={{ fontSize:'12px', color:'#EF4444', marginTop:'2px', fontWeight:600 }}>
                  Contact us to resolve this
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function OrderStatus() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useApp();
  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('orders').select('*').eq('id', id).single();
      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Auto-refresh every 30 seconds when payment is submitted
  useEffect(() => {
    if (!order) return;
    if (order.payment_status !== 'submitted') return;
    const t = setInterval(() => fetchOrder(true), 30000);
    return () => clearInterval(t);
  }, [order, fetchOrder]);

  // Realtime subscription — updates instantly when admin confirms
  useEffect(() => {
    const channel = supabase
      .channel(`order-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'orders', filter: `id=eq.${id}`,
      }, payload => {
        setOrder(payload.new);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
        justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column',
          alignItems:'center', gap:'16px' }}>
          <div style={{ width:'40px', height:'40px', border:'3px solid #E2E8F0',
            borderTop:'3px solid #FC8019', borderRadius:'50%',
            animation:'spin .8s linear infinite' }} />
          <p style={{ color:'var(--text-2)', fontWeight:600 }}>Loading order...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
        justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:'48px', marginBottom:'12px' }}>🔍</p>
          <h2 style={{ fontSize:'20px', fontWeight:900, marginBottom:'8px' }}>Order not found</h2>
          <button onClick={() => navigate('/')}
            style={{ padding:'12px 24px', borderRadius:'12px',
              background:'var(--primary-grad)', color:'white',
              fontWeight:800, border:'none', cursor:'pointer' }}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const pCfg = PAYMENT_STATUS_CONFIG[order.payment_status] || PAYMENT_STATUS_CONFIG.pending;
  const addr = order.shipping_address || {};
  const isRejected = order.payment_status === 'rejected';
  const isVerified = order.payment_status === 'verified';

  const waContact = () => {
    const msg =
      `Hello Asmalabel,%0A%0A` +
      `My payment has not been verified after 10 minutes.%0A%0A` +
      `Order ID: %23${order.id.slice(0,8).toUpperCase()}%0A` +
      `Customer: ${addr.fullName || ''}%0A` +
      `Amount: Rs.${order.total_amount?.toFixed(0)}%0A%0A` +
      `Please verify my payment.`;
    window.open(`https://wa.me/${SHOP_WA}?text=${msg}`, '_blank');
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'100px' }}>

      {/* Header */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)',
        position:'sticky', top:0, zIndex:50 }}>
        <div className="container-center"
          style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px' }}>
          <button onClick={() => navigate('/orders')}
            style={{ padding:'8px', borderRadius:'12px', background:'var(--secondary)',
              border:'none', cursor:'pointer', display:'flex' }}>
            <Home size={20} color="var(--text-2)" />
          </button>
          <div>
            <h1 style={{ fontSize:'17px', fontWeight:900, color:'var(--text)' }}>Order Status</h1>
            <p style={{ fontSize:'12px', color:'var(--text-3)' }}>
              #{order.id.slice(0,8).toUpperCase()}
            </p>
          </div>
          <button onClick={() => fetchOrder(true)} disabled={refreshing}
            style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px',
              padding:'8px 14px', borderRadius:'12px', background:'var(--secondary)',
              border:'none', cursor:'pointer', fontSize:'13px', fontWeight:700,
              color:'var(--text-2)' }}>
            <RefreshCw size={15}
              style={{ animation: refreshing ? 'spin .8s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="container-center" style={{ padding:'16px', maxWidth:'600px',
        display:'flex', flexDirection:'column', gap:'16px' }}>

        {/* Payment status banner */}
        <div style={{ borderRadius:'20px', padding:'20px',
          background: pCfg.bg, border:`1.5px solid ${pCfg.border}`,
          boxShadow:'var(--shadow-sm)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
            <span style={{ fontSize:'28px' }}>{pCfg.icon}</span>
            <div>
              <p style={{ fontSize:'15px', fontWeight:900, color: pCfg.color }}>
                {pCfg.label}
              </p>
              <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px' }}>
                {new Date(order.created_at).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[
              { l:'Order ID',  v:`#${order.id.slice(0,8).toUpperCase()}` },
              { l:'Amount',    v:`₹${order.total_amount?.toFixed(0)}` },
              { l:'Est. Verification', v:'Under 2 mins' },
              { l:'Items',     v:`${order.items?.length || 0} product(s)` },
            ].map(({ l, v }) => (
              <div key={l} style={{ background:'rgba(255,255,255,.7)',
                borderRadius:'12px', padding:'10px 12px' }}>
                <p style={{ fontSize:'10px', fontWeight:700, color:'var(--text-3)',
                  textTransform:'uppercase', letterSpacing:'.4px', marginBottom:'2px' }}>
                  {l}
                </p>
                <p style={{ fontSize:'14px', fontWeight:800, color:'var(--text)' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Verification in progress message */}
          {order.payment_status === 'submitted' && (
            <div style={{ marginTop:'14px', background:'rgba(59,130,246,.08)',
              borderRadius:'12px', padding:'12px', display:'flex',
              alignItems:'flex-start', gap:'10px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%',
                background:'#3B82F6', marginTop:'5px', flexShrink:0,
                animation:'pulse 1.5s ease-in-out infinite' }} />
              <div>
                <p style={{ fontSize:'13px', fontWeight:800, color:'#1D4ED8',
                  marginBottom:'2px' }}>
                  Payment Verification in Progress
                </p>
                <p style={{ fontSize:'12px', color:'#3B82F6', lineHeight:1.5 }}>
                  Thank you for your payment. We are securely verifying your payment.
                  Verification usually takes less than 2 minutes and may take up to
                  10 minutes during busy hours.
                </p>
              </div>
            </div>
          )}

          {/* Rejected message */}
          {isRejected && (
            <div style={{ marginTop:'14px', background:'rgba(239,68,68,.08)',
              borderRadius:'12px', padding:'12px' }}>
              <p style={{ fontSize:'13px', fontWeight:800, color:'#DC2626',
                marginBottom:'4px' }}>
                We could not verify your payment
              </p>
              {order.rejection_reason && (
                <p style={{ fontSize:'12px', color:'#EF4444' }}>
                  Reason: {order.rejection_reason}
                </p>
              )}
              <p style={{ fontSize:'12px', color:'#B91C1C', marginTop:'4px' }}>
                Please contact us or retry payment.
              </p>
            </div>
          )}

          {/* Verified success message */}
          {isVerified && (
            <div style={{ marginTop:'14px', background:'rgba(22,163,74,.08)',
              borderRadius:'12px', padding:'12px', textAlign:'center' }}>
              <p style={{ fontSize:'16px', fontWeight:900, color:'#15803D' }}>
                🎉 Payment Verified Successfully!
              </p>
              <p style={{ fontSize:'13px', color:'#16A34A', marginTop:'4px' }}>
                Your order has been confirmed. Thank you for shopping with Asmalabel!
              </p>
            </div>
          )}
        </div>

        {/* Order Progress Tracker */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px',
          boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)',
            marginBottom:'20px' }}>Order Progress</h3>
          <ProgressTracker status={order.status} />
        </div>

        {/* Order details */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px',
          boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)',
            marginBottom:'14px' }}>Order Details</h3>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', padding:'8px 0',
              borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <img src={item.image_url || 'https://placehold.co/40x40?text=?'}
                  alt={item.name}
                  style={{ width:'40px', height:'40px', borderRadius:'8px', objectFit:'cover' }} />
                <div>
                  <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize:'12px', color:'var(--text-3)' }}>
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p style={{ fontSize:'13px', fontWeight:800, color:'var(--text)' }}>
                ₹{(item.price * item.quantity).toFixed(0)}
              </p>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between',
            marginTop:'12px', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
            <span style={{ fontWeight:900, fontSize:'15px' }}>Total</span>
            <span style={{ fontWeight:900, fontSize:'18px', color:'var(--primary)' }}>
              ₹{order.total_amount?.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Delivery address */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px',
          boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)',
            marginBottom:'12px' }}>Delivery Address</h3>
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

        {/* Action buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <button onClick={waContact}
            style={{ width:'100%', padding:'15px', borderRadius:'16px',
              background:'#25D366', color:'white', fontWeight:900, fontSize:'15px',
              border:'none', cursor:'pointer', display:'flex', alignItems:'center',
              justifyContent:'center', gap:'10px',
              boxShadow:'0 6px 20px rgba(37,211,102,.35)' }}>
            <MessageCircle size={20} />
            Contact Asmalabel on WhatsApp
          </button>

          <a href="tel:+917013942909"
            style={{ width:'100%', padding:'15px', borderRadius:'16px',
              background:'white', color:'var(--text)', fontWeight:800, fontSize:'15px',
              border:'1.5px solid var(--border)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              gap:'10px', textDecoration:'none', boxShadow:'var(--shadow-sm)' }}>
            <Phone size={20} color="#3B82F6" />
            Call Asmalabel
          </a>

          {isRejected && (
            <button onClick={() => navigate('/checkout')}
              style={{ width:'100%', padding:'15px', borderRadius:'16px',
                background:'var(--primary-grad)', color:'white', fontWeight:900,
                fontSize:'15px', border:'none', cursor:'pointer',
                boxShadow:'0 6px 20px rgba(252,128,25,.3)' }}>
              🔄 Retry Payment
            </button>
          )}
        </div>

      </div>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>
    </div>
  );
}
