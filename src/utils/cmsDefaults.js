/* ── Default Homepage CMS Structure & Fallbacks ── */

export const DEFAULT_CMS_DATA = {
  hero: {
    tailoring: {
      title: 'Master Your',
      titleAccent: 'Craft.',
      titleLine2: 'Professional Tailoring Tools',
      sub: 'Premium tools engineered for craftsmen who demand the best. Every stitch, perfected.',
      grad: 'linear-gradient(160deg,#1A0533 0%,#3D0F6B 50%,#1A0533 100%)',
      accentColor: '#C084FC',
      illustration: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800&auto=format&fit=crop&q=80',
      illustrationAlt: 'Professional sewing machine',
      badgeText: 'New Collection 2026',
      btn1Text: 'Shop Now',
      btn1Link: '#products',
      btn2Text: 'Explore',
      btn2Link: '#filter',
    },
    fashion: {
      title: 'Define Your',
      titleAccent: 'Style.',
      titleLine2: "Women's Fashion Collection",
      sub: 'Curated fashion for the modern woman. Elegance meets everyday comfort.',
      grad: 'linear-gradient(160deg,#0A2540 0%,#1A4A7A 50%,#0A2540 100%)',
      accentColor: '#60A5FA',
      illustration: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=640&auto=format&fit=crop&q=80',
      illustrationAlt: 'Women fashion',
      badgeText: 'Trending 2026',
      btn1Text: 'Shop Collection',
      btn1Link: '#products',
      btn2Text: 'Lookbook',
      btn2Link: '#filter',
    },
    slides: [
      {
        id: 'slide-1',
        title: 'Master Your',
        titleAccent: 'Craft.',
        titleLine2: 'Professional Tailoring Tools',
        sub: 'Premium tools engineered for craftsmen who demand the best.',
        illustration: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800&auto=format&fit=crop&q=80',
        badgeText: 'New Collection 2026',
        btn1Text: 'Shop Now',
        btn1Link: '#products',
        active: true,
        category: 'tailoring',
      },
      {
        id: 'slide-2',
        title: 'Define Your',
        titleAccent: 'Style.',
        titleLine2: "Women's Fashion Collection",
        sub: 'Curated fashion for the modern woman. Elegance meets everyday comfort.',
        illustration: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=640&auto=format&fit=crop&q=80',
        badgeText: 'Trending 2026',
        btn1Text: 'Shop Collection',
        btn1Link: '#products',
        active: true,
        category: 'fashion',
      }
    ],
    carouselSettings: {
      autoplay: true,
      slideDuration: 5000,
      pauseOnHover: true,
      transitionStyle: 'fade',
    }
  },

  flashDeals: {
    enabled: true,
    title: 'Flash Deals',
    subtitle: 'Limited time offers. Grab them before stock runs out!',
    badge: '⚡ Limited Time Offer',
    endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    autoHideExpired: false,
    selectedProductIds: [],
    maxDisplay: 6,
    sliderEnabled: true,
    showDiscount: true,
    showStock: true,
    showRatings: true,
    showQuickView: true,
    showAddToCart: true,
  },

  collections: {
    tailoring: [
      { id: 'machines', label: 'Sewing Machines', emoji: '🪡', desc: 'Professional grade', active: true, image: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=400' },
      { id: 'scissors', label: 'Scissors & Blades', emoji: '✂️', desc: 'Precision cut', active: true, image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400' },
      { id: 'threads', label: 'Threads & Yarn', emoji: '🧵', desc: 'Premium quality', active: true, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400' },
      { id: 'measuring', label: 'Measuring Tools', emoji: '📏', desc: 'Accurate tools', active: true, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
    ],
    fashion: [
      { id: 'dresses', label: 'Dresses', emoji: '👗', desc: 'Latest trends', active: true, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
      { id: 'tops', label: 'Tops & Blouses', emoji: '👚', desc: 'Casual & formal', active: true, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
      { id: 'ethnic', label: 'Ethnic Wear', emoji: '🥻', desc: 'Traditional beauty', active: true, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
      { id: 'accessories', label: 'Accessories', emoji: '👜', desc: 'Complete the look', active: true, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
    ]
  },

  newArrivals: {
    enabled: true,
    title: 'New Arrivals',
    subtitle: 'Check out the freshest additions to our catalog.',
    mode: 'auto',
    selectedProductIds: [],
    maxDisplay: 8,
    displayStyle: 'grid',
    sortBy: 'newest',
    showBadges: true,
    showRatings: true,
    showQuickView: true,
  },

  topPicks: {
    enabled: true,
    title: 'Top Picks For You',
    subtitle: 'Handpicked products loved by our customers.',
    selectedProductIds: [],
    maxDisplay: 6,
    displayStyle: 'slider',
  },

  banners: [
    {
      id: 'banner-1',
      title: 'Special Tailoring Equipment Discount',
      subtitle: 'Get up to 25% off on industrial sewing machines this week.',
      btnText: 'Claim Offer',
      btnLink: '#products',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      active: true,
      position: 'middle',
    }
  ],

  footer: {
    aboutText: 'AS HUB — Premium Tailoring Tools & Women Fashion Store in Nellore, Andhra Pradesh.',
    phone: '7013942909',
    email: 'as.businezzz@gmail.com',
    address: 'D.No. 25-2-1709, Pragathi Nagar, Podalkur Road, Nellore - 524004',
    copyright: '© 2026 AS HUB. All rights reserved. Crafted for excellence.',
    socials: {
      whatsapp: '917013942909',
      instagram: '',
      facebook: '',
    }
  },

  seo: {
    metaTitle: 'AS HUB — Premium Tailoring Tools & Women Fashion',
    metaDescription: 'Shop professional tailoring tools, sewing machines, scissors, threads & premium women fashion online at AS HUB.',
    ogTitle: 'AS HUB — Quality Tailoring Equipment & Fashion',
    ogDescription: 'Discover top quality sewing machines, tailoring accessories & designer women wear.',
    ogImage: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=1200',
    keywords: 'tailoring tools, sewing machine, scissors, fashion, dresses, AS HUB, Nellore',
    canonicalUrl: 'https://ashub.com',
  },

  mediaLibrary: [
    { id: 'm-1', url: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800', name: 'Sewing Machine Hero', category: 'tailoring' },
    { id: 'm-2', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=640', name: 'Women Fashion Model', category: 'fashion' },
    { id: 'm-3', url: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=800', name: 'Precision Scissors', category: 'scissors' },
    { id: 'm-4', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', name: 'Rainbow Threads', category: 'threads' },
  ],
};
