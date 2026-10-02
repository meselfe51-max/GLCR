/*
  build.js
  --------
  قالب اصلی سایت: price-page-sample.html
  هر تغییری در این فایل (تبلیغات، بنر، منو، فوتر، اسکریپت آنالیتیکس، بخش جدید، ...)
  با اجرای دستور زیر در «همه‌ی صفحه‌ها» اعمال می‌شود:

      node build.js

  این اسکریپت از روی قالب، این صفحه‌ها را از نو می‌سازد:
    - index.html                  (صفحه اصلی سایت)
    - currency/<slug>/index.html  (صفحه‌ی هر دارایی)
  و فقط این چند چیز را برای هر صفحه عوض می‌کند — بقیه‌ی قالب عیناً کپی می‌شود:
    ۱) <title> و <meta description> (و تگ‌های سئو: canonical، Open Graph، داده‌ی ساختاریافته)
    ۲) متن <h1 id="asset-title"> و <span id="asset-label"> و لینک #details-link
    ۳) جدول‌ها (ردیف‌ها از قبل داخل HTML نوشته می‌شوند تا گوگل نام‌ها را ببیند)
    ۴) آدرس‌های نسبی (href/src/url(...)) برای صفحه‌های دو پوشه پایین‌تر خودکار تنظیم می‌شوند
    ۵) یک خط <script>window.__PAGE_ASSET__ = "..."</script> قبل از price-page.js
  همچنین sitemap.xml و robots.txt و بخش سئوی calculator/index.html را به‌روز می‌کند.

  نکته: calculator/index.html صفحه‌ی جداگانه‌ای است و از قالب ساخته نمی‌شود؛
  تغییرات قالب در آن اعمال نمی‌شود.

  دامنه: یک بار مقدار DEFAULT_SITE_URL را همین‌جا بنویس (یا موقع اجرا SITE_URL=... بده).
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEFAULT_SITE_URL = 'https://YOUR-DOMAIN.com';
const SITE_URL = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
if (SITE_URL.includes('YOUR-DOMAIN')) {
  console.warn('⚠️  دامنه‌ی واقعی تنظیم نشده؛ canonical و sitemap با YOUR-DOMAIN.com ساخته می‌شوند.');
  console.warn('   مقدار DEFAULT_SITE_URL بالای همین فایل را عوض کن و دوباره اجرا کن.\n');
}
const SITE_NAME = 'GLCR';

const ROOT = __dirname;
const TEMPLATE_PATH = path.join(ROOT, 'price-page-sample.html');
const SCRIPT_PATH = path.join(ROOT, 'scripts', 'price-page.js');
const CALC_PATH = path.join(ROOT, 'calculator', 'index.html');

// ---------- ۱) اجرای price-page.js داخل sandbox برای گرفتن ASSETS/ORDER و renderRow ----------
function fakeElement() {
  return {
    set textContent(_) {}, set innerHTML(_) {}, set className(_) {},
    setAttribute() {}, scrollIntoView() {}, href: '', onclick: null
  };
}
const sandbox = {
  document: { getElementById: () => fakeElement() },
  window: { location: { pathname: '/', search: '', hash: '' }, history: { replaceState() {} } },
  history: { replaceState() {} },
  console: { log() {}, warn() {}, error() {} },
  fetch: () => Promise.reject(new Error('no network in build sandbox')),
  setInterval: () => {},
  URLSearchParams: class { get() { return null; } },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(SCRIPT_PATH, 'utf8'), sandbox, { filename: 'scripts/price-page.js' });
vm.runInContext('this.__exported = { ASSETS, ORDER, renderRow };', sandbox);
const { ASSETS, ORDER, renderRow } = sandbox.__exported;

// ---------- ۲) ابزارها ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// جایگزینی regex که اگر الگو در قالب پیدا نشد، build را با پیام واضح متوقف می‌کند
// (تا تغییر قالب بی‌صدا چیزی را خراب نکند).
function mustReplace(html, regex, fn, label) {
  if (!regex.test(html)) throw new Error(`در قالب پیدا نشد: ${label}`);
  return html.replace(regex, fn);
}

// آدرس‌های نسبی را برای صفحه‌هایی که در عمق بیشتری هستند اصلاح می‌کند.
// آدرس‌های کامل (http، //)، مطلق (/)، لنگر (#)، mailto/tel/data/javascript دست نمی‌خورند.
const RELATIVE = /^(?![a-z][a-z0-9+.-]*:|\/|#|\?)/i;
function prefixUrls(html, prefix) {
  if (!prefix) return html;
  const fix = v => (v && RELATIVE.test(v.trim()) ? prefix + v.trim() : v);
  html = html.replace(/\b(href|src|poster|action)=("([^"]*)"|'([^']*)')/gi, (m, attr, quoted, dq, sq) => {
    const q = dq !== undefined ? '"' : "'";
    return `${attr}=${q}${fix(dq !== undefined ? dq : sq)}${q}`;
  });
  html = html.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, v) => `url(${q}${fix(v)}${q})`);
  return html;
}

function fillTables(html) {
  const map = { currency: 'currencies-body', metal: 'metals-body', crypto: 'crypto-body' };
  for (const [type, id] of Object.entries(map)) {
    const rows = ORDER[type].map(key => renderRow(ASSETS[key])).join('');
    const re = new RegExp(`(<tbody\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</tbody>)`);
    html = mustReplace(html, re, (_, open, close) => `${open}${rows}\n        ${close}`, `tbody#${id}`);
  }
  return html;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

// تگ‌های سئو (به‌جز title و description که جداگانه جایگزین می‌شوند)
function seoTags({ title, description, urlPath, structured, prefix = '' }) {
  const url = SITE_URL + urlPath;
  return [
    `<link rel="icon" href="${prefix}images/favicon.svg" type="image/svg+xml">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<link rel="canonical" href="${url}">`,
    '<meta name="theme-color" content="#001421">',
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    '<meta property="og:locale" content="fa_IR">',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    jsonLd(structured)
  ].join('\n');
}

function breadcrumb(name, urlPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name, item: SITE_URL + urlPath }
    ]
  };
}

// title + description + تگ‌های سئو را در head قالب می‌نشاند
function applyHead(html, meta) {
  html = mustReplace(html, /<title\b[^>]*>[\s\S]*?<\/title>/,
    () => `<title id="page-title">${esc(meta.title)}</title>`, 'title');
  html = mustReplace(html, /<meta\s+name="description"[^>]*>/,
    () => `<meta name="description" id="page-description" content="${esc(meta.description)}">\n${seoTags(meta)}`, 'meta description');
  return html;
}

// ---------- ۳) ساخت صفحه‌ها از قالب ----------
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

function buildHome() {
  const meta = {
    title: `${SITE_NAME} | قیمت لحظه‌ای دلار، طلا، سکه و ارز دیجیتال`,
    description: 'قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال به تومان؛ همراه با درصد و مقدار تغییر نسبت به روز قبل و ماشین حساب ارزش روز.',
    urlPath: '/',
    prefix: '',
    structured: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/', inLanguage: 'fa' }
  };
  let html = applyHead(template, meta);
  // صفحه اصلی h1 اختصاصی خودش را دارد (قالب برای صفحات دارایی h1 «قیمت دلار» دارد)
  html = mustReplace(html, /(<h1\b[^>]*\bid="asset-title"[^>]*>)[\s\S]*?(<\/h1>)/,
    (_, open, close) => `${open}قیمت لحظه‌ای ارز، طلا و ارز دیجیتال${close}`, 'h1#asset-title');
  return fillTables(html);
}

function buildAsset(asset) {
  const prefix = '../../';
  const urlPath = `/currency/${asset.slug}/`;
  const meta = {
    title: `قیمت لحظه‌ای ${asset.title.replace(/^قیمت\s+/, '')} | ${SITE_NAME}`,
    description: `قیمت لحظه‌ای ${asset.title.replace(/^قیمت\s+/, '')} امروز به تومان با درصد و مقدار تغییر نسبت به روز قبل؛ مقایسه سریع با سایر ارزها، طلا، سکه و ارزهای دیجیتال در ${SITE_NAME}.`,
    urlPath,
    prefix,
    structured: breadcrumb(asset.title, urlPath)
  };

  let html = prefixUrls(template, prefix);
  html = applyHead(html, meta);
  html = fillTables(html);

  html = mustReplace(html, /(<h1\b[^>]*\bid="asset-title"[^>]*>)[\s\S]*?(<\/h1>)/,
    (_, open, close) => `${open}${asset.title}${close}`, 'h1#asset-title');
  html = mustReplace(html, /(<span\b[^>]*\bid="asset-label"[^>]*>)[\s\S]*?(<\/span>)/,
    (_, open, close) => `${open}${asset.name}${close}`, 'span#asset-label');
  html = mustReplace(html, /<a\b[^>]*\bid="details-link"[^>]*>/,
    tag => tag.replace(/href="[^"]*"/, `href="#${asset.slug}"`), 'a#details-link');

  // به کلاینت می‌گوییم دقیقاً روی کدام دارایی است (بدون نیاز به تشخیص از روی URL)
  html = mustReplace(html, /<script\b[^>]*\bsrc="[^"]*scripts\/price-page\.js"[^>]*><\/script>/,
    tag => `<script>window.__PAGE_ASSET__ = ${JSON.stringify(asset.slug)};</script>\n${tag}`, 'script price-page.js');
  return html;
}

fs.writeFileSync(path.join(ROOT, 'index.html'), buildHome(), 'utf8');
console.log('✔ index.html');

let count = 0;
for (const key of Object.keys(ASSETS)) {
  const asset = ASSETS[key];
  const outDir = path.join(ROOT, 'currency', asset.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), buildAsset(asset), 'utf8');
  count++;
  console.log(`✔ currency/${asset.slug}/index.html`);
}

// ---------- ۴) بخش سئوی ماشین‌حساب (title/description همان‌هایی‌اند که در خود فایل نوشته‌ای) ----------
{
  let html = fs.readFileSync(CALC_PATH, 'utf8');
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1];
  const description = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1];
  if (!title || !description) throw new Error('title/description در calculator/index.html پیدا نشد');
  const block = '<!--seo:start-->\n' + seoTags({
    title: title.trim(), description, urlPath: '/calculator/', prefix: '../', structured: breadcrumb('ماشین حساب', '/calculator/')
  }) + '\n<!--seo:end-->';
  html = mustReplace(html, /<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => block, 'seo markers in calculator');
  fs.writeFileSync(CALC_PATH, html, 'utf8');
  console.log('✔ calculator/index.html (فقط بخش سئوی head)');
}

// ---------- ۵) sitemap.xml و robots.txt ----------
const urls = ['/', '/calculator/'].concat(Object.keys(ASSETS).map(k => `/currency/${ASSETS[k].slug}/`));
fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n') + '\n</urlset>\n',
  'utf8'
);
fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /price-page-sample.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  'utf8'
);
console.log('✔ sitemap.xml, robots.txt');
console.log(`\nتمام شد: صفحه اصلی + ${count} صفحه‌ی دارایی ساخته شد.`);
