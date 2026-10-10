/*
  قالب مشترک همه صفحات در همین فایل قرار دارد.
  برای صفحه اختصاصی هر مورد از مسیرهایی مثل:
  /currency/dollar
  /currency/euro
  /currency/gold-18
  استفاده می‌شود.

  این فایل تنها منبع دیتا و منطق سایت است؛ هم price-page-sample.html و هم
  همه‌ی صفحات ثابت داخل currency/ دقیقاً همین یک فایل را لود می‌کنند.
*/

const ASSETS = {
  dollar: { name: 'دلار آمریکا', title: 'قیمت دلار', type: 'currency', slug: 'dollar' },
  euro: { name: 'یورو', title: 'قیمت یورو', type: 'currency', slug: 'euro' },
  pound: { name: 'پوند انگلیس', title: 'قیمت پوند انگلیس', type: 'currency', slug: 'pound' },
  dirham: { name: 'درهم امارات', title: 'قیمت درهم امارات', type: 'currency', slug: 'dirham' },
  lira: { name: 'لیر ترکیه', title: 'قیمت لیر ترکیه', type: 'currency', slug: 'lira' },
  cad: { name: 'دلار کانادا', title: 'قیمت دلار کانادا', type: 'currency', slug: 'canadian-dollar' },
  aud: { name: 'دلار استرالیا', title: 'قیمت دلار استرالیا', type: 'currency', slug: 'australian-dollar' },
  chf: { name: 'فرانک سوئیس', title: 'قیمت فرانک سوئیس', type: 'currency', slug: 'swiss-franc' },
  cny: { name: 'یوان چین', title: 'قیمت یوان چین', type: 'currency', slug: 'yuan' },
  jpy: { name: '۱۰۰ ین ژاپن', title: 'قیمت ۱۰۰ ین ژاپن', type: 'currency', slug: 'yen' },
  rub: { name: 'روبل روسیه', title: 'قیمت روبل روسیه', type: 'currency', slug: 'ruble' },
  sar: { name: 'ریال عربستان', title: 'قیمت ریال عربستان', type: 'currency', slug: 'saudi-riyal' },
  kwd: { name: 'دینار کویت', title: 'قیمت دینار کویت', type: 'currency', slug: 'kuwaiti-dinar' },
  iqd: { name: 'دینار عراق', title: 'قیمت دینار عراق', type: 'currency', slug: 'iraqi-dinar' },
  inr: { name: 'روپیه هند', title: 'قیمت روپیه هند', type: 'currency', slug: 'indian-rupee' },
  afn: { name: 'افغانی افغانستان', title: 'قیمت افغانی', type: 'currency', slug: 'afghani' },

  gold18: { name: 'طلای ۱۸ عیار (هر گرم)', title: 'قیمت طلای ۱۸ عیار', type: 'metal', slug: 'gold-18' },
  mesghal: { name: 'مثقال طلا', title: 'قیمت مثقال طلا', type: 'metal', slug: 'mesghal' },
  coin: { name: 'سکه تمام (طرح جدید)', title: 'قیمت سکه تمام', type: 'metal', slug: 'coin' },
  halfcoin: { name: 'نیم سکه', title: 'قیمت نیم سکه', type: 'metal', slug: 'half-coin' },
  quartercoin: { name: 'ربع سکه', title: 'قیمت ربع سکه', type: 'metal', slug: 'quarter-coin' },
  silver: { name: 'نقره (هر گرم)', title: 'قیمت نقره', type: 'metal', slug: 'silver' },
  gold24: { name: 'طلای ۲۴ عیار (هر گرم)', title: 'قیمت طلای ۲۴ عیار', type: 'metal', slug: 'gold-24' },
  baharazadi: { name: 'سکه بهار آزادی (طرح قدیم)', title: 'قیمت سکه بهار آزادی', type: 'metal', slug: 'bahar-azadi' },
  gerami: { name: 'سکه گرمی', title: 'قیمت سکه گرمی', type: 'metal', slug: 'gerami-coin' },
  goldounce: { name: 'اونس جهانی طلا', title: 'قیمت اونس جهانی طلا', type: 'metal', slug: 'gold-ounce', unit: 'usd' },
  silverounce: { name: 'اونس جهانی نقره', title: 'قیمت اونس جهانی نقره', type: 'metal', slug: 'silver-ounce', unit: 'usd' },
  platinum: { name: 'پلاتین (هر اونس)', title: 'قیمت پلاتین', type: 'metal', slug: 'platinum', unit: 'usd' },
  palladium: { name: 'پالادیوم (هر اونس)', title: 'قیمت پالادیوم', type: 'metal', slug: 'palladium', unit: 'usd' },

  brent: { name: 'نفت برنت (هر بشکه)', title: 'قیمت نفت برنت', type: 'energy', slug: 'brent-oil', unit: 'usd' },
  opec: { name: 'نفت اوپک (هر بشکه)', title: 'قیمت نفت اوپک', type: 'energy', slug: 'opec-oil', unit: 'usd' },

  bitcoin: { name: 'بیت‌کوین (BTC)', title: 'قیمت بیت‌کوین', type: 'crypto', slug: 'bitcoin' },
  ethereum: { name: 'اتریوم (ETH)', title: 'قیمت اتریوم', type: 'crypto', slug: 'ethereum' },
  tether: { name: 'تتر (USDT)', title: 'قیمت تتر', type: 'crypto', slug: 'tether' },
  bnb: { name: 'بایننس کوین (BNB)', title: 'قیمت بایننس کوین', type: 'crypto', slug: 'bnb' },
  xrp: { name: 'ریپل (XRP)', title: 'قیمت ریپل', type: 'crypto', slug: 'xrp' },
  dogecoin: { name: 'دوج‌کوین (DOGE)', title: 'قیمت دوج‌کوین', type: 'crypto', slug: 'dogecoin' },
  solana: { name: 'سولانا (SOL)', title: 'قیمت سولانا', type: 'crypto', slug: 'solana' },
  cardano: { name: 'کاردانو (ADA)', title: 'قیمت کاردانو', type: 'crypto', slug: 'cardano' },
  tron: { name: 'ترون (TRX)', title: 'قیمت ترون', type: 'crypto', slug: 'tron' },
  litecoin: { name: 'لایت‌کوین (LTC)', title: 'قیمت لایت‌کوین', type: 'crypto', slug: 'litecoin' },
  toncoin: { name: 'تون‌کوین (TON)', title: 'قیمت تون‌کوین', type: 'crypto', slug: 'toncoin' },
  polkadot: { name: 'پولکادات (DOT)', title: 'قیمت پولکادات', type: 'crypto', slug: 'polkadot' },
  chainlink: { name: 'چین‌لینک (LINK)', title: 'قیمت چین‌لینک', type: 'crypto', slug: 'chainlink' },
  avalanche: { name: 'آوالانچ (AVAX)', title: 'قیمت آوالانچ', type: 'crypto', slug: 'avalanche' },
  shiba: { name: '۱۰۰۰ شیبا (SHIB)', title: 'قیمت شیبا', type: 'crypto', slug: 'shiba' }
};

