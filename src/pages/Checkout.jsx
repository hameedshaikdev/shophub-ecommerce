import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, User,
  ArrowLeft, AlertCircle, Copy, Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

/* ─── Shop config ───────────────────────────────────────────── */
const SHOP = {
  upiId:          '7995747250@ptyes',
  upiName:        'Shaik Asmath',
  whatsappNumber: '917013942909',
  shopName:       'AS HUB',
};

/* ─── Validators ────────────────────────────────────────────── */
const V = {
  fullName:   { min:3,  re:/^[a-zA-Z\s]{3,}$/,           msg:'Enter full name (letters only)' },
  phone:      { min:10, re:/^[6-9]\d{9}$/,               msg:'Valid 10-digit mobile number required' },
  email:      { min:5,  re:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg:'Enter a valid email' },
  houseNo:    { min:1,  re:/.+/,                         msg:'House / Flat number required' },
  streetArea: { min:5,  re:/.{5,}/,                      msg:'Enter street name and area (min 5 chars)' },
  landmark:   { min:3,  re:/.{3,}/,                      msg:'Enter a nearby landmark' },
  city:       { min:2,  re:/^[a-zA-Z\s]{2,}$/,          msg:'Enter a valid city' },
  state:      { min:2,  re:/^[a-zA-Z\s]{2,}$/,          msg:'Enter a valid state' },
  pincode:    { min:6,  re:/^[1-9][0-9]{5}$/,           msg:'Valid 6-digit pincode required' },
};

function validate(name, value) {
  const r = V[name];
  if (!r) return '';
  const v = (value || '').trim();
  if (v.length < r.min) return r.msg;
  if (!r.re.test(v)) return r.msg;
  return '';
}

/* ─── FieldError — standalone component, no inline JSX ─────── */
function FieldError({ name, errors, touched }) {
  if (!touched[name] || !errors[name]) return null;
  return (
    <p style={{ color:'#EF4444', fontSize:'11px', marginTop:'4px',
      display:'flex', alignItems:'center', gap:'4px' }}>
      <AlertCircle size={11} />
      {errors[name]}
    </p>
  );
}

