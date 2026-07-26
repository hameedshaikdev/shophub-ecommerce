import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thanks! We'll keep you updated.`);
      setEmail('');
    }
  };

  return (
    <footer>
      <div className="footer-container">

        {/* ── Brand ── */}
        <div>
          <div className="footer-logo">ShopHub</div>
          <p className="footer-description">
            Premium tailoring tools and women's fashion accessories
            designed with quality, trust and affordability in mind.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com/shophub" target="_blank" rel="noopener noreferrer" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com/shophub" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/>
              </svg>
            </a>
            <a href="https://twitter.com/shophub" target="_blank" rel="noopener noreferrer" title="Twitter / X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@shophub" target="_blank" rel="noopener noreferrer" title="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1b1b1b"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <h3 className="footer-title">Quick Links</h3>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/">Products</Link>
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>

        {/* ── Policies ── */}
        <div>
          <h3 className="footer-title">Policies</h3>
          <div className="footer-links">
            <span style={{ color:'#c8c8c8', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'color .3s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#ff6b00'}
              onMouseLeave={e=>e.currentTarget.style.color='#c8c8c8'}>Privacy Policy</span>
            <span style={{ color:'#c8c8c8', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'color .3s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#ff6b00'}
              onMouseLeave={e=>e.currentTarget.style.color='#c8c8c8'}>Shipping Policy</span>
            <span style={{ color:'#c8c8c8', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'color .3s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#ff6b00'}
              onMouseLeave={e=>e.currentTarget.style.color='#c8c8c8'}>Return Policy</span>
            <span style={{ color:'#c8c8c8', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'color .3s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#ff6b00'}
              onMouseLeave={e=>e.currentTarget.style.color='#c8c8c8'}>Terms &amp; Conditions</span>
          </div>
        </div>

        {/* ── Support / Contact ── */}
        <div>
          <h3 className="footer-title">Support</h3>

          <div className="footer-contact">
            <div className="footer-contact-icon"><Mail size={15} /></div>
            <div>
              <span style={{ display:'block', fontSize:'10px', color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'3px' }}>Email</span>
              <a href="mailto:support@shophub.com" className="footer-contact-link">support@shophub.com</a>
            </div>
          </div>

          <div className="footer-contact">
            <div className="footer-contact-icon"><Phone size={15} /></div>
            <div>
              <span style={{ display:'block', fontSize:'10px', color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'3px' }}>Phone</span>
              <a href="tel:+919876543210" className="footer-contact-link">+91 98765 43210</a>
            </div>
          </div>

          <div className="footer-contact">
            <div className="footer-contact-icon"><MessageCircle size={15} /></div>
            <div>
              <span style={{ display:'block', fontSize:'10px', color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'3px' }}>WhatsApp</span>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="footer-contact-link">Chat with us</a>
            </div>
          </div>

          <div className="footer-contact">
            <div className="footer-contact-icon"><MapPin size={15} /></div>
            <div>
              <span style={{ display:'block', fontSize:'10px', color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'3px' }}>Location</span>
              <span style={{ color:'#d4d4d4', fontSize:'13px' }}>Hyderabad, India</span>
            </div>
          </div>

          {/* Newsletter inside footer */}
          <div style={{ marginTop:'20px' }}>
            <p style={{ color:'#aaa', fontSize:'12px', fontWeight:600, marginBottom:'10px', textTransform:'uppercase', letterSpacing:'.5px' }}>Newsletter</p>
            <form className="newsletter" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit">Go</button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ maxWidth:'1250px', margin:'0 auto', padding:'0 30px' }}>
        <div className="footer-divider"></div>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <p>© 2026 ShopHub. All Rights Reserved.</p>
          <div className="footer-payments">
            <span style={{ fontSize:'12px', color:'#555', marginRight:'8px' }}>We accept:</span>
            {['Visa','Mastercard','RuPay','UPI','Net Banking'].map(p => (
              <span key={p} className="payment-pill">{p}</span>
            ))}
          </div>
          <p>Made with ❤️ in India</p>
        </div>
      </div>

      <style>{`
        .footer-contact-link {
          color: #ff6b00;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: color .3s;
        }
        .footer-contact-link:hover { color: #ff9540; text-decoration: underline; }
      `}</style>
    </footer>
  );
}
