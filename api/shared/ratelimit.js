// Enkel in-memory rate limiter per IP. Best-effort (per Azure Function-instans).
// For et lite party-app er dette nok — DDOS-beskyttelse via Azure-laget.

const buckets = new Map();
const VINDU_MS = 5 * 60 * 1000; // 5 minutter
const STD_GRENSE = 5;            // Max 5 POSTs per 5 min per IP+kategori

function hentIp(req) {
    const xff = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
    if (xff) {
        const first = String(xff).split(',')[0].trim();
        const m = first.match(/^([\d.]+)(?::\d+)?$/);
        if (m) return m[1];
        return first;
    }
    return req.headers['x-azure-clientip'] || 'unknown';
}

function sjekkRate(req, kategori, grense = STD_GRENSE) {
    const ip = hentIp(req);
    const key = `${ip}:${kategori}`;
    const naa = Date.now();
    let bucket = buckets.get(key) || [];
    bucket = bucket.filter(t => naa - t < VINDU_MS);
    if (bucket.length >= grense) {
        return { ok: false, ip, gjenstaar: Math.ceil((VINDU_MS - (naa - bucket[0])) / 1000) };
    }
    bucket.push(naa);
    buckets.set(key, bucket);
    // Garbage-collect: hvis mappen blir > 5000 keys, behold de nyeste
    if (buckets.size > 5000) {
        const oldKeys = [...buckets.keys()].slice(0, 1000);
        oldKeys.forEach(k => buckets.delete(k));
    }
    return { ok: true, ip };
}

module.exports = { sjekkRate, hentIp };