// عمداً هیچ عدد نمونه/ساختگی‌ای اینجا نیست. تا وقتی داده واقعی (از API یا کش) نیامده،
// current/previous برابر null می‌مانند و وضعیت هر دارایی 'loading' است.
for (const key of Object.keys(ASSETS)) {
  ASSETS[key].current = null;
  ASSETS[key].previous = null;
  ASSETS[key].status = 'loading'; // 'loading' | 'cached' | 'stale' | 'live' | 'error'
  ASSETS[key].updatedAt = null;
}

const ORDER = {
  currency: ['dollar', 'euro', 'pound', 'dirham', 'lira', 'cad', 'aud', 'chf', 'cny', 'jpy', 'rub', 'sar', 'kwd', 'iqd', 'inr', 'afn'],
  metal: ['gold18', 'gold24', 'mesghal', 'coin', 'halfcoin', 'quartercoin', 'baharazadi', 'gerami', 'silver', 'goldounce', 'silverounce', 'platinum', 'palladium'],
  energy: ['brent', 'opec'],
  crypto: ['bitcoin', 'ethereum', 'tether', 'bnb', 'xrp', 'dogecoin', 'solana', 'cardano', 'tron', 'litecoin', 'toncoin', 'polkadot', 'chainlink', 'avalanche', 'shiba']
};

function toFa(value) {
  return String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

function formatNumber(value) {
  return toFa(Math.round(Number(value)).toLocaleString('en-US'));
}

function calculateChange(current, previous) {
  const change = current - previous;
  const percent = previous === 0 ? 0 : (change / previous) * 100;
  return { change, percent };
}

function changeClass(change) {
  if (change > 0) return 'change-up';
  if (change < 0) return 'change-down';
  return 'change-neutral';
}

function changeArrow(change) {
  if (change > 0) return '↑';
  if (change < 0) return '↓';
  return '';
}

function formatPercent(percent) {
  if (percent === 0) return '۰٪';
  const rounded = Number(percent.toFixed(2));
  const sign = rounded > 0 ? '+' : '';
  return toFa(sign + rounded.toLocaleString('en-US', { maximumFractionDigits: 2 })) + '٪';
}

function formatChange(change) {
  const rounded = Math.round(change);
  if (rounded === 0) return '۰';
  const sign = rounded > 0 ? '+' : '';
  return toFa(sign + rounded.toLocaleString('en-US'));
}

/* دارایی‌هایی که قیمتشان دلاری است (اونس، نفت) با دو رقم اعشار و واحد «دلار» نمایش داده می‌شوند؛
   بقیه مثل قبل به تومان و بدون اعشار. */
function isUsd(asset) {
  return asset.unit === 'usd';
}

function unitName(asset) {
  return isUsd(asset) ? 'دلار' : 'تومان';
}

function formatPrice(asset, value) {
  if (!isUsd(asset)) return formatNumber(value);
  return toFa(Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}

function roundFor(asset, value) {
  return isUsd(asset) ? Math.round(value * 100) / 100 : Math.round(value);
}

function formatChangeFor(asset, change) {
  if (!isUsd(asset)) return formatChange(change);
  const rounded = roundFor(asset, change);
  if (rounded === 0) return '۰';
  const sign = rounded > 0 ? '+' : '';
  return toFa(sign + rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}

// متن ردیف/قیمت وقتی هنوز داده‌ی واقعی نداریم
function pendingText(asset) {
  return asset.status === 'error' ? 'دریافت نشد' : 'در حال دریافت...';
}

function renderRow(asset) {
  if (asset.current == null) {
    return `
    <tr id="${asset.slug}">
      <td>${asset.name}</td>
      <td class="change-neutral">—</td>
      <td class="change-neutral">—</td>
      <td class="change-neutral">${pendingText(asset)}</td>
    </tr>`;
  }
  // قیمت داریم ولی درصد/مقدار تغییر مشخص نیست (مثلاً منبع جهت تغییر را نداده)
  if (asset.previous == null) {
    return `
    <tr id="${asset.slug}">
      <td>${asset.name}</td>
      <td class="change-neutral">—</td>
      <td class="change-neutral">—</td>
      <td>${formatPrice(asset, asset.current)} ${unitName(asset)}</td>
    </tr>`;
  }
  const { change, percent } = calculateChange(asset.current, asset.previous);
  const cls = changeClass(roundFor(asset, change));
  const arrow = changeArrow(roundFor(asset, change));
  return `
    <tr id="${asset.slug}">
      <td>${asset.name}</td>
      <td class="${cls}">${arrow} ${formatPercent(percent)}</td>
      <td class="${cls}">${arrow} ${formatChangeFor(asset, change)} ${unitName(asset)}</td>
      <td>${formatPrice(asset, asset.current)} ${unitName(asset)}</td>
    </tr>`;
}

function renderTable(type, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = ORDER[type].map(key => renderRow(ASSETS[key])).join('');
}

/* ---------------------------------------------------------------------
   چرخش خودکار نرخ در هدر صفحه اصلی: هر ۱۰ ثانیه نام و قیمت عوض می‌شود.
   فقط در صفحه اصلی (بدون ?asset= و بدون #لنگر در آدرس) فعال است؛ صفحه‌ی هر دارایی
   و ماشین‌حساب دست نمی‌خورند. فهرست و زمان را همین‌جا می‌توانی عوض کنی.
--------------------------------------------------------------------- */
const HEADER_ROTATION_KEYS = ['dollar', 'euro', 'pound', 'gold18', 'coin', 'goldounce', 'bitcoin', 'ethereum', 'tether'];
const HEADER_ROTATION_MS = 8 * 1000;   // هر چند ثانیه نرخ عوض شود
const HEADER_FADE_MS = 700;            // مدت محو/ظاهر شدن (هر دو نیمه‌ی تغییر)
let headerRotationIndex = 0;

const IS_ROTATING_HEADER = !window.__PAGE_ASSET__
  && !!document.getElementById('currencies-body')
  && !new URLSearchParams(window.location.search).get('asset')
  && !/\/currency\/[^/]+\/?$/i.test(decodeURIComponent(window.location.pathname).replace(/\\/g, '/'));

function getCurrentAsset() {
  if (IS_ROTATING_HEADER) return ASSETS[HEADER_ROTATION_KEYS[headerRotationIndex]] || ASSETS.dollar;
  // نکته: اینجا همیشه از روی فیلد slug جستجو می‌کنیم، نه از روی نام کلید داخلی
  // شیء ASSETS (که برای gold18/halfcoin/quartercoin با slug فرق دارد).
  if (window.__PAGE_ASSET__) {
    return Object.values(ASSETS).find(asset => asset.slug === window.__PAGE_ASSET__) || ASSETS.dollar;
  }
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
  const match = path.match(/\/currency\/([^/]+)\/?$/i);
  if (match) {
    const slug = match[1].toLowerCase();
    return Object.values(ASSETS).find(asset => asset.slug === slug) || ASSETS.dollar;
  }

  const query = new URLSearchParams(window.location.search).get('asset');
  if (query) {
    return Object.values(ASSETS).find(asset => asset.slug === query) || ASSETS[query] || ASSETS.dollar;
  }

  const hash = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
  if (hash) {
    return Object.values(ASSETS).find(asset => asset.slug === hash) || ASSETS[hash] || ASSETS.dollar;
  }

  return ASSETS.dollar;
}

function renderCurrentAsset() {
  const asset = getCurrentAsset();
  const priceElement = document.getElementById('asset-price');
  const statusElement = document.getElementById('live-status');

  // در صفحه‌ی اختصاصی هر دارایی عنوان/برچسب از قبل در HTML نوشته شده؛ صفحه اصلی h1 مخصوص خودش را دارد
  if (window.__PAGE_ASSET__) {
    document.getElementById('asset-title').textContent = asset.title;
    document.getElementById('asset-label').textContent = asset.name;
  } else if (IS_ROTATING_HEADER) {
    // عنوان h1 صفحه اصلی ثابت می‌ماند؛ فقط نام ارز داخل کادر قیمت عوض می‌شود
    document.getElementById('asset-label').textContent = asset.name;
  }

  if (asset.current == null) {
    priceElement.innerHTML = pendingText(asset) === 'دریافت نشد'
      ? 'دریافت قیمت لحظه‌ای امکان‌پذیر نیست'
      : 'در حال دریافت قیمت...';
    priceElement.className = 'dollar-price loading-text';
  } else {
    priceElement.innerHTML = `${formatPrice(asset, asset.current)} <span class="money">${unitName(asset)}</span>`;
    priceElement.className = 'dollar-price';
  }

  if (statusElement) {
    if (asset.status === 'live') {
      statusElement.className = 'status-bar status-live';
      statusElement.textContent = asset.updatedAt ? `آخرین بروزرسانی: ${asset.updatedAt}` : '';
    } else if (asset.status === 'cached') {
      statusElement.className = 'status-bar status-cached';
      statusElement.textContent = 'در حال دریافت قیمت تازه... (این عدد آخرین قیمت شناخته‌شده است)';
    } else if (asset.status === 'stale') {
      statusElement.className = 'status-bar status-cached';
      statusElement.textContent = 'دریافت قیمت تازه ممکن نشد؛ آخرین قیمت ذخیره‌شده نمایش داده می‌شود و دوباره تلاش می‌کنیم.';
    } else if (asset.status === 'error') {
      statusElement.className = 'status-bar status-error';
      statusElement.textContent = 'اتصال به سرور قیمت برقرار نشد؛ به‌زودی دوباره تلاش می‌کنیم.';
    } else {
      statusElement.className = 'status-bar status-loading';
      statusElement.textContent = 'در حال دریافت قیمت لحظه‌ای...';
    }
  }

  const detailsLink = document.getElementById('details-link');
  detailsLink.href = `#${asset.slug}`;
  detailsLink.onclick = function (event) {
    event.preventDefault();
    const target = document.getElementById(asset.slug);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // در حالت چرخش، #لنگر به آدرس اضافه نمی‌شود (مبادا با رفرش، چرخش متوقف شود)
      if (!IS_ROTATING_HEADER) history.replaceState(null, '', `#${asset.slug}`);
    }
  };
}

function renderAll() {
  renderCurrentAsset();
  renderTable('currency', 'currencies-body');
  renderTable('metal', 'metals-body');
  renderTable('energy', 'energy-body');
  renderTable('crypto', 'crypto-body');
}

/* ---------------------------------------------------------------------
   کش محلی (برای رفع فاصله‌ی چند ثانیه‌ای بین لود صفحه و رسیدن جواب API):
   - در اولین بازدید (کش خالی) کاربر متن «در حال دریافت قیمت...» را می‌بیند.
   - از بازدید دوم به بعد، آخرین قیمت واقعی شناخته‌شده فوراً نمایش داده می‌شود
     و همزمان یک درخواست تازه هم در پس‌زمینه ارسال می‌شود.
   هیچ‌وقت به عدد ساختگی/نمونه برنمی‌گردیم.
--------------------------------------------------------------------- */
const CACHE_KEY = 'glcr-last-prices-v2';

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveCache() {
  try {
    const data = {};
    for (const key of Object.keys(ASSETS)) {
      const asset = ASSETS[key];
      if (asset.status === 'live' && Number.isFinite(asset.current)) {
        data[key] = {
          current: asset.current,
          previous: Number.isFinite(asset.previous) ? asset.previous : null
        };
      }
    }
    // اگر در این دور چیزی نگرفته‌ایم، کش قبلی را خراب نکن
    if (Object.keys(data).length === 0) return;
    const old = loadCache() || {};
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.assign(old, data)));
  } catch (error) {
    // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)؛ فقط یعنی کش نداریم.
  }
}

