const IMAGE_MAP = {
  // Tailoring
  'sewing machine': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
  'overlock machine': 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800&auto=format&fit=crop&q=80',
  'scissors': 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&auto=format&fit=crop&q=80',
  'pinking shears': 'https://images.unsplash.com/photo-1594498258009-2e2bde84459e?w=800&auto=format&fit=crop&q=80',
  'polyester thread': 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800&auto=format&fit=crop&q=80',
  'cotton thread': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80',
  'needle': 'https://images.unsplash.com/photo-1594498258009-2e2bde84459e?w=800&auto=format&fit=crop&q=80',
  'leather needle': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
  'measuring tape': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
  'quilting ruler': 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&auto=format&fit=crop&q=80',

  // Fashion
  'floral maxi': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
  'little black dress': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
  'casual a-line dress': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
  'dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
  'silk blouse': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80',
  'cotton crop top': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
  'blazer': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
  'jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
  'palazzo': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
  'kurti': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  'anarkali': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&auto=format&fit=crop&q=80',
  'handbag': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80',
  'jewelry': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
};

const CATEGORY_FALLBACKS = {
  machines: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
  scissors: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&auto=format&fit=crop&q=80',
  threads: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=800&auto=format&fit=crop&q=80',
  needles: 'https://images.unsplash.com/photo-1594498258009-2e2bde84459e?w=800&auto=format&fit=crop&q=80',
  measuring: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
  dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
  tops: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80',
  bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
  ethnic: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80'
};

export function getProductImage(product) {
  if (product && product.image_url && product.image_url.startsWith('http') && !product.image_url.includes('placehold.co')) {
    return product.image_url;
  }
  if (!product) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';

  const name = (product.name || '').toLowerCase();
  for (const key in IMAGE_MAP) {
    if (name.includes(key)) return IMAGE_MAP[key];
  }

  if (product.sub_category && CATEGORY_FALLBACKS[product.sub_category]) {
    return CATEGORY_FALLBACKS[product.sub_category];
  }

  return product.category === 'tailoring'
    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';
}

export function parseProductTags(product) {
  if (!product) return { cleanDesc: '', badge: '', discount_tag: '' };

  let desc = product.description || '';
  let badge = product.badge || product.tag || '';
  let discount_tag = product.discount_tag || '';

  const tagMatch = desc.match(/\[TAG:([^\]]*)\]/);
  if (tagMatch) {
    const parts = tagMatch[1].split('|');
    if (parts[0]) badge = parts[0];
    if (parts[1]) discount_tag = parts[1];
    desc = desc.replace(/\s*\[TAG:[^\]]*\]/g, '').trim();
  } else if (badge.includes('|')) {
    const parts = badge.split('|');
    badge = parts[0] || '';
    discount_tag = parts[1] || '';
  }

  return { cleanDesc: desc, badge, discount_tag };
}
