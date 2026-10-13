// جمع‌آوری قیمت‌ها برای نمودار ۲۴ ساعته (اجرا توسط GitHub Actions، Node 18+).
// خروجی: data/history.json  →  { updatedAt, points: { assetKey: [[unixSeconds, priceToman], ...] } }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const OUT = 'data/history.json';
const KEEP_SECONDS = 26 * 60 * 60;
const DAILY_KEEP_DAYS = 130; // برای بازده ۷/۳۰/۹۰ روزه‌ی داشبورد: آخرین قیمت هر روز (به وقت تهران)

// کلید روز به وقت تهران (UTC+3:30، بدون ساعت تابستانی)
function tehranDay(ts) {
  return new Date((ts + 12600) * 1000).toISOString().slice(0, 10);
} // کمی بیشتر از ۲۴ ساعت
const TIMEOUT_MS = 15000;

const TGJU_URLS = [
  'https://call1.tgju.org/ajax.json',
  'https://call4.tgju.org/ajax.json',
  'https://call5.tgju.org/ajax.json'
];
const TGJU_KEYS = {
  dollar: 'price_dollar_rl', euro: 'price_eur', pound: 'price_gbp', dirham: 'price_aed',
  lira: 'price_try', gold18: 'geram18', mesghal: 'mesghal', coin: 'sekee',
  halfcoin: 'nim', quartercoin: 'rob', silver: 'silver_999',
  cad: 'price_cad', aud: 'price_aud', chf: 'price_chf', cny: 'price_cny', jpy: 'price_jpy',
  rub: 'price_rub', sar: 'price_sar', kwd: 'price_kwd', iqd: 'price_iqd', inr: 'price_inr', afn: 'price_afn',
  gold24: 'geram24', baharazadi: 'sekeb', gerami: 'gerami',
  dogecoin: 'crypto-dogecoin-irr', solana: 'crypto-solana-irr', cardano: 'crypto-cardano-irr',
  tron: 'crypto-tron-irr', litecoin: 'crypto-litecoin-irr', toncoin: 'crypto-toncoin-irr',
  polkadot: 'crypto-polkadot-irr', chainlink: 'crypto-chainlink-irr', avalanche: 'crypto-avalanche-irr'
};
// قیمت این‌ها دلاری است و مثل سایت بدون تقسیم بر ۱۰ ذخیره می‌شود
const TGJU_USD_KEYS = {
  goldounce: 'ons', silverounce: 'silver', platinum: 'platinum', palladium: 'palladium',
  brent: 'oil_brent', opec: 'oil_opec'
};
// ۱۰۰۰ شیبا = قیمت دلاری شیبا × قیمت تتر (ریال) × ۱۰۰۰ ÷ ۱۰
const SHIBA = { usdKey: 'crypto-shiba-inu', rateKey: 'crypto-tether-irr', scale: 1000 };
const NOBITEX_URL = 'https://apiv2.nobitex.ir/market/stats?dstCurrency=rls';
const NOBITEX_KEYS = { bitcoin: 'btc', ethereum: 'eth', tether: 'usdt', bnb: 'bnb', xrp: 'xrp' };

function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (v == null) return NaN;
  const s = String(v).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٬,\s]/g, '').replace(/%/g, '').replace(/٫/g, '.');
  if (s === '') return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

async function getJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; glcr-collector)', accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

async function firstOk(urls, validate) {
  for (const url of urls) {
    try {
      const json = await getJson(url);
      if (validate(json)) return json;
      console.warn('پاسخ نامعتبر:', url);
    } catch (e) { console.warn('خطا:', url, e.message); }
  }
  return null;
}

const startedAt = Math.floor(Date.now() / 1000);
const prices = {};
const meta = {}; // برای هر دارایی: { p: قیمت مبنا برای محاسبه‌ی تغییر، t: زمان واقعی قیمت }

// همان منطق صفحه (price-page.js): مبنای تغییر از درصد/مقدار تغییر منبع
function previousOf(item, current, divisor) {
  const pct = Math.abs(num(item.dp));
  const amount = Math.abs(num(item.d)) / divisor;
  if (Number.isFinite(pct) && pct > 0 && item.dt === 'high') return current / (1 + pct / 100);
  if (Number.isFinite(pct) && pct > 0 && pct < 100 && item.dt === 'low') return current / (1 - pct / 100);
  if (Number.isFinite(amount) && amount > 0 && item.dt === 'high') return current - amount;
  if (Number.isFinite(amount) && amount > 0 && item.dt === 'low') return current + amount;
  if (pct === 0) return current;
  return null;
}
// زمان قیمت در TGJU (به وقت تهران) → ثانیه‌ی یونیکس
function tehranTs(ts) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(String(ts || ''));
  if (!m) return null;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) / 1000 - 12600;
  return Number.isFinite(t) && t <= startedAt + 300 ? t : null;
}