function hydrateFromCache() {
  const cache = loadCache();
  if (!cache) return;
  for (const key of Object.keys(ASSETS)) {
    const cached = cache[key];
    if (cached && Number.isFinite(cached.current)) {
      ASSETS[key].current = cached.current;
      ASSETS[key].previous = Number.isFinite(cached.previous) ? cached.previous : null;
      ASSETS[key].status = 'cached';
    }
  }
}

// بعد از هر دور دریافت، دارایی‌هایی که در این دور به‌روز نشدند:
// - اگر هیچ عددی نداریم → 'error'
// - اگر عدد قدیمی (کش‌شده) داریم → 'stale' (عدد حذف نمی‌شود)
function markNotUpdated(keys, updatedKeys) {
  for (const key of keys) {
    if (updatedKeys.has(key)) continue;
    ASSETS[key].status = ASSETS[key].current == null ? 'error' : 'stale';
  }
}

// ساعت به وقت تهران (مستقل از ساعت/منطقه‌ی زمانی دستگاه کاربر)، ۲۴ ساعته
function tehranTimeLabel() {
  try {
    return new Date().toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', hour12: false });
  } catch (error) {
    return new Date().toLocaleTimeString('fa-IR');
  }
}

function parseLiveNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (value == null) return NaN;
  const normalized = String(value)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٬,\s]/g, '')
    .replace(/%/g, '')
    .replace(/٫/g, '.');
  if (normalized === '') return NaN;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

/* ---------------------------------------------------------------------
   دریافت JSON با timeout و چند مسیر جایگزین (مستقیم، سپس پروکسی‌های CORS).
   اولین مسیری که جواب معتبر بدهد در دفعات بعد اول امتحان می‌شود.
--------------------------------------------------------------------- */
const FETCH_TIMEOUT_MS = 5000;
// مسیر اول (آخرین مسیر موفق) فوراً شروع می‌شود؛ بقیه به‌ترتیب با کمی فاصله، تا اگر اولی کند بود سریع جایگزین برسند
const STAGGER_MS = 400;

function viaAllOrigins(url) {
  return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
}
function viaCorsProxy(url) {
  return 'https://corsproxy.io/?url=' + encodeURIComponent(url);
}
function viaCodeTabs(url) {
  return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url);
}
function viaThingProxy(url) {
  return 'https://thingproxy.freeboard.io/fetch/' + url;
}

