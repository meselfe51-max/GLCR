// جمع‌آوری قیمت‌ها برای نمودار ۲۴ ساعته (اجرا توسط GitHub Actions، Node 18+).
// خروجی: data/history.json  →  { updatedAt, points: { assetKey: [[unixSeconds, priceToman], ...] } }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const OUT = 'data/history.json';
const KEEP_SECONDS = 26 * 60 * 60; // کمی بیشتر از ۲۴ ساعت
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

const prices = {};

const tgju = await firstOk(TGJU_URLS, j => j && j.current && typeof j.current === 'object');
if (tgju) {
  for (const [asset, key] of Object.entries(TGJU_KEYS)) {
    const rial = num(tgju.current[key] && tgju.current[key].p);
    if (rial > 0) prices[asset] = rial / 10;
  }
  for (const [asset, key] of Object.entries(TGJU_USD_KEYS)) {
    const usd = num(tgju.current[key] && tgju.current[key].p);
    if (usd > 0) prices[asset] = usd;
  }
  const shibaUsd = num(tgju.current[SHIBA.usdKey] && tgju.current[SHIBA.usdKey].p);
  const tetherRial = num(tgju.current[SHIBA.rateKey] && tgju.current[SHIBA.rateKey].p);
  if (shibaUsd > 0 && tetherRial > 0) prices.shiba = (shibaUsd * tetherRial * SHIBA.scale) / 10;
} else console.warn('TGJU در دسترس نبود.');

const nobitex = await firstOk([NOBITEX_URL], j => j && j.stats && typeof j.stats === 'object');
if (nobitex) {
  for (const [asset, code] of Object.entries(NOBITEX_KEYS)) {
    const rial = num(nobitex.stats[code + '-rls'] && nobitex.stats[code + '-rls'].latest);
    if (rial > 0) prices[asset] = rial / 10;
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

console.log(`قیمت ${added} دارایی ثبت شد.`);
if (added === 0) { console.error('هیچ قیمتی دریافت نشد؛ فایل تغییر نکرد.'); process.exit(0); }

history.updatedAt = now;
mkdirSync('data', { recursive: true });
writeFileSync(OUT, JSON.stringify(history));