const tgju = await firstOk(TGJU_URLS, j => j && j.current && typeof j.current === 'object');
if (tgju) {
  for (const [asset, key] of Object.entries(TGJU_KEYS)) {
    const item = tgju.current[key];
    const rial = num(item && item.p);
    if (rial > 0) {
      prices[asset] = rial / 10;
      meta[asset] = { p: previousOf(item, rial / 10, 10), t: tehranTs(item.ts) || startedAt };
    }
  }
  for (const [asset, key] of Object.entries(TGJU_USD_KEYS)) {
    const item = tgju.current[key];
    const usd = num(item && item.p);
    if (usd > 0) {
      prices[asset] = usd;
      meta[asset] = { p: previousOf(item, usd, 1), t: tehranTs(item.ts) || startedAt };
    }
  }
  const shibaUsd = num(tgju.current[SHIBA.usdKey] && tgju.current[SHIBA.usdKey].p);
  const tetherRial = num(tgju.current[SHIBA.rateKey] && tgju.current[SHIBA.rateKey].p);
  if (shibaUsd > 0 && tetherRial > 0) {
    prices.shiba = (shibaUsd * tetherRial * SHIBA.scale) / 10;
    const su = tgju.current[SHIBA.usdKey];
    meta.shiba = { p: previousOf({ dp: su.dp, dt: su.dt }, prices.shiba, 10), t: tehranTs(su.ts) || startedAt };
  }
} else console.warn('TGJU در دسترس نبود.');

const nobitex = await firstOk([NOBITEX_URL], j => j && j.stats && typeof j.stats === 'object');
if (nobitex) {
  for (const [asset, code] of Object.entries(NOBITEX_KEYS)) {
    const st = nobitex.stats[code + '-rls'];
    const rial = num(st && st.latest);
    if (rial > 0) {
      prices[asset] = rial / 10;
      const dc = num(st.dayChange);
      meta[asset] = { p: Number.isFinite(dc) && dc > -100 ? rial / 10 / (1 + dc / 100) : null, t: startedAt };
    }
  }
} else console.warn('نوبیتکس در دسترس نبود.');

let history = { updatedAt: 0, points: {} };
try { history = JSON.parse(readFileSync(OUT, 'utf8')); } catch { /* اولین اجرا */ }
if (!history.points || typeof history.points !== 'object') history.points = {};

const now = Math.floor(Date.now() / 1000);
const cutoff = now - KEEP_SECONDS;
let added = 0;
for (const [asset, price] of Object.entries(prices)) {
  const arr = (history.points[asset] || []).filter(p => Array.isArray(p) && p[0] >= cutoff);
  arr.push([now, Math.round(price * 100) / 100]);
  history.points[asset] = arr;
  added++;
}
for (const asset of Object.keys(history.points)) {
  history.points[asset] = history.points[asset].filter(p => p[0] >= cutoff);
  if (history.points[asset].length === 0) delete history.points[asset];
}

// ذخیره‌ی روزانه: برای هر دارایی، آخرین قیمت هر روز؛ هر اجرا قیمت همان روز را به‌روز می‌کند
if (!history.daily || typeof history.daily !== 'object') history.daily = {};
const dailyCutoff = now - DAILY_KEEP_DAYS * 86400;
const today = tehranDay(now);
for (const [asset, price] of Object.entries(prices)) {
  const arr = (history.daily[asset] || []).filter(p => Array.isArray(p) && p[0] >= dailyCutoff);
  const rounded = Math.round(price * 100) / 100;
  if (arr.length && tehranDay(arr[arr.length - 1][0]) === today) arr[arr.length - 1] = [now, rounded];
  else arr.push([now, rounded]);
  history.daily[asset] = arr;
}

// آخرین قیمت هر دارایی (برای نمایش پشتیبان در سایت وقتی منبع زنده از مرورگر در دسترس نیست)
if (!history.latest || typeof history.latest !== 'object') history.latest = {};
for (const [asset, price] of Object.entries(prices)) {
  const m = meta[asset] || { p: null, t: startedAt };
  const r2 = v => Math.round(v * 100) / 100;
  history.latest[asset] = [r2(price), Number.isFinite(m.p) ? r2(m.p) : null, m.t];
}

console.log(`قیمت ${added} دارایی ثبت شد.`);
if (added === 0) { console.error('هیچ قیمتی دریافت نشد؛ فایل تغییر نکرد.'); process.exit(0); }

history.updatedAt = now;
mkdirSync('data', { recursive: true });
writeFileSync(OUT, JSON.stringify(history));