// اگر پروکسی شخصی خودت را داری (مثلاً Cloudflare Worker)، آدرسش را اینجا بگذار؛
// آدرس باید یک پارامتر ?url= بگیرد و JSON را با هدر CORS برگرداند.
// مثال: 'https://my-proxy.example.workers.dev/?url='
const MY_PROXY_PREFIX = '';
function viaMyProxy(url) {
  return MY_PROXY_PREFIX + encodeURIComponent(url);
}

async function fetchTextWithTimeout(url, options, sharedController) {
  let controller = null;
  let timer = null;
  const init = Object.assign({ cache: 'no-store' }, options || {});
  controller = sharedController || (typeof AbortController !== 'undefined' ? new AbortController() : null);
  if (controller) init.signal = controller.signal;
  // (در محیط build.js تایمر وجود ندارد؛ آنجا بدون timeout ادامه می‌دهیم)
  const hasTimers = typeof setTimeout === 'function' && typeof clearTimeout === 'function';
  const timeout = hasTimers
    ? new Promise((_, reject) => {
        timer = setTimeout(() => {
          if (controller) controller.abort();
          reject(new Error('timeout'));
        }, FETCH_TIMEOUT_MS);
      })
    : new Promise(() => {});
  try {
    const response = await Promise.race([fetch(url, init), timeout]);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await Promise.race([response.text(), timeout]);
  } finally {
    if (hasTimers) clearTimeout(timer);
  }
}

const lastGoodTarget = {};

// targets: [{ name, url }]  —  validate(json) باید true/false برگرداند
// مسیرها موازی (با فاصله‌ی کوتاه) امتحان می‌شوند و اولین پاسخ معتبر برنده است؛ بقیه لغو می‌شوند.
function fetchJsonFromTargets(label, targets, validate) {
  const start = Math.min(lastGoodTarget[label] || 0, targets.length - 1);
  const ordered = targets.slice(start).concat(targets.slice(0, start));
  const errors = [];
  const controllers = [];
  const timers = [];
  const hasTimers = typeof setTimeout === 'function' && typeof clearTimeout === 'function';
  let settled = false;
  let failed = 0;

  return new Promise((resolve, reject) => {
    function stopAll() {
      settled = true;
      timers.forEach(t => clearTimeout(t));
      controllers.forEach(c => { try { c.abort(); } catch (e) { /* مهم نیست */ } });
    }

    async function run(target) {
      if (settled) return;
      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        if (controller) controllers.push(controller);
        const text = await fetchTextWithTimeout(target.url, undefined, controller);
        const json = JSON.parse(text);
        if (!validate(json)) throw new Error('ساختار پاسخ غیرمنتظره');
        if (settled) return;
        lastGoodTarget[label] = targets.indexOf(target);
        stopAll();
        resolve(json);
      } catch (error) {
        if (settled) return;
        errors.push(`${target.name}: ${error && error.message ? error.message : error}`);
        failed++;
        if (failed === ordered.length) {
          const failure = new Error(`${label}: همه‌ی مسیرها شکست خوردند`);
          failure.details = errors;
          reject(failure);
        }
      }
    }

    ordered.forEach((target, i) => {
      if (i === 0 || !hasTimers) run(target);
      else timers.push(setTimeout(() => run(target), Math.min(i, 3) * STAGGER_MS));
    });
  });
}

/* ---------------------------------------------------------------------
   منبع قیمت ارز، طلا و سکه: TGJU
   خود سایت TGJU قیمت‌ها را از یک فایل JSON می‌خواند (call1..call5.tgju.org/ajax.json)؛
   این همان داده‌ای است که روی صفحه‌ی اصلی می‌بینی، ولی بدون نیاز به پارس کردن HTML.
   این یک API رسمی و مستند نیست؛ اگر TGJU ساختارش را عوض کند، باید همین بخش
   به‌روز شود (کلیدها و فیلدها پایین‌تر مشخص شده‌اند).

   فیلدهای هر آیتم:  p = قیمت (ریال، رشته‌ی دارای ویرگول)
                     dp = درصد تغییر (بدون علامت)
                     dt = جهت تغییر: 'high' (افزایش) یا 'low' (کاهش)
   قیمت‌ها ریال هستند و سایت تومان نشان می‌دهد → تقسیم بر ۱۰.
--------------------------------------------------------------------- */
const TGJU_FEED_URLS = [
  'https://call1.tgju.org/ajax.json',
  'https://call4.tgju.org/ajax.json',
  'https://call5.tgju.org/ajax.json'
];

const TGJU_TARGETS = [].concat(
  MY_PROXY_PREFIX ? [{ name: 'پروکسی شخصی', url: viaMyProxy(TGJU_FEED_URLS[0]) }] : [],
  [
    { name: 'tgju مستقیم (call1)', url: TGJU_FEED_URLS[0] },
    { name: 'allorigins (call1)', url: viaAllOrigins(TGJU_FEED_URLS[0]) },
    { name: 'codetabs (call1)', url: viaCodeTabs(TGJU_FEED_URLS[0]) },
    { name: 'thingproxy (call1)', url: viaThingProxy(TGJU_FEED_URLS[0]) },
    { name: 'corsproxy (call1)', url: viaCorsProxy(TGJU_FEED_URLS[0]) },
    { name: 'allorigins (call4)', url: viaAllOrigins(TGJU_FEED_URLS[1]) },
    { name: 'codetabs (call4)', url: viaCodeTabs(TGJU_FEED_URLS[1]) },
    { name: 'tgju مستقیم (call5)', url: TGJU_FEED_URLS[2] }
  ]
);

// کلید هر دارایی در فایل JSON خود TGJU (به ترتیب اولویت).
// کلیدهای dollar/euro/dirham/lira/gold18/mesghal/coin در منابع دیگر تأیید شده‌اند؛
// pound/halfcoin/quartercoin/silver حدسی‌اند — اگر پیدا نشوند، کنسول مرورگر
// کلیدهای مشابه موجود را چاپ می‌کند تا همین‌جا اصلاحشان کنی.
const TGJU_KEYS = {
  dollar: ['price_dollar_rl'],
  euro: ['price_eur'],
  pound: ['price_gbp'],
  dirham: ['price_aed'],
  lira: ['price_try'],
  gold18: ['geram18'],
  mesghal: ['mesghal'],
  coin: ['sekee'],
  halfcoin: ['nim'],
  quartercoin: ['rob'],
  silver: ['silver_999'],

  // ارزهای تازه (قیمت به ریال)
  cad: ['price_cad'],
  aud: ['price_aud'],
  chf: ['price_chf'],
  cny: ['price_cny'],
  jpy: ['price_jpy'], // قیمت ۱۰۰ ین
  rub: ['price_rub'],
  sar: ['price_sar'],
  kwd: ['price_kwd'],
  iqd: ['price_iqd'],
  inr: ['price_inr'],
  afn: ['price_afn'],

  // طلا و سکه‌ی تازه (ریال) و فلزات/نفت جهانی (دلار؛ asset.unit === 'usd')
  gold24: ['geram24'],
  baharazadi: ['sekeb'],
  gerami: ['gerami'],
  goldounce: ['ons'],
  silverounce: ['silver'],
  platinum: ['platinum'],
  palladium: ['palladium'],
  brent: ['oil_brent'],
  opec: ['oil_opec'],

  // ارز دیجیتال از خود TGJU (قیمت به ریال)
  dogecoin: ['crypto-dogecoin-irr'],
  solana: ['crypto-solana-irr'],
  cardano: ['crypto-cardano-irr'],
  tron: ['crypto-tron-irr'],
  litecoin: ['crypto-litecoin-irr'],
  toncoin: ['crypto-toncoin-irr'],
  polkadot: ['crypto-polkadot-irr'],
  chainlink: ['crypto-chainlink-irr'],
  avalanche: ['crypto-avalanche-irr']
};

