import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight, X, ShoppingCart, BadgeCheck, Sparkles, Scissors, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import { getProductImage } from '../utils/productImages';
import SEO from '../components/common/SEO';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('products').select('*').eq('active', true).limit(10);
        setSuggested(data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const validWishlist = (wishlist || []).filter(p => p && p.id);

  /* ── EMPTY WISHLIST STATE ── */
  if (validWishlist.length === 0) {
    return (
      <div style={{ background:'radial-gradient(circle at 50% 0%, #F8FAFC 0%, #F1F5F9 100%)', minHeight:'100vh', padding:'28px 0 64px' }}>
        <SEO title="My Wishlist Collection | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/wishlist" />
        <div className="sh-container" style={{ maxWidth:'760px', margin:'0 auto' }}>

          {/* Empty Hero Banner */}
          <div style={{ background:'white', borderRadius:'24px', padding:'40px 24px', textAlign:'center', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', marginBottom:'32px' }}>
            <div style={{ width:'84px', height:'84px', borderRadius:'50%', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', border:'1px solid #E2E8F0' }}>
              <Heart size={38} color="#0F172A" strokeWidth={1.75} />
            </div>
            <h2 style={{ fontSize:'24px', fontWeight:900, color:'#0F172A', marginBottom:'6px', letterSpacing:'-0.4px' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ color:'#64748B', marginBottom:'22px', fontSize:'14px', fontWeight:500 }}>
              Tap the ♡ icon on any item to save it for later.
            </p>
            <button className="sh-btn" onClick={() => navigate('/')} style={{ margin:'0 auto' }}>
              Explore Collection <ArrowRight size={16} />
            </button>
          </div>

          {/* ── SUGGESTED FOR YOU SCROLLER ── */}
          {suggested.length > 0 && (
            <div style={{ marginBottom:'36px' }}>
              <div style={{ marginBottom:'12px' }}>
                <h3 style={{ fontSize:'18px', fontWeight:900, color:'#0F172A', margin:'0 0 2px', letterSpacing:'-0.3px' }}>
                  Suggested for You
                </h3>
                <p style={{ fontSize:'12px', color:'#64748B', margin:0, fontWeight:500 }}>
                  Based on Your Activity
                </p>
              </div>

              <div style={{ display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'8px', WebkitOverflowScrolling:'touch', scrollSnapType:'x mandatory', scrollbarWidth:'none' }}>
                {suggested.map(p => {
                  const pPrice = Number(p.price || 0);
                  const pOrig = Number(p.original_price || Math.round(pPrice * 1.3));
                  const pDisc = pOrig > pPrice ? Math.round((1 - pPrice / pOrig) * 100) : 20;

                  return (
                    <div key={p.id} style={{
                      width:'175px', flexShrink:0, scrollSnapAlign:'start',
                      background:'#FFFFFF', borderRadius:'14px', border:'1px solid #E2E8F0',
                      padding:'10px', display:'flex', flexDirection:'column', boxShadow:'0 2px 8px rgba(15,23,42,0.03)',
                      boxSizing:'border-box'
                    }}>
                      <div style={{ width:'100%', aspectRatio:'1', borderRadius:'10px', overflow:'hidden', background:'#F8FAFC', marginBottom:'8px', position:'relative' }}>
                        <img src={getProductImage(p)} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        {p.category && (
                          <span style={{ position:'absolute', top:'6px', left:'6px', background:'#0F172A', color:'white', fontSize:'8.5px', fontWeight:800, padding:'2px 6px', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'.4px' }}>
                            {p.category === 'tailoring' ? 'TAILORING' : 'POPULAR'}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize:'12.5px', fontWeight:800, color:'#0F172A', margin:'0 0 6px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.3, minHeight:'32px' }}>
                        {p.name}
                      </p>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'14px', fontWeight:900, color:'#0F172A' }}>₹{pPrice.toFixed(0)}</span>
                        {pOrig > pPrice && (
                          <span style={{ fontSize:'11.5px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500 }}>₹{pOrig.toFixed(0)}</span>
                        )}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                        <span style={{ fontSize:'11px', fontWeight:800, color:'#16A34A' }}>{pDisc}% off</span>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'2px', fontSize:'9.5px', fontWeight:800, color:'#334155', background:'#F1F5F9', padding:'1px 5px', borderRadius:'4px', border:'1px solid #E2E8F0' }}>
                          <BadgeCheck size={10} color="#0F172A" /> Assured
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(p, 1)}
                        style={{
                          marginTop:'auto', width:'100%', padding:'8px 0', borderRadius:'8px',
                          background:'#0F172A', border:'1px solid #0F172A', color:'#FFFFFF',
                          fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all .2s'
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── LUXURY QUALITY BANNER ── */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF7 0%, #FAF2E6 50%, #F5E8D3 100%)',
            borderRadius: '24px', border: '1.5px solid #EBDCCB', padding: '32px 20px',
            textAlign: 'center', boxShadow: '0 12px 32px rgba(180, 130, 70, 0.08)'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '99px',
              background: '#FFFFFF', border: '1px solid #E2D3BF',
              color: '#8A6133', fontSize: '10.5px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px'
            }}>
              <Sparkles size={12} color="#B88346" />
              <span>Official Storefront · Nellore, AP</span>
            </div>
            <h3 style={{ fontSize:'20px', fontWeight:900, color:'#0F172A', marginBottom:'10px' }}>
              Asmalabel — Crafting Quality Tailoring &amp; Women's Fashion
            </h3>
            <p style={{ fontSize:'13.5px', color:'#475569', lineHeight:1.75, maxWidth:'680px', margin:'0 auto' }}>
              Handpicked boutique supplies, high-precision scissors, and sewing essentials delivered across India.
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* ── ACTIVE WISHLIST VIEW ── */
  const isSingle = validWishlist.length === 1;

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 0%, #F8FAFC 0%, #F1F5F9 100%)', paddingBottom:'80px' }}>
      <SEO title="My Wishlist Collection | Asmalabel" robots="noindex, nofollow" canonical="https://asmalabel.in/wishlist" />
      <div className="sh-container" style={{ padding:'28px 16px 0', maxWidth:'780px', margin:'0 auto' }}>

        {/* ── Heading: My Wishlist Collection & Saved for Later ── */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4.5vw, 28px)',
            fontWeight: 900,
            color: '#0F172A',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif'
          }}>
            My Wishlist Collection
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748B',
            fontWeight: 600,
            margin: '0 0 6px'
          }}>
            Saved for Later
          </p>
        </div>

        {/* ── Products Layout: Single Centered Card vs Responsive Grid ── */}
        <div className={isSingle ? "wishlist-single-wrapper" : "wishlist-grid-wrapper"}>
          {validWishlist.map(product => {
            const price = Number(product.price || 0);
            const orig = Number(product.original_price || 0);
            const disc = orig > price ? Math.round((1 - price / orig) * 100) : 0;

            return (
              <div
                key={product.id}
                className="wishlist-product-card"
              >
                {/* Product Image Frame with Close / Remove Button */}
                <div className="wishlist-img-frame">
                  <Link to={`/product/${product.id}`} style={{ display:'block', width:'100%', height:'100%' }}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    />
                  </Link>

                  {/* Top-Right Circular X Remove Button */}
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                    title="Remove from wishlist"
                    className="wishlist-remove-btn"
                  >
                    <X size={13} color="#FFFFFF" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Product Details */}
                <div style={{ textAlign:'center', flex:1, display:'flex', flexDirection:'column', marginBottom:'10px' }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration:'none' }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 3px',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '34px'
                    }}>
                      {product.name}
                    </h3>
                  </Link>

                  {product.category && (
                    <p style={{ fontSize:'11px', color:'#64748B', margin:'0 0 4px', fontWeight:500 }}>
                      {product.category === 'tailoring' ? 'Tailoring' : 'Fashion'}
                    </p>
                  )}

                  {/* Price Row (With wrap protection) */}
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:'4px 6px', flexWrap:'wrap', marginTop:'auto' }}>
                    <span style={{ fontSize:'14px', fontWeight:900, color:'#0F172A', whiteSpace:'nowrap' }}>
                      Rs. {price.toFixed(0)}
                    </span>
                    {orig > price && (
                      <span style={{ fontSize:'11px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500, whiteSpace:'nowrap' }}>
                        Rs. {orig.toFixed(0)}
                      </span>
                    )}
                    {disc > 0 && (
                      <span style={{ fontSize:'10px', fontWeight:800, color:'#16A34A', background:'#DCFCE7', padding:'1px 4px', borderRadius:'4px', whiteSpace:'nowrap' }}>
                        {disc}% off
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(product.id);
                  }}
                  className="wishlist-add-btn"
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Suggested for You Scroller Below Active Wishlist ── */}
        {suggested.length > 0 && (
          <div style={{ marginTop:'44px' }}>
            <div style={{ marginBottom:'12px' }}>
              <h3 style={{ fontSize:'18px', fontWeight:900, color:'#0F172A', margin:'0 0 2px', letterSpacing:'-0.3px' }}>
                Suggested for You
              </h3>
              <p style={{ fontSize:'12px', color:'#64748B', margin:0, fontWeight:500 }}>
                Based on Your Activity
              </p>
            </div>

            <div style={{ display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'8px', WebkitOverflowScrolling:'touch', scrollSnapType:'x mandatory', scrollbarWidth:'none' }}>
              {suggested.map(p => {
                const pPrice = Number(p.price || 0);
                const pOrig = Number(p.original_price || Math.round(pPrice * 1.3));
                const pDisc = pOrig > pPrice ? Math.round((1 - pPrice / pOrig) * 100) : 20;

                return (
                  <div key={p.id} style={{
                    width:'175px', flexShrink:0, scrollSnapAlign:'start',
                    background:'#FFFFFF', borderRadius:'14px', border:'1px solid #E2E8F0',
                    padding:'10px', display:'flex', flexDirection:'column', boxShadow:'0 2px 8px rgba(15,23,42,0.03)',
                    boxSizing:'border-box'
                  }}>
                    <div style={{ width:'100%', aspectRatio:'1', borderRadius:'10px', overflow:'hidden', background:'#F8FAFC', marginBottom:'8px', position:'relative' }}>
                      <img src={getProductImage(p)} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                    <p style={{ fontSize:'12.5px', fontWeight:800, color:'#0F172A', margin:'0 0 6px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.3, minHeight:'32px' }}>
                      {p.name}
                    </p>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'4px' }}>
                      <span style={{ fontSize:'14px', fontWeight:900, color:'#0F172A' }}>₹{pPrice.toFixed(0)}</span>
                      {pOrig > pPrice && (
                        <span style={{ fontSize:'11.5px', color:'#94A3B8', textDecoration:'line-through', fontWeight:500 }}>₹{pOrig.toFixed(0)}</span>
                      )}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                      <span style={{ fontSize:'11px', fontWeight:800, color:'#16A34A' }}>{pDisc}% off</span>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'2px', fontSize:'9.5px', fontWeight:800, color:'#334155', background:'#F1F5F9', padding:'1px 5px', borderRadius:'4px', border:'1px solid #E2E8F0' }}>
                        <BadgeCheck size={10} color="#0F172A" /> Assured
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      style={{
                        marginTop:'auto', width:'100%', padding:'8px 0', borderRadius:'8px',
                        background:'#0F172A', border:'1px solid #0F172A', color:'#FFFFFF',
                        fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all .2s'
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .wishlist-single-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .wishlist-single-wrapper .wishlist-product-card {
          width: 100%;
          max-width: 280px;
        }
        .wishlist-grid-wrapper {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        @media(min-width: 640px) {
          .wishlist-grid-wrapper {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }
        }
        .wishlist-product-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 8px 8px 10px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          position: relative;
          box-sizing: border-box;
          height: auto;
        }
        .wishlist-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          background: #F8FAFC;
          margin-bottom: 8px;
        }
        .wishlist-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
          max-width: 24px !important;
          max-height: 24px !important;
          border-radius: 50% !important;
          aspect-ratio: 1 / 1 !important;
          box-sizing: border-box !important;
          padding: 0 !important;
          margin: 0 !important;
          background: rgba(15, 23, 42, 0.65) !important;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: none !important;
          cursor: pointer;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .wishlist-remove-btn:hover {
          background: rgba(239, 68, 68, 0.95) !important;
          transform: scale(1.1);
        }
        .wishlist-add-btn {
          width: 100%;
          padding: 8px 0;
          border-radius: 8px;
          background: #0F172A;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 12px;
          border: none;
          cursor: pointer;
          transition: all .2s;
          box-shadow: 0 2px 6px rgba(15,23,42,0.08);
        }
        .wishlist-add-btn:hover {
          background: #1E293B;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
