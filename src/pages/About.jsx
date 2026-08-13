import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BadgeCheck, Truck, ShieldCheck, MessageCircle, Star, Package,
  Mail, Phone, Clock, Scissors, Sparkles, Target, Heart, Award,
  Users, ChevronDown, Zap, RefreshCcw, ArrowRight,
} from 'lucide-react';
import { supabase } from '../config/supabase';

/* ── Fallback counts shown while loading or if DB not yet set up ── */
const FALLBACK = {
  instagram_tailoring: { followers: 0, handle: '@as_tailoring_tools_textiles', description: 'Professional sewing machines, tailoring tools, daily tips & tutorials for craftsmen', url: 'https://www.instagram.com/as_tailoring_tools_textiles' },
  instagram_fashion:   { followers: 0, handle: '@asma_label.in',              description: "Women's fashion, ethnic wear collections, trending outfits & style inspiration",      url: 'https://www.instagram.com/asma_label.in' },
  youtube:             { followers: 0, handle: '@astailoringtoolstextiles',    description: 'Sewing tutorials, machine reviews, tailoring tips & DIY fashion projects',            url: 'https://youtube.com/@astailoringtoolstextiles' },
  facebook:            { followers: 0, handle: 'As Textile & Tailoring',      description: 'Send your fabrics to us and get magic created just for you - online tailoring store', url: 'https://www.facebook.com/share/166X2VepUx/?mibextid=wwXIfr' },
};