// شیبا ارزش بسیار کمی دارد و قیمت ریالی TGJU گرد شده است (مثلاً ۱۴ ریال).
// پس از قیمت دلاری شیبا × قیمت تتر (ریال) × مقیاس محاسبه می‌شود (قیمت ۱۰۰۰ شیبا).
const TGJU_DERIVED = {
  shiba: { usdKey: 'crypto-shiba-inu', rateKey: 'crypto-tether-irr', scale: 1000 }
};

// تبدیل یک آیتم خام TGJU به {current, previous}. divisor = ۱۰ برای ریال→تومان، ۱ برای قیمت‌های دلاری.
function itemFromRaw(item, divisor) {
  {
    const raw = parseLiveNumber(item.p);
    if (!Number.isFinite(raw) || raw <= 0) return null;

    const current = raw / divisor;
    const pct = Math.abs(parseLiveNumber(item.dp));
    const amount = Math.abs(parseLiveNumber(item.d)) / divisor; // مقدار تغییر (اگر منبع بدهد)
    let previous = null; // null یعنی «تغییر نامشخص»، نه «بدون تغییر»
    if (Number.isFinite(pct) && pct > 0 && item.dt === 'high') previous = current / (1 + pct / 100);
    else if (Number.isFinite(pct) && pct > 0 && pct < 100 && item.dt === 'low') previous = current / (1 - pct / 100);
    else if (Number.isFinite(amount) && amount > 0 && item.dt === 'high') previous = current - amount;
    else if (Number.isFinite(amount) && amount > 0 && item.dt === 'low') previous = current + amount;
    else if (pct === 0) previous = current;
    return { current, previous };
  }
}

function readTgjuItem(feedCurrent, keys, asset) {
  const divisor = asset && isUsd(asset) ? 1 : 10;
  for (const key of keys) {
    const item = feedCurrent[key];
    if (!item) continue;
    const result = itemFromRaw(item, divisor);
    if (result) return result;
  }
  return null;
}

function readTgjuDerived(feedCurrent, def) {
  const usdItem = feedCurrent[def.usdKey];
  const rateItem = feedCurrent[def.rateKey];
  if (!usdItem || !rateItem) return null;
  const usd = parseLiveNumber(usdItem.p);
  const rate = parseLiveNumber(rateItem.p); // ریال به‌ازای هر تتر
  if (!Number.isFinite(usd) || usd <= 0 || !Number.isFinite(rate) || rate <= 0) return null;
  // درصد/جهت تغییر از همان قیمت دلاری می‌آید؛ مقدار تغییر دلاری به ریال قابل‌استفاده نیست، پس حذف می‌شود.
  const raw = { p: usd * rate * def.scale, dp: usdItem.dp, dt: usdItem.dt };
  return itemFromRaw(raw, 10);
}

function applyItem(assetKey, item, timeLabel) {
  if (!item || !Number.isFinite(item.current)) return false;
  ASSETS[assetKey].current = item.current;
  ASSETS[assetKey].previous = Number.isFinite(item.previous) ? item.previous : null;
  ASSETS[assetKey].status = 'live';
  ASSETS[assetKey].updatedAt = timeLabel;
  return true;
}

async function updateFiatAndMetalsFromTgju() {
  const keys = Object.keys(TGJU_KEYS).concat(Object.keys(TGJU_DERIVED));
  const updatedKeys = new Set();
  try {
    const feed = await fetchJsonFromTargets(
      'TGJU',
      TGJU_TARGETS,
      json => json && json.current && typeof json.current === 'object'
    );
    const now = tehranTimeLabel();
    const missing = [];
    for (const assetKey of keys) {
      const item = TGJU_DERIVED[assetKey]
        ? readTgjuDerived(feed.current, TGJU_DERIVED[assetKey])
        : readTgjuItem(feed.current, TGJU_KEYS[assetKey], ASSETS[assetKey]);
      if (applyItem(assetKey, item, now)) updatedKeys.add(assetKey);
      else missing.push(assetKey);
    }
    if (updatedKeys.size > 0) saveCache();
    if (missing.length > 0) {
      const allKeys = Object.keys(feed.current);
      console.warn('این دارایی‌ها در فایل TGJU پیدا نشدند:', missing.join(', '));
      for (const assetKey of missing) {
        if (!TGJU_KEYS[assetKey]) continue;
        const hint = TGJU_KEYS[assetKey][0].replace(/^price_/, '').slice(0, 3);
        console.warn(`کلیدهای مشابه برای «${assetKey}»:`, allKeys.filter(k => k.includes(hint)));
      }
    }
  } catch (error) {
    console.warn('دریافت قیمت ارز/طلا/سکه از TGJU انجام نشد:', error.details || error);
  } finally {
    markNotUpdated(keys, updatedKeys);
  }
}

/* ---------------------------------------------------------------------
   منبع ۲: نوبیتکس برای ارز دیجیتال (بیت‌کوین، اتریوم، تتر، بایننس‌کوین، ریپل).
   API عمومی و مستند است (apidocs.nobitex.ir، آدرس پایه: apiv2.nobitex.ir)، بدون توکن، و قیمت را مستقیماً
   به ریال می‌دهد. با GET فراخوانی می‌شود (درخواست ساده، بدون preflight CORS).
   محدودیت: ۲۰ درخواست در دقیقه برای هر IP.
   dayChange درصد تغییر ۲۴ ساعته است (رشته).
--------------------------------------------------------------------- */
// نکته: نوبیتکس آدرس پایه‌ی API را از api.nobitex.ir به apiv2.nobitex.ir منتقل کرده است.
const NOBITEX_API_URL = 'https://apiv2.nobitex.ir/market/stats?dstCurrency=rls';

const NOBITEX_TARGETS = [
  { name: 'nobitex مستقیم', url: NOBITEX_API_URL },
  { name: 'allorigins', url: viaAllOrigins(NOBITEX_API_URL) }
];

const NOBITEX_KEYS = {
  bitcoin: 'btc',
  ethereum: 'eth',
  tether: 'usdt',
  bnb: 'bnb',
  xrp: 'xrp'
};

