import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Confirmed' },
  processing: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' },
};

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useApp();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait for auth to finish
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [user, authLoading]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-center py-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-sm">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8">Start shopping and your orders will appear here.</p>
        <button onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #7c1d6f, #db2777)' }}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-center py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package size={28} className="text-gray-800" />
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            My Orders <span className="text-gray-400 font-medium text-lg">({orders.length})</span>
          </h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.confirmed;
            const Icon = status.icon;
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                      <Icon size={20} className={status.color} />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                    {status.label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 font-medium">
                          {item.name}
                          <span className="text-gray-400 font-normal"> × {item.quantity}</span>
                        </span>
                        <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                      <Truck size={16} />
                      Free Delivery
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Paid</p>
                      <p className="text-xl font-black text-gray-900">₹{order.total_amount.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">{order.shipping_address.fullName}</span>
                      {' — '}{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
