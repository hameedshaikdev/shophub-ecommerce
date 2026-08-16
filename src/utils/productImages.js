import { supabase } from '../config/supabase';

// Map of categories and subcategories to reliable Unsplash fallback images
const FALLBACK_IMAGES = {
  tailoring: {
    scissors: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    threads: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&auto=format&fit=crop&q=80',
    needles: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
    measuring: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    machines: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    presser_feet: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    default: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'
  },
  fashion: {
    dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    tops: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    ethnic: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    accessories: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    default: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
  }
};

/**
 * Returns a guaranteed valid image URL for a product.
 * Checks:
 * 1. product.image_url
 * 2. product.images array (first element)
 * 3. Fallback based on category/subcategory
 */
export function getProductImage(product) {
  if (!product) return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80';

  if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== '') {
    return product.image_url.trim();
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    if (firstImg && typeof firstImg === 'string' && firstImg.trim() !== '') {
      return firstImg.trim();
    }
  }

  const category = (product.category || 'tailoring').toLowerCase();
  const subCategory = (product.sub_category || '').toLowerCase();

  if (FALLBACK_IMAGES[category]) {
    if (FALLBACK_IMAGES[category][subCategory]) {
      return FALLBACK_IMAGES[category][subCategory];
    }
    return FALLBACK_IMAGES[category].default;
  }

  return product.category === 'tailoring'
    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';
}

export function parseProductTags(product) {
  if (!product) return {
    cleanDesc: '', badge: '', discount_tag: '', colors: [],
    bundle: { enabled: true, companionIds: [], companionId: '', discountPct: 5, subtitle: '' }
  };

  let desc = product.description || '';
  let badge = product.badge || product.tag || '';
  let discount_tag = product.discount_tag || '';
  let colors = product.colors || [];
  let bundle = { enabled: true, companionIds: [], companionId: '', discountPct: 5, subtitle: '' };

  const bundleMatch = desc.match(/\[BUNDLE:([^\]]*)\]/);
  if (bundleMatch) {
    const bParts = bundleMatch[1].split('|');
    const compStr = bParts[1] || '';
    const companionIds = compStr ? compStr.split(',').filter(Boolean) : [];
    bundle = {
      enabled: bParts[0] !== 'false',
      companionIds,
      companionId: companionIds[0] || '',
      discountPct: bParts[2] ? Number(bParts[2]) : 5,
      subtitle: bParts[3] || ''
    };
    desc = desc.replace(/\s*\[BUNDLE:[^\]]*\]/g, '').trim();
  }

  const tagMatch = desc.match(/\[TAG:([^\]]*)\]/);
  if (tagMatch) {
    const parts = tagMatch[1].split('|');
    if (parts[0]) badge = parts[0];
    if (parts[1]) discount_tag = parts[1];
    if (parts[2]) colors = parts[2].split(',').filter(Boolean);
    desc = desc.replace(/\s*\[TAG:[^\]]*\]/g, '').trim();
  } else if (badge.includes('|')) {
    const parts = badge.split('|');
    badge = parts[0] || '';
    discount_tag = parts[1] || '';
    if (parts[2]) colors = parts[2].split(',').filter(Boolean);
  }

  return { cleanDesc: desc, badge, discount_tag, colors, bundle };
}