/* ─── StepDot ───────────────────────────────────────────────── */
function StepDot({ n, current }) {
  const done   = current > n;
  const active = current === n;
  return (
    <div style={{
      width:'28px', height:'28px', borderRadius:'50%',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'11px', fontWeight:900,
      background: done ? '#16A34A' : active ? 'var(--primary)' : '#E2E8F0',
      color: (done || active) ? 'white' : '#94A3B8',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, user, clearCart, loading: authLoading } = useApp();

  const [step,       setStep]       = useState(1);
  const [saving,     setSaving]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order,      setOrder]      = useState(null);
  const [utr,        setUtr]        = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [copied,     setCopied]     = useState('');
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});

  const [form, setForm] = useState({
    fullName:   '',
    email:      '',
    phone:      '',
    houseNo:    '',
    streetArea: '',
    landmark:   '',
    city:       '',
    state:      '',
    pincode:    '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    if (cart.length === 0) navigate('/cart');
  }, [user, authLoading, cart]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, value) }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, value) }));
  }

  function validateAll() {
    const errs = {};
    const t    = {};
    Object.keys(V).forEach(k => {
      t[k] = true;
      const e = validate(k, form[k]);
      if (e) errs[k] = e;
    });
    setErrors(errs);
    setTouched(t);
    return Object.keys(errs).length === 0;
  }

  function fieldStyle(name) {
    const ok  = touched[name] && !errors[name];
    const bad = touched[name] &&  errors[name];
    return {
      width:'100%', padding:'12px 16px', borderRadius:'12px',
      fontSize:'14px', fontFamily:'inherit', fontWeight:500,
      color:'var(--text)', outline:'none', transition:'all .2s',
      border:      bad ? '1.5px solid #EF4444' : ok ? '1.5px solid #16A34A' : '1.5px solid #E2E8F0',
      background:  bad ? '#FEF2F2'             : ok ? '#F0FDF4'             : 'white',
    };
  }

  function copy(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setSaving(true);
    try {
      const fullAddress =
        `${form.houseNo}, ${form.streetArea}, Near ${form.landmark}, ` +
        `${form.city}, ${form.state} - ${form.pincode}`;

      const { data, error } = await supabase.from('orders').insert([{
        user_id:        user.id,
        total_amount:   getCartTotal(),
        payment_status: 'pending',
        status:         'pending_payment',
        shipping_address: {
          fullName:   form.fullName, phone:      form.phone,
          email:      form.email,   houseNo:    form.houseNo,
          streetArea: form.streetArea, landmark: form.landmark,
          city:       form.city,    state:      form.state,
          pincode:    form.pincode, fullAddress,
        },
        items: cart.map(i => ({
          product_id: i.id, name: i.name,
          quantity:   i.quantity, price: i.price, image_url: i.image_url,
        })),
      }]).select().single();

      if (error) throw error;
      setOrder(data);
      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      alert('Error creating order: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleScreenshotUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `screenshots/${order.id}.${ext}`;
      const { error } = await supabase.storage
        .from('payment-screenshots').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('payment-screenshots').getPublicUrl(path);
      setScreenshot(data.publicUrl);
    } catch (err) {
      alert('Screenshot upload failed — you can still proceed.');
    } finally {
      setUploading(false);
    }
  }

  async function handlePaymentSubmitted() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await supabase.from('orders').update({
        payment_status: 'submitted',
        status:         'payment_submitted',
        utr:            utr.trim() || null,
        screenshot_url: screenshot || null,
        submitted_at:   new Date().toISOString(),
      }).eq('id', order.id);

      const addr  = order.shipping_address;
      const items = order.items
        .map(i => `  ✦ ${i.name} ×${i.quantity}  →  ₹${(i.price * i.quantity).toFixed(0)}`)
        .join('%0A');

      const msg =
        `🛍️ *PAYMENT SUBMITTED — ${SHOP.shopName}*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `🔖 *Order ID :* %23${order.id.slice(0,8).toUpperCase()}%0A` +
        `💰 *Amount   :* ₹${order.total_amount.toFixed(0)}%0A` +
        `🏧 *UPI ID   :* ${SHOP.upiId}%0A` +
        (utr ? `🔢 *UTR No   :* ${utr}%0A` : '') +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `👤 *CUSTOMER*%0A` +
        `• Name  : ${addr.fullName}%0A` +
        `• Phone : +91 ${addr.phone}%0A` +
        `• Email : ${addr.email}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `📦 *ITEMS ORDERED*%0A` +
        `${items}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `📍 *DELIVERY ADDRESS*%0A` +
        `• Flat/House : ${addr.houseNo}%0A` +
        `• Street/Area: ${addr.streetArea}%0A` +
        `• Landmark   : Near ${addr.landmark}%0A` +
        `• City       : ${addr.city}%0A` +
        `• State      : ${addr.state}%0A` +
        `• Pincode    : ${addr.pincode}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `⚠️ *Please verify payment and confirm order.*%0A` +
        `✅ Payment done via UPI — Please ship!`;

      clearCart();
      window.open(`https://wa.me/${SHOP.whatsappNumber}?text=${msg}`, '_blank');
      navigate(`/order-status/${order.id}`);
    } catch (err) {
      alert('Error submitting payment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const savings = cart.reduce((a, i) =>
    i.original_price > i.price ? a + (i.original_price - i.price) * i.quantity : a, 0);

  const total = getCartTotal();
  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=` +
    encodeURIComponent(
      `upi://pay?pa=${SHOP.upiId}&pn=${SHOP.upiName}&am=${total.toFixed(2)}&cu=INR`
    );

  if (authLoading) return null;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Header bar ── */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)',
        position:'sticky', top:0, zIndex:50 }}>
        <div className="container-center" style={{ display:'flex',
          alignItems:'center', gap:'12px', padding:'14px 16px' }}>
          <button
            onClick={() => step === 2 ? setStep(1) : navigate('/cart')}
            style={{ padding:'8px', borderRadius:'12px', background:'var(--secondary)',
              border:'none', cursor:'pointer', display:'flex' }}>
            <ArrowLeft size={20} color="var(--text-2)" />
          </button>
          <h1 style={{ fontSize:'18px', fontWeight:900, color:'var(--text)' }}>
            {step === 1 ? 'Delivery Address' : 'Pay & Confirm'}
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
            <StepDot n={1} current={step} />
            <div style={{ width:'20px', height:'2px',
              background: step > 1 ? '#16A34A' : '#E2E8F0', borderRadius:'99px' }} />
            <StepDot n={2} current={step} />
          </div>
        </div>
      </div>

      <div className="container-center" style={{ padding:'16px', maxWidth:'680px' }}>

        {/* ══ STEP 1 — ADDRESS ══ */}
        {step === 1 && (
          <form onSubmit={handleAddressSubmit} noValidate>
            <div style={{ background:'white', borderRadius:'20px', padding:'20px',
              boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>

              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px',
                  background:'#EEF2FF', display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0 }}>
                  <MapPin size={20} color="#6366F1" />
                </div>
                <div>
                  <h2 style={{ fontSize:'16px', fontWeight:900, color:'var(--text)' }}>Delivery Address</h2>
                  <p style={{ fontSize:'12px', color:'var(--text-3)' }}>All fields required for delivery</p>
                </div>
              </div>

              {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA',
                  borderRadius:'12px', padding:'10px 14px', marginBottom:'14px',
                  display:'flex', alignItems:'center', gap:'8px',
                  fontSize:'13px', fontWeight:700, color:'#DC2626' }}>
                  <AlertCircle size={15} />
                  Fix {Object.keys(errors).length} error(s) to continue
                </div>
              )}

              <div className="checkout-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>

                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>Full Name *</label>
                  <div style={{ position:'relative' }}>
                    <User size={14} color="#94A3B8" style={{ position:'absolute',
                      left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                    <input name="fullName" value={form.fullName}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. Ramesh Kumar"
                      style={{ ...fieldStyle('fullName'), paddingLeft:'36px' }} />
                  </div>
                  <FieldError name="fullName" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>Mobile *</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:'12px', top:'50%',
                      transform:'translateY(-50%)', fontSize:'13px',
                      fontWeight:800, color:'#64748B' }}>+91</span>
                    <input name="phone" value={form.phone}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. 9876543210" maxLength={10}
                      style={{ ...fieldStyle('phone'), paddingLeft:'44px' }} />
                  </div>
                  <FieldError name="phone" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>Email *</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={14} color="#94A3B8" style={{ position:'absolute',
                      left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                    <input name="email" type="email" value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. ramesh@gmail.com"
                      style={{ ...fieldStyle('email'), paddingLeft:'36px' }} />
                  </div>
                  <FieldError name="email" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>House / Flat No. *</label>
                  <input name="houseNo" value={form.houseNo}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Flat 3A / H.No 10-2-304" style={fieldStyle('houseNo')} />
                  <FieldError name="houseNo" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>Street / Area *</label>
                  <input name="streetArea" value={form.streetArea}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Gandhi Nagar, Banjara Hills" style={fieldStyle('streetArea')} />
                  <FieldError name="streetArea" errors={errors} touched={touched} />
                </div>

                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>
                    Landmark * <span style={{ fontWeight:500, color:'var(--text-3)' }}>(helps delivery)</span>
                  </label>
                  <div style={{ position:'relative' }}>
                    <MapPin size={14} color="#94A3B8" style={{ position:'absolute',
                      left:'12px', top:'50%', transform:'translateY(-50%)' }} />
                    <input name="landmark" value={form.landmark}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="e.g. Near Railway Station"
                      style={{ ...fieldStyle('landmark'), paddingLeft:'36px' }} />
                  </div>
                  <FieldError name="landmark" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>City *</label>
                  <input name="city" value={form.city}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Hyderabad" style={fieldStyle('city')} />
                  <FieldError name="city" errors={errors} touched={touched} />
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>State *</label>
                  <input name="state" value={form.state}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Telangana" style={fieldStyle('state')} />
                  <FieldError name="state" errors={errors} touched={touched} />
                </div>

                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>Pincode *</label>
                  <input name="pincode" value={form.pincode}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. 500034" maxLength={6} style={fieldStyle('pincode')} />
                  <FieldError name="pincode" errors={errors} touched={touched} />
                </div>
              </div>

              <button type="submit" disabled={saving}
                style={{ width:'100%', marginTop:'20px', padding:'15px',
                  borderRadius:'16px', fontWeight:900, fontSize:'16px',
                  color:'white', border:'none', cursor:'pointer',
                  background:'var(--primary-grad)',
                  boxShadow:'0 8px 24px rgba(252,128,25,.3)',
                  opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Continue to Payment →'}
              </button>
            </div>
          </form>
        )}

        {/* ══ STEP 2 — PAYMENT ══ */}
        {step === 2 && order && (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Amount banner */}
            <div style={{ background:'linear-gradient(135deg,#FC8019,#FF9F1C)',
              borderRadius:'20px', padding:'20px', color:'white', textAlign:'center',
              boxShadow:'0 12px 32px rgba(252,128,25,.35)' }}>
              <p style={{ fontSize:'12px', fontWeight:700, opacity:.9, marginBottom:'2px' }}>
                Order #{order.id.slice(0,8).toUpperCase()}
              </p>
              <p style={{ fontSize:'13px', fontWeight:600, opacity:.85, marginBottom:'6px' }}>
                Total Amount to Pay
              </p>
              <p style={{ fontSize:'52px', fontWeight:900, lineHeight:1.1 }}>
                ₹{total.toFixed(0)}
              </p>
              {savings > 0 && (
                <p style={{ fontSize:'12px', marginTop:'6px',
                  background:'rgba(255,255,255,.2)', borderRadius:'99px',
                  padding:'3px 14px', display:'inline-block', fontWeight:700 }}>
                  You saved ₹{savings.toFixed(0)}!
                </p>
              )}
            </div>

            {/* QR + UPI ID */}
            <div style={{ background:'white', borderRadius:'20px', padding:'24px',
              boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)',
              textAlign:'center' }}>
              <h3 style={{ fontSize:'16px', fontWeight:900, color:'var(--text)',
                marginBottom:'4px' }}>Scan QR to Pay</h3>
              <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'20px' }}>
                Open GPay / PhonePe / Paytm → Scan QR or use UPI ID below
              </p>

              <div style={{ display:'inline-block', padding:'12px',
                border:'3px solid #FC8019', borderRadius:'16px',
                marginBottom:'20px', background:'white' }}>
                <img src={qrUrl} alt="UPI QR Code"
                  style={{ width:'180px', height:'180px', display:'block', borderRadius:'8px' }} />
              </div>

              {[
                { label:'UPI ID', value:SHOP.upiId, key:'upi' },
                { label:'Exact Amount', value:`${total.toFixed(2)}`, key:'amt' },
              ].map(({ label, value, key }) => (
                <div key={key} style={{ display:'flex', alignItems:'center',
                  justifyContent:'space-between', background:'#F8FAFC',
                  border:'1.5px solid #E2E8F0', borderRadius:'14px',
                  padding:'12px 16px', marginBottom:'10px' }}>
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontSize:'10px', color:'var(--text-3)', fontWeight:700,
                      textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'2px' }}>
                      {label}
                    </p>
                    <p style={{ fontSize:'16px', fontWeight:900, color:'var(--text)' }}>
                      {key === 'amt' ? '₹' : ''}{value}
                    </p>
                  </div>
                  <button onClick={() => copy(value, key)}
                    style={{ display:'flex', alignItems:'center', gap:'6px',
                      padding:'8px 14px', borderRadius:'10px',
                      background: copied === key ? '#16A34A' : 'var(--primary)',
                      color:'white', fontWeight:800, fontSize:'13px',
                      border:'none', cursor:'pointer', transition:'all .2s' }}>
                    {copied === key
                      ? (<><Check size={14} />Copied!</>)
                      : (<><Copy size={14} />Copy</>)}
                  </button>
                </div>
              ))}

              <p style={{ fontSize:'12px', color:'#EF4444', fontWeight:700,
                background:'#FEF2F2', borderRadius:'10px', padding:'8px',
                marginTop:'4px' }}>
                ⚠️ Pay exactly ₹{total.toFixed(2)} — wrong amount delays verification
              </p>
            </div>

            {/* UTR + Screenshot */}
            <div style={{ background:'white', borderRadius:'20px', padding:'20px',
              boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontSize:'15px', fontWeight:900, color:'var(--text)',
                marginBottom:'4px' }}>After Payment (Recommended)</h3>
              <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'16px' }}>
                Adding UTR / screenshot speeds up verification to under 2 minutes
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>
                    UTR / Transaction ID
                  </label>
                  <input value={utr} onChange={e => setUtr(e.target.value)}
                    placeholder="e.g. 423698745123"
                    style={{ width:'100%', padding:'12px 16px', borderRadius:'12px',
                      border:'1.5px solid #E2E8F0', fontSize:'14px',
                      fontFamily:'inherit', outline:'none' }}
                    onFocus={e => { e.target.style.borderColor='var(--primary)'; }}
                    onBlur={e => { e.target.style.borderColor='#E2E8F0'; }} />
                  <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'4px' }}>
                    Found in your UPI app under transaction details
                  </p>
                </div>

                <div>
                  <label style={{ display:'block', fontSize:'12px', fontWeight:700,
                    color:'var(--text-2)', marginBottom:'6px' }}>
                    Payment Screenshot
                  </label>
                  <label style={{ display:'flex', alignItems:'center',
                    justifyContent:'center', gap:'8px', padding:'14px',
                    borderRadius:'12px', border:'2px dashed #E2E8F0',
                    cursor:'pointer', fontSize:'13px', fontWeight:700,
                    color:'var(--text-2)', background:'#F8FAFC',
                    transition:'all .2s' }}>
                    {uploading ? '⏳ Uploading...'
                      : screenshot ? '✅ Screenshot uploaded!'
                      : '📸 Tap to upload screenshot'}
                    <input type="file" accept="image/*"
                      onChange={handleScreenshotUpload}
                      style={{ display:'none' }} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button onClick={handlePaymentSubmitted} disabled={submitting}
              style={{ width:'100%', padding:'18px', borderRadius:'18px',
                background:'linear-gradient(135deg,#16A34A,#15803D)',
                color:'white', fontWeight:900, fontSize:'17px',
                border:'none', cursor:'pointer',
                boxShadow:'0 8px 28px rgba(22,163,74,.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                gap:'10px', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? '⏳ Submitting...' : "✅ I've Made Payment"}
            </button>
            <p style={{ textAlign:'center', fontSize:'12px', color:'var(--text-3)',
              marginTop:'-8px' }}>
              This notifies AS HUB on WhatsApp for payment verification
            </p>

            {/* Mini order summary */}
            <div style={{ background:'white', borderRadius:'16px', padding:'16px',
              boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontSize:'14px', fontWeight:900, color:'var(--text)',
                marginBottom:'12px' }}>Order Summary</h3>
              {order.items.map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between',
                  fontSize:'13px', marginBottom:'6px' }}>
                  <span style={{ color:'var(--text-2)', fontWeight:600 }}>
                    {item.name} ×{item.quantity}
                  </span>
                  <span style={{ fontWeight:800, color:'var(--text)' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid var(--border)', marginTop:'10px',
                paddingTop:'10px', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:900, fontSize:'15px' }}>Total</span>
                <span style={{ fontWeight:900, fontSize:'18px', color:'var(--primary)' }}>
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
      <style>{`
        @media (max-width: 640px) {
          .checkout-form-grid {
            grid-template-columns: 1fr !important;
          }
          .checkout-form-grid > div {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </div>
  );
}
