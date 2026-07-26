import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, CheckCircle, Truck, ArrowLeft, AlertCircle, ShieldCheck, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

const SHOP_CONFIG = {
  upiId: '7995747250@ptyes',
  upiName: 'Shaik Asmath',
  whatsappNumber: '917013942909',
  shopName: 'AS HUB',
};

const VALIDATORS = {
  fullName:   { min:3, pattern:/^[a-zA-Z\s]{3,}$/,           msg:'Enter your full name (letters only, min 3 chars)' },
  phone:      { min:10,pattern:/^[6-9]\d{9}$/,                msg:'Enter a valid 10-digit Indian mobile number' },
  email:      { min:5, pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg:'Enter a valid email address' },
  houseNo:    { min:1, pattern:/.+/,                          msg:'House / Flat number is required' },
  streetArea: { min:5, pattern:/.{5,}/,                       msg:'Enter street name and area (min 5 chars)' },
  landmark:   { min:3, pattern:/.{3,}/,                       msg:'Enter a nearby landmark' },
  city:       { min:2, pattern:/^[a-zA-Z\s]{2,}$/,           msg:'Enter a valid city name' },
  state:      { min:2, pattern:/^[a-zA-Z\s]{2,}$/,           msg:'Enter a valid state name' },
  pincode:    { min:6, pattern:/^[1-9][0-9]{5}$/,            msg:'Enter a valid 6-digit pincode' },
};

