import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const location = useLocation();
  const { cmsData, cmsDraft } = useApp();
  if (location.pathname.startsWith('/admin')) return null;

  const isPreviewMode = window.location.search.includes('preview=draft');
  const activeCms = isPreviewMode ? (cmsDraft || cmsData) : cmsData;
  const f = activeCms?.footer || {};
  const s = f.socials || {};

  const fbUrl = s.facebook || 'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr';
  const igUrl = s.instagram || 'https://www.instagram.com/as_tailoring_tools_textiles';
  const ytUrl = s.youtube || 'https://youtube.com/@astailoringtoolstextiles';
  const waNum = s.whatsapp || '917013942909';
  const phone = f.phone || '7013942909';
  const email = f.email || 'as.businezzz@gmail.com';
  const copyright = f.copyright || '© 2026 AS HUB · All Rights Reserved';

  return (
    <footer style={{ background:'#0F172A', paddingBottom:'calc(90px + env(safe-area-inset-bottom, 0px))' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto',
        padding:'48px 24px 40px', textAlign:'center',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'22px' }}>

        {/* Logo + name */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <img src="/logo.png" alt="Asmalabel"
            style={{ width:'48px', height:'48px', borderRadius:'50%',
              objectFit:'cover', objectPosition:'center',
              border:'2.5px solid #1A1A2E', flexShrink:0 }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
          <div style={{ display:'none', width:'48px', height:'48px', borderRadius:'50%',
            background:'linear-gradient(135deg,#1E2A45,#0F3460)',
            alignItems:'center', justifyContent:'center',
            fontSize:'18px', fontWeight:900, color:'white', flexShrink:0 }}>
            A
          </div>
          <div style={{ textAlign:'left' }}>
            <p style={{ fontSize:'20px', fontWeight:900, color:'white',
              letterSpacing:'-.3px', lineHeight:1 }}>Asmalabel</p>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,.85)', marginTop:'3px' }}>
              Tailoring &amp; Fashion
            </p>
          </div>
        </div>

        {/* Tagline / About */}
        <p style={{ fontSize:'13px', color:'rgba(255,255,255,.85)',
          lineHeight:1.75, maxWidth:'340px' }}>
          {f.aboutText || "Premium tailoring tools & women's fashion. Quality you can trust, delivered to your door."}
        </p>

        {/* Navigation Links for SEO & Crawlability */}
        <div style={{ display: 'flex', gap: '8px 14px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '13px', fontWeight: 600, maxWidth: '420px', margin: '0 auto' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>·</span>
          <Link to="/about" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none', whiteSpace: 'nowrap' }}>About Us</Link>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>·</span>
          <Link to="/?category=tailoring" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Tailoring Tools</Link>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>·</span>
          <Link to="/?category=fashion" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Women's Fashion</Link>
        </div>

        {/* Social icons */}
        <div style={{ display:'flex', gap:'10px', alignItems: 'center' }}>

          {/* Facebook */}
          {fbUrl && (
            <a href={fbUrl}
              target="_blank" rel="noopener noreferrer" title="Facebook"
              style={{ width:'36px', height:'36px', borderRadius:'10px',
                background:'#1877F2', display:'flex', alignItems:'center',
                justifyContent:'center', transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          )}

          {/* Instagram */}
          {igUrl && (
            <a href={igUrl}
              target="_blank" rel="noopener noreferrer" title="Instagram"
              style={{ width:'36px', height:'36px', borderRadius:'10px',
                background:'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          )}

          {/* YouTube */}
          {ytUrl && (
            <a href={ytUrl}
              target="_blank" rel="noopener noreferrer" title="YouTube"
              style={{ width:'36px', height:'36px', borderRadius:'10px',
                background:'#FF0000', display:'flex', alignItems:'center',
                justifyContent:'center', transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.47 12.35 12.35 0 0 0-7.64 0A4.83 4.83 0 0 1 4.41 6.69 49.68 49.68 0 0 0 4 12a49.68 49.68 0 0 0 .41 5.31 4.83 4.83 0 0 1 3.77 2.47 12.35 12.35 0 0 0 7.64 0 4.83 4.83 0 0 1 3.77-2.47A49.68 49.68 0 0 0 20 12a49.68 49.68 0 0 0-.41-5.31zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
            </a>
          )}

          {/* WhatsApp */}
          {waNum && (
            <a href={`https://wa.me/${waNum.replace(/\D/g, '')}`}
              target="_blank" rel="noopener noreferrer" title="WhatsApp"
              style={{ width:'36px', height:'36px', borderRadius:'10px',
                background:'#25D366', display:'flex', alignItems:'center',
                justifyContent:'center', transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a8.6 8.6 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12.004 2a9.96 9.96 0 0 0-8.463 15.23L2 22l4.916-1.489A9.96 9.96 0 1 0 12.004 2zm0 18.214a8.228 8.228 0 0 1-4.354-1.244l-.31-.186-3.23.98.886-3.146-.203-.32a8.23 8.23 0 1 1 7.211 3.916z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Contact details */}
        <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', justifyContent:'center', alignItems: 'center' }}>
          {email && (
            <a href={`mailto:${email}`}
              style={{ fontSize:'12px', color:'rgba(255,255,255,.85)', textDecoration:'none' }}>
              {email}
            </a>
          )}
          {email && phone && <span style={{ color:'rgba(255,255,255,.4)' }}>·</span>}
          {phone && (
            <a href={`tel:+91${phone.replace(/\D/g, '')}`}
              style={{ fontSize:'12px', color:'rgba(255,255,255,.85)', textDecoration:'none' }}>
              +91 {phone}
            </a>
          )}
        </div>

        <p style={{ fontSize:'11px', color:'rgba(255,255,255,.4)' }}>
          {copyright}
        </p>
      </div>
    </footer>
  );
}
