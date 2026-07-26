import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, CreditCard, Shield, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer } from '../utils/whatsappNotifications';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, user, clearCart } = useApp();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = payment
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    if (cart.length === 0) { navigate('/cart'); }
  }, [user, cart]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
      amount: Math.round(getCartTotal() * 100),
      currency: 'INR',
      name: 'ShopHub',
      description: 'Order Payment',
      handler: async (response) => {
        await saveOrder(response.razorpay_payment_id);
      },
      prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
      theme: { color: '#7c1d6f' },
    };
    if (window.Razorpay) {
      new window.Razorpay(options).open();
    } else {
      alert('Payment gateway not loaded. Please refresh and try again.');
    }
  };

  const saveOrder = async (paymentId) => {
    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        total_amount: getCartTotal(),
        payment_id: paymentId,
        shipping_address: { 
          fullName: formData.fullName, 
          phone: formData.phone, 
          address: formData.address, 
          city: formData.city, 
          state: formData.state, 
          pincode: formData.pincode 
        },
        items: cart.map(i => ({ 
          product_id: i.id, 
          name: i.name, 
          quantity: i.quantity, 
          price: i.price 
        })),
        status: 'confirmed',
      };

      const { data: orderResponse, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp notifications
      try {
        await sendOrderNotificationToAdmin(orderResponse, user);
        await sendOrderConfirmationToCustomer(orderResponse, user);
      } catch (whatsappError) {
        console.error('WhatsApp notification error:', whatsappError);
        // Don't fail the order if WhatsApp fails
      }

      clearCart();
      
      // Show success message with WhatsApp info
      if (window.confirm('🎉 Order placed successfully!\n\nClick OK to notify admin via WhatsApp about your order.')) {
        // This will trigger the WhatsApp notification
      }
      
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Error placing order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); }
    else { handlePayment(); }
  };

  const savings = cart.reduce((acc, item) => {
    if (item.original_price && item.original_price > item.price) {
      return acc + (item.original_price - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const fields = {
    1: [
      { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User, col: 1 },
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', icon: Phone, col: 1 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: Mail, col: 2 },
      { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'House no., Street name, Area', icon: MapPin, col: 2 },
      { name: 'city', label: 'City', type: 'text', placeholder: 'Mumbai', icon: null, col: 1 },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra', icon: null, col: 1 },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '400001', icon: null, col: 2 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container-center py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-gray-900">Checkout</h1>
            <div className="flex items-center gap-2 ml-auto">
              {[{ n: 1, label: 'Address' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${step >= n ? 'text-white' : 'bg-gray-200 text-gray-500'}`}
                    style={step >= n ? { background: 'linear-gradient(135deg, #7c1d6f, #db2777)' } : {}}>
                    {step > n ? <CheckCircle size={14} /> : n}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${step >= n ? 'text-purple-700' : 'text-gray-400'}`}>{label}</span>
                  {n < 2 && <div className={`w-8 h-0.5 ${step > n ? 'bg-purple-500' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-center py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <MapPin size={20} className="text-purple-600" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {fields[1].map(({ name, label, type, placeholder, icon: Icon, col }) => (
                      <div key={name} className={col === 2 ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{label} *</label>
                        <div className="relative">
                          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />}
                          {type === 'textarea' ? (
                            <textarea
                              name={name}
                              value={formData[name]}
                              onChange={handleChange}
                              required
                              rows={2}
                              placeholder={placeholder}
                              className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm resize-none`}
                            />
                          ) : (
                            <input
                              type={type}
                              name={name}
                              value={formData[name]}
                              onChange={handleChange}
                              required
                              placeholder={placeholder}
                              className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit"
                    className="w-full mt-6 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7c1d6f, #db2777)' }}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <CreditCard size={20} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">Payment</h2>
                  </div>

                  {/* Address Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">{formData.fullName} · {formData.phone}</p>
                        <p className="text-gray-600">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="ml-auto text-purple-600 text-xs font-bold hover:text-purple-700 flex-shrink-0">Edit</button>
                    </div>
                  </div>

                  {/* Payment methods notice */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-3">Accepted Payment Methods</p>
                    {[
                      { icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                      { icon: '📱', label: 'UPI', sub: 'GPay, PhonePe, Paytm, BHIM' },
                      { icon: '🏦', label: 'Net Banking', sub: 'All major banks supported' },
                    ].map(({ icon, label, sub }) => (
                      <div key={label} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* No COD notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-amber-800 font-medium">
                      ⚠️ We do not accept Cash on Delivery. All orders must be paid online for faster processing and secure transactions.
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7c1d6f, #db2777)' }}>
                    <Shield size={18} />
                    {loading ? 'Processing...' : `Pay ₹${getCartTotal().toFixed(0)} Securely`}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-black text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{getCartTotal().toFixed(0)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span className="font-semibold">-₹{savings.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-green-600">
                  <span>Delivery</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-gray-900">₹{getCartTotal().toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Shield size={14} className="text-green-600" />
                <span>100% secure & encrypted payment</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Truck size={14} className="text-blue-600" />
                <span>Free delivery on all orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
