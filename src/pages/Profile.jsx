import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Package, Heart, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useApp();

  useEffect(() => {
    // Only redirect if loading is done AND user is still null
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Show nothing while auth is loading
  if (loading || !user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const initial = (user.user_metadata?.full_name || user.email).charAt(0).toUpperCase();
  const name = user.user_metadata?.full_name || 'User';
  const phone = user.user_metadata?.phone;
  const memberSince = new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const menuItems = [
    { icon: Package, label: 'My Orders', sub: 'Track & manage orders', path: '/orders', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Heart, label: 'My Wishlist', sub: 'Saved items', path: '/wishlist', color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="relative overflow-hidden py-12" style={{ background: 'linear-gradient(135deg, #7c1d6f, #db2777)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="container-center relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
              {initial}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black">{name}</h1>
              <p className="opacity-80 text-sm mt-1">{user.email}</p>
              <p className="opacity-60 text-xs mt-1">Member since {memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-center py-8 max-w-2xl">
        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-gray-900">Account Details</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { icon: Mail, label: 'Email', value: user.email },
              ...(phone ? [{ icon: Phone, label: 'Phone', value: phone }] : []),
              { icon: Shield, label: 'Account ID', value: user.id.slice(0, 16) + '...' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-gray-900">My Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.map(({ icon: Icon, label, sub, path, color, bg }) => (
              <Link key={path} to={path}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            ))}
            {user.email === 'admin@shop.com' && (
              <Link to="/admin"
                className="flex items-center gap-4 px-6 py-4 hover:bg-purple-50 transition-colors group">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-purple-700 text-sm">Admin Panel</p>
                  <p className="text-xs text-gray-500">Manage products & orders</p>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
              </Link>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
