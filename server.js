import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const sessions = new Map();
const rateLimits = new Map();

const ALLOWED_ORIGINS = new Set([
  'https://artx.one',
  'https://www.artx.one',
  'https://firm-production-93e2.up.railway.app',
  'https://atrx-one-production.up.railway.app'
]);

// Ensure data folder exists
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`📁 Using persistent DATA_DIR: ${DATA_DIR}`);

  const DEFAULT_CONTENT_FILE = path.join(__dirname, 'data', 'content.json');
  if (!fs.existsSync(CONTENT_FILE) && fs.existsSync(DEFAULT_CONTENT_FILE)) {
    fs.copyFileSync(DEFAULT_CONTENT_FILE, CONTENT_FILE);
    console.log(`✅ Seeded default content.json to ${CONTENT_FILE}`);
  }

  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log(`✅ Initialized empty leads.json at ${LEADS_FILE}`);
  }
} catch (err) {
  console.error('Error initializing data directory:', err);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.xml', '.txt']);

function buildCsp() {
  let scriptSrc = "'self'";
  try {
    const html = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (m) {
      const hash = crypto.createHash('sha256').update(m[1]).digest('base64');
      scriptSrc += ` 'sha256-${hash}'`;
    }
  } catch {
    // dist not built yet (local dev) — JSON-LD data blocks are not CSP-executable anyway
  }
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "media-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ');
}

const CSP = buildCsp();

function isPrivateIp(ip) {
  const v = ip.replace(/^::ffff:/i, '');
  return (
    /^(10\.|127\.|0\.|169\.254\.|192\.168\.)/.test(v) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(v) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(v) ||
    v === '::1' ||
    /^f[cd]/i.test(v) ||
    /^fe80:/i.test(v)
  );
}

// Rightmost public IP in X-Forwarded-For: trusted proxies (Railway edge,
// atrx-one reverse proxy) append the real socket IP, so spoofed entries
// injected by the client end up on the left and are ignored.
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!isPrivateIp(parts[i])) return parts[i];
    }
  }
  return req.socket.remoteAddress || 'unknown';
}

function checkRate(bucket, ip, limit, windowMs) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(key);
  }
  for (const [token, expires] of sessions) {
    if (now > expires) sessions.delete(token);
  }
}, 10 * 60 * 1000).unref();

function timingSafeEqualStr(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function isAdmin(req) {
  const header = req.headers['x-admin-token'];
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const token = (typeof header === 'string' && header) || bearer;
  if (!token) return false;
  const expires = sessions.get(token);
  if (!expires) return false;
  if (Date.now() > expires) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function acceptsGzip(req) {
  return /\bgzip\b/.test(req.headers['accept-encoding'] || '');
}

function sendJson(req, res, status, obj) {
  const body = JSON.stringify(obj);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
  if (body.length > 1024 && acceptsGzip(req)) {
    const gz = zlib.gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = gz.length;
    res.writeHead(status, headers);
    return res.end(gz);
  }
  headers['Content-Length'] = Buffer.byteLength(body);
  res.writeHead(status, headers);
  res.end(body);
}

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function readContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading dynamic content:', err);
  }
  return null;
}

function atomicWriteJson(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  try {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, file.replace(/\.json$/, '.prev.json'));
    }
  } catch (err) {
    console.error('Backup copy failed:', err);
  }
  fs.renameSync(tmp, file);
}

// Serialize all lead mutations: read-modify-write happens inside one chain,
// so concurrent requests cannot overwrite each other's leads.
let leadWriteChain = Promise.resolve();
function mutateLeads(mutator) {
  const task = leadWriteChain.then(() => {
    const leads = readLeads();
    const result = mutator(leads);
    if (result !== false) atomicWriteJson(LEADS_FILE, leads);
    return result;
  });
  leadWriteChain = task.catch(() => {});
  return task;
}

const LEAD_STRING_FIELDS = [
  'type', 'name', 'contact', 'service', 'budget', 'message', 'comment', 'issue',
  'currency', 'urgency', 'estimatedPrice', 'estimatedDays', 'discount',
  'targetUrl', 'timestamp', 'lang'
];
const LEAD_STATUSES = new Set(['new', 'in_progress', 'proposal_sent', 'deal', 'archived']);

function truncate(value, max) {
  return String(value).slice(0, max);
}

function sanitizeLeadPayload(data) {
  const lead = {};
  for (const field of LEAD_STRING_FIELDS) {
    if (typeof data[field] === 'string' && data[field]) {
      lead[field] = truncate(data[field], field === 'message' || field === 'comment' || field === 'issue' ? 5000 : 2000);
    }
  }
  if (Array.isArray(data.selectedServices)) {
    lead.selectedServices = data.selectedServices
      .filter(s => typeof s === 'string')
      .slice(0, 30)
      .map(s => truncate(s, 200));
  }
  return lead;
}