function readNobitexItem(stat) {
  if (!stat) return null;
  const rawPrice = parseLiveNumber(stat.latest);
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return null;

  const current = rawPrice / 10; // ریال به تومان
  const dayChangePercent = parseLiveNumber(stat.dayChange);
  let previous = null;
  if (Number.isFinite(dayChangePercent) && dayChangePercent > -100) {
    previous = current / (1 + dayChangePercent / 100);
  }
  return { current, previous };
}

async function updateCryptoFromNobitex() {
  const keys = Object.keys(NOBITEX_KEYS);
  const updatedKeys = new Set();
  try {
    const payload = await fetchJsonFromTargets(
      'Nobitex',
      NOBITEX_TARGETS,
      json => json && json.stats && typeof json.stats === 'object'
    );
    const now = tehranTimeLabel();
    for (const [assetKey, code] of Object.entries(NOBITEX_KEYS)) {
      const item = readNobitexItem(payload.stats[`${code}-rls`]);
      if (applyItem(assetKey, item, now)) updatedKeys.add(assetKey);
      else console.warn(`«${code}-rls» در پاسخ نوبیتکس پیدا نشد.`);
    }
    if (updatedKeys.size > 0) saveCache();
  } catch (error) {
    console.warn('دریافت قیمت ارز دیجیتال از نوبیتکس انجام نشد:', error.details || error);
  } finally {
    markNotUpdated(keys, updatedKeys);
  }
}

let isUpdating = false;

async function updateFromAPI() {
  if (isUpdating) return; // از هم‌پوشانی دورها جلوگیری می‌کنیم
  isUpdating = true;
  try {
    await Promise.allSettled([
      updateFiatAndMetalsFromTgju(),
      updateCryptoFromNobitex()
    ]);
    renderAll();
  } finally {
    isUpdating = false;
  }
}

/* ---------------------------------------------------------------------
   نمودار ۶ / ۱۲ / ۲۴ ساعته: با کلیک (یا لمس) روی هر ردیف جدول باز می‌شود.
   داده را ربات GitHub (scripts/collect-prices.mjs) در data/history.json ذخیره می‌کند.
   هیچ داده‌ی ساختگی کشیده نمی‌شود؛ اگر داده‌ی کافی نباشد، پیام «در حال جمع‌آوری» می‌آید.
--------------------------------------------------------------------- */
const CHART_PERIODS = [6, 12, 24];
const CHART_DEFAULT_HOURS = 6;
const CHART_COLORS = { up: '#22c55e', down: '#ef4444', flat: '#8aa0b8' };
const CHART_CANDLES = 24; // تعداد شمع در هر بازه
let chartMode = 'line'; // 'line' یا 'candle'
const HISTORY_URL = (function () {
  try {
    const src = document.currentScript && document.currentScript.src;
    return src ? new URL('../data/history.json', src).href : null;
  } catch (e) {
    return null;
  }
})();

let historyCache = { at: 0, data: null };
let chartState = { key: null, hours: CHART_DEFAULT_HOURS, series: [] };

async function loadHistory() {
  if (!HISTORY_URL) return null;
  if (historyCache.data && Date.now() - historyCache.at < 60 * 1000) return historyCache.data;
  try {
    const res = await fetch(HISTORY_URL + '?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    historyCache = { at: Date.now(), data };
    return data;
  } catch (e) {
    return null;
  }
}

function formatClock(ts) {
  return toFa(new Date(ts * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' }));
}

function chartSeriesFor(key, hours, history) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - hours * 3600;
  const raw = (history && history.points && history.points[key]) || [];
  let pts = raw.filter(p => Array.isArray(p) && p[0] >= from && Number.isFinite(p[1]));
  const live = ASSETS[key].current;
  // آخرین نقطه را با قیمت زنده‌ی همین لحظه می‌بندیم تا نمودار به قیمت جدول برسد
  if (live != null && Number.isFinite(live) && (!pts.length || pts[pts.length - 1][0] < now - 60)) {
    pts = pts.concat([[now, live]]);
  }
  return pts;
}

function ensureChartDom() {
  let overlay = document.getElementById('chart-overlay');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'chart-overlay';
  overlay.className = 'chart-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="chart-panel" role="dialog" aria-modal="true" aria-labelledby="chart-title">
      <div class="chart-head">
        <div class="chart-head-main">
          <h3 id="chart-title"></h3>
          <div class="chart-price" id="chart-price"></div>
          <span class="chart-chip" id="chart-chip"></span>
        </div>
        <button type="button" class="chart-close" id="chart-close" aria-label="بستن">×</button>
      </div>
      <div class="chart-controls">
        <div class="chart-seg" role="group" aria-label="بازه‌ی زمانی">
          ${CHART_PERIODS.map(h => `<button type="button" class="chart-period" data-hours="${h}">${toFa(h)} ساعته</button>`).join('')}
        </div>
        <div class="chart-seg" role="group" aria-label="نوع نمودار">
          <button type="button" class="chart-mode" data-mode="line">خطی</button>
          <button type="button" class="chart-mode" data-mode="candle">شمعی</button>
        </div>
      </div>
      <div class="chart-body" id="chart-body" dir="ltr"></div>
      <div class="chart-stats" id="chart-stats"></div>
      <p class="chart-note" id="chart-note"></p>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target.id === 'chart-close') closeChart();
    const periodBtn = event.target.closest && event.target.closest('.chart-period');
    if (periodBtn) {
      chartState.hours = Number(periodBtn.dataset.hours);
      drawChart();
    }
    const modeBtn = event.target.closest && event.target.closest('.chart-mode');
    if (modeBtn) {
      chartMode = modeBtn.dataset.mode;
      drawChart();
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeChart();
  });
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (!overlay.hidden) drawChart(); }, 150);
  });
  return overlay;
}

function closeChart() {
  const overlay = document.getElementById('chart-overlay');
  if (overlay) overlay.hidden = true;
  document.body.classList.remove('chart-open');
}

async function openChart(key) {
  const overlay = ensureChartDom();
  chartState = { key, hours: CHART_DEFAULT_HOURS, series: [] };
  overlay.hidden = false;
  document.body.classList.add('chart-open');
  const asset = ASSETS[key];
  document.getElementById('chart-title').textContent = asset.name;
  document.getElementById('chart-price').textContent = '';
  document.getElementById('chart-chip').textContent = '';
  document.getElementById('chart-body').innerHTML = '<div class="chart-empty">در حال دریافت داده...</div>';
  document.getElementById('chart-stats').innerHTML = '';
  document.getElementById('chart-note').textContent = '';
  chartState.history = await loadHistory();
  if (chartState.key === key) drawChart();
}

// برچسب‌های «خوانا» برای محور قیمت: تیک‌های گرد و واحد مناسب (میلیارد/میلیون)
function niceTicks(min, max, count) {
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = mult * mag;
  const first = Math.ceil(min / step - 1e-9);
  const ticks = [];
  for (let i = first; i * step <= max + step * 1e-9; i++) ticks.push(i * step);
  return { ticks, step };
}

function axisScale(asset, maxValue) {
  if (isUsd(asset)) return { div: 1, word: '' };
  if (maxValue >= 1e9) return { div: 1e9, word: ' میلیارد' };
  if (maxValue >= 1e7) return { div: 1e6, word: ' میلیون' };
  return { div: 1, word: '' };
}

