import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MessageCircle, ExternalLink,
         Star, Scissors, Package, ShieldCheck, BadgeCheck, Truck } from 'lucide-react';

const fadeUp  = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}} };
const stagger = { visible:{transition:{staggerChildren:.08}} };

function Section({ children, style={} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });
  return (
    <motion.section ref={ref} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} variants={stagger} style={style}>
      {children}
    </motion.section>
  );
}

const REVIEWS = [
  { name:'Priya Sharma',   initials:'PS', bg:'#7C3AED', rating:5,
    text:'Amazing quality sewing machine! Runs so smoothly, exactly what I needed for my tailoring work.',
    product:'Professional Sewing Machine' },
  { name:'Meena Reddy',    initials:'MR', bg:'#DB2777', rating:5,
    text:'The dress quality is outstanding. Got so many compliments! Will definitely order again.',
    product:'Floral Maxi Dress' },
  { name:'Lakshmi Devi',   initials:'LD', bg:'#0369A1', rating:4,
    text:'Thread quality is excellent, colors are vibrant and don\'t fade. Very satisfied.',
    product:'Polyester Thread Set' },
  { name:'Sunitha Rao',    initials:'SR', bg:'#059669', rating:5,
    text:'Fast delivery and genuine products. The scissors are razor sharp and perfectly balanced.',
    product:'Fabric Cutting Scissors' },
  { name:'Kavitha Nair',   initials:'KN', bg:'#D97706', rating:5,
    text:'Best quality ethnic wear at this price. The embroidery work is gorgeous. Love it!',
    product:'Embroidered Kurti' },
  { name:'Rekha Pillai',   initials:'RP', bg:'#DC2626', rating:4,
    text:'Sewing needles are exactly what I wanted. Strong, sharp and don\'t break easily.',
    product:'Universal Needle Set' },
];

