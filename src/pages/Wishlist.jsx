import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, user } = useApp();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart size={80} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Login to view your wishlist
        </h2>
        <p className="text-gray-600 mb-6">
          Save your favorite products for later
        </p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Login
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart size={80} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Start adding products you love!
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-gray-600 mb-8">{wishlist.length} items</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