function axisLabel(asset, value, scale, step) {
  const x = value / scale.div;
  let decimals = Math.max(0, Math.ceil(-Math.log10(step / scale.div) - 1e-9));
  decimals = Math.min(4, decimals);
  if (isUsd(asset)) decimals = Math.max(2, decimals);
  return toFa(x.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })) + scale.word;
}

// ساخت شمع‌ها از نقطه‌های ذخیره‌شده؛ باز = بسته‌ی شمع قبلی (مثل صرافی‌ها)
function buildCandles(pts, windowStart, hours) {
  const bucket = (hours * 3600) / CHART_CANDLES;
  const candles = [];
  let prevClose = null;
  for (let i = 0; i < CHART_CANDLES; i++) {
    const lo = windowStart + i * bucket;
    const hi = lo + bucket;
    const seg = pts.filter(p => p[0] >= lo && (p[0] < hi || (i === CHART_CANDLES - 1 && p[0] <= hi)));
    if (!seg.length) continue;
    const values = seg.map(p => p[1]);
    const open = prevClose != null ? prevClose : values[0];
    const close = values[values.length - 1];
    candles.push({
      i, t: lo + bucket / 2, from: lo,
      open, close,
      high: Math.max(open, ...values),
      low: Math.min(open, ...values)
    });
    prevClose = close;
  }
  return candles;
}