function sanitizeLeadUpdates(data) {
  const updates = {};
  if (typeof data.status === 'string' && LEAD_STATUSES.has(data.status)) {
    updates.status = data.status;
  }
  if (Array.isArray(data.notes)) {
    updates.notes = data.notes
      .filter(n => n && typeof n === 'object' && typeof n.text === 'string')
      .slice(0, 200)
      .map(n => ({
        text: truncate(n.text, 2000),
        createdAt: typeof n.createdAt === 'string' ? truncate(n.createdAt, 64) : new Date().toISOString()
      }));
  }
  return updates;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function notifyTelegram(lead) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  try {
    let msg = `🔥 <b>НОВАЯ ЗАЯВКА ARTX AGENCY</b>\n\n`;
    msg += `<b>Тип:</b> ${escapeHtml(lead.type || 'Контакт')}\n`;
    if (lead.name) msg += `<b>Имя:</b> ${escapeHtml(lead.name)}\n`;
    if (lead.contact) msg += `<b>Контакт:</b> ${escapeHtml(lead.contact)}\n`;
    if (lead.service) msg += `<b>Услуга:</b> ${escapeHtml(lead.service)}\n`;
    if (lead.budget) msg += `<b>Бюджет:</b> ${escapeHtml(lead.budget)}\n`;
    if (lead.estimatedPrice) msg += `<b>Смета:</b> ${escapeHtml(lead.estimatedPrice)}\n`;
    if (lead.estimatedDays) msg += `<b>Срок:</b> ${escapeHtml(lead.estimatedDays)}\n`;
    if (lead.targetUrl) msg += `<b>Сайт/профиль для аудита:</b> ${escapeHtml(lead.targetUrl)}\n`;
    if (lead.issue) msg += `<b>Проблема:</b> ${escapeHtml(lead.issue)}\n`;
    if (lead.selectedServices && lead.selectedServices.length > 0) {
      msg += `<b>Выбранные услуги:</b>\n• ${lead.selectedServices.map(escapeHtml).join('\n• ')}\n`;
    }
    if (lead.comment || lead.message) {
      msg += `\n<b>Комментарий:</b>\n${escapeHtml(lead.comment || lead.message)}\n`;
    }
    msg += `\n<i>Дата: ${escapeHtml(new Date().toLocaleString('ru-RU'))}</i>`;
    msg = msg.slice(0, 4000);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('Vary', 'Accept-Encoding, Origin');

  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/health' || pathname === '/api/health') {
    return sendJson(req, res, 200, {
      status: 'ok',
      service: 'artx-agency',
      uptime: process.uptime(),
      time: new Date().toISOString()
    });
  }

  // Admin Auth endpoint
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    if (!ADMIN_PASSWORD) {
      return sendJson(req, res, 503, { success: false, error: 'Admin access is not configured' });
    }
    const ip = getClientIp(req);
    if (!checkRate('login', ip, 10, 15 * 60 * 1000)) {
      res.setHeader('Retry-After', '900');
      return sendJson(req, res, 429, { success: false, error: 'Слишком много попыток. Попробуйте через 15 минут.' });
    }
    try {
      const { password } = await parseJsonBody(req);
      if (typeof password === 'string' && timingSafeEqualStr(password, ADMIN_PASSWORD)) {
        const token = crypto.randomBytes(32).toString('hex');
        sessions.set(token, Date.now() + SESSION_TTL_MS);
        return sendJson(req, res, 200, { success: true, token });
      }
      return sendJson(req, res, 401, { success: false, error: 'Неверный пароль' });
    } catch {
      return sendJson(req, res, 400, { error: 'Invalid request' });
    }
  }

  // API: Leads submission (Public — the only write endpoint open to visitors)
  if (req.method === 'POST' && pathname === '/api/leads') {
    const ip = getClientIp(req);
    if (!checkRate('lead', ip, 10, 60 * 60 * 1000)) {
      res.setHeader('Retry-After', '3600');
      return sendJson(req, res, 429, { error: 'Слишком много заявок. Попробуйте позже.' });
    }
    try {
      const data = await parseJsonBody(req);
      if (!data || typeof data !== 'object' || typeof data.contact !== 'string' || !data.contact.trim()) {
        return sendJson(req, res, 400, { error: 'Contact is required' });
      }
      const lead = {
        ...sanitizeLeadPayload(data),
        id: crypto.randomUUID(),
        status: 'new',
        notes: [],
        ip,
        userAgent: truncate(req.headers['user-agent'] || '', 512),
        createdAt: new Date().toISOString()
      };

      await mutateLeads(leads => {
        leads.unshift(lead);
      });

      notifyTelegram(lead).catch(console.error);
      return sendJson(req, res, 200, { success: true, id: lead.id });
    } catch (err) {
      console.error('Error processing lead:', err);
      return sendJson(req, res, 400, { error: 'Invalid lead payload' });
    }
  }

  // API: Get leads (Admin / CRM)
  if (req.method === 'GET' && pathname === '/api/leads') {
    if (!isAdmin(req)) return sendJson(req, res, 401, { error: 'Требуется авторизация' });
    const leads = readLeads();
    return sendJson(req, res, 200, { count: leads.length, leads });
  }

  // API: Update lead (PATCH /api/leads/:id, Admin)
  if (req.method === 'PATCH' && pathname.startsWith('/api/leads/')) {
    if (!isAdmin(req)) return sendJson(req, res, 401, { error: 'Требуется авторизация' });
    const leadId = pathname.replace('/api/leads/', '');
    try {
      const updates = sanitizeLeadUpdates(await parseJsonBody(req));
      const result = await mutateLeads(leads => {
        const index = leads.findIndex(l => l.id === leadId);
        if (index === -1) return false;
        leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
        return leads[index];
      });
      if (result === false) return sendJson(req, res, 404, { error: 'Lead not found' });
      return sendJson(req, res, 200, { success: true, lead: result });
    } catch {
      return sendJson(req, res, 400, { error: 'Update failed' });
    }
  }

  // API: Delete lead (DELETE /api/leads/:id, Admin)
  if (req.method === 'DELETE' && pathname.startsWith('/api/leads/')) {
    if (!isAdmin(req)) return sendJson(req, res, 401, { error: 'Требуется авторизация' });
    const leadId = pathname.replace('/api/leads/', '');
    const result = await mutateLeads(leads => {
      const index = leads.findIndex(l => l.id === leadId);
      if (index === -1) return false;
      leads.splice(index, 1);
      return true;
    });
    if (result === false) return sendJson(req, res, 404, { error: 'Lead not found' });
    return sendJson(req, res, 200, { success: true });
  }

  // API: Get dynamic content (public — the site renders from it)
  if (req.method === 'GET' && pathname === '/api/content') {
    const content = readContent();
    return sendJson(req, res, 200, content || {});
  }

  // API: Save dynamic content (Admin). Merges into existing content so keys
  // the admin UI does not manage (e.g. settings) are never dropped.
  if (req.method === 'PUT' && pathname === '/api/content') {
    if (!isAdmin(req)) return sendJson(req, res, 401, { error: 'Требуется авторизация' });
    try {
      const data = await parseJsonBody(req);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return sendJson(req, res, 400, { error: 'Invalid content payload' });
      }
      const merged = { ...(readContent() || {}), ...data };
      atomicWriteJson(CONTENT_FILE, merged);
      return sendJson(req, res, 200, { success: true });
    } catch {
      return sendJson(req, res, 400, { error: 'Failed to save content' });
    }
  }

  // Static File Serving
  if (req.method === 'GET' || req.method === 'HEAD') {
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    let filePath = path.join(DIST_DIR, safePath);
    let spaFallback = false;
    let spaStatus = 200;

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(safePath).toLowerCase();
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not Found');
      }
      filePath = path.join(DIST_DIR, 'index.html');
      spaFallback = true;
      spaStatus = pathname === '/' || pathname.startsWith('/cases/') ? 200 : 404;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      let cacheControl;
      if (spaFallback || ext === '.html' || ext === '.xml' || ext === '.txt') {
        cacheControl = 'no-cache, no-store, must-revalidate';
      } else if (ext === '.mp4' || ext === '.webm') {
        cacheControl = 'public, max-age=3600';
      } else {
        cacheControl = 'public, max-age=31536000, immutable';
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;

      // Range requests for video (Safari/iOS/Chrome HTML5 streaming)
      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.webm')) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || Number.isNaN(start) || Number.isNaN(end)) {
          res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
          return res.end();
        }

        const chunksize = (end - start) + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          'Cache-Control': cacheControl
        });

        if (req.method === 'HEAD') return res.end();
        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.on('error', () => res.destroy());
        return fileStream.pipe(res);
      }

      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', cacheControl);

      if (COMPRESSIBLE_EXTS.has(ext) && acceptsGzip(req)) {
        res.writeHead(spaStatus, { 'Content-Type': contentType, 'Content-Encoding': 'gzip' });
        if (req.method === 'HEAD') return res.end();
        const gz = zlib.createGzip();
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', () => res.destroy());
        gz.on('error', () => res.destroy());
        return fileStream.pipe(gz).pipe(res);
      }

      res.writeHead(spaStatus, { 'Content-Type': contentType, 'Content-Length': fileSize });
      if (req.method === 'HEAD') return res.end();

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => res.destroy());
      return stream.pipe(res);
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ARTX Agency Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static assets from ${DIST_DIR}`);
});