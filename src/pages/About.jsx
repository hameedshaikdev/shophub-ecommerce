import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BadgeCheck, Truck, ShieldCheck, MessageCircle, Star, Package,
  Phone, Mail, Clock, Scissors, Sparkles, Target, Heart, Award,
  Users, ChevronDown, ExternalLink, ArrowRight, Zap, RefreshCcw,
} from 'lucide-react';

const fu = { hidden:{opacity:0,y:32},  visible:{opacity:1,y:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const fl = { hidden:{opacity:0,x:-32}, visible:{opacity:1,x:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const fr = { hidden:{opacity:0,x:32},  visible:{opacity:1,x:0, transition:{duration:.6,ease:[.22,1,.36,1]}} };
const si = { hidden:{opacity:0,scale:.92}, visible:{opacity:1,scale:1, transition:{duration:.5,ease:[.22,1,.36,1]}} };
const sg = { visible:{ transition:{ staggerChildren:.08 } } };

const CW = { maxWidth:'1100px', margin:'0 auto', padding:'0 24px' };

function R({ v=fu, children, style={} }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={v} style={style}>{children}</motion.div>;
}
function SR({ children, style={} }) {
  const ref = useRef(null);
  const ok  = useInView(ref, { once:true, margin:'-60px' });
  return <motion.div ref={ref} initial="hidden" animate={ok?'visible':'hidden'} variants={sg} style={style}>{children}</motion.div>;
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
      style={{ background:'white', borderRadius:'20px', padding:'28px 24px',
        border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
      <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:ib,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
        <Icon size={22} strokeWidth={1.8} color={ic} />
      </div>
      <p style={{ fontSize:'15px', fontWeight:800, color:'#0A0A0A', marginBottom:'8px' }}>{title}</p>
      <p style={{ fontSize:'13px', color:'#8E8E93', lineHeight:1.65 }}>{desc}</p>
    </motion.div>
  );
}

function RCard({ name, initials, bg, rating, text, product }) {
  return (
    <motion.div variants={si}
      whileHover={{ y:-5, boxShadow:'0 16px 48px rgba(0,0,0,.10)' }}
      style={{ background:'white', borderRadius:'20px', padding:'24px',
        border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:bg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'14px', fontWeight:900, color:'white', flexShrink:0 }}>{initials}</div>
        <div>
          <p style={{ fontSize:'14px', fontWeight:800, color:'#0A0A0A' }}>{name}</p>
          <Badge color='#059669' bg='#F0FDF4' icon={BadgeCheck}>Verified Customer</Badge>
        </div>
      </div>
      <div style={{ display:'flex', gap:'2px', marginBottom:'10px' }}>
        {[...Array(5)].map((_,i) =>
          <Star key={i} size={13} fill={i<rating?'#FFB800':'none'} color={i<rating?'#FFB800':'#E0E0E0'}/>)}
      </div>
      <p style={{ fontSize:'13px', color:'#444', lineHeight:1.7, marginBottom:'12px', fontStyle:'italic' }}>"{text}"</p>
      <p style={{ fontSize:'11px', color:'#8E8E93', display:'flex', alignItems:'center', gap:'4px' }}>
        <Package size={11}/> {product}
      </p>
    </motion.div>
  );
}

export default function About() {
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
    <div style={{ background:'#FAFAFA', minHeight:'100vh', paddingBottom:'80px' }}>

      {/* HERO */}
      <div style={{ background:'linear-gradient(160deg,#1A1A2E 0%,#0F3460 100%)',
        position:'relative', overflow:'hidden', padding:'72px 24px 64px' }}>
        <motion.div animate={{ scale:[1,1.3,1], opacity:[.3,.5,.3] }}
          transition={{ duration:8, repeat:Infinity }}
          style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%',
            background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
            top:'-150px', right:'-100px', pointerEvents:'none' }} />
        <div style={CW}>
          <motion.div initial="hidden" animate="visible" variants={sg}>
            <motion.div variants={fu} style={{ marginBottom:'16px' }}>
              <Badge color='#C084FC' bg='rgba(192,132,252,.15)' icon={Users}>
                Trusted by 2,000+ Customers
              </Badge>
            </motion.div>
            <motion.h1 variants={fu}
              style={{ fontSize:'clamp(32px,6vw,64px)', fontWeight:900, color:'white',
                letterSpacing:'-2px', lineHeight:1.05, marginBottom:'16px', maxWidth:'700px' }}>
              About <span style={{ color:'#C084FC' }}>AS HUB</span>
            </motion.h1>
            <motion.p variants={fu}
              style={{ fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,.65)',
                maxWidth:'520px', lineHeight:1.75, marginBottom:'40px' }}>
              Premium tailoring tools and curated women's fashion delivered across India.
            </motion.p>
            <motion.div variants={sg} style={{ display:'flex', gap:'28px', flexWrap:'wrap' }}>
              {[
                {icon:Star, stat:'4.9', label:'Rating'},
                {icon:Package, stat:'500+', label:'Products'},
                {icon:Truck, stat:'Pan India', label:'Delivery'},
                {icon:Users, stat:'2,000+', label:'Customers'},
              ].map(({ icon:Icon, stat, label }) => (
                <motion.div key={label} variants={fu}
                  style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px',
                    background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={18} strokeWidth={1.8} color='#C084FC' />
                  </div>
                  <div>
                    <p style={{ fontSize:'18px', fontWeight:900, color:'white', lineHeight:1 }}>{stat}</p>
                    <p style={{ fontSize:'11px', color:'rgba(255,255,255,.5)', marginTop:'2px' }}>{label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{ background:'white', borderBottom:'1px solid #F0F0F0' }}>
        <div style={CW}>
          <div style={{ display:'flex', overflowX:'auto', justifyContent:'space-around', flexWrap:'wrap' }}>
            {TRUST.map(({ icon:Icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:'8px',
                padding:'16px 20px', flexShrink:0 }}>
                <Icon size={16} strokeWidth={2} color='#1A1A2E' />
                <span style={{ fontSize:'13px', fontWeight:700, color:'#0A0A0A', whiteSpace:'nowrap' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OUR STORY */}
      <div style={{ padding:'80px 24px', background:'white' }}>
        <div style={CW}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
            gap:'64px', alignItems:'center' }}>
            <R v={fl}>
              <Label>Our Story</Label>
              <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-1px', lineHeight:1.15, marginBottom:'28px' }}>
                Built for craftsmen,<br/>loved by fashionistas
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {[
                  {year:'2022',text:'Started as a small tailoring tools supplier focused on quality scissors and threads.'},
                  {year:'2023',text:'Expanded into sewing machines and professional equipment after customer demand grew.'},
                  {year:'2024',text:'Launched Women\'s Fashion — curated ethnic wear, dresses, and accessories.'},
                  {year:'2026',text:'Now serving 2,000+ happy customers across India with 500+ premium products.'},
                ].map(({ year, text }) => (
                  <div key={year} style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
                    <div style={{ flexShrink:0, width:'48px', height:'24px', borderRadius:'6px',
                      background:'#1A1A2E', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:'10px', fontWeight:800, color:'white' }}>{year}</span>
                    </div>
                    <p style={{ fontSize:'14px', color:'#555', lineHeight:1.7 }}>{text}</p>
                  </div>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'linear-gradient(160deg,#1A1A2E,#0F3460)',
                borderRadius:'24px', padding:'36px', position:'relative', overflow:'hidden' }}>
                <motion.div animate={{ scale:[1,1.3,1], opacity:[.2,.4,.2] }}
                  transition={{ duration:6, repeat:Infinity }}
                  style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
                    top:'-50px', right:'-50px', pointerEvents:'none' }} />
                {[
                  {icon:Scissors, title:'Tailoring First',  desc:'We started with professional tools because we believe in craftsmen.'},
                  {icon:Heart,    title:'Quality Promise',  desc:'Every product tested before going on our shelves.'},
                  {icon:Users,    title:'Customer Focused', desc:'Your satisfaction is our only KPI. Period.'},
                ].map(({ icon:Icon, title, desc }) => (
                  <div key={title} style={{ display:'flex', gap:'14px', marginBottom:'24px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', flexShrink:0,
                      background:'rgba(255,255,255,.1)', display:'flex',
                      alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} strokeWidth={1.8} color='#C084FC' />
                    </div>
                    <div>
                      <p style={{ fontSize:'14px', fontWeight:800, color:'white', marginBottom:'4px' }}>{title}</p>
                      <p style={{ fontSize:'12px', color:'rgba(255,255,255,.55)', lineHeight:1.65 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </div>
      </div>

      {/* MISSION & VISION */}
      <div style={{ padding:'80px 24px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px' }}>
            <Label>What Drives Us</Label>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-1px' }}>
              Mission &amp; Vision
            </h2>
          </div></R>
          <SR style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
            {[
              {icon:Target, label:'Our Mission', color:'#7C3AED', bg:'#F5F3FF',
               title:'Empower Every Craftsman',
               text:'To provide every tailor and fashion lover in India with access to premium quality tools and clothing at affordable prices — delivered to their doorstep.'},
              {icon:Sparkles, label:'Our Vision', color:'#0369A1', bg:'#EFF6FF',
               title:"India's Most Trusted Fashion Hub",
               text:'To become the most trusted destination for tailoring tools and women\'s fashion in India, known for unmatched quality, transparency, and customer delight.'},
            ].map(item => (
              <motion.div key={item.label} variants={si}
                whileHover={{ y:-6, boxShadow:'0 20px 56px rgba(0,0,0,.10)' }}
                style={{ background:'white', borderRadius:'24px', padding:'36px',
                  border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
                <Badge color={item.color} bg={item.bg} icon={item.icon}>{item.label}</Badge>
                <h3 style={{ fontSize:'22px', fontWeight:900, color:'#0A0A0A',
                  letterSpacing:'-.5px', margin:'16px 0 12px' }}>{item.title}</h3>
                <p style={{ fontSize:'14px', color:'#555', lineHeight:1.75 }}>{item.text}</p>
              </motion.div>
            ))}
          </SR>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div style={{ padding:'80px 24px', background:'white' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px' }}>
            <Label>Why AS HUB</Label>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-1px' }}>
              Why Choose Us?
            </h2>
          </div></R>
          <SR style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
            {FEATURES.map(f => <FCard key={f.title} {...f} />)}
          </SR>
        </div>
      </div>

      {/* COMPANY VALUES */}
      <div style={{ padding:'80px 24px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px' }}>
            <Label>What We Stand For</Label>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-1px' }}>
              Our Values
            </h2>
          </div></R>
          <SR style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px' }}>
            {VALUES.map(v => <FCard key={v.title} {...v} />)}
          </SR>
        </div>
      </div>

      {/* WHY NO COD */}
      <div style={{ padding:'80px 24px', background:'white' }}>
        <div style={CW}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'48px', alignItems:'flex-start' }}>
            <R v={fl}>
              <Badge color='#EA580C' bg='#FFF7ED' icon={ShieldCheck}>UPI Only</Badge>
              <h2 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-.5px', margin:'16px 0 12px' }}>
                Why No Cash on Delivery?
              </h2>
              <p style={{ fontSize:'14px', color:'#555', lineHeight:1.75, marginBottom:'20px' }}>
                We are a small team focused on delivering quality products. To maintain service standards and keep prices low, we accept <strong>UPI payments only</strong>.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  {icon:Zap,         text:'Faster processing — no waiting for cash collection'},
                  {icon:ShieldCheck, text:'Eliminates fake orders and reduces cancellations'},
                  {icon:BadgeCheck,  text:'Lower costs means better prices for you'},
                  {icon:Truck,       text:'Same-day dispatch once payment is confirmed'},
                ].map(({ icon:Icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'12px',
                    padding:'12px 16px', background:'#FAFAFA', borderRadius:'12px', border:'1px solid #F0F0F0' }}>
                    <Icon size={16} strokeWidth={2} color='#EA580C' style={{ flexShrink:0 }} />
                    <span style={{ fontSize:'13px', color:'#333', fontWeight:600 }}>{text}</span>
                  </div>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'#FFFBEB', borderRadius:'20px', padding:'28px',
                border:'1px solid #FDE68A' }}>
                <p style={{ fontSize:'14px', fontWeight:800, color:'#92400E', marginBottom:'8px',
                  display:'flex', alignItems:'center', gap:'8px' }}>
                  <Zap size={16} color='#D97706' /> Accepted UPI Apps
                </p>
                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'16px' }}>
                  {['GPay','PhonePe','Paytm','BHIM','Amazon Pay'].map(app => (
                    <span key={app} style={{ padding:'6px 14px', borderRadius:'10px',
                      background:'white', border:'1px solid #FDE68A',
                      fontSize:'13px', fontWeight:700, color:'#92400E' }}>{app}</span>
                  ))}
                </div>
                <p style={{ fontSize:'13px', color:'#B45309', lineHeight:1.65 }}>
                  Payment takes under 30 seconds! Your order is confirmed immediately after payment.
                </p>
              </div>
            </R>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ padding:'80px 24px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
            marginBottom:'48px', flexWrap:'wrap', gap:'16px' }}>
            <div>
              <Label>Testimonials</Label>
              <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-1px', marginBottom:'8px' }}>
                What Customers Say
              </h2>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={16} fill='#FFB800' color='#FFB800'/>)}
                <span style={{ fontSize:'14px', fontWeight:700, color:'#555', marginLeft:'6px' }}>
                  4.9 / 5 · 200+ Reviews
                </span>
              </div>
            </div>
          </div></R>
          <SR style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
            {REVIEWS.map(r => <RCard key={r.name} {...r} />)}
          </SR>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding:'80px 24px', background:'white' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px' }}>
            <Label>Got Questions?</Label>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A',
              letterSpacing:'-1px' }}>Frequently Asked Questions</h2>
          </div></R>
          <div style={{ maxWidth:'720px' }}>
            {FAQS.map(f => <Accordion key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ padding:'80px 24px', background:'#FAFAFA' }}>
        <div style={CW}>
          <R><div style={{ marginBottom:'48px' }}>
            <Label>Get In Touch</Label>
            <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#0A0A0A', letterSpacing:'-1px' }}>
              Contact Us
            </h2>
          </div></R>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'32px' }}>
            <R v={fl}>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  {icon:Mail,    label:'Email',    value:'as.businezzz@gmail.com', href:'mailto:as.businezzz@gmail.com', ic:'#2563EB', ib:'#EFF6FF'},
                  {icon:Phone,   label:'Phone',    value:'+91 70139 42909',         href:'tel:+917013942909',             ic:'#16A34A', ib:'#F0FDF4'},
                  {icon:MessageCircle,label:'WhatsApp',value:'Chat with us',        href:'https://wa.me/917013942909',    ic:'#16A34A', ib:'#F0FDF4'},
                  {icon:Clock,   label:'Hours',    value:'9 AM – 9 PM, Mon–Sat',    href:null,                            ic:'#D97706', ib:'#FFFBEB'},
                ].map(({ icon:Icon, label, value, href, ic, ib }) => (
                  <a key={label} href={href || undefined}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 18px',
                      background:'white', borderRadius:'16px', textDecoration:'none',
                      border:'1px solid #F0F0F0', boxShadow:'0 2px 8px rgba(0,0,0,.04)',
                      transition:'box-shadow .2s, transform .2s', cursor: href ? 'pointer' : 'default' }}
                    onMouseEnter={e => { if(href){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.04)'; }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'13px', background:ib,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={20} strokeWidth={1.8} color={ic} />
                    </div>
                    <div>
                      <p style={{ fontSize:'11px', fontWeight:700, color:'#8E8E93',
                        textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'2px' }}>{label}</p>
                      <p style={{ fontSize:'14px', fontWeight:700, color:'#0A0A0A' }}>{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </R>
            <R v={fr}>
              <div style={{ background:'linear-gradient(160deg,#1A1A2E,#0F3460)',
                borderRadius:'24px', padding:'36px', height:'100%', minHeight:'280px',
                display:'flex', flexDirection:'column', justifyContent:'center',
                position:'relative', overflow:'hidden' }}>
                <motion.div animate={{ scale:[1,1.2,1], opacity:[.2,.4,.2] }}
                  transition={{ duration:6, repeat:Infinity }}
                  style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%',
                    background:'radial-gradient(circle,rgba(192,132,252,.3) 0%,transparent 70%)',
                    top:'-50px', right:'-50px', pointerEvents:'none' }} />
                <p style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'2px', color:'#C084FC', marginBottom:'12px' }}>Need Help?</p>
                <h3 style={{ fontSize:'24px', fontWeight:900, color:'white',
                  letterSpacing:'-.5px', marginBottom:'10px' }}>We're here for you</h3>
                <p style={{ fontSize:'14px', color:'rgba(255,255,255,.6)',
                  lineHeight:1.7, marginBottom:'24px' }}>
                  Our team usually replies within 10 minutes on WhatsApp. Don't hesitate to reach out!
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  <a href="https://wa.me/917013942909" target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      padding:'13px 24px', borderRadius:'12px', background:'#25D366',
                      color:'white', fontSize:'14px', fontWeight:800, textDecoration:'none' }}>
                    <MessageCircle size={16} /> Chat on WhatsApp
                  </a>
                  <a href="mailto:as.businezzz@gmail.com"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      padding:'13px 24px', borderRadius:'12px',
                      background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)',
                      color:'white', fontSize:'14px', fontWeight:700, textDecoration:'none' }}>
                    <Mail size={16} /> Email Us
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