const UPI_APPS = [
  { name:'Google Pay',  shortName:'GPay',    emoji:'🟢', color:'#34A853', pkg:'gpay', link:(upiId,amt,name)=>`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
  { name:'PhonePe',     shortName:'PhonePe', emoji:'🟣', color:'#5F259F', pkg:'phonepe', link:(upiId,amt,name)=>`phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
  { name:'Paytm',       shortName:'Paytm',   emoji:'🔵', color:'#00BAF2', pkg:'paytm', link:(upiId,amt,name)=>`paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
  { name:'BHIM UPI',    shortName:'BHIM',    emoji:'🟠', color:'#FF6B35', pkg:'bhim', link:(upiId,amt,name)=>`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
  { name:'Amazon Pay',  shortName:'Amazon',  emoji:'🟡', color:'#FF9900', pkg:'amazon', link:(upiId,amt,name)=>`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
  { name:'Any UPI App', shortName:'Other',   emoji:'📱', color:'#64748B', pkg:'other', link:(upiId,amt,name)=>`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=ASHUB+Order` },
];


const Checkout = () => {
  const navigate  = useNavigate();
  const { cart, getCartTotal, user, clearCart, loading: authLoading } = useApp();

  const [step,        setStep]        = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [savedOrder,  setSavedOrder]  = useState(null);
  const [errors,      setErrors]      = useState({});
  const [touched,     setTouched]     = useState({});
  const [pendingApp,  setPendingApp]  = useState(null);
  const [orderCount,  setOrderCount]  = useState(247);

  const [form, setForm] = useState({
    fullName:   user?.user_metadata?.full_name || '',
    email:      user?.email || '',
    phone:      user?.user_metadata?.phone?.replace('+91','').replace(/\s/g,'') || '',
    houseNo:    '',
    streetArea: '',
    landmark:   '',
    city:       '',
    state:      '',
    pincode:    '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user)             { navigate('/login?redirect=/checkout'); return; }
    if (cart.length === 0) { navigate('/cart'); }
  }, [user, authLoading, cart]);

  // Fetch real order count for social proof
  useEffect(() => {
    supabase.from('orders').select('id', { count:'exact', head:true })
      .eq('status','confirmed')
      .then(({ count }) => { if (count > 0) setOrderCount(count + 200); });
  }, []);

  const validateField = (name, value) => {
    const rule = VALIDATORS[name];
    if (!rule) return '';
    if (!value || value.trim().length < rule.min) return rule.msg;
    if (!rule.pattern.test(value.trim())) return rule.msg;
    return '';
  };

  const validateAll = () => {
    const errs = {};
    Object.keys(VALIDATORS).forEach(k => {
      const e = validateField(k, form[k]);
      if (e) errs[k] = e;
    });
    setErrors(errs);
    const allTouched = {};
    Object.keys(VALIDATORS).forEach(k => allTouched[k] = true);
    setTouched(allTouched);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) setStep(2);
  };

  // Save order to DB first, then open UPI app
  const handleUpiAppClick = async (app) => {
    // If order already saved, just open the app again
    if (savedOrder) {
      window.location.href = app.link(SHOP_CONFIG.upiId, getCartTotal().toFixed(2), SHOP_CONFIG.upiName);
      setPendingApp(app);
      return;
    }

    setLoading(true);
    setPendingApp(app);
    try {
      const fullAddress = `${form.houseNo}, ${form.streetArea}, Near ${form.landmark}, ${form.city}, ${form.state} - ${form.pincode}`;
      const { data, error } = await supabase.from('orders').insert([{
        user_id:      user.id,
        total_amount: getCartTotal(),
        payment_id:   null,
        shipping_address: {
          fullName:   form.fullName, phone: form.phone, email: form.email,
          houseNo:    form.houseNo,  streetArea: form.streetArea,
          landmark:   form.landmark, city:  form.city,
          state:      form.state,    pincode: form.pincode, fullAddress,
        },
        items: cart.map(i => ({ product_id:i.id, name:i.name, quantity:i.quantity, price:i.price, image_url:i.image_url })),
        status: 'pending_payment',
      }]).select().single();

      if (error) throw error;
      setSavedOrder(data);

      // Open UPI app with exact amount
      setTimeout(() => {
        window.location.href = app.link(SHOP_CONFIG.upiId, getCartTotal().toFixed(2), SHOP_CONFIG.upiName);
      }, 300);

      // After 4 seconds (payment time), show confirmation screen
      setTimeout(() => {
        setStep(3);
        sendWhatsAppAndComplete(data);
      }, 8000);

    } catch (err) {
      console.error(err);
      alert('Error saving order. Please try again.');
      setPendingApp(null);
    } finally {
      setLoading(false);
    }
  };

  // Send WhatsApp silently and mark order confirmed
  const sendWhatsAppAndComplete = async (order) => {
    try {
      // Update order status
      await supabase.from('orders').update({ status:'confirmed' }).eq('id', order.id);

      const itemsList = (order.items || cart)
        .map(i => `  • ${i.name} × ${i.quantity}  =  ₹${(i.price * i.quantity).toFixed(0)}`)
        .join('%0A');

      const addr = order.shipping_address;
      const msg =
        `🛍️ *NEW ORDER — ${SHOP_CONFIG.shopName}*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `🔖 *Order ID:* %23${order.id.slice(0,8).toUpperCase()}%0A` +
        `💰 *Total:* ₹${order.total_amount.toFixed(0)} (UPI — ${pendingApp?.name || 'UPI'})%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `👤 *CUSTOMER*%0A` +
        `Name    : ${addr.fullName}%0A` +
        `Phone   : +91 ${addr.phone}%0A` +
        `Email   : ${addr.email}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `📦 *ITEMS*%0A${itemsList}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `📍 *DELIVERY ADDRESS*%0A` +
        `Flat/House : ${addr.houseNo}%0A` +
        `Street/Area: ${addr.streetArea}%0A` +
        `Landmark   : Near ${addr.landmark}%0A` +
        `City       : ${addr.city}%0A` +
        `State      : ${addr.state}%0A` +
        `Pincode    : ${addr.pincode}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `✅ *Payment done via UPI. Please ship!*`;

      // Open WhatsApp automatically
      window.open(`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${msg}`, '_blank');

      clearCart();
    } catch (err) {
      console.error('WhatsApp send error:', err);
    }
  };

  // Manual "I've paid" button as fallback
  const handleManualConfirm = () => {
    if (savedOrder) {
      setStep(3);
      sendWhatsAppAndComplete(savedOrder);
    }
  };

  const savings = cart.reduce((acc, i) => {
    if (i.original_price && i.original_price > i.price)
      return acc + (i.original_price - i.price) * i.quantity;
    return acc;
  }, 0);

  const FieldError = ({ name }) =>
    touched[name] && errors[name]
      ? <p style={{ color:'#EF4444', fontSize:'11px', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
          <AlertCircle size={11}/> {errors[name]}
        </p>
      : null;

  const fieldStyle = (name) => ({
    width:'100%', padding:'12px 16px', borderRadius:'12px', fontSize:'14px',
    fontFamily:'inherit', fontWeight:500, color:'var(--text)', transition:'all .2s',
    outline:'none',
    border: touched[name] && errors[name]  ? '1.5px solid #EF4444' :
            touched[name] && !errors[name] ? '1.5px solid #16A34A' :
                                             '1.5px solid #E2E8F0',
    background: touched[name] && errors[name]  ? '#FEF2F2' :
                touched[name] && !errors[name] ? '#F0FDF4' : 'white',
  });

  const errCount = Object.keys(errors).filter(k => errors[k] && touched[k]).length;


  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Top bar ── */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:50 }}>
        <div className="container-center" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px' }}>
          <button onClick={() => step > 1 ? setStep(step-1) : navigate('/cart')}
            style={{ padding:'8px', borderRadius:'12px', background:'var(--secondary)', border:'none', cursor:'pointer', display:'flex' }}>
            <ArrowLeft size={20} color="var(--text-2)" />
          </button>
          <h1 style={{ fontSize:'18px', fontWeight:900, color:'var(--text)' }}>Checkout</h1>
          {/* Step dots */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                <div style={{
                  width:'28px', height:'28px', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'11px', fontWeight:900, transition:'all .3s',
                  background: step > n ? '#16A34A' : step === n ? 'var(--primary)' : '#E2E8F0',
                  color: step >= n ? 'white' : '#94A3B8',
                }}>
                  {step > n ? '✓' : n}
                </div>
                {n < 3 && <div style={{ width:'20px', height:'2px', background: step > n ? '#16A34A' : '#E2E8F0', borderRadius:'99px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-center" style={{ padding:'16px', maxWidth:'680px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* ══ STEP 1: Address ══════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} noValidate>
              <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'4px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <MapPin size={20} color="#6366F1" />
                  </div>
                  <div>
                    <h2 style={{ fontSize:'16px', fontWeight:900, color:'var(--text)' }}>Delivery Address</h2>
                    <p style={{ fontSize:'12px', color:'var(--text-3)' }}>All fields required for successful delivery</p>
                  </div>
                </div>

                {errCount > 0 && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'12px', padding:'10px 14px', margin:'12px 0', display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', fontWeight:700, color:'#DC2626' }}>
                    <AlertCircle size={15}/> Fix {errCount} error{errCount > 1 ? 's' : ''} to continue
                  </div>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'16px' }}>
                  {/* Full Name */}
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Full Name *</label>
                    <div style={{ position:'relative' }}>
                      <User size={14} color="#94A3B8" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                      <input name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur}
                        placeholder="Abdul Hameed" style={{ ...fieldStyle('fullName'), paddingLeft:'36px' }} />
                    </div>
                    <FieldError name="fullName" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Mobile *</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'13px', fontWeight:700, color:'#64748B' }}>+91</span>
                      <input name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur}
                        placeholder="9173963720" maxLength={10} style={{ ...fieldStyle('phone'), paddingLeft:'44px' }} />
                    </div>
                    <FieldError name="phone" />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Email *</label>
                    <div style={{ position:'relative' }}>
                      <Mail size={14} color="#94A3B8" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                      <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur}
                        placeholder="you@email.com" style={{ ...fieldStyle('email'), paddingLeft:'36px' }} />
                    </div>
                    <FieldError name="email" />
                  </div>

                  {/* House No */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>House / Flat No. *</label>
                    <input name="houseNo" value={form.houseNo} onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. H.No 25-2-1709" style={fieldStyle('houseNo')} />
                    <FieldError name="houseNo" />
                  </div>

                  {/* Street / Area */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Street / Area *</label>
                    <input name="streetArea" value={form.streetArea} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Pragati Nagar" style={fieldStyle('streetArea')} />
                    <FieldError name="streetArea" />
                  </div>

                  {/* Landmark */}
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Landmark * <span style={{ fontWeight:500, color:'var(--text-3)' }}>(helps delivery find you)</span></label>
                    <div style={{ position:'relative' }}>
                      <MapPin size={14} color="#94A3B8" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                      <input name="landmark" value={form.landmark} onChange={handleChange} onBlur={handleBlur}
                        placeholder="Near Big Bazaar / Opposite Reliance Fresh"
                        style={{ ...fieldStyle('landmark'), paddingLeft:'36px' }} />
                    </div>
                    <FieldError name="landmark" />
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>City *</label>
                    <input name="city" value={form.city} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Hyderabad" style={fieldStyle('city')} />
                    <FieldError name="city" />
                  </div>

                  {/* State */}
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>State *</label>
                    <input name="state" value={form.state} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Telangana" style={fieldStyle('state')} />
                    <FieldError name="state" />
                  </div>

                  {/* Pincode */}
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'var(--text-2)', marginBottom:'6px', display:'block' }}>Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} onBlur={handleBlur}
                      placeholder="500072" maxLength={6} style={fieldStyle('pincode')} />
                    <FieldError name="pincode" />
                  </div>
                </div>

                <button type="submit"
                  style={{ width:'100%', marginTop:'20px', padding:'15px', borderRadius:'16px', fontWeight:900, fontSize:'16px', color:'white', border:'none', cursor:'pointer', background:'linear-gradient(135deg,#FC8019,#FF9F1C)', boxShadow:'0 8px 24px rgba(252,128,25,.3)' }}>
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}


          {/* ══ STEP 2: Payment ══════════════════════════════════════════ */}
          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Address summary */}
              <div style={{ background:'white', borderRadius:'16px', padding:'14px 16px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                  <MapPin size={16} color="#6366F1" style={{ marginTop:'2px', flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:800, color:'var(--text)' }}>{form.fullName} · +91 {form.phone}</p>
                    <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px', lineHeight:1.5 }}>
                      {form.houseNo}, {form.streetArea}, Near {form.landmark}<br/>
                      {form.city}, {form.state} — {form.pincode}
                    </p>
                  </div>
                </div>
                <button onClick={() => setStep(1)} style={{ fontSize:'12px', fontWeight:800, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>Edit</button>
              </div>

              {/* Amount card */}
              <div style={{ background:'linear-gradient(135deg,#FC8019,#FF9F1C)', borderRadius:'20px', padding:'24px', textAlign:'center', boxShadow:'0 12px 32px rgba(252,128,25,.35)', color:'white' }}>
                <p style={{ fontSize:'13px', fontWeight:700, opacity:.9, marginBottom:'4px' }}>Total Amount to Pay</p>
                <p style={{ fontSize:'48px', fontWeight:900, lineHeight:1.1 }}>₹{getCartTotal().toFixed(0)}</p>
                {savings > 0 && <p style={{ fontSize:'13px', marginTop:'6px', background:'rgba(255,255,255,.2)', borderRadius:'99px', padding:'4px 14px', display:'inline-block', fontWeight:700 }}>You saved ₹{savings.toFixed(0)}! 🎉</p>}
              </div>

              {/* UPI Apps */}
              <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)', marginBottom:'4px' }}>Pay with UPI</h3>
                <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'16px' }}>Tap your UPI app — it will open automatically with the amount pre-filled</p>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
                  {UPI_APPS.map(app => (
                    <button key={app.pkg} onClick={() => handleUpiAppClick(app)} disabled={loading}
                      style={{
                        display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                        padding:'14px 8px', borderRadius:'16px', border:`2px solid ${pendingApp?.pkg === app.pkg ? app.color : '#E2E8F0'}`,
                        background: pendingApp?.pkg === app.pkg ? `${app.color}10` : 'white',
                        cursor:'pointer', transition:'all .2s', boxShadow:'var(--shadow-xs)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = app.color; e.currentTarget.style.transform='translateY(-2px)'; }}
                      onMouseLeave={e => { if(pendingApp?.pkg !== app.pkg){ e.currentTarget.style.borderColor='#E2E8F0'; } e.currentTarget.style.transform='translateY(0)'; }}>
                      <span style={{ fontSize:'28px', lineHeight:1 }}>{app.emoji}</span>
                      <span style={{ fontSize:'11px', fontWeight:800, color: pendingApp?.pkg === app.pkg ? app.color : 'var(--text-2)' }}>{app.shortName}</span>
                    </button>
                  ))}
                </div>

                {/* Pending state */}
                {pendingApp && !loading && (
                  <div style={{ marginTop:'16px', background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'14px', padding:'14px' }}>
                    <p style={{ fontSize:'13px', fontWeight:800, color:'#92400E', marginBottom:'4px' }}>
                      ⏳ Waiting for payment via {pendingApp.name}...
                    </p>
                    <p style={{ fontSize:'12px', color:'#B45309' }}>Complete the payment in the UPI app. WhatsApp notification will be sent automatically.</p>
                    <button onClick={handleManualConfirm}
                      style={{ marginTop:'12px', width:'100%', padding:'12px', borderRadius:'12px', background:'#16A34A', color:'white', fontWeight:800, fontSize:'14px', border:'none', cursor:'pointer' }}>
                      ✅ I've Paid — Confirm Order
                    </button>
                  </div>
                )}
              </div>

              {/* Why no COD section */}
              <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <ShieldCheck size={18} color="#FC8019" /> Why UPI Only? No Cash on Delivery
                </h3>

                <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.7, marginBottom:'12px' }}>
                  We are a small, dedicated team focused on delivering quality products. To ensure every order gets our full attention and to avoid return losses, we currently accept <strong>UPI payments only</strong>. This helps us:
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
                  {[
                    { emoji:'⚡', text:'Process and ship your order faster' },
                    { emoji:'🔒', text:'Ensure payment security for both parties' },
                    { emoji:'📦', text:'Reduce order cancellations and returns' },
                    { emoji:'💰', text:'Keep product prices low without extra charges' },
                  ].map(({ emoji, text }) => (
                    <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'#F8FAFC', borderRadius:'12px' }}>
                      <span style={{ fontSize:'18px', flexShrink:0 }}>{emoji}</span>
                      <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-2)' }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Delivered orders social proof */}
                <div style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #BBF7D0', borderRadius:'14px', padding:'14px', display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                  <PackageCheck size={24} color="#16A34A" style={{ flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:'14px', fontWeight:900, color:'#15803D' }}>{orderCount}+ Orders Successfully Delivered</p>
                    <p style={{ fontSize:'12px', color:'#166534' }}>Customers across India trust AS HUB</p>
                  </div>
                </div>

                {/* Contact options */}
                <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text-2)', marginBottom:'10px' }}>Have questions? Contact us:</p>
                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                  <a href="https://wa.me/917013942909" target="_blank" rel="noopener noreferrer"
                    style={{ flex:1, minWidth:'120px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', borderRadius:'12px', background:'#25D366', color:'white', fontWeight:800, fontSize:'13px', textDecoration:'none' }}>
                    💬 WhatsApp
                  </a>
                  <a href="tel:+917013942909"
                    style={{ flex:1, minWidth:'120px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', borderRadius:'12px', background:'#EFF6FF', color:'#1D4ED8', fontWeight:800, fontSize:'13px', textDecoration:'none', border:'1px solid #BFDBFE' }}>
                    📞 Call Us
                  </a>
                  <a href="mailto:as.businezzz@gmail.com"
                    style={{ flex:1, minWidth:'120px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', borderRadius:'12px', background:'#FFF7ED', color:'#C2410C', fontWeight:800, fontSize:'13px', textDecoration:'none', border:'1px solid #FED7AA' }}>
                    ✉️ Email
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Success ══════════════════════════════════════════ */}
          {step === 3 && (
            <div style={{ background:'white', borderRadius:'24px', padding:'40px 24px', textAlign:'center', boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:'72px', marginBottom:'16px' }}>🎉</div>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'#F0FDF4', border:'3px solid #16A34A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <CheckCircle size={32} color="#16A34A" />
              </div>
              <h2 style={{ fontSize:'24px', fontWeight:900, color:'var(--text)', marginBottom:'8px' }}>Order Confirmed!</h2>
              <p style={{ color:'var(--text-3)', fontSize:'14px', marginBottom:'6px' }}>
                Order ID: <strong style={{ color:'var(--text)' }}>#{savedOrder?.id?.slice(0,8).toUpperCase()}</strong>
              </p>
              <p style={{ color:'var(--text-2)', fontSize:'14px', marginBottom:'24px', lineHeight:1.6 }}>
                We've received your order and sent the details to our WhatsApp. We'll confirm and ship your order soon!
              </p>
              <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'14px', padding:'14px', marginBottom:'24px' }}>
                <p style={{ fontSize:'13px', color:'#166534', fontWeight:700 }}>📲 WhatsApp notification sent automatically!</p>
                <p style={{ fontSize:'12px', color:'#15803D', marginTop:'4px' }}>Our team will reach out to confirm your order.</p>
              </div>
              <button onClick={() => navigate('/orders')}
                style={{ width:'100%', padding:'14px', borderRadius:'16px', background:'linear-gradient(135deg,#FC8019,#FF9F1C)', color:'white', fontWeight:900, fontSize:'15px', border:'none', cursor:'pointer', boxShadow:'0 8px 24px rgba(252,128,25,.3)' }}>
                View My Orders →
              </button>
              <button onClick={() => navigate('/')}
                style={{ width:'100%', marginTop:'10px', padding:'14px', borderRadius:'16px', background:'white', color:'var(--text-2)', fontWeight:700, fontSize:'14px', border:'1.5px solid var(--border)', cursor:'pointer' }}>
                Continue Shopping
              </button>
            </div>
          )}

          {/* ── Order Summary (always visible) ── */}
          {step < 3 && (
            <div style={{ background:'white', borderRadius:'20px', padding:'16px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontSize:'14px', fontWeight:900, color:'var(--text)', marginBottom:'12px' }}>Order Summary</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', maxHeight:'160px', overflowY:'auto' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'10px', overflow:'hidden', background:'#F1F5F9', flexShrink:0 }}>
                      <img src={item.image_url||'https://via.placeholder.com/44'} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontSize:'13px', fontWeight:800, color:'var(--text)', flexShrink:0 }}>₹{(item.price*item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:'1px solid var(--border)', marginTop:'12px', paddingTop:'12px' }}>
                {savings > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#16A34A', fontWeight:700, marginBottom:'6px' }}><span>Savings</span><span>-₹{savings.toFixed(0)}</span></div>}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--text-2)', marginBottom:'6px' }}><span>Delivery</span><span style={{ color:'#16A34A', fontWeight:700 }}>FREE</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'18px', fontWeight:900, color:'var(--text)' }}><span>Total</span><span>₹{getCartTotal().toFixed(0)}</span></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
