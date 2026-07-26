import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft, Shield, Truck, RefreshCw, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const discount = product?.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-center py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded-xl w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-4">😕</div>
        <h2 className="text-2xl font-black mb-2 text-gray-900">Product not found</h2>
        <p className="text-gray-500 mb-6">This product may have been removed or is unavailable.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-center py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <div className="container-center py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm aspect-square">
              <img
                src={product.image_url || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
                {discount}% OFF
              </div>
            )}
            <button
              onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
              className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart size={20} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1 capitalize">
                {product.category} {product.sub_category && `› ${product.sub_category}`}
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">{product.name}</h1>
              {product.unit && <p className="text-gray-500 text-sm">{product.unit}</p>}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">₹{product.price.toFixed(0)}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price.toFixed(0)}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-1 rounded-lg">Save ₹{(product.original_price - product.price).toFixed(0)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700 text-sm">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors font-bold text-gray-700"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <button
                    onClick={() => (!product.stock || quantity < product.stock) && setQuantity(q => q + 1)}
                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors font-bold text-gray-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold border-2 transition-all duration-300 disabled:opacity-40"
                style={{
                  borderColor: 'rgb(var(--theme-primary))',
                  color: added ? 'white' : 'rgb(var(--theme-primary))',
                  background: added ? 'linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))' : 'white'
                }}
              >
                <ShoppingCart size={18} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))' }}
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: 'Free Delivery', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Shield, label: 'Secure Payment', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: RefreshCw, label: 'Easy Returns', color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <Icon size={20} className={`${color} mx-auto mb-1`} />
                  <p className={`text-xs font-bold ${color}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