function drawChart() {
  const key = chartState.key;
  const asset = ASSETS[key];
  const hours = chartState.hours;
  const bodyEl = document.getElementById('chart-body');
  const statsEl = document.getElementById('chart-stats');
  const noteEl = document.getElementById('chart-note');
  const chipEl = document.getElementById('chart-chip');

  document.querySelectorAll('.chart-period').forEach(btn => {
    btn.setAttribute('aria-pressed', Number(btn.dataset.hours) === hours ? 'true' : 'false');
  });
  document.querySelectorAll('.chart-mode').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.mode === chartMode ? 'true' : 'false');
  });
  document.getElementById('chart-price').innerHTML = asset.current != null
    ? `${formatPrice(asset, asset.current)} <small>${unitName(asset)}</small>`
    : '';

  const pts = chartSeriesFor(key, hours, chartState.history);
  statsEl.innerHTML = '';
  noteEl.textContent = '';
  chipEl.textContent = '';
  chipEl.className = 'chart-chip';

  const MIN_SPAN_SECONDS = 15 * 60;
  if (pts.length < 2 || pts[pts.length - 1][0] - pts[0][0] < MIN_SPAN_SECONDS) {
    bodyEl.innerHTML = `<div class="chart-empty">هنوز داده‌ی کافی برای ${toFa(hours)} ساعت گذشته جمع نشده است.<br>ربات هر چند دقیقه یک نقطه ذخیره می‌کند؛ کمی بعد دوباره سر بزن.</div>`;
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - hours * 3600;
  const windowEnd = now;
  const span = windowEnd - windowStart;
  const prices = pts.map(p => p[1]);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const state = last > first ? 'up' : last < first ? 'down' : 'flat';
  const color = CHART_COLORS[state];
  const candles = chartMode === 'candle' ? buildCandles(pts, windowStart, hours) : [];

  let dataMin = Math.min.apply(null, chartMode === 'candle' && candles.length ? candles.map(c => c.low) : prices);
  let dataMax = Math.max.apply(null, chartMode === 'candle' && candles.length ? candles.map(c => c.high) : prices);
  const flat = dataMax === dataMin;
  if (flat) {
    const pad = Math.abs(dataMax) * 0.002 || 1;
    dataMin -= pad;
    dataMax += pad;
  } else {
    const pad = (dataMax - dataMin) * 0.1;
    dataMin -= pad;
    dataMax += pad;
  }
  const { ticks, step } = niceTicks(dataMin, dataMax, 4);
  const scale = axisScale(asset, dataMax);

  const W = Math.max(bodyEl.clientWidth || 320, 260);
  const H = window.innerWidth < 600 ? 230 : 280;
  const L = 6, R = 86, T = 8, B = 24;
  const pw = W - L - R;
  const ph = H - T - B;
  const X = t => L + ((t - windowStart) / span) * pw;
  const Y = v => T + (1 - (v - dataMin) / (dataMax - dataMin)) * ph;

  let svg = `<svg class="chart-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" dir="ltr" aria-hidden="true">`;
  // خطوط راهنما و برچسب قیمت (سمت راست)
  ticks.forEach(v => {
    const y = Y(v);
    svg += `<line class="chart-grid" x1="${L}" x2="${L + pw}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    svg += `<text class="chart-axis-text" x="${L + pw + 8}" y="${(y + 3.5).toFixed(1)}">${axisLabel(asset, v, scale, step)}</text>`;
  });
  // محور زمان (پایین)
  for (let i = 0; i <= 4; i++) {
    const x = L + (i / 4) * pw;
    const anchor = i === 0 ? 'start' : i === 4 ? 'end' : 'middle';
    svg += `<line class="chart-grid chart-grid-v" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${T}" y2="${T + ph}"/>`;
    svg += `<text class="chart-axis-text" x="${x.toFixed(1)}" y="${H - 7}" text-anchor="${anchor}">${formatClock(windowStart + (span * i) / 4)}</text>`;
  }

  if (chartMode === 'candle' && candles.length) {
    const slot = pw / CHART_CANDLES;
    const cw = Math.max(3, Math.min(slot * 0.62, 16));
    candles.forEach(c => {
      const x = L + (c.i + 0.5) * slot;
      const col = c.close >= c.open ? CHART_COLORS.up : CHART_COLORS.down;
      const yo = Y(c.open), yc = Y(c.close);
      svg += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Y(c.high).toFixed(1)}" y2="${Y(c.low).toFixed(1)}" stroke="${col}" stroke-width="1.5"/>`;
      svg += `<rect x="${(x - cw / 2).toFixed(1)}" y="${Math.min(yo, yc).toFixed(1)}" width="${cw.toFixed(1)}" height="${Math.max(2, Math.abs(yo - yc)).toFixed(1)}" fill="${col}" rx="1.5"/>`;
    });
  } else {
    const line = pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
    const x0 = X(pts[0][0]).toFixed(1);
    const x1 = X(pts[pts.length - 1][0]).toFixed(1);
    svg += `<defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.32"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`;
    svg += `<polygon points="${x0},${T + ph} ${line} ${x1},${T + ph}" fill="url(#chart-fill)"/>`;
    svg += `<polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  // خط‌چین و برچسب قیمت فعلی روی محور
  const ly = Y(last);
  svg += `<line x1="${L}" x2="${L + pw}" y1="${ly.toFixed(1)}" y2="${ly.toFixed(1)}" stroke="${color}" stroke-width="1" stroke-dasharray="4 3" opacity="0.85"/>`;
  svg += `<rect x="${L + pw + 2}" y="${(ly - 9).toFixed(1)}" width="${R - 4}" height="18" rx="4" fill="${color}"/>`;
  svg += `<text class="chart-axis-text chart-last-text" x="${L + pw + 2 + (R - 4) / 2}" y="${(ly + 3.5).toFixed(1)}" text-anchor="middle">${axisLabel(asset, last, scale, step)}</text>`;
  // عناصر ضربدر دقیق (در ابتدا پنهان)
  svg += `<line id="chart-cross-v" class="chart-cross" y1="${T}" y2="${T + ph}" style="display:none"/>`;
  svg += `<circle id="chart-cross-dot" r="5" fill="${color}" stroke="#001421" stroke-width="2" style="display:none"/>`;
  svg += '</svg>';

  bodyEl.innerHTML = `<div class="chart-plot" id="chart-plot" style="height:${H}px">${svg}<div class="chart-tip" id="chart-tip" hidden></div></div>`;

  const pct = first > 0 ? ((last - first) / first) * 100 : 0;
  chipEl.className = `chart-chip chart-chip-${state}`;
  chipEl.setAttribute('dir', 'ltr');
  chipEl.textContent = `${state === 'up' ? '▲' : state === 'down' ? '▼' : '■'} ${toFa(Math.abs(pct).toFixed(2))}٪`;
  statsEl.innerHTML = `
    <div class="chart-stat"><span>بیشترین</span><strong>${formatPrice(asset, Math.max.apply(null, prices))}</strong></div>
    <div class="chart-stat"><span>کمترین</span><strong>${formatPrice(asset, Math.min.apply(null, prices))}</strong></div>
    <div class="chart-stat"><span>شروع بازه</span><strong>${formatPrice(asset, first)}</strong></div>`;

  const t0 = pts[0][0];
  const t1 = pts[pts.length - 1][0];
  const ageMin = Math.round((Date.now() / 1000 - t1) / 60);
  const collectedHours = Math.max(1, Math.round((t1 - t0) / 3600));
  if (flat && pts.length >= 3) {
    noteEl.textContent = 'در این بازه قیمت تغییر نکرده است؛ ممکن است منبع این نرخ فقط یک‌بار در روز به‌روز شود.';
  } else if (t0 - windowStart > 30 * 60) {
    noteEl.textContent = `داده‌ی این نرخ هنوز حدود ${toFa(collectedHours)} ساعت جمع شده است و با گذشت زمان کامل‌تر می‌شود.`;
  } else if (ageMin > 30) {
    noteEl.textContent = `آخرین داده‌ی ذخیره‌شده ${toFa(ageMin)} دقیقه پیش است.`;
  }

  // ضربدر دقیق با لمس یا حرکت موس
  const plot = document.getElementById('chart-plot');
  const crossV = document.getElementById('chart-cross-v');
  const crossDot = document.getElementById('chart-cross-dot');
  const tip = document.getElementById('chart-tip');
  function show(event) {
    const rect = plot.getBoundingClientRect();
    const px = Math.min(Math.max(event.clientX - rect.left, L), L + pw);
    let x, html;
    if (chartMode === 'candle' && candles.length) {
      const slot = pw / CHART_CANDLES;
      const idx = Math.min(Math.max(Math.floor((px - L) / slot), 0), CHART_CANDLES - 1);
      let c = candles.find(k => k.i === idx);
      if (!c) c = candles.reduce((best, k) => Math.abs(k.i - idx) < Math.abs(best.i - idx) ? k : best, candles[0]);
      x = L + (c.i + 0.5) * slot;
      crossDot.style.display = 'none';
      html = `<b>${formatClock(c.from)}</b>
        <span>باز</span><em>${formatPrice(asset, c.open)}</em>
        <span>بالا</span><em>${formatPrice(asset, c.high)}</em>
        <span>پایین</span><em>${formatPrice(asset, c.low)}</em>
        <span>بسته</span><em>${formatPrice(asset, c.close)}</em>`;
    } else {
      const target = windowStart + ((px - L) / pw) * span;
      let best = pts[0];
      pts.forEach(p => { if (Math.abs(p[0] - target) < Math.abs(best[0] - target)) best = p; });
      x = X(best[0]);
      crossDot.setAttribute('cx', x.toFixed(1));
      crossDot.setAttribute('cy', Y(best[1]).toFixed(1));
      crossDot.style.display = '';
      html = `<b>${formatPrice(asset, best[1])} ${unitName(asset)}</b><span class="chart-tip-time">${formatClock(best[0])}</span>`;
    }
    crossV.setAttribute('x1', x.toFixed(1));
    crossV.setAttribute('x2', x.toFixed(1));
    crossV.style.display = '';
    tip.innerHTML = html;
    tip.hidden = false;
    tip.className = chartMode === 'candle' && candles.length ? 'chart-tip chart-tip-ohlc' : 'chart-tip';
    const half = tip.offsetWidth / 2;
    tip.style.left = Math.min(Math.max(x, half + 4), L + pw - half + 40) + 'px';
  }
  function hide() {
    crossV.style.display = 'none';
    crossDot.style.display = 'none';
    tip.hidden = true;
  }
  plot.addEventListener('pointermove', show);
  plot.addEventListener('pointerdown', show);
  plot.addEventListener('pointerleave', hide);
}

function initChartClicks() {
  if (typeof document.addEventListener !== 'function') return;
  document.addEventListener('click', function (event) {
    const row = event.target.closest && event.target.closest('tbody tr[id]');
    if (!row || event.target.closest('a')) return;
    const key = Object.keys(ASSETS).find(k => ASSETS[k].slug === row.id);
    if (key) openChart(key);
  });
}

// بعدی را که قیمت دارد انتخاب می‌کند (اگر هیچ‌کدام قیمت نداشتند، همان‌جا می‌ماند)
function advanceHeaderRotation() {
  const total = HEADER_ROTATION_KEYS.length;
  for (let step = 1; step <= total; step++) {
    const idx = (headerRotationIndex + step) % total;
    if (ASSETS[HEADER_ROTATION_KEYS[idx]].current != null) {
      headerRotationIndex = idx;
      return true;
    }
  }
  return false;
}

function startHeaderRotation() {
  if (!IS_ROTATING_HEADER || typeof document.querySelector !== 'function') return;
  const box = document.querySelector('.dollar-box');
  if (box) box.style.setProperty('--header-fade', HEADER_FADE_MS + 'ms');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setInterval(() => {
    if (typeof document.hidden !== 'undefined' && document.hidden) return;
    const before = headerRotationIndex;
    if (!advanceHeaderRotation() || before === headerRotationIndex) return;
    if (!box || reduceMotion) { renderCurrentAsset(); return; }
    box.classList.add('is-switching');
    setTimeout(() => {
      renderCurrentAsset();
      box.classList.remove('is-switching');
    }, HEADER_FADE_MS);
  }, HEADER_ROTATION_MS);
}

hydrateFromCache();
renderAll();
updateFromAPI();
startHeaderRotation();
initChartClicks();
setInterval(() => {
  // وقتی تب در پس‌زمینه است درخواست نفرست
  if (typeof document.hidden !== 'undefined' && document.hidden) return;
  updateFromAPI();
}, 60 * 1000);