export default function About() {
  return (
    <div style={{ minHeight:'100vh', background:'#FAFAFA', paddingBottom:'80px' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,#1A1A2E 0%,#0F3460 100%)',
        padding:'56px 24px 48px' }}>
        <div className="container-center" style={{ maxWidth:'640px', textAlign:'center' }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.6, ease:[.22,1,.36,1] }}>
            <Scissors size={40} strokeWidth={1.5} color="#C084FC"
              style={{ margin:'0 auto 16px' }} />
            <h1 style={{ fontSize:'clamp(26px,5vw,38px)', fontWeight:900,
              color:'white', letterSpacing:'-1px', marginBottom:'12px' }}>
              About AS HUB
            </h1>
            <p style={{ color:'rgba(255,255,255,.6)', fontSize:'15px', lineHeight:1.7 }}>
              Your one-stop destination for premium tailoring tools and women's fashion
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-center" style={{ maxWidth:'760px', padding:'40px 16px 0' }}>

        {/* Categories */}
        <Section>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
            gap:'14px', marginBottom:'20px' }}>
            {[
              { icon:Scissors, title:'Tailoring Tools', color:'#7C3AED', bg:'#F5F3FF',
                text:'Sewing machines, scissors, threads, needles & measuring tools for professionals.' },
              { icon:Package, title:"Women's Fashion", color:'#DB2777', bg:'#FDF2F8',
                text:'Trendy dresses, ethnic wear, tops, bottoms and stylish accessories.' },
            ].map(c => (
              <motion.div key={c.title} variants={fadeUp}
                whileHover={{ y:-4, boxShadow:'0 8px 28px rgba(0,0,0,.09)' }}
                style={{ background:'white', borderRadius:'20px', padding:'24px',
                  boxShadow:'0 2px 12px rgba(0,0,0,.06)', border:'1px solid #F0F0F0' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'13px',
                  background:c.bg, display:'flex', alignItems:'center',
                  justifyContent:'center', marginBottom:'14px' }}>
                  <c.icon size={22} strokeWidth={1.8} color={c.color} />
                </div>
                <h3 style={{ fontSize:'15px', fontWeight:800, color:'#0A0A0A',
                  marginBottom:'8px' }}>{c.title}</h3>
                <p style={{ fontSize:'13px', color:'#8E8E93', lineHeight:1.65 }}>{c.text}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Why No COD */}
        <Section style={{ marginBottom:'20px' }}>
          <motion.div variants={fadeUp}
            style={{ background:'linear-gradient(135deg,#1A1A2E,#0F3460)',
              borderRadius:'20px', padding:'28px',
              boxShadow:'0 2px 12px rgba(0,0,0,.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <ShieldCheck size={22} strokeWidth={1.8} color="#C084FC" />
              <h2 style={{ fontSize:'18px', fontWeight:900, color:'white',
                letterSpacing:'-.3px' }}>Why We Don't Offer Cash on Delivery</h2>
            </div>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,.6)',
              lineHeight:1.75, marginBottom:'16px' }}>
              We are a small, dedicated team focused on delivering quality products to every
              customer. To maintain our service standards and keep prices low, we currently
              accept <strong style={{ color:'rgba(255,255,255,.85)' }}>UPI payments only</strong>.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { icon:Package,     text:'Faster order processing — no waiting for cash collection' },
                { icon:ShieldCheck, text:'Eliminates fake orders and reduces cancellations' },
                { icon:BadgeCheck,  text:'Lower costs = better prices for you' },
                { icon:Truck,       text:'Your order ships the same day payment is confirmed' },
              ].map(({ icon:Icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px',
                  padding:'10px 14px', background:'rgba(255,255,255,.06)',
                  borderRadius:'12px', border:'1px solid rgba(255,255,255,.08)' }}>
                  <Icon size={16} strokeWidth={2} color="#C084FC" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:'13px', color:'rgba(255,255,255,.65)' }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:'16px', padding:'12px 16px',
              background:'rgba(192,132,252,.1)', borderRadius:'12px',
              border:'1px solid rgba(192,132,252,.2)' }}>
              <p style={{ fontSize:'12px', color:'rgba(192,132,252,.9)', fontWeight:600,
                lineHeight:1.6 }}>
                💳 We accept all UPI apps — GPay, PhonePe, Paytm, BHIM and more.
                Payment takes under 30 seconds!
              </p>
            </div>
          </motion.div>
        </Section>

        {/* Why us */}
        <Section style={{ marginBottom:'20px' }}>
          <motion.div variants={fadeUp}
            style={{ background:'white', borderRadius:'20px', padding:'28px',
              boxShadow:'0 2px 12px rgba(0,0,0,.06)', border:'1px solid #F0F0F0' }}>
            <h2 style={{ fontSize:'18px', fontWeight:900, color:'#0A0A0A',
              marginBottom:'20px', letterSpacing:'-.3px' }}>Why Choose Us?</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { icon:BadgeCheck,  color:'#059669', text:'Quality products from trusted manufacturers' },
                { icon:ShieldCheck, color:'#7C3AED', text:'Competitive pricing with regular discounts' },
                { icon:Package,     color:'#0369A1', text:'Free delivery on all orders' },
                { icon:Scissors,    color:'#DB2777', text:'Easy UPI payment — no extra charges' },
                { icon:BadgeCheck,  color:'#D97706', text:'Fast order confirmation via WhatsApp' },
                { icon:ShieldCheck, color:'#DC2626', text:'Dedicated customer support 24/7' },
              ].map(({ icon:Icon, color, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'12px',
                  padding:'10px 14px', background:'#F8F8F8', borderRadius:'12px' }}>
                  <Icon size={17} strokeWidth={2} color={color} style={{ flexShrink:0 }} />
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#333' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Contact */}
        <Section style={{ marginBottom:'0' }}>
          <motion.div variants={fadeUp}
            style={{ background:'white', borderRadius:'20px', padding:'28px',
              boxShadow:'0 2px 12px rgba(0,0,0,.06)', border:'1px solid #F0F0F0' }}>
            <h2 style={{ fontSize:'18px', fontWeight:900, color:'#0A0A0A',
              marginBottom:'20px', letterSpacing:'-.3px' }}>Contact Us</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
              {[
                { href:'mailto:as.businezzz@gmail.com', icon:Mail,           color:'#3B82F6', label:'Email', value:'as.businezzz@gmail.com' },
                { href:'tel:+917013942909',              icon:Phone,          color:'#10B981', label:'Phone', value:'+91 70139 42909' },
                { href:'https://wa.me/917013942909',     icon:MessageCircle,  color:'#25D366', label:'WhatsApp', value:'Chat with us', target:'_blank' },
              ].map(({ href, icon:Icon, color, label, value, target }) => (
                <a key={label} href={href} target={target} rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'14px',
                    padding:'14px 16px', background:'#F8F8F8',
                    borderRadius:'14px', textDecoration:'none', transition:'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#F0F0F0'}
                  onMouseLeave={e => e.currentTarget.style.background='#F8F8F8'}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'11px',
                    background:'white', display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0,
                    boxShadow:'0 1px 6px rgba(0,0,0,.08)' }}>
                    <Icon size={17} strokeWidth={2} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize:'11px', fontWeight:700, color:'#8E8E93',
                      textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'2px' }}>{label}</p>
                    <p style={{ fontSize:'14px', fontWeight:700, color:'#0A0A0A' }}>{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {[
                { href:'https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr', label:'Facebook',  color:'#1877F2', bg:'#EFF6FF' },
                { href:'https://www.instagram.com/as_tailoring_tools_textiles',  label:'Instagram', color:'#E1306C', bg:'#FDF2F8' },
                { href:'https://youtube.com/@astailoringtoolstextiles',           label:'YouTube',   color:'#FF0000', bg:'#FEF2F2' },
              ].map(({ href, label, color, bg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'6px',
                    padding:'9px 16px', borderRadius:'10px', background:bg,
                    color, fontSize:'13px', fontWeight:700, textDecoration:'none',
                    transition:'opacity .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                  {label} <ExternalLink size={12} strokeWidth={2} />
                </a>
              ))}
            </div>
          </motion.div>
        </Section>
      </div>

      {/* ══ CUSTOMER REVIEWS ═══════════════════════════════════ */}
      <div style={{ marginTop:'56px', padding:'0 0 20px' }}>
        <div className="container-center" style={{ maxWidth:'760px', padding:'0 16px' }}>
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginBottom:'36px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'2px', color:'#8E8E93', marginBottom:'10px', display:'block' }}>
                Testimonials
              </span>
              <h2 style={{ fontSize:'clamp(22px,4vw,30px)', fontWeight:900, color:'#0A0A0A',
                letterSpacing:'-0.5px', marginBottom:'10px' }}>
                What Our Customers Say
              </h2>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                {[...Array(5)].map((_,i) => (
                  <Star key={i} size={16} fill="#FFB800" color="#FFB800" />
                ))}
                <span style={{ fontSize:'13px', fontWeight:700, color:'#8E8E93', marginLeft:'8px' }}>
                  4.9/5 · 200+ reviews
                </span>
              </div>
            </motion.div>

            {/* Review grid */}
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
              {REVIEWS.map(r => (
                <motion.div key={r.name} variants={fadeUp}
                  whileHover={{ y:-5, boxShadow:'0 12px 36px rgba(0,0,0,.10)' }}
                  transition={{ type:'spring', stiffness:300, damping:24 }}
                  style={{ background:'white', borderRadius:'20px', padding:'22px',
                    border:'1px solid #F0F0F0', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>

                  {/* Stars */}
                  <div style={{ display:'flex', gap:'2px', marginBottom:'12px' }}>
                    {[...Array(5)].map((_,i) => (
                      <Star key={i} size={13}
                        fill={i < r.rating ? '#FFB800' : 'none'}
                        color={i < r.rating ? '#FFB800' : '#E0E0E0'} />
                    ))}
                  </div>

                  {/* Text */}
                  <p style={{ fontSize:'13px', color:'#444', lineHeight:1.7,
                    marginBottom:'18px', fontStyle:'italic' }}>
                    "{r.text}"
                  </p>

                  {/* Author */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%',
                      background:r.bg, display:'flex', alignItems:'center',
                      justifyContent:'center', fontSize:'13px', fontWeight:800,
                      color:'white', flexShrink:0 }}>
                      {r.initials}
                    </div>
                    <div>
                      <p style={{ fontSize:'13px', fontWeight:800, color:'#0A0A0A' }}>{r.name}</p>
                      <p style={{ fontSize:'11px', color:'#8E8E93', marginTop:'1px' }}>
                        Bought: {r.product}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </div>

    </div>
  );
}
