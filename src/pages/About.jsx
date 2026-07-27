import { Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'80px' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#FC8019,#FF9F1C)', padding:'48px 24px 40px' }}>
        <div className="container-center" style={{ maxWidth:'720px', textAlign:'center' }}>
          <p style={{ fontSize:'40px', marginBottom:'12px' }}>🏪</p>
          <h1 style={{ fontSize:'32px', fontWeight:900, color:'white', marginBottom:'8px' }}>
            About AS HUB
          </h1>
          <p style={{ color:'rgba(255,255,255,.85)', fontSize:'15px', lineHeight:1.6 }}>
            Your one-stop destination for premium tailoring tools and women's fashion
          </p>
        </div>
      </div>

      <div className="container-center" style={{ maxWidth:'720px', padding:'24px 16px' }}>

        {/* Categories */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
          {[
            { emoji:'🪡', title:'Tailoring Tools', text:'Sewing machines, scissors, threads, needles & measuring tools for professionals.' },
            { emoji:'👗', title:"Women's Fashion", text:'Trendy dresses, ethnic wear, tops, bottoms and stylish accessories.' },
          ].map(c => (
            <div key={c.title} style={{ background:'white', borderRadius:'16px', padding:'18px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:'32px', marginBottom:'8px' }}>{c.emoji}</div>
              <h3 style={{ fontSize:'14px', fontWeight:900, color:'var(--text)', marginBottom:'6px' }}>{c.title}</h3>
              <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', marginBottom:'16px' }}>
          <h2 style={{ fontSize:'17px', fontWeight:900, color:'var(--text)', marginBottom:'14px' }}>Why Choose Us?</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { e:'✅', t:'Quality products from trusted manufacturers' },
              { e:'💰', t:'Competitive pricing with regular discounts' },
              { e:'🚚', t:'Free delivery on all orders' },
              { e:'📱', t:'Easy UPI payment — no extra charges' },
              { e:'💬', t:'Fast order confirmation via WhatsApp' },
              { e:'🎯', t:'Dedicated customer support' },
            ].map(({ e, t }) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background:'var(--bg)', borderRadius:'12px' }}>
                <span style={{ fontSize:'18px', flexShrink:0 }}>{e}</span>
                <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-2)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', marginBottom:'16px' }}>
          <h2 style={{ fontSize:'17px', fontWeight:900, color:'var(--text)', marginBottom:'14px' }}>Contact Us</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { href:'mailto:as.businezzz@gmail.com', icon:<Mail size={18} color="#3B82F6"/>, label:'Email', value:'as.businezzz@gmail.com', bg:'#EFF6FF' },
              { href:'tel:+917013942909',              icon:<Phone size={18} color="#16A34A"/>, label:'Phone', value:'+91 70139 42909',       bg:'#F0FDF4' },
              { href:'https://wa.me/917013942909', target:'_blank', icon:<MessageCircle size={18} color="#25D366"/>, label:'WhatsApp', value:'Chat with us', bg:'#F0FDF4' },
            ].map(({ href, icon, label, value, bg, target }) => (
              <a key={label} href={href} target={target} rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 16px', background:bg, borderRadius:'14px', textDecoration:'none', transition:'opacity .2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='.8'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                <div style={{ width:'40px', height:'40px', background:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'var(--shadow-xs)' }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:'2px' }}>{label}</p>
                  <p style={{ fontSize:'14px', fontWeight:800, color:'var(--text)' }}>{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Social */}
        <div style={{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
          <h2 style={{ fontSize:'17px', fontWeight:900, color:'var(--text)', marginBottom:'14px' }}>Follow Us</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { href:'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr', emoji:'📘', label:'Facebook', handle:'AS HUB', color:'#1877F2', bg:'#EFF6FF' },
              { href:'https://www.instagram.com/as_tailoring_tools_textiles', emoji:'📷', label:'Instagram', handle:'@as_tailoring_tools_textiles', color:'#E1306C', bg:'#FDF2F8' },
              { href:'https://youtube.com/@astailoringtoolstextiles?si=pJxUJtUY7ykHlpSK', emoji:'▶️', label:'YouTube', handle:'@astailoringtoolstextiles', color:'#FF0000', bg:'#FEF2F2' },
            ].map(({ href, emoji, label, handle, color, bg }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 16px', background:bg, borderRadius:'14px', textDecoration:'none' }}>
                <span style={{ fontSize:'24px', flexShrink:0 }}>{emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'14px', fontWeight:800, color:'var(--text)' }}>{label}</p>
                  <p style={{ fontSize:'12px', color:'var(--text-3)' }}>{handle}</p>
                </div>
                <ExternalLink size={16} color={color} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
