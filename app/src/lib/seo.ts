type SeoMetaInput = {
  title: string;
  description: string;
  keywords: string;
  path: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
};

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://odsunsolutions.in';
const DEFAULT_OG_IMAGE = '/media/logo3.png';
const BRAND_NAME = 'Odsun Solutions';

function upsertMetaTag(selector: string, attributes: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    el!.setAttribute(key, value);
  });
}

function upsertLinkTag(selector: string, attributes: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    document.head.appendChild(el);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    el!.setAttribute(key, value);
  });
}

function setJsonLd(jsonLd: Record<string, unknown>) {
  const scriptId = 'seo-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(jsonLd);
}

export function applySeoMeta({
  title,
  description,
  keywords,
  path,
  ogType = 'website',
  jsonLd,
}: SeoMetaInput) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const ogImageUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  document.title = title;

  upsertMetaTag('meta[name="description"]', { name: 'description', content: description });
  upsertMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords });
  upsertMetaTag('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' });
  upsertMetaTag('meta[name="author"]', { name: 'author', content: BRAND_NAME });
  upsertMetaTag('meta[name="theme-color"]', { name: 'theme-color', content: '#05070a' });

  upsertMetaTag('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMetaTag('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMetaTag('meta[property="og:type"]', { property: 'og:type', content: ogType });
  upsertMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: ogImageUrl });
  upsertMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: BRAND_NAME });
  upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' });

  upsertMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImageUrl });

  upsertLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  upsertLinkTag('link[rel="sitemap"]', { rel: 'sitemap', type: 'application/xml', href: `${SITE_URL}/sitemap.xml` });

  if (jsonLd) {
    setJsonLd(jsonLd);
  }
}
