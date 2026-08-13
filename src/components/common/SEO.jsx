import { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://asmalabel.in';

export default function SEO({
  title = "Asmalabel | Premium Tailoring Tools & Women's Fashion",
  description = "Shop premium tailoring tools, sewing accessories, textiles and women's fashion at Asmalabel. Based in Nellore, Andhra Pradesh.",
  canonical,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogType = "website",
  ogImage = "https://asmalabel.in/logo.png",
  schema
}) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to set or create meta element
    const setMeta = (nameAttr, nameVal, contentVal) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 2. Meta Description
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    // 3. Meta Robots
    if (robots) {
      setMeta('name', 'robots', robots);
    }

    // 4. OpenGraph & Twitter
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'Asmalabel');
    setMeta('name', 'twitter:card', 'summary_large_image');
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    }

    // 5. Canonical Link
    const targetCanonical = canonical || `${DEFAULT_ORIGIN}${window.location.pathname}`;
    setMeta('property', 'og:url', targetCanonical);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', targetCanonical);

    // 6. JSON-LD Schema
    const scriptId = 'dynamic-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('id', scriptId);
        scriptEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonical, robots, ogType, ogImage, schema]);

  return null;
}
