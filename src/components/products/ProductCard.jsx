import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null;

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    addToCart(product, 1);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleWish = (e) => {
    e.preventDefault();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="sh-card sh-fade-up">
      <div className="sh-card-img">
        <img src={product.image_url || 'https://placehold.co/300x300?text=No+Image'} alt={product.name} loading="lazy" />

        {discount && <span className="sh-card-discount">{discount}% OFF</span>}

        <button className="sh-card-wish" onClick={handleWish}>
          <Heart size={14} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#9ca3af'} />
        </button>

        <button
          className={`sh-card-add${added ? ' added' : ''}`}
          onClick={handleAdd}
          title="Add to cart"
        >
          {added ? '✓' : '+'}
        </button>
      </div>

      <div className="sh-card-body">
        <p className="sh-card-name">{product.name}</p>
        {product.unit && <p className="sh-card-unit">{product.unit}</p>}

        <div className="sh-card-price">
          <span className="sh-price">₹{product.price.toFixed(0)}</span>
          {product.original_price > product.price && (
            <>
              <span className="sh-price-old">₹{product.original_price.toFixed(0)}</span>
              {discount && <span className="sh-price-save">{discount}% off</span>}
            </>
          )}
        </div>

        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <p style={{ fontSize:'11px', color:'var(--primary)', fontWeight:700, marginTop:'6px' }}>
            Only {product.stock} left
          </p>
        )}
        {product.stock === 0 && (
          <p style={{ fontSize:'11px', color:'var(--danger)', fontWeight:700, marginTop:'6px' }}>
            Out of stock
          </p>
        )}
      </div>
    </Link>
  );
}
