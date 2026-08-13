import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';
import SEO from '../components/common/SEO';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist } = useApp();

  const validWishlist = (wishlist || []).filter(p => p && p.id);

  if (validWishlist.length === 0) {
    return (
      <div style={{ minHeight:'75vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center', background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)' }}>
        <div style={{ width:'88px', height:'88px', borderRadius:'22px', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', boxShadow:'0 20px 48px -8px rgba(15,23,42,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', border:'1px solid rgba(255,255,255,0.9)' }}>
          <Heart size={40} color="#E94560" />
        </div>
        <h2 style={{ fontSize:'26px', fontWeight:900, color:'#0F172A', marginBottom:'8px', letterSpacing:'-0.5px' }}>
          Your Wishlist is Empty
        </h2>
        <p style={{ color:'#64748B', fontSize:'15px', fontWeight:500, marginBottom:'28px' }}>
          Tap the ♡ on any item card to save it to your wishlist
        </p>
        <button className="sh-btn" onClick={() => navigate('/')}>
          Explore Collection <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 0%, #F1F5F9 0%, #F8FAFC 60%, #EEF2F6 100%)', paddingBottom:'80px' }}>
      <SEO title="My Wishlist | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/wishlist" />
      <div className="sh-container" style={{ padding:'40px 0 0' }}>
        <div style={{ marginBottom:'32px' }}>
          <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1.5px', color:'#E94560', background:'rgba(233,69,96,0.1)', padding:'4px 12px', borderRadius:'9999px' }}>
            Saved Favorites
          </span>
          <h1 style={{ fontSize:'32px', fontWeight:900, color:'#0F172A', letterSpacing:'-0.8px', marginTop:'8px' }}>
            My Wishlist Collection
          </h1>
          <p style={{ color:'#64748B', fontSize:'14px', fontWeight:600, marginTop:'4px' }}>
            {validWishlist.length} saved item{validWishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="sh-grid-products">
          {validWishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
