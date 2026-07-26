import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background:'linear-gradient(180deg,#1b1b1b,#0d0d0d)',
      color:'white',
      borderTopLeftRadius:'32px',
      borderTopRightRadius:'32px',
      marginTop:'40px',
      // Extra bottom padding on mobile so bottom nav doesn't overlap
      paddingBottom:'80px',
    }}>
      <div style={{ maxWidth:'1250px', margin:'0 auto', padding:'48px 24px 24px' }}>

        {/* ── Mobile: Compact layout ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>

          {/* Brand */}
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'30px', fontWeight:900, color:'#FC8019', marginBottom:'8px' }}>AS HUB</div>
            <p style={{ color:'#aaa', fontSize:'14px', lineHeight:1.7, maxWidth:'300px', margin:'0 auto' }}>
              Premium tailoring tools &amp; women's fashion — quality you can trust
            </p>
            {/* Social icons */}
            <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginTop:'16px' }}>
              {[
                { href:'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr', emoji:'📘' },
                { href:'https://www.instagram.com/as_tailoring_tools_textiles', emoji:'📷' },
                { href:'https://youtube.com/@astailoringtoolstextiles?si=pJxUJtUY7ykHlpSK', emoji:'▶️' },
              ].map(({ href, emoji }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width:'44px', height:'44px', borderRadius:'50%', background:'#242424', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', textDecoration:'none', transition:'background .3s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#FC8019'}
                  onMouseLeave={e => e.currentTarget.style.background='#242424'}>
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links + Contact — side by side on mobile */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
            <div>
              <h3 style={{ fontSize:'15px', fontWeight:800, color:'white', marginBottom:'14px', position:'relative', paddingBottom:'8px' }}>
                Quick Links
                <span style={{ position:'absolute', bottom:0, left:0, width:'30px', height:'3px', background:'#FC8019', borderRadius:'99px' }} />
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[['/', 'Home'], ['/about', 'About'], ['/cart', 'Cart'], ['/wishlist', 'Wishlist'], ['/orders', 'Orders']].map(([to, label]) => (
                  <Link key={to} to={to} style={{ color:'#c8c8c8', fontSize:'13px', fontWeight:500, textDecoration:'none', transition:'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#FC8019'}
                    onMouseLeave={e => e.currentTarget.style.color='#c8c8c8'}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize:'15px', fontWeight:800, color:'white', marginBottom:'14px', position:'relative', paddingBottom:'8px' }}>
                Contact
                <span style={{ position:'absolute', bottom:0, left:0, width:'30px', height:'3px', background:'#FC8019', borderRadius:'99px' }} />
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <a href="mailto:as.businezzz@gmail.com" style={{ display:'flex', alignItems:'flex-start', gap:'8px', textDecoration:'none' }}>
                  <Mail size={14} color="#FC8019" style={{ marginTop:'2px', flexShrink:0 }} />
                  <span style={{ color:'#c8c8c8', fontSize:'12px', wordBreak:'break-all' }}>as.businezzz@gmail.com</span>
                </a>
                <a href="tel:+917013942909" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
                  <Phone size={14} color="#FC8019" style={{ flexShrink:0 }} />
                  <span style={{ color:'#c8c8c8', fontSize:'12px' }}>+91 70139 42909</span>
                </a>
                <a href="https://wa.me/917013942909" target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
                  <MessageCircle size={14} color="#25D366" style={{ flexShrink:0 }} />
                  <span style={{ color:'#25D366', fontSize:'12px', fontWeight:700 }}>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div style={{ textAlign:'center' }}>
            <p style={{ color:'#666', fontSize:'11px', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'.5px' }}>We Accept</p>
            <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'8px' }}>
              {['UPI','GPay','PhonePe','Paytm'].map(p => (
                <span key={p} style={{ padding:'4px 12px', borderRadius:'8px', background:'rgba(255,255,255,.07)', fontSize:'11px', fontWeight:700, color:'#ccc', border:'1px solid rgba(255,255,255,.1)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Divider + copyright */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'20px', textAlign:'center' }}>
            <p style={{ color:'#555', fontSize:'12px' }}>© 2026 AS HUB. All Rights Reserved.</p>
            <p style={{ color:'#444', fontSize:'11px', marginTop:'4px' }}>Made with ❤️ in India</p>
          </div>

        </div>
      </div>

      {/* Desktop grid layout */}
      <style>{`
        @media(min-width: 768px) {
          footer > div > div {
            display: grid !important;
            grid-template-columns: 2fr 1fr 1fr !important;
            gap: 48px !important;
          }
          footer > div > div > div:first-child {
            text-align: left !important;
          }
          footer > div > div > div:first-child > div {
            justify-content: flex-start !important;
          }
          footer > div > div > div:nth-child(2) {
            grid-column: span 1 !important;
          }
          footer {
            padding-bottom: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
