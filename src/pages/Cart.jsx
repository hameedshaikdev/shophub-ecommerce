import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProductImage } from '../utils/productImages';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, user } = useApp();

  const handleCheckout = () => {
    if (!user) navigate('/login?redirect=/checkout');
    else navigate('/checkout');
  };

  const safeCart = (cart || []).filter(Boolean);

  const savings = safeCart.reduce((acc, item) => {
    const p = Number(item?.price || 0);
    const op = Number(item?.original_price || 0);
    const q = Number(item?.quantity || 1);
    if (op > p) return acc + (op - p) * q;
    return acc;
  }, 0);

  const cartTotal = Number(getCartTotal() || 0);

  if (safeCart.length === 0) {
    return (
      <div style={{ minHeight:'75vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 20px', background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)' }}>
        <div style={{ width:'100px', height:'100px', borderRadius:'32px', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', boxShadow:'0 20px 48px -8px rgba(15,23,42,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', border:'1px solid rgba(255,255,255,0.9)' }}>
          <ShoppingCart size={44} color="#E94560" />
        </div>
        <h2 style={{ fontSize:'26px', fontWeight:900, color:'#0F172A', marginBottom:'8px', letterSpacing:'-0.5px' }}>Your cart is empty</h2>
        <p style={{ color:'#64748B', marginBottom:'32px', fontSize:'15px', fontWeight:500 }}>Looks like you haven't added any items yet.</p>
        <button className="sh-btn" onClick={() => navigate('/')}>
          Explore Collection <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)', minHeight:'100vh', padding:'40px 0 64px' }}>
      <div className="sh-container">

        {/* Header */}
        <div style={{ marginBottom:'32px' }}>
          <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1.5px', color:'#E94560', background:'rgba(233,69,96,0.1)', padding:'4px 12px', borderRadius:'9999px' }}>
            Shopping Bag
          </span>
          <h1 style={{ fontSize:'32px', fontWeight:900, color:'#0F172A', letterSpacing:'-.8px', marginTop:'8px' }}>
            Review Your Order
          </h1>
          <p style={{ color:'#64748B', marginTop:'4px', fontSize:'14px', fontWeight:600 }}>{safeCart.length} item{safeCart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'24px' }}>
          <div style={{ display:'grid', gap:'28px', gridTemplateColumns: 'minmax(0,1fr)' }} id="cart-layout">

            {/* Cart Items List */}
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {safeCart.map(item => {
                const itemPrice = Number(item?.price || 0);
                const itemOrigPrice = Number(item?.original_price || 0);
                const itemQty = Number(item?.quantity || 1);

                return (
                  <div key={item.id || Math.random()} className="cart-item-row" style={{ background:'rgba(255, 255, 255, 0.82)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderRadius:'20px', padding:'14px', display:'flex', gap:'12px', boxShadow:'0 10px 32px rgba(15,23,42,0.06)', border:'1px solid rgba(255, 255, 255, 0.9)', alignItems:'flex-start', position:'relative', boxSizing:'border-box', width:'100%' }}>
                    {/* Image */}
                    <div className="cart-item-img" style={{ width:'80px', height:'80px', borderRadius:'16px', overflow:'hidden', background:'rgba(241,245,249,0.8)', flexShrink:0, boxShadow:'0 4px 14px rgba(0,0,0,0.06)' }}>
                      <img src={getProductImage(item)} alt={item.name || 'Item'}
                        style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'20px' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
                      <p style={{ fontWeight:800, fontSize:'14px', color:'#0F172A', marginBottom:'4px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', letterSpacing:'-0.2px', lineHeight:1.3 }}>{item.name}</p>
                      {item.unit && <p style={{ fontSize:'12px', color:'#64748B', marginBottom:'8px', fontWeight:500 }}>{item.unit}</p>}
                      <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                        <span style={{ fontWeight:900, fontSize:'18px', color:'#0F172A' }}>₹{itemPrice.toFixed(0)}</span>
                        {itemOrigPrice > itemPrice && (
                          <span style={{ fontSize:'13px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500 }}>₹{itemOrigPrice.toFixed(0)}</span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px', flexShrink:0, minWidth:0 }}>
                      <button onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                        style={{ padding:'8px', borderRadius:'9999px', background:'rgba(239,68,68,0.1)', color:'#EF4444', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
                        <Trash2 size={16} />
                      </button>

                      <div style={{ display:'flex', alignItems:'center', background:'rgba(241,245,249,0.8)', borderRadius:'9999px', border:'1px solid rgba(226,232,240,0.8)', padding:'4px 8px' }}>
                        <button onClick={() => updateCartQuantity(item.id, itemQty - 1)}
                          style={{ padding:'4px 8px', background:'none', border:'none', cursor:'pointer', color:'#0F172A', display:'flex', alignItems:'center' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ padding:'0 6px', fontWeight:900, fontSize:'14px', color:'#0F172A', minWidth:'24px', textAlign:'center' }}>{itemQty}</span>
                        <button onClick={() => updateCartQuantity(item.id, itemQty + 1)}
                          style={{ padding:'4px 8px', background:'none', border:'none', cursor:'pointer', color:'#0F172A', display:'flex', alignItems:'center' }}>
                          <Plus size={14} />
                        </button>
                      </div>

                      <span style={{ fontSize:'14px', fontWeight:900, color:'#0F172A' }}>
                        ₹{(itemPrice * itemQty).toFixed(0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Glass Card */}
            <div className="cart-summary-card" style={{ background:'rgba(255, 255, 255, 0.85)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', borderRadius:'28px', padding:'24px', boxShadow:'0 20px 48px -8px rgba(15,23,42,0.12), 0 0 24px rgba(233,69,96,0.15)', border:'1px solid rgba(255, 255, 255, 0.95)', height:'fit-content' }}>
              <h2 style={{ fontWeight:900, fontSize:'20px', color:'#0F172A', marginBottom:'20px', letterSpacing:'-0.4px' }}>Order Summary</h2>

              {savings > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(48,209,88,0.12)', border:'1px solid rgba(48,209,88,0.3)', borderRadius:'9999px', padding:'10px 16px', marginBottom:'20px' }}>
                  <Tag size={16} color="#16A34A" />
                  <span style={{ fontSize:'13px', fontWeight:800, color:'#166534' }}>You save ₹{savings.toFixed(0)} on this order!</span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
                {[
                  ['Subtotal', `₹${cartTotal.toFixed(0)}`],
                  ['Express Delivery', 'FREE', '#30D158'],
                  ...(savings > 0 ? [['Discount Savings', `-₹${savings.toFixed(0)}`, '#30D158']] : []),
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'14px', color:'#64748B', fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:'14px', fontWeight:800, color: color || '#0F172A' }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid rgba(226,232,240,0.8)', paddingTop:'14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:800, fontSize:'16px', color:'#0F172A' }}>Total Payable</span>
                  <span style={{ fontWeight:900, fontSize:'24px', color:'#0F172A', letterSpacing:'-0.5px' }}>₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>

              <button className="sh-btn" style={{ width:'100%', justifyContent:'center', height:'52px' }} onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button onClick={() => navigate('/')}
                style={{ width:'100%', marginTop:'12px', padding:'13px', borderRadius:'9999px', border:'1px solid rgba(226,232,240,0.8)', background:'rgba(255,255,255,0.8)', fontWeight:800, fontSize:'14px', color:'#475569', cursor:'pointer' }}>
                Continue Shopping
              </button>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginTop:'20px', fontSize:'12px', color:'#64748B', fontWeight:600 }}>
                <ShieldCheck size={16} color="#30D158" /> Guaranteed 100% Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:768px) {
          #cart-layout {
            grid-template-columns: minmax(0,1.6fr) 380px !important;
          }
        }
        @media(max-width:640px) {
          .cart-item-row {
            border-radius: 16px !important;
            padding: 12px !important;
            gap: 10px !important;
          }
          .cart-item-img {
            width: 68px !important;
            height: 68px !important;
            border-radius: 12px !important;
            flex-shrink: 0 !important;
          }
          .cart-summary-card {
            padding: 16px !important;
            border-radius: 20px !important;
          }
        }
        @media(max-width:360px) {
          .cart-item-img {
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>
    </div>
  );
}
