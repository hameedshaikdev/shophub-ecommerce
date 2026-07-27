import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, user } = useApp();

  const handleCheckout = () => {
    if (!user) navigate('/login?redirect=/checkout');
    else navigate('/checkout');
  };

  const savings = cart.reduce((acc, item) => {
    if (item.original_price && item.original_price > item.price)
      return acc + (item.original_price - item.price) * item.quantity;
    return acc;
  }, 0);

  if (cart.length === 0) {
    return (
      <div style={{ minHeight:'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 20px', background:'var(--bg)' }}>
        <div style={{ width:'96px', height:'96px', borderRadius:'28px', background:'white', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
          <ShoppingCart size={40} color="var(--text-3)" />
        </div>
        <h2 style={{ fontSize:'24px', fontWeight:800, color:'var(--text)', marginBottom:'8px' }}>Your cart is empty</h2>
        <p style={{ color:'var(--text-2)', marginBottom:'32px', fontSize:'15px' }}>Looks like you haven't added anything yet.</p>
        <button className="sh-btn" onClick={() => navigate('/')}>
          Start Shopping <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', padding:'40px 0 64px' }}>
      <div className="sh-container">

        {/* Header */}
        <div style={{ marginBottom:'32px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:900, color:'var(--text)', letterSpacing:'-.5px' }}>
            My Cart
          </h1>
          <p style={{ color:'var(--text-2)', marginTop:'4px', fontSize:'14px' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'24px' }}>
          <div style={{ display:'grid', gap:'24px', gridTemplateColumns: 'minmax(0,1fr)' }} id="cart-layout">

            {/* Cart Items */}
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ background:'white', borderRadius:'20px', padding:'16px', display:'flex', gap:'16px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', alignItems:'center' }}>
                  {/* Image */}
                  <div style={{ width:'80px', height:'80px', borderRadius:'14px', overflow:'hidden', background:'#f8f9fa', flexShrink:0 }}>
                    <img src={item.image_url || 'https://placehold.co/80x80?text=?'} alt={item.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
                    {item.unit && <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'8px' }}>{item.unit}</p>}
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ fontWeight:800, fontSize:'16px', color:'var(--text)' }}>₹{item.price.toFixed(0)}</span>
                      {item.original_price > item.price && (
                        <span style={{ fontSize:'12px', color:'var(--text-3)', textDecoration:'line-through' }}>₹{item.original_price.toFixed(0)}</span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px', flexShrink:0 }}>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ padding:'6px', borderRadius:'8px', background:'rgba(239,68,68,.08)', color:'var(--danger)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Trash2 size={15} />
                    </button>

                    <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' }}>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center' }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ padding:'0 8px', fontWeight:800, fontSize:'14px', color:'var(--text)', minWidth:'28px', textAlign:'center' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center' }}>
                        <Plus size={13} />
                      </button>
                    </div>

                    <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text-2)' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ background:'white', borderRadius:'24px', padding:'28px', boxShadow:'var(--shadow)', border:'1px solid var(--border)', height:'fit-content' }}>
              <h2 style={{ fontWeight:800, fontSize:'18px', color:'var(--text)', marginBottom:'20px' }}>Order Summary</h2>

              {savings > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(31,166,114,.08)', border:'1px solid rgba(31,166,114,.2)', borderRadius:'12px', padding:'10px 14px', marginBottom:'16px' }}>
                  <Tag size={15} color="var(--success)" />
                  <span style={{ fontSize:'13px', fontWeight:700, color:'var(--success)' }}>You save ₹{savings.toFixed(0)} on this order!</span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px' }}>
                {[
                  ['Subtotal', `₹${getCartTotal().toFixed(0)}`],
                  ['Delivery', 'FREE', 'var(--success)'],
                  ...(savings > 0 ? [['Discount', `-₹${savings.toFixed(0)}`, 'var(--success)']] : []),
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'14px', color:'var(--text-2)', fontWeight:500 }}>{label}</span>
                    <span style={{ fontSize:'14px', fontWeight:700, color: color || 'var(--text)' }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop:'1.5px solid var(--border)', paddingTop:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:800, fontSize:'16px', color:'var(--text)' }}>Total</span>
                  <span style={{ fontWeight:900, fontSize:'22px', color:'var(--text)' }}>₹{getCartTotal().toFixed(0)}</span>
                </div>
              </div>

              <button className="sh-btn" style={{ width:'100%', justifyContent:'center' }} onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <button onClick={() => navigate('/')}
                style={{ width:'100%', marginTop:'10px', padding:'12px', borderRadius:'14px', border:'1.5px solid var(--border)', background:'transparent', fontWeight:600, fontSize:'14px', color:'var(--text-2)', cursor:'pointer' }}>
                Continue Shopping
              </button>
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
      `}</style>
    </div>
  );
}
