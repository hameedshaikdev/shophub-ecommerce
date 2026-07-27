import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, user } = useApp();

  if (!user) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center' }}>
        <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'#FEF2F2',
          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Heart size={36} color="#FECACA" />
        </div>
        <h2 style={{ fontSize:'20px', fontWeight:900, color:'var(--text)', marginBottom:'8px' }}>
          Login to view your wishlist
        </h2>
        <p style={{ color:'var(--text-3)', fontSize:'14px', marginBottom:'24px' }}>
          Save your favourite products for later
        </p>
        <button onClick={() => navigate('/login')}
          style={{ padding:'12px 28px', borderRadius:'14px', background:'var(--primary-grad)',
            color:'white', fontWeight:800, fontSize:'14px', border:'none', cursor:'pointer',
            boxShadow:'0 6px 20px rgba(252,128,25,.3)' }}>
          Login
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center' }}>
        <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'#FEF2F2',
          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Heart size={36} color="#FECACA" />
        </div>
        <h2 style={{ fontSize:'20px', fontWeight:900, color:'var(--text)', marginBottom:'8px' }}>
          Your wishlist is empty
        </h2>
        <p style={{ color:'var(--text-3)', fontSize:'14px', marginBottom:'24px' }}>
          Tap the ♡ on any product to save it here
        </p>
        <button onClick={() => navigate('/')}
          style={{ padding:'12px 28px', borderRadius:'14px', background:'var(--primary-grad)',
            color:'white', fontWeight:800, fontSize:'14px', border:'none', cursor:'pointer',
            boxShadow:'0 6px 20px rgba(252,128,25,.3)' }}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'80px' }}>
      <div className="container-center" style={{ padding:'24px 16px' }}>
        <div style={{ marginBottom:'20px' }}>
          <h1 style={{ fontSize:'24px', fontWeight:900, color:'var(--text)' }}>
            My Wishlist
          </h1>
          <p style={{ color:'var(--text-3)', fontSize:'13px', marginTop:'4px' }}>
            {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="sh-grid-products">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
