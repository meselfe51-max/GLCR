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

  gold18: { name: 'طلای ۱۸ عیار (هر گرم)', title: 'قیمت طلای ۱۸ عیار', type: 'metal', slug: 'gold-18' },
  mesghal: { name: 'مثقال طلا', title: 'قیمت مثقال طلا', type: 'metal', slug: 'mesghal' },
  coin: { name: 'سکه تمام (طرح جدید)', title: 'قیمت سکه تمام', type: 'metal', slug: 'coin' },
  halfcoin: { name: 'نیم سکه', title: 'قیمت نیم سکه', type: 'metal', slug: 'half-coin' },
  quartercoin: { name: 'ربع سکه', title: 'قیمت ربع سکه', type: 'metal', slug: 'quarter-coin' },
  silver: { name: 'نقره (هر گرم)', title: 'قیمت نقره', type: 'metal', slug: 'silver' },

  bitcoin: { name: 'بیت‌کوین (BTC)', title: 'قیمت بیت‌کوین', type: 'crypto', slug: 'bitcoin' },
  ethereum: { name: 'اتریوم (ETH)', title: 'قیمت اتریوم', type: 'crypto', slug: 'ethereum' },
  tether: { name: 'تتر (USDT)', title: 'قیمت تتر', type: 'crypto', slug: 'tether' },
  bnb: { name: 'بایننس کوین (BNB)', title: 'قیمت بایننس کوین', type: 'crypto', slug: 'bnb' },
  xrp: { name: 'ریپل (XRP)', title: 'قیمت ریپل', type: 'crypto', slug: 'xrp' }
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
  currency: ['dollar', 'euro', 'pound', 'dirham', 'lira'],
  metal: ['gold18', 'mesghal', 'coin', 'halfcoin', 'quartercoin', 'silver'],
  crypto: ['bitcoin', 'ethereum', 'tether', 'bnb', 'xrp']
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
      <td>${formatNumber(asset.current)} تومان</td>
    </tr>`;
  }
  const { change, percent } = calculateChange(asset.current, asset.previous);
  const cls = changeClass(Math.round(change));
  const arrow = changeArrow(Math.round(change));
  return `
    <tr id="${asset.slug}">
      <td>${asset.name}</td>
      <td class="${cls}">${arrow} ${formatPercent(percent)}</td>
      <td class="${cls}">${arrow} ${formatChange(change)} تومان</td>
      <td>${formatNumber(asset.current)} تومان</td>
    </tr>`;
}

function renderTable(type, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = ORDER[type].map(key => renderRow(ASSETS[key])).join('');
}

function getCurrentAsset() {
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
  }

  if (asset.current == null) {
    priceElement.innerHTML = pendingText(asset) === 'دریافت نشد'
      ? 'دریافت قیمت لحظه‌ای امکان‌پذیر نیست'
      : 'در حال دریافت قیمت...';
    priceElement.className = 'dollar-price loading-text';
  } else {
    priceElement.innerHTML = `${formatNumber(asset.current)} <span class="money">تومان</span>`;
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
      history.replaceState(null, '', `#${asset.slug}`);
    }
  };
}

function renderAll() {
  renderCurrentAsset();
  renderTable('currency', 'currencies-body');
  renderTable('metal', 'metals-body');
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
  silver: ['silver_999']
};

function readTgjuItem(feedCurrent, keys) {
  for (const key of keys) {
    const item = feedCurrent[key];
    if (!item) continue;
    const rial = parseLiveNumber(item.p);
    if (!Number.isFinite(rial) || rial <= 0) continue;

    const current = rial / 10;
    const pct = Math.abs(parseLiveNumber(item.dp));
    const amount = Math.abs(parseLiveNumber(item.d)) / 10; // مقدار تغییر به تومان (اگر منبع بدهد)
    let previous = null; // null یعنی «تغییر نامشخص»، نه «بدون تغییر»
    if (Number.isFinite(pct) && pct > 0 && item.dt === 'high') previous = current / (1 + pct / 100);
    else if (Number.isFinite(pct) && pct > 0 && pct < 100 && item.dt === 'low') previous = current / (1 - pct / 100);
    else if (Number.isFinite(amount) && amount > 0 && item.dt === 'high') previous = current - amount;
    else if (Number.isFinite(amount) && amount > 0 && item.dt === 'low') previous = current + amount;
    else if (pct === 0) previous = current;
    return { current, previous };
  }
  return null;
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
  const keys = Object.keys(TGJU_KEYS);
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
      const item = readTgjuItem(feed.current, TGJU_KEYS[assetKey]);
      if (applyItem(assetKey, item, now)) updatedKeys.add(assetKey);
      else missing.push(assetKey);
    }
    if (updatedKeys.size > 0) saveCache();
    if (missing.length > 0) {
      const allKeys = Object.keys(feed.current);
      console.warn('این دارایی‌ها در فایل TGJU پیدا نشدند:', missing.join(', '));
      for (const assetKey of missing) {
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

hydrateFromCache();
renderAll();
updateFromAPI();
setInterval(() => {
  // وقتی تب در پس‌زمینه است درخواست نفرست
  if (typeof document.hidden !== 'undefined' && document.hidden) return;
  updateFromAPI();
}, 60 * 1000);