const fu = { hidden:{opacity:0,y:32},  visible:{opacity:1,y:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const fl = { hidden:{opacity:0,x:-32}, visible:{opacity:1,x:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const fr = { hidden:{opacity:0,x:32},  visible:{opacity:1,x:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const si = { hidden:{opacity:0,scale:.92}, visible:{opacity:1,scale:1, transition:{duration:.5,ease:[.22,1,.36,1]}} };
const sg = { visible:{ transition:{ staggerChildren:.08 } } };

const CW = { maxWidth:'1100px', margin:'0 auto', padding:'0 20px' };

function R({ v=fu, children, style={} }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={v} style={style}>{children}</motion.div>;
}
function SR({ children, className='', style={} }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={sg} className={className} style={style}>{children}</motion.div>;
}

function Label({ c='#8E8E93', children }) {
  return <p style={{ fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'2px',color:c,marginBottom:'12px' }}>{children}</p>;
}
function Badge({ color='#7C3AED', bg='#F5F3FF', icon:Icon, children }) {
  return (
    <span style={{ display:'inline-flex',alignItems:'center',gap:'5px',padding:'5px 12px',
      borderRadius:'99px',background:bg,color,fontSize:'11px',fontWeight:800,letterSpacing:'.2px' }}>
      {Icon && <Icon size={11} strokeWidth={2} />}{children}
    </span>
  );
}

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid #F0F0F0' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'18px 0',background:'none',border:'none',cursor:'pointer',textAlign:'left',gap:'16px' }}>
        <span style={{ fontSize:'15px',fontWeight:700,color:'#0A0A0A' }}>{q}</span>
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:.25 }}
          style={{ flexShrink:0,color:'#8E8E93',display:'flex' }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <motion.div initial={false} animate={{ height:open?'auto':0, opacity:open?1:0 }}
        transition={{ duration:.3, ease:[.22,1,.36,1] }} style={{ overflow:'hidden' }}>
        <p style={{ fontSize:'14px',color:'#555',lineHeight:1.75,paddingBottom:'18px' }}>{a}</p>
      </motion.div>
    </div>
  );
}

function FCard({ icon:Icon, title, desc, ic='#7C3AED', ib='#F5F3FF' }) {
  return (
    <motion.div variants={si}
      whileHover={{ y:-6, boxShadow:'0 16px 48px rgba(0,0,0,.10)' }}
      transition={{ type:'spring', stiffness:300, damping:22 }}
      className="about-card-item"
      style={{ background:'white', borderRadius:'20px', padding:'22px 20px',
        border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
      <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:ib,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
        <Icon size={20} strokeWidth={1.8} color={ic} />
      </div>
      <p style={{ fontSize:'14px', fontWeight:800, color:'#0A0A0A', marginBottom:'6px' }}>{title}</p>
      <p style={{ fontSize:'12px', color:'#8E8E93', lineHeight:1.6 }}>{desc}</p>
    </motion.div>
  );
}

function RCard({ name, initials, bg, rating, text, product }) {
  return (
    <motion.div variants={si}
      whileHover={{ y:-5, boxShadow:'0 16px 48px rgba(0,0,0,.10)' }}
      className="about-card-item"
      style={{ background:'white', borderRadius:'20px', padding:'20px',
        border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:bg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'13px', fontWeight:900, color:'white', flexShrink:0 }}>{initials}</div>
        <div>
          <p style={{ fontSize:'13px', fontWeight:800, color:'#0A0A0A' }}>{name}</p>
          <Badge color='#059669' bg='#F0FDF4' icon={BadgeCheck}>Verified Customer</Badge>
        </div>
      </div>
      <div style={{ display:'flex', gap:'2px', marginBottom:'8px' }}>
        {[...Array(5)].map((_,i) =>
          <Star key={i} size={12} fill={i<rating?'#FFB800':'none'} color={i<rating?'#FFB800':'#E0E0E0'}/>)}
      </div>
      <p style={{ fontSize:'12px', color:'#444', lineHeight:1.6, marginBottom:'10px', fontStyle:'italic' }}>"{text}"</p>
      <p style={{ fontSize:'11px', color:'#8E8E93', display:'flex', alignItems:'center', gap:'4px' }}>
        <Package size={11}/> {product}
      </p>
    </motion.div>
  );
}

/* ── Format follower count nicely ─────────────────────────── */
// Accepts raw numbers: 20000 → "20K+", 1500 → "1.5K+", 1000000 → "1M+"
function fmtCount(n) {
  const num = Number(n);
  if (!num || num === 0) return '—';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K+`;
  return `${num}+`;
}

export default function About() {
  const [socialStats, setSocialStats] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSocialStats() {
      try {
        const { data, error } = await supabase
          .from('social_media_stats')
          .select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const merged = { ...FALLBACK };
          data.forEach(item => {
            if (merged[item.platform]) {
              merged[item.platform] = {
                followers:   item.followers   ?? merged[item.platform].followers,
                handle:      item.handle      || merged[item.platform].handle,
                description: item.description || merged[item.platform].description,
                url:         item.platform_url || merged[item.platform].url,
              };
            }
          });
          setSocialStats(merged);
        }
      } catch (err) {
        // silently fall back to FALLBACK values already set in state
        console.error('Social stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSocialStats();
  }, []);

  const FEATURES = [
    { icon:BadgeCheck,    title:'Genuine Products',    desc:'Every product verified before listing.',         ic:'#16A34A', ib:'#F0FDF4' },
    { icon:Truck,         title:'Fast Delivery',       desc:'Pan India. Dispatched within 24 hours.',        ic:'#2563EB', ib:'#EFF6FF' },
    { icon:ShieldCheck,   title:'Secure UPI Payments', desc:'100% safe, encrypted checkout. No hidden fees.',ic:'#7C3AED', ib:'#F5F3FF' },
    { icon:MessageCircle, title:'WhatsApp Support',    desc:'Real support. Average reply: 10 minutes.',      ic:'#16A34A', ib:'#F0FDF4' },
    { icon:Star,          title:'Premium Quality',     desc:'Curated top-quality tools and fashion items.',  ic:'#D97706', ib:'#FFFBEB' },
    { icon:Zap,           title:'Best Prices',         desc:'No middlemen. Lowest prices guaranteed.',       ic:'#EA580C', ib:'#FFF7ED' },
  ];
  const VALUES = [
    { icon:Award,    title:'Quality',               desc:'We never compromise on product quality.',  ic:'#DC2626', ib:'#FEF2F2' },
    { icon:Heart,    title:'Trust',                 desc:'Transparency and honesty in everything.',  ic:'#DB2777', ib:'#FDF2F8' },
    { icon:Sparkles, title:'Innovation',            desc:'Constantly improving our catalog.',         ic:'#7C3AED', ib:'#F5F3FF' },
    { icon:Users,    title:'Customer Satisfaction', desc:'Every decision puts the customer first.',  ic:'#2563EB', ib:'#EFF6FF' },
  ];
  const REVIEWS = [
    { name:'Priya Sharma',  initials:'PS', bg:'#7C3AED', rating:5, text:'Amazing quality sewing machine! Runs so smoothly, exactly what I needed.', product:'Professional Sewing Machine' },
    { name:'Meena Reddy',   initials:'MR', bg:'#DB2777', rating:5, text:'Dress quality outstanding. Got so many compliments! Will order again.', product:'Floral Maxi Dress' },
    { name:'Lakshmi Devi',  initials:'LD', bg:'#0369A1', rating:4, text:'Thread quality is excellent. Colors vibrant and don\'t fade at all.', product:'Polyester Thread Set' },
    { name:'Sunitha Rao',   initials:'SR', bg:'#059669', rating:5, text:'Fast delivery, genuine products. Scissors are razor sharp and balanced.', product:'Fabric Cutting Scissors' },
    { name:'Kavitha Nair',  initials:'KN', bg:'#D97706', rating:5, text:'Best quality ethnic wear. The embroidery work is gorgeous. Love it!', product:'Embroidered Kurti' },
    { name:'Rekha Pillai',  initials:'RP', bg:'#DC2626', rating:4, text:'Needles are exactly what I wanted. Strong, sharp and don\'t break.', product:'Universal Needle Set' },
  ];
  const FAQS = [
    { q:'Do you ship across India?', a:'Yes! We ship pan India. Delivery takes 3–7 business days depending on your location.' },
    { q:'How do I contact support?', a:'WhatsApp at +91 70139 42909 or email as.businezzz@gmail.com. We reply within 10 minutes on WhatsApp.' },
    { q:'Why UPI only? No Cash on Delivery?', a:'UPI ensures faster processing, prevents fake orders, and lets us keep prices low. Payments are instant.' },
    { q:'How long does delivery take?', a:'Orders dispatched within 24 hours of payment. Delivery: 3–7 business days.' },
    { q:'Can I return or exchange a product?', a:'Yes, 7-day return policy. Contact us on WhatsApp with photos for defective or incorrect items.' },
    { q:'Are all products genuine?', a:'100%. Every product is sourced from verified manufacturers and quality-checked before listing.' },
  ];
  const TRUST = [
    { icon:BadgeCheck, text:'100% Genuine' },
    { icon:ShieldCheck, text:'Secure Payments' },
    { icon:Truck, text:'Fast Delivery' },
    { icon:RefreshCcw, text:'Easy Returns' },
    { icon:MessageCircle, text:'24/7 Support' },
  ];

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh', paddingBottom:'88px' }}>

      {/* HERO */}
      <div style={{ background:'linear-gradient(160deg,#1A1A2E 0%,#0F3460 100%)',
        position:'relative', overflow:'hidden', padding:'56px 20px 64px' }}>
        <motion.div animate={{ scale:[1,1.3,1], opacity:[.3,.5,.3] }}
          transition={{ duration:8, repeat:Infinity }}
          style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%',
            background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
            top:'-150px', right:'-100px', pointerEvents:'none' }} />
        <div style={CW}>
          <motion.div initial="hidden" animate="visible" variants={sg}>
            <motion.div variants={fu} style={{ marginBottom:'14px' }}>
              <Badge color='#C084FC' bg='rgba(192,132,252,.15)' icon={Users}>
                Trusted by 2,000+ Customers
              </Badge>
            </motion.div>
            <motion.h1 variants={fu}
              style={{ fontSize:'clamp(28px,5vw,56px)', fontWeight:900, color:'white',
                letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:'12px', maxWidth:'700px' }}>
              About <span style={{ color:'#C084FC' }}>Asmalabel</span>
            </motion.h1>
            <motion.p variants={fu}
              style={{ fontSize:'clamp(14px,1.8vw,17px)', color:'rgba(255,255,255,.65)',
                maxWidth:'520px', lineHeight:1.7, marginBottom:'32px' }}>
              Premium tailoring tools and curated women's fashion delivered across India.
            </motion.p>
            <motion.div variants={sg} className="about-stats-row sh-scroll-hide">
              {[
                {icon:Star, stat:'4.9', label:'Rating'},
                {icon:Package, stat:'500+', label:'Products'},
                {icon:Truck, stat:'Pan India', label:'Delivery'},
                {icon:Users, stat:'2,000+', label:'Customers'},
              ].map(({ icon:Icon, stat, label }) => (
                <motion.div key={label} variants={fu}
                  style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'12px',
                    background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={16} strokeWidth={1.8} color='#C084FC' />
                  </div>
                  <div>
                    <p style={{ fontSize:'16px', fontWeight:900, color:'white', lineHeight:1, margin:0 }}>{stat}</p>
                    <p style={{ fontSize:'10px', color:'rgba(255,255,255,.5)', marginTop:'2px', margin:0 }}>{label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CONNECT WITH US - Social Media Section */}
      <div style={{ padding:'80px 20px 88px', background:'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px', textAlign:'center', maxWidth:'640px', margin:'0 auto 48px' }}>
            <Label c='#6B4F8A'>Connect With Us</Label>
            <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#0F172A',
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing:'-0.8px', lineHeight:1.2, marginBottom:'12px' }}>
              Our Social Media
            </h2>
            <p style={{ fontSize:'15px', color:'#64748B', lineHeight:1.7, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
              Follow us for daily inspiration, tailoring tutorials, and exclusive new collection updates.
            </p>
          </div></R>

          {/* 2-col responsive grid */}
          <div className="social-grid">

            {[
              {
                key: 'instagram_tailoring',
                platform: 'Instagram',
                sub: 'Tailoring Tools',
                color: '#E1306C',
                badgeBg: '#FCE4EC',
                badgeColor: '#C13584',
                handleColor: '#C13584',
                borderColor: 'rgba(225, 48, 108, 0.25)',
                iconGrad: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #FD1D1D 100%)',
                btnGrad: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #FD1D1D 100%)',
                glow: 'rgba(225, 48, 108, 0.3)',
                statLabel: 'Followers',
                url: socialStats.instagram_tailoring.url || 'https://www.instagram.com/as_tailoring_tools_textiles',
                handle: socialStats.instagram_tailoring.handle,
                desc: socialStats.instagram_tailoring.description || 'Professional sewing tools, machines & tailoring tips for craftsmen',
                count: socialStats.instagram_tailoring.followers,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ),
              },
              {
                key: 'instagram_fashion',
                platform: 'Instagram',
                sub: 'Fashion Label',
                color: '#E1306C',
                badgeBg: '#FCE4EC',
                badgeColor: '#C13584',
                handleColor: '#C13584',
                borderColor: 'rgba(225, 48, 108, 0.25)',
                iconGrad: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #FD1D1D 100%)',
                btnGrad: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #FD1D1D 100%)',
                glow: 'rgba(225, 48, 108, 0.3)',
                statLabel: 'Followers',
                url: socialStats.instagram_fashion.url || 'https://www.instagram.com/asma_label.in',
                handle: socialStats.instagram_fashion.handle,
                desc: socialStats.instagram_fashion.description || "Women's fashion, ethnic wear & style inspiration",
                count: socialStats.instagram_fashion.followers,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ),
              },
              {
                key: 'youtube',
                platform: 'YouTube',
                sub: 'Video Channel',
                color: '#DC2626',
                badgeBg: '#FEE2E2',
                badgeColor: '#DC2626',
                handleColor: '#B91C1C',
                borderColor: 'rgba(220, 38, 38, 0.2)',
                iconGrad: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                btnGrad: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                glow: 'rgba(239, 68, 68, 0.25)',
                statLabel: 'Subscribers',
                url: socialStats.youtube.url || 'https://youtube.com/@astailoringtoolstextiles',
                handle: socialStats.youtube.handle,
                desc: socialStats.youtube.description || 'Sewing tutorials, machine reviews & DIY fashion projects',
                count: socialStats.youtube.followers,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ),
              },
              {
                key: 'facebook',
                platform: 'Facebook',
                sub: 'Business Page',
                color: '#2563EB',
                badgeBg: '#DBEAFE',
                badgeColor: '#2563EB',
                handleColor: '#1D4ED8',
                borderColor: 'rgba(37, 99, 235, 0.2)',
                iconGrad: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                btnGrad: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                glow: 'rgba(59, 130, 246, 0.25)',
                statLabel: 'Followers',
                url: socialStats.facebook.url || 'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr',
                handle: socialStats.facebook.handle,
                desc: socialStats.facebook.description || 'Latest products, customer reviews & special offers',
                count: socialStats.facebook.followers,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                ),
              },
            ].map((s, i) => (
              <motion.a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y:-4, boxShadow:`0 20px 40px ${s.glow}`, borderColor: s.color }}
                className="social-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px',
                  border: `1.5px solid ${s.borderColor}`,
                  boxShadow: '0 6px 24px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>

                {/* Left: Brand Icon Box with vibrant gradient */}
                <div className="social-card-icon-box" style={{ width:'56px', height:'56px', borderRadius:'18px',
                  background: s.iconGrad, display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0, boxShadow:`0 8px 20px ${s.glow}` }}>
                  {s.icon}
                </div>

                {/* Middle: Title, Handle, Description */}
                <div className="social-card-content" style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap', justifyContent:'inherit' }}>
                    <span style={{ fontSize:'16px', fontWeight:800, color:'#0F172A', whiteSpace:'nowrap' }}>{s.platform}</span>
                    <span style={{ fontSize:'11px', fontWeight:800, color: s.badgeColor,
                      background: s.badgeBg, padding:'4px 10px', borderRadius:'99px',
                      whiteSpace:'nowrap', letterSpacing:'0.2px' }}>{s.sub}</span>
                  </div>
                  <p className="social-card-handle" style={{ fontSize:'13px', fontWeight:700, color: s.handleColor, margin:'0 0 4px',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.handle}</p>
                  <p className="social-card-desc" style={{ fontSize:'12px', color:'#64748B', margin:0, lineHeight:1.5,
                    wordBreak:'break-word', display:'-webkit-box', WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical', overflow:'hidden' }}>{s.desc}</p>
                </div>

                {/* Right: Stat count + Brand Button */}
                <div className="social-card-right" style={{ textAlign:'right', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <p className="social-card-count" style={{ fontSize:'24px', fontWeight:900, color: s.color, margin:0, lineHeight:1.1, letterSpacing:'-0.5px' }}>
                    {loading ? '…' : fmtCount(s.count)}
                  </p>
                  <p style={{ fontSize:'11px', color:'#94A3B8', margin:'3px 0 8px', fontWeight:700, whiteSpace:'nowrap' }}>{s.statLabel}</p>
                  <span className="social-card-btn" style={{
                    fontSize: '12px', fontWeight: 800, color: '#FFFFFF',
                    background: s.btnGrad, padding: '7px 16px', borderRadius: '99px',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    boxShadow: `0 4px 14px ${s.glow}`
                  }}>
                    Follow <ArrowRight size={12} strokeWidth={2.5} />
                  </span>
                </div>

              </motion.a>
            ))}

          </div>
        </div>
      </div>

      {/* TRUST STRIP moved down - keeping original position */}
      <div style={{ background:'white', borderBottom:'1px solid #F0F0F0' }}>
        <div style={CW}>
          <div className="sh-scroll-hide" style={{ display:'flex', overflowX:'auto', gap:'12px', padding:'12px 4px' }}>
            {TRUST.map(({ icon:Icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:'6px',
                padding:'8px 14px', borderRadius:'9999px', background:'#F8FAFC', border:'1px solid #E2E8F0', flexShrink:0 }}>
                <Icon size={14} strokeWidth={2} color='#1A1A2E' />
                <span style={{ fontSize:'12px', fontWeight:700, color:'#0A0A0A', whiteSpace:'nowrap' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OUR STORY */}
      <div style={{ padding:'56px 20px', background:'white' }}>
        <div style={CW}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
            gap:'40px', alignItems:'center' }}>
            <R v={fl}>
              <Label>Our Story</Label>
              <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.5px', lineHeight:1.2, marginBottom:'24px' }}>
                Built for craftsmen,<br/>loved by fashionistas
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {[
                  {year:'2022',text:'Started as a small tailoring tools supplier focused on quality scissors and threads.'},
                  {year:'2023',text:'Expanded into sewing machines and professional equipment after customer demand grew.'},
                  {year:'2024',text:'Launched Women\'s Fashion — curated ethnic wear, dresses, and accessories.'},
                  {year:'2026',text:'Now serving 2,000+ happy customers across India with 500+ premium products.'},
                ].map(({ year, text }) => (
                  <div key={year} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                    <div style={{ flexShrink:0, width:'46px', height:'22px', borderRadius:'6px',
                      background:'#1A1A2E', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:'10px', fontWeight:800, color:'white' }}>{year}</span>
                    </div>
                    <p style={{ fontSize:'13px', color:'#555', lineHeight:1.6 }}>{text}</p>
                  </div>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'linear-gradient(160deg,#1A1A2E,#0F3460)',
                borderRadius:'24px', padding:'28px 24px', position:'relative', overflow:'hidden' }}>
                <motion.div animate={{ scale:[1,1.3,1], opacity:[.2,.4,.2] }}
                  transition={{ duration:6, repeat:Infinity }}
                  style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
                    top:'-50px', right:'-50px', pointerEvents:'none' }} />
                
                {/* Horizontal scroll on mobile for dark card items */}
                <div className="about-dark-features-row sh-scroll-hide">
                  {[
                    {icon:Scissors, title:'Tailoring First',  desc:'We started with professional tools because we believe in craftsmen.'},
                    {icon:Heart,    title:'Quality Promise',  desc:'Every product tested before going on our shelves.'},
                    {icon:Users,    title:'Customer Focused', desc:'Your satisfaction is our only KPI. Period.'},
                  ].map(({ icon:Icon, title, desc }) => (
                    <div key={title} style={{ display:'flex', gap:'12px', marginBottom:'20px' }}>
                      <div style={{ width:'38px', height:'38px', borderRadius:'12px', flexShrink:0,
                        background:'rgba(255,255,255,.1)', display:'flex',
                        alignItems:'center', justifyContent:'center' }}>
                        <Icon size={17} strokeWidth={1.8} color='#C084FC' />
                      </div>
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:800, color:'white', marginBottom:'3px' }}>{title}</p>
                        <p style={{ fontSize:'12px', color:'rgba(255,255,255,.65)', lineHeight:1.55 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </R>
          </div>
        </div>
      </div>

      {/* MISSION & VISION (Horizontal Carousel on Mobile) */}
      <div style={{ padding:'56px 20px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'32px' }}>
            <Label>What Drives Us</Label>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-0.5px' }}>
              Mission &amp; Vision
            </h2>
          </div></R>
          <div className="about-horizontal-row sh-scroll-hide">
            {[
              {icon:Target, label:'Our Mission', color:'#7C3AED', bg:'#F5F3FF',
               title:'Empower Every Craftsman',
               text:'To provide every tailor and fashion lover in India with access to premium quality tools and clothing at affordable prices — delivered to their doorstep.'},
              {icon:Sparkles, label:'Our Vision', color:'#0369A1', bg:'#EFF6FF',
               title:"India's Most Trusted Fashion Hub",
               text:'To become the most trusted destination for tailoring tools and women\'s fashion in India, known for unmatched quality, transparency, and customer delight.'},
            ].map(item => (
              <motion.div key={item.label} variants={si}
                whileHover={{ y:-4, boxShadow:'0 16px 40px rgba(0,0,0,.08)' }}
                className="about-card-item"
                style={{ background:'white', borderRadius:'22px', padding:'24px',
                  border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.05)', flex:1 }}>
                <Badge color={item.color} bg={item.bg} icon={item.icon}>{item.label}</Badge>
                <h3 style={{ fontSize:'18px', fontWeight:900, color:'#0A0A0A',
                  letterSpacing:'-.4px', margin:'12px 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize:'13px', color:'#555', lineHeight:1.65 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US (Horizontal Carousel on Mobile) */}
      <div style={{ padding:'56px 20px', background:'white' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'32px' }}>
            <Label>Why Asmalabel</Label>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-0.5px' }}>
              Why Choose Us?
            </h2>
          </div></R>
          <div className="about-horizontal-row sh-scroll-hide">
            {FEATURES.map(f => <FCard key={f.title} {...f} />)}
          </div>
        </div>
      </div>

      {/* COMPANY VALUES (Horizontal Carousel on Mobile) */}
      <div style={{ padding:'56px 20px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'32px' }}>
            <Label>What We Stand For</Label>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-0.5px' }}>
              Our Values
            </h2>
          </div></R>
          <div className="about-horizontal-row sh-scroll-hide">
            {VALUES.map(v => <FCard key={v.title} {...v} />)}
          </div>
        </div>
      </div>

      {/* WHY NO COD */}
      <div style={{ padding:'56px 20px', background:'white' }}>
        <div style={CW}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'32px', alignItems:'flex-start' }}>
            <R v={fl}>
              <Badge color='#EA580C' bg='#FFF7ED' icon={ShieldCheck}>UPI Only</Badge>
              <h2 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-.5px', margin:'12px 0 10px' }}>
                Why No Cash on Delivery?
              </h2>
              <p style={{ fontSize:'13px', color:'#555', lineHeight:1.65, marginBottom:'16px' }}>
                We are a small team focused on delivering quality products. To maintain service standards and keep prices low, we accept <strong>UPI payments only</strong>.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[
                  {icon:Zap,         text:'Faster processing — no waiting for cash collection'},
                  {icon:ShieldCheck, text:'Eliminates fake orders and reduces cancellations'},
                  {icon:BadgeCheck,  text:'Lower costs means better prices for you'},
                  {icon:Truck,       text:'Same-day dispatch once payment is confirmed'},
                ].map(({ icon:Icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px',
                    padding:'10px 14px', background:'#FAFAFA', borderRadius:'12px', border:'1px solid #F0F0F0' }}>
                    <Icon size={15} strokeWidth={2} color='#EA580C' style={{ flexShrink:0 }} />
                    <span style={{ fontSize:'12px', color:'#333', fontWeight:600 }}>{text}</span>
                  </div>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'#FFFBEB', borderRadius:'20px', padding:'24px',
                border:'1px solid #FDE68A' }}>
                <p style={{ fontSize:'13px', fontWeight:800, color:'#92400E', marginBottom:'8px',
                  display:'flex', alignItems:'center', gap:'6px' }}>
                  <Zap size={15} color='#D97706' /> Accepted UPI Apps
                </p>
                <div className="sh-scroll-hide" style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px', marginBottom:'12px' }}>
                  {['GPay','PhonePe','Paytm','BHIM','Amazon Pay'].map(app => (
                    <span key={app} style={{ padding:'5px 12px', borderRadius:'8px',
                      background:'white', border:'1px solid #FDE68A',
                      fontSize:'12px', fontWeight:700, color:'#92400E', flexShrink:0 }}>{app}</span>
                  ))}
                </div>
                <p style={{ fontSize:'12px', color:'#B45309', lineHeight:1.6 }}>
                  Payment takes under 30 seconds! Your order is confirmed immediately after payment.
                </p>
              </div>
            </R>
          </div>
        </div>
      </div>

      {/* REVIEWS (Horizontal Carousel on Mobile) */}
      <div style={{ padding:'56px 20px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
            marginBottom:'32px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <Label>Testimonials</Label>
              <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.5px', marginBottom:'6px' }}>
                What Customers Say
              </h2>
              <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={15} fill='#FFB800' color='#FFB800'/>)}
                <span style={{ fontSize:'13px', fontWeight:700, color:'#555', marginLeft:'4px' }}>
                  4.9 / 5 · 200+ Reviews
                </span>
              </div>
            </div>
          </div></R>
          <div className="about-horizontal-row sh-scroll-hide">
            {REVIEWS.map(r => <RCard key={r.name} {...r} />)}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding:'56px 20px', background:'white' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'32px' }}>
            <Label>Got Questions?</Label>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A',
              letterSpacing:'-0.5px' }}>Frequently Asked Questions</h2>
          </div></R>
          <div style={{ maxWidth:'720px' }}>
            {FAQS.map(f => <Accordion key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ padding:'56px 20px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'32px' }}>
            <Label>Get In Touch</Label>
            <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-0.5px' }}>
              Contact Us
            </h2>
          </div></R>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'24px' }}>
            <R v={fl}>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  {icon:Mail,    label:'Email',    value:'as.businezzz@gmail.com', href:'mailto:as.businezzz@gmail.com', ic:'#2563EB', ib:'#EFF6FF'},
                  {icon:Phone,   label:'Phone',    value:'+91 70139 42909',         href:'tel:+917013942909',             ic:'#16A34A', ib:'#F0FDF4'},
                  {icon:MessageCircle,label:'WhatsApp',value:'Chat with us',        href:'https://wa.me/917013942909',    ic:'#16A34A', ib:'#F0FDF4'},
                  {icon:Clock,   label:'Hours',    value:'9 AM – 9 PM, Mon–Sat',    href:null,                            ic:'#D97706', ib:'#FFFBEB'},
                ].map(({ icon:Icon, label, value, href, ic, ib }) => (
                  <a key={label} href={href || undefined}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 16px',
                      background:'white', borderRadius:'14px', textDecoration:'none',
                      border:'1px solid #F0F0F0', boxShadow:'0 2px 8px rgba(0,0,0,.04)',
                      transition:'box-shadow .2s, transform .2s', cursor: href ? 'pointer' : 'default' }}
                    onMouseEnter={e => { if(href){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.04)'; }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:ib,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={18} strokeWidth={1.8} color={ic} />
                    </div>
                    <div>
                      <p style={{ fontSize:'10px', fontWeight:700, color:'#8E8E93',
                        textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'2px' }}>{label}</p>
                      <p style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A' }}>{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'linear-gradient(160deg,#1A1A2E,#0F3460)',
                borderRadius:'24px', padding:'28px 24px', height:'100%', minHeight:'240px',
                display:'flex', flexDirection:'column', justifyContent:'center',
                position:'relative', overflow:'hidden' }}>
                <motion.div animate={{ scale:[1,1.2,1], opacity:[.2,.4,.2] }}
                  transition={{ duration:6, repeat:Infinity }}
                  style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
                    top:'-50px', right:'-50px', pointerEvents:'none' }} />
                <p style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'2px', color:'#C084FC', marginBottom:'10px' }}>Need Help?</p>
                <h3 style={{ fontSize:'22px', fontWeight:900, color:'white',
                  letterSpacing:'-.5px', marginBottom:'8px' }}>We're here for you</h3>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,.6)',
                  lineHeight:1.6, marginBottom:'20px' }}>
                  Our team usually replies within 10 minutes on WhatsApp. Don't hesitate to reach out!
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  <a href="https://wa.me/917013942909" target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      padding:'12px 20px', borderRadius:'12px', background:'#25D366',
                      color:'white', fontSize:'13px', fontWeight:800, textDecoration:'none' }}>
                    <MessageCircle size={15} /> Chat on WhatsApp
                  </a>
                  <a href="mailto:as.businezzz@gmail.com"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      padding:'12px 20px', borderRadius:'12px',
                      background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)',
                      color:'white', fontSize:'13px', fontWeight:700, textDecoration:'none' }}>
                    <Mail size={15} /> Email Us
                  </a>
                </div>
              </div>
            </R>
          </div>
        </div>
      </div>

    </div>
  );
}
